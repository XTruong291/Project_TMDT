from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    author_name = Column(String(255), nullable=False)
    author_email = Column(String(255), nullable=False)
    rating = Column(Integer, default=5, nullable=False)
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    product = relationship("Product", back_populates="reviews")

