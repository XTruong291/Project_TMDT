import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate, OrderCancelRequest
from app.api.deps import (
    get_current_admin,
    get_current_active_user,
    get_optional_current_user,
    oauth2_scheme,
)
from app.core.security import decode_access_token

router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_suffix = uuid.uuid4().hex[:6].upper()
    return f"RAY-{timestamp}-{unique_suffix}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
):
    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )

    # Optional user association if bearer token is present
    user_id: Optional[int] = None
    if token:
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            try:
                user_id = int(payload["sub"])
            except ValueError:
                user_id = None

    # Calculate subtotal and shipping fee
    subtotal = float(sum(item.total_price for item in order_in.items))
    # Raycon promotion: Free shipping over $50, otherwise $4.99
    shipping_fee = 0.0 if subtotal >= 50.0 else 4.99
    total_amount = float(subtotal + shipping_fee)

    order_number = generate_order_number()

    order = Order(
        order_number=order_number,
        user_id=user_id,
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        shipping_address=order_in.shipping_address,
        shipping_city=order_in.shipping_city,
        shipping_district=order_in.shipping_district,
        payment_method=order_in.payment_method,
        shipping_fee=shipping_fee,
        subtotal=subtotal,
        total_amount=total_amount,
        status=OrderStatus.PENDING,
        notes=order_in.notes,
    )
    db.add(order)
    db.flush()  # assign order.id

    for item_in in order_in.items:
        # Safely resolve foreign key product_id by ID or handle
        resolved_product_id: Optional[str] = None
        if item_in.product_id:
            matched_prod = (
                db.query(Product)
                .filter((Product.id == item_in.product_id) | (Product.handle == item_in.product_id))
                .first()
            )
            if matched_prod:
                resolved_product_id = matched_prod.id

        item = OrderItem(
            order_id=order.id,
            product_id=resolved_product_id,
            product_name=item_in.product_name,
            color_name=item_in.color_name,
            color_image=item_in.color_image,
            unit_price=float(item_in.unit_price),
            quantity=item_in.quantity,
            total_price=float(item_in.total_price),
        )
        db.add(item)

    db.commit()
    db.refresh(order)
    return order


@router.get("/track/{order_number}", response_model=OrderResponse)
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found"
        )
    return order


@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve all orders placed by the current logged-in customer."""
    return (
        db.query(Order)
        .filter((Order.user_id == current_user.id) | (Order.customer_email == current_user.email))
        .order_by(Order.created_at.desc())
        .all()
    )


@router.post("/{order_identifier}/cancel", response_model=OrderResponse)
def cancel_order(
    order_identifier: str,
    cancel_in: Optional[OrderCancelRequest] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Customer order cancellation: supports both ID and OrderNumber, guests with email, and logged-in users."""
    order = None
    if order_identifier.isdigit():
        order = db.query(Order).filter(Order.id == int(order_identifier)).first()
    if not order:
        order = db.query(Order).filter(Order.order_number == order_identifier).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_identifier}' not found"
        )

    # Ownership validation
    is_owner = False
    if current_user:
        if (
            current_user.role == "admin"
            or order.user_id == current_user.id
            or (order.customer_email and current_user.email and order.customer_email.lower() == current_user.email.lower())
        ):
            is_owner = True

    if not is_owner and cancel_in and cancel_in.guest_email:
        if order.customer_email and order.customer_email.lower().strip() == cancel_in.guest_email.lower().strip():
            is_owner = True

    if not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền hủy đơn hàng này. Vui lòng đăng nhập hoặc xác nhận đúng email đặt hàng."
        )

    # Status validation: Can only cancel if pending or processing
    if order.status not in [OrderStatus.PENDING, OrderStatus.PROCESSING]:
        if order.status == OrderStatus.SHIPPED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng đang được vận chuyển, không thể tự hủy. Quý khách vui lòng liên hệ bộ phận hỗ trợ."
            )
        elif order.status == OrderStatus.DELIVERED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng đã được giao thành công, không thể hủy."
            )
        elif order.status == OrderStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng này đã được hủy trước đó."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể hủy đơn hàng ở trạng thái hiện tại."
            )

    order.status = OrderStatus.CANCELLED
    if cancel_in and cancel_in.reason:
        reason_text = cancel_in.reason.strip()
        cancel_note = f"[Khách hàng hủy: {reason_text}]"
        order.notes = f"{order.notes}\n{cancel_note}" if order.notes else cancel_note

    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=List[OrderResponse])
def get_all_orders(
    status_filter: Optional[OrderStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )

    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found",
        )

    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully", "id": order_id}

