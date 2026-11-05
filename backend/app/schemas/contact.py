from datetime import datetime
from typing import Optional
from app.schemas.base import CamelModel


class ContactBase(CamelModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ContactCreate(ContactBase):
    pass


class ContactStatusUpdate(CamelModel):
    status: str  # unread, read, responded


class ContactResponse(ContactBase):
    id: int
    status: str
    created_at: datetime

