from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.database import Base


class AboutSection(Base):
    __tablename__ = "about_sections"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, default="company_overview", index=True)
    content = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    is_visible = Column(Boolean, nullable=False, default=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

