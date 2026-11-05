from typing import Optional
from datetime import datetime
from app.schemas.base import CamelModel


class ReviewCreate(CamelModel):
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    rating: int  # 1 to 5
    title: Optional[str] = None
    comment: str


class ReviewResponse(CamelModel):
    id: int
    product_id: str
    author_name: str
    author_email: str
    rating: int
    title: Optional[str] = None
    comment: str
    created_at: datetime

