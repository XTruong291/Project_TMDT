from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User, RoleEnum

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def get_current_admin(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted: Admin privileges required"
        )
    return current_user


def get_optional_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[User]:
    """Return the authenticated user if token is valid and active, else None."""
    if not token:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        return None
    try:
        user_id = int(user_id_str)
    except ValueError:
        return None
    return db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()


