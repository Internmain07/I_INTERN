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
from app.models.company import Company
from app.utils.email import send_password_reset_email, send_email_verification_otp, send_welcome_email
import secrets
import random
import urllib.parse
import os
import uuid
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
    User must verify email with OTP before they can login.
    """
    db_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if employer with this email already exists (for employer registrations)
    if user_in.role in ["company", "employer"]:  # Support both old and new role names
        # Check if there's already a user with employer role
        existing_employer = db.query(UserModel).filter(
            UserModel.email == user_in.email,
            UserModel.role.in_(["company", "employer"])
        ).first()
        if existing_employer:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Generate a secure 6-digit OTP for email verification
    verification_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Set OTP expiration (10 minutes from now)
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Create user with hashed password - Email NOT verified yet
    hashed_password = get_password_hash(user_in.password)
    
    # Normalize role: convert "company" to "employer" for consistency
    user_role = "employer" if user_in.role == "company" else user_in.role
    
    db_user = UserModel(
        email=user_in.email, 
        hashed_password=hashed_password, 
        role=user_role, 
        full_name=user_in.get('full_name') if hasattr(user_in, 'full_name') else None,
        email_verified=False,  # Require email verification
        email_verification_otp=verification_otp,
        email_verification_otp_expires=expires_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # If user is registering as an employer, create an EmployerProfile record (not verified yet)
    if user_role == "employer":
        from app.models.company import EmployerProfile
        db_employer_profile = EmployerProfile(
            user_id=db_user.id,  # Link to user via foreign key
            company_name=user_in.get('company_name') if hasattr(user_in, 'company_name') else "Company Name Not Set",
            is_verified=False,  # Not verified until email is verified
        )
        db.add(db_employer_profile)
        db.commit()
        db.refresh(db_employer_profile)

    # Send verification email with OTP
    try:
        send_email_verification_otp(str(db_user.email), verification_otp)  # type: ignore
        print(f"✅ Verification OTP sent to {db_user.email}: {verification_otp}")
    except Exception as e:
        print(f"❌ Failed to send verification email: {str(e)}")
        # Continue even if email fails - user can request resend

    return EmailVerificationResponse(
        success=True,
        message="Registration successful! Please check your email for verification OTP.",
        email=str(db_user.email)
    )

@router.post("/login", response_model=Token)
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, str(user.hashed_password)):  # type: ignore
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if email is verified
    if user.email_verified == "false":
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please verify your email with the OTP sent to your inbox.",
        )
    
    # Check if user is suspended (admin feature)
    if hasattr(user, 'is_suspended') and user.is_suspended:
        raise HTTPException(
            status_code=403,
            detail="Your account has been suspended. Please contact support.",
        )
    
    access_token = create_access_token(subject=str(user.email))  # type: ignore
    
    # Set cookie with configured settings
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.COOKIE_HTTPONLY,  # type: ignore
        secure=settings.COOKIE_SECURE,  # type: ignore
        samesite=settings.COOKIE_SAMESITE,  # type: ignore
        max_age=settings.COOKIE_MAX_AGE,
        domain=settings.COOKIE_DOMAIN
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_current_user_profile(
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
):
    """Get current user profile with all details"""
    from app.models.profile import StudentProfile
    
    # Build base user data
    user_data = {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "name": current_user.full_name,
        "phone": current_user.phone,
        "avatar_url": current_user.avatar_url,
    }
    
    # Add student profile data if user is a student/intern
    if current_user.role in ['student', 'intern']:
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if student_profile:
            user_data.update({
                "location": student_profile.location,
                "date_of_birth": student_profile.date_of_birth,
                "bio": student_profile.bio,
                "linkedin": student_profile.linkedin_url,
                "github": student_profile.github_url,
                "portfolio": student_profile.portfolio_url,
                "university": student_profile.university,
                "major": student_profile.major,
                "graduation_year": student_profile.graduation_year,
                "grading_type": student_profile.grading_type,
                "grading_score": student_profile.grading_score,
                "skills": student_profile.skills,  # This is the skills array!
            })
        else:
            # Add None values
            user_data.update({
                "location": None,
                "date_of_birth": None,
                "bio": None,
                "linkedin": None,
                "github": None,
                "portfolio": None,
                "university": None,
                "major": None,
                "graduation_year": None,
                "grading_type": None,
                "grading_score": None,
                "skills": None,
            })
    
    return user_data

@router.post("/logout")
def logout(response: Response):
    """
    Logout user by clearing the authentication cookie.
    """
    response.delete_cookie(
        key="access_token",
        domain=settings.COOKIE_DOMAIN,
        secure=settings.COOKIE_SECURE,  # type: ignore
        httponly=settings.COOKIE_HTTPONLY,  # type: ignore
        samesite=settings.COOKIE_SAMESITE  # type: ignore
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
        user.reset_otp = reset_otp  # type: ignore
        user.reset_otp_expires = expires_at  # type: ignore
        db.commit()
        
        # Send password reset email with OTP
        try:
            email_sent = send_password_reset_email(str(user.email), reset_otp)  # type: ignore
            if email_sent:
                print(f"✅ Password reset email sent successfully to {user.email}")
            else:
                print(f"⚠️ Password reset email failed to send to {user.email}")
                # Optionally, you could raise an exception here or return a different status
        except Exception as e:
            print(f"❌ Exception while sending email: {str(e)}")
            import traceback
            traceback.print_exc()
            # Don't fail the request if email fails (security best practice)
    
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
    
    if not user or not str(user.reset_otp):  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if OTP matches
    if str(user.reset_otp) != otp_data.otp:  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if OTP is expired
    if user.reset_otp_expires < datetime.utcnow():  # type: ignore
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    return {
        "message": "OTP is valid",
        "email": str(user.email)  # type: ignore
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
    
    if not user or not str(user.reset_otp):  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if OTP matches
    if str(user.reset_otp) != reset_data.otp:  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if OTP is expired
    if user.reset_otp_expires < datetime.utcnow():  # type: ignore
        # Clear expired OTP
        user.reset_otp = None  # type: ignore
        user.reset_otp_expires = None  # type: ignore
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)  # type: ignore
    
    # Clear reset OTP
    user.reset_otp = None  # type: ignore
    user.reset_otp_expires = None  # type: ignore
    
    db.commit()
    
    return PasswordResetResponse(
        message="Password has been reset successfully. You can now log in with your new password.",
        email=str(user.email)  # type: ignore
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
    if str(user.email_verified) == "true":  # type: ignore
        return EmailVerificationResponse(
            message="Email is already verified",
            email=str(user.email),  # type: ignore
            email_verified=True
        )
    
    # Generate a secure 6-digit OTP
    verification_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Set OTP expiration (10 minutes from now)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Store OTP and expiration in database
    user.email_verification_otp = verification_otp  # type: ignore
    user.email_verification_otp_expires = expires_at  # type: ignore
    db.commit()
    
    # Send verification email with OTP
    try:
        send_email_verification_otp(str(user.email), verification_otp)  # type: ignore
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # Don't fail the request if email fails
    
    return EmailVerificationResponse(
        message="Verification OTP has been sent to your email",
        email=str(user.email),  # type: ignore
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
    if str(user.email_verified) == "true":  # type: ignore
        # Already verified, just return token
        access_token = create_access_token(subject=str(user.email))  # type: ignore
        
        # Set cookie with configured settings
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=settings.COOKIE_HTTPONLY,  # type: ignore
            secure=settings.COOKIE_SECURE,  # type: ignore
            samesite=settings.COOKIE_SAMESITE,  # type: ignore
            max_age=settings.COOKIE_MAX_AGE,
            domain=settings.COOKIE_DOMAIN
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Check if OTP exists
    if not str(user.email_verification_otp):  # type: ignore
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new verification code.")
    
    # Check if OTP matches
    if str(user.email_verification_otp) != request.otp:  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Check if OTP is expired
    if user.email_verification_otp_expires < datetime.utcnow():  # type: ignore
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new verification code.")
    
    # Mark email as verified
    user.email_verified = True  # type: ignore
    user.email_verification_otp = None  # type: ignore  # Clear the OTP
    user.email_verification_otp_expires = None  # type: ignore
    
    # If user is an employer, also verify the employer profile
    if user.role in ["company", "employer"]:
        from app.models.company import EmployerProfile
        employer_profile = db.query(EmployerProfile).filter(EmployerProfile.user_id == user.id).first()
        if employer_profile:
            employer_profile.is_verified = True
    
    db.commit()
    
    # Send welcome email after successful verification
    try:
        welcome_name = user.full_name or user.email.split('@')[0]  # type: ignore
        send_welcome_email(str(user.email), str(user.role), welcome_name)  # type: ignore
    except Exception as e:
        print(f"Failed to send welcome email: {str(e)}")
        # Don't fail the verification if welcome email fails
    
    # Generate access token for the user
    access_token = create_access_token(subject=str(user.email))  # type: ignore
    
    # Set cookie with configured settings
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.COOKIE_HTTPONLY,  # type: ignore
        secure=settings.COOKIE_SECURE,  # type: ignore
        samesite=settings.COOKIE_SAMESITE,  # type: ignore
        max_age=settings.COOKIE_MAX_AGE,
        domain=settings.COOKIE_DOMAIN
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

