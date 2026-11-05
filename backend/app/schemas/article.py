from datetime import datetime
from typing import Optional
from app.schemas.base import CamelModel


class ArticleBase(CamelModel):
    title: str
    slug: Optional[str] = None
    summary: str
    content: str
    thumbnail: Optional[str] = None
    category: str = "tin-tuc"
    author: str = "Ban Biên Tập RYVO"
    is_published: bool = True


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(CamelModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    thumbnail: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    is_published: Optional[bool] = None


class ArticleResponse(CamelModel):
    id: int
    slug: str
    title: str
    summary: str
    content: str
    thumbnail: Optional[str] = None
    category: str
    author: str
    views: int
    is_published: bool
    published_at: datetime
    created_at: datetime
    updated_at: datetime

