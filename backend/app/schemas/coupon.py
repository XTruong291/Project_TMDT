from typing import Optional
from app.schemas.base import CamelModel


class CouponVerifyRequest(CamelModel):
    code: str
    subtotal: float


class CouponVerifyResponse(CamelModel):
    valid: bool
    code: str
    discount_type: str       # "percent" or "fixed"
    discount_value: float    # 10.0 or 15.0
    discount_amount: float   # calculated amount in dollars
    min_order_amount: float
    description: Optional[str] = None
    message: str

