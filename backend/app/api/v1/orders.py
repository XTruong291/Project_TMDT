import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.coupon import Coupon
from app.models.user import User, RoleEnum
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
    return f"RYVO-{timestamp}-{unique_suffix}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đơn hàng phải chứa ít nhất một sản phẩm.",
        )

    # 1. Verify items & calculate subtotal strictly from real MySQL products
    calculated_subtotal = 0.0
    verified_items = []

    for item_in in order_in.items:
        if item_in.quantity <= 0 or item_in.quantity > 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Số lượng mua cho sản phẩm '{item_in.product_name}' không hợp lệ (cho phép 1 đến 10).",
            )

        # Lookup product by id or handle
        prod = (
            db.query(Product)
            .filter((Product.id == item_in.product_id) | (Product.handle == item_in.product_id))
            .first()
        )
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sản phẩm '{item_in.product_name}' không tồn tại trong hệ thống.",
            )

        if not prod.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{prod.name}' hiện đã ngừng kinh doanh. Vui lòng xóa khỏi giỏ.",
            )

        if not prod.in_stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{prod.name}' hiện đã hết hàng. Vui lòng xóa khỏi giỏ.",
            )

        # Real price from database (ignore client-supplied unit_price)
        real_unit_price = float(prod.price)
        item_total = round(real_unit_price * item_in.quantity, 2)
        calculated_subtotal += item_total

        verified_items.append({
            "product_id": prod.id,
            "product_name": prod.name,
            "color_name": item_in.color_name,
            "color_image": item_in.color_image,
            "unit_price": real_unit_price,
            "quantity": item_in.quantity,
            "total_price": item_total,
        })

    calculated_subtotal = round(calculated_subtotal, 2)

    # 2. Verify coupon from MySQL if provided
    discount_amount = 0.0
    applied_coupon_code: Optional[str] = None

    if order_in.coupon_code and order_in.coupon_code.strip():
        code_clean = order_in.coupon_code.strip().upper()
        coupon = (
            db.query(Coupon)
            .filter(Coupon.code == code_clean, Coupon.is_active.is_(True))
            .first()
        )
        if not coupon:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mã giảm giá '{code_clean}' không hợp lệ hoặc đã hết hạn.",
            )

        if calculated_subtotal < float(coupon.min_order_amount):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Đơn hàng cần đạt tối thiểu {float(coupon.min_order_amount):,.0f} ₫ để sử dụng mã {coupon.code}.",
            )

        if coupon.discount_type == "percent":
            discount_amount = round((calculated_subtotal * float(coupon.discount_value)) / 100.0, 2)
        else:
            discount_amount = min(float(coupon.discount_value), calculated_subtotal)

        applied_coupon_code = coupon.code

    # 3. Calculate shipping fee (Free shipping for orders >= 500.000 ₫, standard shipping fee 30.000 ₫)
    shipping_fee = 0.0 if calculated_subtotal >= 500000.0 or applied_coupon_code == "FREESHIP" else 30000.0
    total_amount = round(max(0.0, calculated_subtotal - discount_amount + shipping_fee), 2)

    # 4. Create Order
    order_number = generate_order_number()
    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        customer_name=order_in.customer_name.strip(),
        customer_email=current_user.email,
        customer_phone=order_in.customer_phone.strip(),
        shipping_address=order_in.shipping_address.strip(),
        shipping_city=order_in.shipping_city.strip(),
        shipping_district=order_in.shipping_district.strip(),
        payment_method=order_in.payment_method,
        shipping_fee=shipping_fee,
        subtotal=calculated_subtotal,
        discount_amount=discount_amount,
        total_amount=total_amount,
        coupon_code=applied_coupon_code,
        status=OrderStatus.PENDING,
        notes=order_in.notes.strip() if order_in.notes else None,
    )
    db.add(order)
    db.flush()

    for item_data in verified_items:
        item = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            product_name=item_data["product_name"],
            color_name=item_data["color_name"],
            color_image=item_data["color_image"],
            unit_price=item_data["unit_price"],
            quantity=item_data["quantity"],
            total_price=item_data["total_price"],
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
    current_user: User = Depends(get_current_active_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )

    # Only Admin or the order owner can view the order
    is_admin = current_user.role == RoleEnum.ADMIN
    is_owner = (order.user_id == current_user.id) or (order.customer_email.lower() == current_user.email.lower())
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập đơn hàng này.",
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

