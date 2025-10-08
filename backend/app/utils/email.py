import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from app.core.config import settings

def send_email(
    to_email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Send an email using SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Plain text body
        html_body: Optional HTML body
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Get email configuration from settings
        smtp_server = getattr(settings, 'SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = getattr(settings, 'SMTP_PORT', 587)
        smtp_username = getattr(settings, 'SMTP_USERNAME', None)
        smtp_password = getattr(settings, 'SMTP_PASSWORD', None)
        from_email = getattr(settings, 'FROM_EMAIL', smtp_username)
        
        if not smtp_username or not smtp_password:
            print("Email configuration not set. Email not sent.")
            print(f"Would send email to: {to_email}")
            print(f"Subject: {subject}")
            print(f"Body: {body}")
            return True  # Return True in development mode
        
        # Create message
        message = MIMEMultipart('alternative')
        message['From'] = from_email
        message['To'] = to_email
        message['Subject'] = subject
        
        # Add plain text body
        text_part = MIMEText(body, 'plain')
        message.attach(text_part)
        
        # Add HTML body if provided
        if html_body:
            html_part = MIMEText(html_body, 'html')
            message.attach(html_part)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(message)
        
        print(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # In development, print the email content
        print(f"Would send email to: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        return False


def send_password_reset_email(email: str, reset_otp: str) -> bool:
    """
    Send a password reset email with an OTP code
    
    Args:
        email: User's email address
        reset_otp: 6-digit OTP code for password reset
        
    Returns:
        bool: True if email sent successfully
    """
    subject = "I-Intern - Password Reset OTP"
    
    # Plain text body
    body = f"""
Hello,

You requested to reset your password for your I-Intern account.

Your password reset OTP is:

{reset_otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, please ignore this email and ensure your account is secure.

Best regards,
I-Intern Team
    """
    
    # HTML body
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .logo {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo h1 {{
            color: #1F7368;
            font-size: 28px;
            margin: 0;
        }}
        .otp-box {{
            background-color: #f0f8ff;
            border: 2px dashed #1F7368;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }}
        .otp-code {{
            font-size: 36px;
            font-weight: bold;
            color: #1F7368;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }}
        .otp-label {{
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }}
        .warning {{
            color: #666;
            font-size: 14px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }}
        .highlight {{
            background-color: #fff3cd;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="logo">
                <h1>🎓 I-Intern</h1>
            </div>
            <h2 style="color: #1F7368;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your I-Intern account.</p>
            <p>Use the following One-Time Password (OTP) to reset your password:</p>
            
            <div class="otp-box">
                <div class="otp-label">Your OTP Code:</div>
                <div class="otp-code">{reset_otp}</div>
            </div>
            
            <div class="highlight">
                <p style="margin: 0;"><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
            </div>
            
            <p>Enter this OTP on the password reset page to create a new password.</p>
            
            <div class="warning">
                <p><strong>🔒 Security Tips:</strong></p>
                <ul>
                    <li>Never share your OTP with anyone</li>
                    <li>I-Intern will never ask for your OTP via phone or email</li>
                    <li>If you did not request this reset, please ignore this email</li>
                </ul>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The I-Intern Team</p>
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(email, subject, body, html_body)
