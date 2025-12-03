from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...api.deps import get_current_user
from ...models.user import User
from ...models.feed import Feed
from ...schemas.feed import Feed as FeedSchema, FeedCreate, FeedUpdate
from ...services.rss_fetcher import fetch_and_store_articles

router = APIRouter()


@router.get("/", response_model=List[FeedSchema])
def get_feeds(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feeds = db.query(Feed).filter(Feed.user_id == current_user.id).all()
    return feeds


@router.post("/", response_model=FeedSchema, status_code=status.HTTP_201_CREATED)
async def create_feed(
    feed_data: FeedCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feed = Feed(
        user_id=current_user.id,
        title=feed_data.title,
        url=feed_data.url,
        description=feed_data.description,
        category=feed_data.category
    )
    db.add(feed)
    db.commit()
    db.refresh(feed)

    await fetch_and_store_articles(feed, db)

    return feed


@router.get("/{feed_id}", response_model=FeedSchema)
def get_feed(
    feed_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(
        Feed.id == feed_id,
        Feed.user_id == current_user.id
    ).first()
    if not feed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed not found"
        )
    return feed


@router.put("/{feed_id}", response_model=FeedSchema)
def update_feed(
    feed_id: int,
    feed_data: FeedUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(
        Feed.id == feed_id,
        Feed.user_id == current_user.id
    ).first()
    if not feed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed not found"
        )

    if feed_data.title is not None:
        feed.title = feed_data.title
    if feed_data.description is not None:
        feed.description = feed_data.description
    if feed_data.category is not None:
        feed.category = feed_data.category

    db.commit()
    db.refresh(feed)
    return feed


@router.delete("/{feed_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feed(
    feed_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(
        Feed.id == feed_id,
        Feed.user_id == current_user.id
    ).first()
    if not feed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed not found"
        )

    db.delete(feed)
    db.commit()
    return None


@router.post("/{feed_id}/refresh", response_model=dict)
async def refresh_feed(
    feed_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feed = db.query(Feed).filter(
        Feed.id == feed_id,
        Feed.user_id == current_user.id
    ).first()
    if not feed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed not found"
        )

    count = await fetch_and_store_articles(feed, db)
    return {"message": f"Fetched {count} new articles"}
