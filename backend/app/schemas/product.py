from typing import List, Optional
from datetime import datetime
from pydantic import computed_field
from app.schemas.base import CamelModel


class ProductColorSchema(CamelModel):
    name: str
    swatch: str
    image: str


class ProductSpecSchema(CamelModel):
    label: str
    value: str


class ProductBase(CamelModel):
    name: str
    sku: Optional[str] = None
    tagline: Optional[str] = None
    category: str
    sub_category: Optional[str] = None
    collection_slug: str
    image: str
    price: float
    compare_at_price: Optional[float] = None
    badge: Optional[str] = None
    rating: float = 5.0
    review_count: int = 0
    featured: bool = False
    in_stock: bool = True
    is_active: bool = True
    description: Optional[str] = None
    gallery_images: List[str] = []
    specs: List[ProductSpecSchema] = []
    colors: List[ProductColorSchema] = []


class ProductCreate(ProductBase):
    id: str
    handle: str


class ProductUpdate(CamelModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    tagline: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    collection_slug: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    badge: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    featured: Optional[bool] = None
    in_stock: Optional[bool] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    specs: Optional[List[ProductSpecSchema]] = None
    colors: Optional[List[ProductColorSchema]] = None


class ProductResponse(ProductBase):
    id: str
    handle: str
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def href(self) -> str:
        """Computed field matching Frontend link expectation /products/[handle]."""
        return f"/products/{self.handle}"

