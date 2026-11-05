from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from app.core.database import Base


class SiteAnalytics(Base):
    __tablename__ = "site_analytics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    total_visits = Column(Integer, nullable=False, default=154820)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

