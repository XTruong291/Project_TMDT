from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, JSON, func
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, index=True)
    handle = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    category = Column(String(64), index=True, nullable=False)
    collection_slug = Column(String(64), index=True, nullable=False)
    image = Column(String(512), nullable=False)
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)
    badge = Column(String(64), nullable=True)
    rating = Column(Float, default=5.0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    in_stock = Column(Boolean, default=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Complex fields stored cleanly as native JSON in MySQL 8.0
    gallery_images = Column(JSON, default=list, nullable=False)
    specs = Column(JSON, default=list, nullable=False)
    colors = Column(JSON, default=list, nullable=False)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

