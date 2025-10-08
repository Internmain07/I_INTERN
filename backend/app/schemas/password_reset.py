from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class PasswordResetRequest(BaseModel):
    """Schema for requesting a password reset"""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Schema for confirming password reset with OTP"""
    email: EmailStr
    otp: str
    new_password: str
    
    @validator('otp')
    def validate_otp(cls, v):
        if not v.isdigit():
            raise ValueError('OTP must contain only digits')
        if len(v) != 6:
            raise ValueError('OTP must be exactly 6 digits')
        return v
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class PasswordResetResponse(BaseModel):
    """Schema for password reset response"""
    message: str
    email: Optional[str] = None

class OTPVerification(BaseModel):
    """Schema for verifying OTP"""
    email: EmailStr
    otp: str
    
    @validator('otp')
    def validate_otp(cls, v):
        if not v.isdigit():
            raise ValueError('OTP must contain only digits')
        if len(v) != 6:
            raise ValueError('OTP must be exactly 6 digits')
        return v
