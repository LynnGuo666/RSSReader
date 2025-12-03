from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    feed_id = Column(Integer, ForeignKey("feeds.id"), nullable=False)
    title = Column(String, nullable=False)
    link = Column(String, nullable=False, unique=True)
    content = Column(Text)
    author = Column(String)
    published_at = Column(DateTime)
    fetched_at = Column(DateTime, default=datetime.utcnow)

    feed = relationship("Feed", back_populates="articles")
    user_articles = relationship("UserArticle", back_populates="article", cascade="all, delete-orphan")


class UserArticle(Base):
    __tablename__ = "user_articles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    article_id = Column(Integer, ForeignKey("articles.id"), primary_key=True)
    is_read = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    read_at = Column(DateTime)

    user = relationship("User", back_populates="user_articles")
    article = relationship("Article", back_populates="user_articles")
