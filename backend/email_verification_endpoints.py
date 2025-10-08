

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


@router.post("/verify-email", response_model=EmailVerificationResponse)
def verify_email(
    verify_data: VerifyEmailRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Verify user's email address using the OTP sent via email
    """
    user = db.query(UserModel).filter(
        UserModel.email == verify_data.email
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is already verified
    if user.email_verified == "true":
        return EmailVerificationResponse(
            message="Email is already verified",
            email=user.email,
            email_verified=True
        )
    
    # Check if OTP exists
    if not user.email_verification_otp:
        raise HTTPException(status_code=400, detail="No verification OTP found. Please request a new one.")
    
    # Check if OTP matches
    if user.email_verification_otp != verify_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if OTP is expired
    if user.email_verification_otp_expires < datetime.utcnow():
        # Clear expired OTP
        user.email_verification_otp = None
        user.email_verification_otp_expires = None
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    # Mark email as verified
    user.email_verified = "true"
    
    # Clear verification OTP
    user.email_verification_otp = None
    user.email_verification_otp_expires = None
    
    db.commit()
    
    return EmailVerificationResponse(
        message="Email verified successfully! You can now access all features.",
        email=user.email,
        email_verified=True
    )
