from fastapi import APIRouter, Depends, HTTPException, Request, Response
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
from app.schemas.email_verification import (
    SendVerificationOTPRequest,
    VerifyEmailRequest,
    EmailVerificationResponse
)
from app.api import deps
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.config import settings
from app.models.user import User as UserModel
from app.utils.email import send_password_reset_email, send_email_verification_otp, send_welcome_email
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

# Google OAuth endpoints - Currently disabled
# To enable: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables
# Uncomment the endpoints below and configure properly

# @router.get("/google/login")
# def google_login():
#     """Redirect to Google OAuth"""
#     # Generate a random state for CSRF protection
#     state = secrets.token_urlsafe(32)
#     oauth_states[state] = True
#     
#     # Get Google OAuth configuration from environment variables
#     client_id = os.getenv("GOOGLE_CLIENT_ID")
#     if not client_id:
#         raise HTTPException(status_code=503, detail="Google OAuth is not configured")
#     
#     redirect_uri = f"{BACKEND_URL}/api/v1/auth/google/callback"
#     scope = "openid email profile"
#     
#     google_auth_url = (
#         f"https://accounts.google.com/o/oauth2/v2/auth?"
#         f"client_id={client_id}&"
#         f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
#         f"response_type=code&"
#         f"scope={urllib.parse.quote(scope)}&"
#         f"state={state}"
#     )
#     
#     return RedirectResponse(url=google_auth_url)

# @router.get("/google/callback")
# async def google_callback(code: str, state: str, db: Session = Depends(deps.get_db)):
#     """Handle Google OAuth callback"""
#     # Verify state to prevent CSRF
#     if state not in oauth_states:
#         raise HTTPException(status_code=400, detail="Invalid state parameter")
#     
#     # Remove used state
#     del oauth_states[state]
#     
#     # In production, exchange code for access token and get user info
#     # You would normally:
#     # 1. Exchange code for access token with Google
#     # 2. Get user info from Google using the access token
#     # 3. Create or find user in your database
#     # 4. Generate your own JWT token
#     
#     # TODO: Implement full Google OAuth flow
#     google_client_id = os.getenv("GOOGLE_CLIENT_ID")
#     google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
#     
#     # Placeholder - implement actual OAuth flow
#     frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8081")
#     return RedirectResponse(url=f"{frontend_url}/login?error=google_oauth_incomplete")

@router.post("/register", response_model=EmailVerificationResponse)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    """
    Register a new user and send email verification OTP.
    User must verify email before they can login.
    """
    db_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate a secure 6-digit OTP for email verification
    verification_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Set OTP expiration (10 minutes from now)
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Create user with hashed password and verification OTP
    hashed_password = get_password_hash(user_in.password)
    db_user = UserModel(
        email=user_in.email, 
        hashed_password=hashed_password, 
        role=user_in.role, 
        skills=user_in.skills,
        email_verified="false",
        email_verification_otp=verification_otp,
        email_verification_otp_expires=expires_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Send verification email with OTP
    try:
        send_email_verification_otp(db_user.email, verification_otp)
    except Exception as e:
        print(f"Failed to send verification email: {str(e)}")
        # Don't fail registration if email fails - user can request new OTP

    return EmailVerificationResponse(
        message="Account created successfully. Please check your email for verification OTP.",
        email=db_user.email,
        email_verified=False
    )

@router.post("/login", response_model=Token)
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    
    # Set cookie with configured settings
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.COOKIE_MAX_AGE,
        domain=settings.COOKIE_DOMAIN
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def get_current_user_profile(current_user: UserModel = Depends(deps.get_current_user)):
    """Get current user profile"""
    return current_user

@router.post("/logout")
def logout(response: Response):
    """
    Logout user by clearing the authentication cookie.
    """
    response.delete_cookie(
        key="access_token",
        domain=settings.COOKIE_DOMAIN,
        secure=settings.COOKIE_SECURE,
        httponly=settings.COOKIE_HTTPONLY,
        samesite=settings.COOKIE_SAMESITE
    )
    return {"message": "Successfully logged out"}

# Debug endpoint removed for production security
# @router.get("/debug/users")
# def list_all_users(db: Session = Depends(deps.get_db)):
#     """DEBUG: List all users (REMOVE IN PRODUCTION!)"""
#     users = db.query(UserModel).all()
#     return [{"id": u.id, "email": u.email, "role": u.role} for u in users]


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

@router.post("/send-verification-otp", response_model=EmailVerificationResponse)
def send_verification_otp(
    request: SendVerificationOTPRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Send an email verification OTP to the user's email address.
    This can be used for new users or users who need to re-verify their email.
    """
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is already verified
    if user.email_verified == "true":
        return EmailVerificationResponse(
            message="Email is already verified",
            email=user.email,
            email_verified=True
        )
    
    # Generate a secure 6-digit OTP
    verification_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Set OTP expiration (10 minutes from now)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Store OTP and expiration in database
    user.email_verification_otp = verification_otp
    user.email_verification_otp_expires = expires_at
    db.commit()
    
    # Send verification email with OTP
    try:
        send_email_verification_otp(user.email, verification_otp)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # Don't fail the request if email fails
    
    return EmailVerificationResponse(
        message="Verification OTP has been sent to your email",
        email=user.email,
        email_verified=False
    )


@router.post("/verify-email", response_model=Token)
def verify_email(
    response: Response,
    request: VerifyEmailRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Verify email using OTP and return access token.
    This completes the registration process.
    """
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is already verified
    if user.email_verified == "true":
        # Already verified, just return token
        access_token = create_access_token(subject=user.email)
        
        # Set cookie with configured settings
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            max_age=settings.COOKIE_MAX_AGE,
            domain=settings.COOKIE_DOMAIN
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Check if OTP exists
    if not user.email_verification_otp:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new verification code.")
    
    # Check if OTP matches
    if user.email_verification_otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Check if OTP is expired
    if user.email_verification_otp_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new verification code.")
    
    # Mark email as verified
    user.email_verified = "true"
    user.email_verification_otp = None  # Clear the OTP
    user.email_verification_otp_expires = None
    db.commit()
    
    # Send welcome email after successful verification
    try:
        send_welcome_email(user.email, user.role, user.name)
    except Exception as e:
        print(f"Failed to send welcome email: {str(e)}")
        # Don't fail the verification if welcome email fails
    
    # Generate access token for the user
    access_token = create_access_token(subject=user.email)
    
    # Set cookie with configured settings
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.COOKIE_MAX_AGE,
        domain=settings.COOKIE_DOMAIN
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

