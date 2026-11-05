from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    thumbnail = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="tin-tuc", index=True)
    author = Column(String(100), nullable=False, default="Ban Biên Tập Raycon")
    author_id = Column(String(36), nullable=True)
    views = Column(Integer, nullable=False, default=0)
    is_published = Column(Boolean, nullable=False, default=True, index=True)
    published_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

