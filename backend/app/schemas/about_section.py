from datetime import datetime
from typing import Optional
from app.schemas.base import CamelModel


class AboutSectionBase(CamelModel):
    title: str
    category: str = "company_overview"
    content: str
    image_url: Optional[str] = None
    is_visible: bool = True
    sort_order: int = 0


class AboutSectionCreate(AboutSectionBase):
    pass


class AboutSectionUpdate(CamelModel):
    title: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_visible: Optional[bool] = None
    sort_order: Optional[int] = None


class AboutSectionResponse(AboutSectionBase):
    id: int
    created_at: datetime
    updated_at: datetime

