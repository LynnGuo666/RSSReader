from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ArticleBase(BaseModel):
    title: str
    link: str
    content: Optional[str] = None
    author: Optional[str] = None
    published_at: Optional[datetime] = None


class Article(ArticleBase):
    id: int
    feed_id: int
    fetched_at: datetime
    is_read: bool = False
    is_starred: bool = False

    class Config:
        from_attributes = True


class ArticleMarkRead(BaseModel):
    is_read: bool


class ArticleMarkStarred(BaseModel):
    is_starred: bool
