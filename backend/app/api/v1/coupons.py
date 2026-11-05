from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.coupon import Coupon
from app.schemas.coupon import CouponVerifyRequest, CouponVerifyResponse

router = APIRouter(prefix="/coupons", tags=["Coupons"])


@router.post("/verify", response_model=CouponVerifyResponse)
def verify_coupon(
    payload: CouponVerifyRequest,
    db: Session = Depends(get_db),
):
    code_clean = payload.code.strip().upper()
    coupon = db.query(Coupon).filter(
        Coupon.code == code_clean,
        Coupon.is_active.is_(True),
    ).first()

    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mã giảm giá '{code_clean}' không tồn tại hoặc đã hết hiệu lực."
        )

    # Check expiration if set
    if coupon.expires_at:
        now = datetime.now(timezone.utc)
        expires_at_aware = coupon.expires_at.replace(tzinfo=timezone.utc) if coupon.expires_at.tzinfo is None else coupon.expires_at
        if now > expires_at_aware:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mã giảm giá '{code_clean}' đã hết hạn sử dụng."
            )

    # Check min order amount
    if payload.subtotal < coupon.min_order_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Đơn hàng cần đạt tối thiểu ${coupon.min_order_amount:.2f} để sử dụng mã này."
        )

    # Calculate discount amount
    if coupon.discount_type == "percent":
        discount_amount = round((payload.subtotal * coupon.discount_value) / 100.0, 2)
    else:  # fixed
        discount_amount = min(float(coupon.discount_value), payload.subtotal)

    return CouponVerifyResponse(
        valid=True,
        code=coupon.code,
        discount_type=coupon.discount_type,
        discount_value=coupon.discount_value,
        discount_amount=discount_amount,
        min_order_amount=coupon.min_order_amount,
        description=coupon.description,
        message=f"Đã áp dụng mã {coupon.code}: {coupon.description or ''}"
    )


@router.get("", response_model=List[dict])
def list_active_coupons(db: Session = Depends(get_db)):
    coupons = db.query(Coupon).filter(Coupon.is_active.is_(True)).all()
    return [
        {
            "code": c.code,
            "discountType": c.discount_type,
            "discountValue": c.discount_value,
            "minOrderAmount": c.min_order_amount,
            "description": c.description,
        }
        for c in coupons
    ]

