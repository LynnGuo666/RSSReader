from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional


class FeedBase(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    category: Optional[str] = None


class FeedCreate(FeedBase):
    pass


class FeedUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None


class Feed(FeedBase):
    id: int
    user_id: int
    last_fetched: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
