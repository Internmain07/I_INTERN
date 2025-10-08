from pydantic import BaseModel, EmailStr
from typing import Optional

class SendVerificationOTPRequest(BaseModel):
    """Request to send email verification OTP"""
    email: EmailStr

class VerifyEmailRequest(BaseModel):
    """Request to verify email with OTP"""
    email: EmailStr
    otp: str

class EmailVerificationResponse(BaseModel):
    """Response for email verification operations"""
    message: str
    email: Optional[str] = None
    email_verified: Optional[bool] = None
