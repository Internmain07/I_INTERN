from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.models.company import Company, EmployerProfile
from app.schemas.token import TokenData

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/v1/auth/login",
    auto_error=False  # Allow checking cookies if Bearer token is not present
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    request: Request,
    db: Session = Depends(get_db), 
    token: Optional[str] = Depends(reusable_oauth2)
) -> User:
    # Try to get token from Authorization header first, then from cookie
    if not token:
        token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
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
    # Only reject if user explicitly has employer/company or admin role
    print(f"DEBUG get_current_active_intern: user={current_user.email}, role={current_user.role}, role_type={type(current_user.role)}")
    if current_user.role in ["employer", "company", "admin"]:  # Support both old and new role names
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
    if current_user.role not in ["employer", "company"]:  # Support both old and new role names
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    # Get the employer profile corresponding to this user
    employer_profile = db.query(EmployerProfile).filter(EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(
            status_code=404, detail="Employer profile not found"
        )
    return employer_profile