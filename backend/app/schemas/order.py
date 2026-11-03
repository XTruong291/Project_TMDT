from typing import List, Optional
from datetime import datetime
from app.schemas.base import CamelModel
from app.models.order import OrderStatus


class OrderItemCreate(CamelModel):
    product_id: str
    product_name: str
    color_name: str
    color_image: Optional[str] = None
    unit_price: float
    quantity: int
    total_price: float


class OrderItemResponse(OrderItemCreate):
    id: int
    order_id: int


class OrderCreate(CamelModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    shipping_city: str = "Hà Nội"
    shipping_district: str = "Hoàn Kiếm"
    payment_method: str = "cod"
    notes: Optional[str] = None
    items: List[OrderItemCreate]


class OrderStatusUpdate(CamelModel):
    status: OrderStatus


class OrderResponse(CamelModel):
    id: int
    order_number: str
    user_id: Optional[int] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    shipping_city: str
    shipping_district: str
    payment_method: str
    shipping_fee: float
    subtotal: float
    total_amount: float
    status: OrderStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]

