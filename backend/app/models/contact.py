from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="unread", index=True)  # unread, read, responded
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

