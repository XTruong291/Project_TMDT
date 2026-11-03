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


class UserLogin(CamelModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: int
    role: RoleEnum
    is_active: bool
    created_at: datetime


class Token(CamelModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
