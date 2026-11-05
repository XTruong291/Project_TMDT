from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from app.core.database import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(64), unique=True, index=True, nullable=False)
    discount_type = Column(String(32), default="percent", nullable=False)  # "percent" or "fixed"
    discount_value = Column(Float, nullable=False)                         # e.g. 10.0 or 15.0
    min_order_amount = Column(Float, default=0.0, nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

