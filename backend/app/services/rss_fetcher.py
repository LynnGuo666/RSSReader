import feedparser
import httpx
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List
from ..models.feed import Feed
from ..models.article import Article
from ..core.database import SessionLocal


async def fetch_feed_content(url: str) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return feedparser.parse(response.text)
        except Exception as e:
            print(f"Error fetching feed {url}: {str(e)}")
            return None


def parse_article_date(date_struct) -> datetime:
    if date_struct:
        try:
            return datetime(*date_struct[:6])
        except:
            pass
    return datetime.utcnow()


async def fetch_and_store_articles(feed: Feed, db: Session) -> int:
    feed_data = await fetch_feed_content(feed.url)
    if not feed_data or not feed_data.entries:
        return 0

    new_articles_count = 0
    for entry in feed_data.entries:
        link = entry.get('link', '')
        if not link:
            continue

        existing_article = db.query(Article).filter(Article.link == link).first()
        if existing_article:
            continue

        article = Article(
            feed_id=feed.id,
            title=entry.get('title', 'No Title'),
            link=link,
            content=entry.get('summary', entry.get('description', '')),
            author=entry.get('author', ''),
            published_at=parse_article_date(entry.get('published_parsed'))
        )
        db.add(article)
        new_articles_count += 1

    feed.last_fetched = datetime.utcnow()
    db.commit()
    return new_articles_count


async def fetch_all_feeds():
    db = SessionLocal()
    try:
        feeds = db.query(Feed).all()
        total_new_articles = 0
        for feed in feeds:
            count = await fetch_and_store_articles(feed, db)
            total_new_articles += count
            print(f"Fetched {count} new articles from {feed.title}")
        print(f"Total new articles: {total_new_articles}")
    finally:
        db.close()
