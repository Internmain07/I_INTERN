from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, User
from app.schemas.token import Token
from app.schemas.password_reset import (
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordResetResponse,
    OTPVerification
)
from app.api import deps
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User as UserModel
from app.utils.email import send_password_reset_email
import secrets
import random
import urllib.parse
import os
from datetime import datetime, timedelta

router = APIRouter()

# OAuth state storage (in production, use Redis or database)
oauth_states = {}

# Get backend URL from environment variable
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

@router.get("/google/login")
def google_login():
    """Redirect to Google OAuth"""
    # Generate a random state for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = True
    
    # Google OAuth configuration (you'll need to set these in your .env)
    client_id = "YOUR_GOOGLE_CLIENT_ID"  # Replace with actual client ID from Google Console
    redirect_uri = f"{BACKEND_URL}/api/v1/auth/google/callback"
    scope = "openid email profile"
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"response_type=code&"
        f"scope={urllib.parse.quote(scope)}&"
        f"state={state}"
    )
    
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, state: str, db: Session = Depends(deps.get_db)):
    """Handle Google OAuth callback"""
    # Verify state to prevent CSRF
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Remove used state
    del oauth_states[state]
    
    # In production, exchange code for access token and get user info
    # For now, we'll create a demo flow
    # You would normally:
    # 1. Exchange code for access token with Google
    # 2. Get user info from Google using the access token
    # 3. Create or find user in your database
    # 4. Generate your own JWT token
    
    # Demo: redirect to frontend with error message for now
    frontend_url = "http://localhost:8081/login?error=google_not_configured"
    return RedirectResponse(url=frontend_url)

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_in.password)
    db_user = UserModel(email=user_in.email, hashed_password=hashed_password, role=user_in.role, skills=user_in.skills)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(subject=user_in.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def get_current_user_profile(current_user: UserModel = Depends(deps.get_current_user)):
    """Get current user profile"""
    return current_user

@router.get("/debug/users")
def list_all_users(db: Session = Depends(deps.get_db)):
    """DEBUG: List all users (REMOVE IN PRODUCTION!)"""
    users = db.query(UserModel).all()
    return [{"id": u.id, "email": u.email, "role": u.role} for u in users]


@router.post("/forgot-password", response_model=PasswordResetResponse)
def forgot_password(
    reset_request: PasswordResetRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Request a password reset. Sends an email with a 6-digit OTP.
    Returns success even if email doesn't exist (for security).
    """
    user = db.query(UserModel).filter(UserModel.email == reset_request.email).first()
    
    if user:
        # Generate a secure 6-digit OTP
        reset_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Set OTP expiration (10 minutes from now)
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        # Store OTP and expiration in database
        user.reset_otp = reset_otp
        user.reset_otp_expires = expires_at
        db.commit()
        
        # Send password reset email with OTP
        try:
            send_password_reset_email(user.email, reset_otp)
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            # Don't fail the request if email fails
    
    # Always return success message (security best practice)
    return PasswordResetResponse(
        message="If an account exists with that email, you will receive a password reset OTP."
    )


@router.post("/verify-otp")
def verify_otp(
    otp_data: OTPVerification,
    db: Session = Depends(deps.get_db)
):
    """
    Verify if a password reset OTP is valid and not expired
    """
    user = db.query(UserModel).filter(
        UserModel.email == otp_data.email
    ).first()
    
    if not user or not user.reset_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if OTP matches
    if user.reset_otp != otp_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if OTP is expired
    if user.reset_otp_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    return {
        "message": "OTP is valid",
        "email": user.email
    }


@router.post("/reset-password", response_model=PasswordResetResponse)
def reset_password(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(deps.get_db)
):
    """
    Reset password using a valid OTP
    """
    # Find user with this email
    user = db.query(UserModel).filter(
        UserModel.email == reset_data.email
    ).first()
    
    if not user or not user.reset_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if OTP matches
    if user.reset_otp != reset_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if OTP is expired
    if user.reset_otp_expires < datetime.utcnow():
        # Clear expired OTP
        user.reset_otp = None
        user.reset_otp_expires = None
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    
    # Clear reset OTP
    user.reset_otp = None
    user.reset_otp_expires = None
    
    db.commit()
    
    return PasswordResetResponse(
        message="Password has been reset successfully. You can now log in with your new password.",
        email=user.email
    )