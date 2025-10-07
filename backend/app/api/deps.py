from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.schemas.token import TokenData

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/v1/auth/login"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        token_data = TokenData(email=email)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.email == token_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_intern(
    current_user: User = Depends(get_current_user),
) -> User:
    # Accept "intern" or "student" or None/null (default for students)
    # Only reject if user explicitly has company or admin role
    print(f"DEBUG get_current_active_intern: user={current_user.email}, role={current_user.role}, role_type={type(current_user.role)}")
    if current_user.role in ["company", "admin"]:
        print(f"DEBUG: Rejecting user with role: {current_user.role}")
        raise HTTPException(
            status_code=403, 
            detail=f"Access denied: This endpoint is for students/interns only. Your role is '{current_user.role}'. Please log in with a student account or visit the company dashboard."
        )
    print(f"DEBUG: Allowing user with role: {current_user.role}")
    return current_user

def get_current_active_company(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Company:
    if current_user.role != "company":
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    # Get the company record corresponding to this user by email
    # Note: companies.id might be UUID while users.id is integer, so we match by email
    company = db.query(Company).filter(Company.email == current_user.email).first()
    if not company:
        raise HTTPException(
            status_code=404, detail="Company profile not found"
        )
    return company