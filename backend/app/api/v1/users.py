from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User, RoleEnum
from app.models.order import Order
from app.schemas.user import UserCreate, UserUpdate, UserStatusUpdate, UserResponse
from app.api.deps import get_current_admin

router = APIRouter(prefix="/users", tags=["Users Management"])


@router.get("", response_model=List[UserResponse])
def get_users(
    role: Optional[RoleEnum] = Query(None, description="Filter by user role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search by name, email, or phone"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(search_filter),
                User.email.ilike(search_filter),
                User.phone.ilike(search_filter),
            )
        )

    return query.order_by(User.created_at.desc()).all()


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing = db.query(User).filter(User.email == user_in.email.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{user_in.email}' is already registered",
        )

    new_user = User(
        email=user_in.email.strip(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name.strip(),
        phone=user_in.phone.strip() if user_in.phone else None,
        role=user_in.role or RoleEnum.CUSTOMER,
        is_active=user_in.is_active if user_in.is_active is not None else True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    # Check email duplicate if changed
    if user_in.email and user_in.email != user.email:
        existing = db.query(User).filter(User.email == user_in.email).first()
        if existing and existing.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{user_in.email}' is already used by another account",
            )
        user.email = user_in.email

    if user_in.full_name:
        user.full_name = user_in.full_name
    if user_in.phone is not None:
        user.phone = user_in.phone
    if user_in.role:
        # Prevent demoting the only admin or own account if necessary
        user.role = user_in.role
    if user_in.is_active is not None:
        if user.id == admin.id and not user_in.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot deactivate your own admin account",
            )
        user.is_active = user_in.is_active
    if user_in.password and user_in.password.strip():
        user.hashed_password = hash_password(user_in.password.strip())

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/status", response_model=UserResponse)
def toggle_user_status(
    user_id: int,
    status_in: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    if user.id == admin.id and not status_in.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own admin account",
        )

    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    # Detach orders to preserve purchase records
    db.query(Order).filter(Order.user_id == user_id).update(
        {Order.user_id: None}, synchronize_session=False
    )

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "id": user_id}

