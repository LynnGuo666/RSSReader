from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List, Optional
from datetime import datetime
from ...core.database import get_db
from ...api.deps import get_current_user
from ...models.user import User
from ...models.article import Article, UserArticle
from ...models.feed import Feed
from ...schemas.article import Article as ArticleSchema, ArticleMarkRead, ArticleMarkStarred

router = APIRouter()


@router.get("/", response_model=List[ArticleSchema])
def get_articles(
    feed_id: Optional[int] = None,
    is_read: Optional[bool] = None,
    is_starred: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Article).join(Feed).filter(Feed.user_id == current_user.id)

    if feed_id:
        query = query.filter(Article.feed_id == feed_id)

    if search:
        query = query.filter(
            or_(
                Article.title.contains(search),
                Article.content.contains(search)
            )
        )

    articles = query.order_by(desc(Article.published_at)).offset(skip).limit(limit).all()

    result = []
    for article in articles:
        user_article = db.query(UserArticle).filter(
            UserArticle.user_id == current_user.id,
            UserArticle.article_id == article.id
        ).first()

        article_dict = {
            "id": article.id,
            "feed_id": article.feed_id,
            "title": article.title,
            "link": article.link,
            "content": article.content,
            "author": article.author,
            "published_at": article.published_at,
            "fetched_at": article.fetched_at,
            "is_read": user_article.is_read if user_article else False,
            "is_starred": user_article.is_starred if user_article else False
        }

        if is_read is not None and article_dict["is_read"] != is_read:
            continue
        if is_starred is not None and article_dict["is_starred"] != is_starred:
            continue

        result.append(ArticleSchema(**article_dict))

    return result


@router.get("/{article_id}", response_model=ArticleSchema)
def get_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(Article).join(Feed).filter(
        Article.id == article_id,
        Feed.user_id == current_user.id
    ).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    user_article = db.query(UserArticle).filter(
        UserArticle.user_id == current_user.id,
        UserArticle.article_id == article.id
    ).first()

    article_dict = {
        "id": article.id,
        "feed_id": article.feed_id,
        "title": article.title,
        "link": article.link,
        "content": article.content,
        "author": article.author,
        "published_at": article.published_at,
        "fetched_at": article.fetched_at,
        "is_read": user_article.is_read if user_article else False,
        "is_starred": user_article.is_starred if user_article else False
    }

    return ArticleSchema(**article_dict)


@router.post("/{article_id}/read", response_model=ArticleSchema)
def mark_article_read(
    article_id: int,
    mark_data: ArticleMarkRead,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(Article).join(Feed).filter(
        Article.id == article_id,
        Feed.user_id == current_user.id
    ).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    user_article = db.query(UserArticle).filter(
        UserArticle.user_id == current_user.id,
        UserArticle.article_id == article_id
    ).first()

    if not user_article:
        user_article = UserArticle(
            user_id=current_user.id,
            article_id=article_id,
            is_read=mark_data.is_read,
            read_at=datetime.utcnow() if mark_data.is_read else None
        )
        db.add(user_article)
    else:
        user_article.is_read = mark_data.is_read
        user_article.read_at = datetime.utcnow() if mark_data.is_read else None

    db.commit()
    db.refresh(user_article)

    return get_article(article_id, current_user, db)


@router.post("/{article_id}/star", response_model=ArticleSchema)
def mark_article_starred(
    article_id: int,
    mark_data: ArticleMarkStarred,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(Article).join(Feed).filter(
        Article.id == article_id,
        Feed.user_id == current_user.id
    ).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    user_article = db.query(UserArticle).filter(
        UserArticle.user_id == current_user.id,
        UserArticle.article_id == article_id
    ).first()

    if not user_article:
        user_article = UserArticle(
            user_id=current_user.id,
            article_id=article_id,
            is_starred=mark_data.is_starred
        )
        db.add(user_article)
    else:
        user_article.is_starred = mark_data.is_starred

    db.commit()
    db.refresh(user_article)

    return get_article(article_id, current_user, db)
