from app.schemas.base import CamelModel
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.schemas.product import ProductColorSchema, ProductSpecSchema, ProductCreate, ProductUpdate, ProductResponse
from app.schemas.order import OrderCreate, OrderItemCreate, OrderResponse, OrderItemResponse, OrderStatusUpdate
from app.schemas.about_section import AboutSectionCreate, AboutSectionUpdate, AboutSectionResponse
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleResponse
from app.schemas.contact import ContactCreate, ContactStatusUpdate, ContactResponse
from app.schemas.analytics import AnalyticsStatsResponse

__all__ = [
    "CamelModel",
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "ProductColorSchema",
    "ProductSpecSchema",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "OrderCreate",
    "OrderItemCreate",
    "OrderResponse",
    "OrderItemResponse",
    "OrderStatusUpdate",
    "AboutSectionCreate",
    "AboutSectionUpdate",
    "AboutSectionResponse",
    "ArticleCreate",
    "ArticleUpdate",
    "ArticleResponse",
    "ContactCreate",
    "ContactStatusUpdate",
    "ContactResponse",
    "AnalyticsStatsResponse",
]

