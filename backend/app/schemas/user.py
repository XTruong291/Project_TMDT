from typing import Optional
from datetime import datetime
from app.schemas.base import CamelModel
from app.models.user import RoleEnum


class UserBase(CamelModel):
    email: str
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: Optional[RoleEnum] = RoleEnum.CUSTOMER
    is_active: Optional[bool] = True


class UserUpdate(CamelModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None


class UserStatusUpdate(CamelModel):
    is_active: bool


class UserLogin(CamelModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: int
    role: RoleEnum
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class Token(CamelModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
