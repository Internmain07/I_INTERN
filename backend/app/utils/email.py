import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
import logging
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email(
    to_email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Send an email using SMTP with proper error handling and timeouts
    
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
        
        # Check if email is configured
        if not smtp_username or not smtp_password:
            error_msg = f"❌ EMAIL NOT CONFIGURED! SMTP credentials missing. Cannot send email to {to_email}"
            logger.error(error_msg)
            logger.info(f"Subject: {subject}")
            logger.info(f"Body preview: {body[:100]}...")
            
            # In development mode only, return True to allow testing
            if getattr(settings, 'ENVIRONMENT', 'development') == 'development':
                logger.warning("⚠️ Running in development mode - allowing operation without email")
                return True
            
            # In production, this is a critical error
            return False
        
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
        
        # Send email with timeout to prevent hanging
        logger.info(f"📧 Attempting to send email to {to_email}...")
        
        with smtplib.SMTP(smtp_server, smtp_port, timeout=30) as server:
            server.set_debuglevel(0)  # Set to 1 for debug output
            
            # Start TLS encryption
            logger.info("🔐 Starting TLS encryption...")
            server.starttls()
            
            # Login to SMTP server
            logger.info("🔑 Logging in to SMTP server...")
            server.login(smtp_username, smtp_password)
            
            # Send the email
            logger.info("📤 Sending email...")
            server.send_message(message)
        
        logger.info(f"✅ Email sent successfully to {to_email}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"❌ SMTP Authentication failed: {str(e)}")
        logger.error("Check your SMTP username and password (App Password for Gmail)")
        return False
    
    except smtplib.SMTPException as e:
        logger.error(f"❌ SMTP Error occurred: {str(e)}")
        return False
    
    except TimeoutError as e:
        logger.error(f"❌ Email sending timed out: {str(e)}")
        logger.error("SMTP server may be unreachable or blocked by firewall")
        return False
    
    except Exception as e:
        logger.error(f"❌ Unexpected error sending email: {type(e).__name__}: {str(e)}")
        logger.error(f"Target: {to_email}, Subject: {subject}")
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


def send_email_verification_otp(email: str, verification_otp: str) -> bool:
    """
    Send an email verification OTP to verify user's email address
    
    Args:
        email: User's email address
        verification_otp: 6-digit OTP code for email verification
        
    Returns:
        bool: True if email sent successfully
    """
    subject = "I-Intern - Verify Your Email Address"
    
    # Plain text body
    body = f"""
Hello,

Welcome to I-Intern! Please verify your email address to activate your account.

Your email verification OTP is:

{verification_otp}

This OTP will expire in 10 minutes.

If you did not create an account with I-Intern, please ignore this email.

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
            background-color: #d4edda;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }}
        .welcome-banner {{
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="logo">
                <h1>🎓 I-Intern</h1>
            </div>
            
            <div class="welcome-banner">
                <h2 style="margin: 0; font-size: 24px;">Welcome to I-Intern!</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Let's verify your email address</p>
            </div>
            
            <p>Hello,</p>
            <p>Thank you for creating an account with I-Intern! To complete your registration and activate your account, please verify your email address.</p>
            
            <p>Use the following One-Time Password (OTP) to verify your email:</p>
            
            <div class="otp-box">
                <div class="otp-label">Your Verification OTP:</div>
                <div class="otp-code">{verification_otp}</div>
            </div>
            
            <div class="highlight">
                <p style="margin: 0;"><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
            </div>
            
            <p>Enter this OTP on the verification page to activate your account and start exploring internship opportunities!</p>
            
            <div class="warning">
                <p><strong>🔒 Security Tips:</strong></p>
                <ul>
                    <li>Never share your OTP with anyone</li>
                    <li>I-Intern will never ask for your OTP via phone or email</li>
                    <li>If you did not create an account, please ignore this email</li>
                </ul>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The I-Intern Team</p>
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(email, subject, body, html_body)


def send_welcome_email(email: str, role: str, name: Optional[str] = None) -> bool:
    """
    Send a welcome email to new users after successful registration
    
    Args:
        email: User's email address
        role: User role (intern/student or company)
        name: User's name (optional)
        
    Returns:
        bool: True if email sent successfully
    """
    greeting = f"Hello {name}," if name else "Hello,"
    
    # Customize content based on role
    if role.lower() == "company":
        subject = "Welcome to I-Intern - Start Posting Internships!"
        role_emoji = "🏢"
        role_specific_content = """
            <p>As a company on I-Intern, you can now:</p>
            <ul>
                <li>📝 Post unlimited internship opportunities</li>
                <li>🔍 Search and connect with talented students</li>
                <li>⭐ Manage applications from qualified candidates</li>
                <li>🤝 Build your team with the best interns</li>
            </ul>
            <p>Start by creating your first internship posting and reach thousands of motivated students!</p>
        """
        plain_content = """
As a company on I-Intern, you can now:
- Post unlimited internship opportunities
- Search and connect with talented students
- Manage applications from qualified candidates
- Build your team with the best interns

Start by creating your first internship posting and reach thousands of motivated students!
        """
    else:  # intern/student
        subject = "Welcome to I-Intern - Your Internship Journey Begins!"
        role_emoji = "🎓"
        role_specific_content = """
            <p>As a student on I-Intern, you can now:</p>
            <ul>
                <li>🔍 Explore thousands of internship opportunities</li>
                <li>📄 Create and showcase your professional profile</li>
                <li>✉️ Apply to internships that match your skills</li>
                <li>📊 Track your applications and progress</li>
                <li>💼 Connect with top companies</li>
            </ul>
            <p>Start exploring internships and take the first step towards your dream career!</p>
        """
        plain_content = """
As a student on I-Intern, you can now:
- Explore thousands of internship opportunities
- Create and showcase your professional profile
- Apply to internships that match your skills
- Track your applications and progress
- Connect with top companies

Start exploring internships and take the first step towards your dream career!
        """
    
    # Plain text body
    body = f"""
{greeting}

Thank you for joining I-Intern! 🎉

We're thrilled to have you as part of our community. I-Intern is dedicated to connecting talented students with amazing internship opportunities.

{plain_content}

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The I-Intern Team

---
Connect with us:
Website: www.i-intern.com
Support: support@i-intern.com
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
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 32px;
            font-weight: bold;
        }}
        .header .emoji {{
            font-size: 48px;
            margin-bottom: 10px;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .welcome-message {{
            background-color: #f0f8ff;
            border-left: 4px solid #1F7368;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }}
        .welcome-message h2 {{
            color: #1F7368;
            margin: 0 0 10px 0;
            font-size: 24px;
        }}
        .features {{
            margin: 30px 0;
        }}
        .features ul {{
            list-style: none;
            padding: 0;
        }}
        .features li {{
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            font-size: 16px;
        }}
        .features li:last-child {{
            border-bottom: none;
        }}
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }}
        .footer {{
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
        }}
        .footer .social-links {{
            margin-top: 15px;
        }}
        .footer a {{
            color: #1F7368;
            text-decoration: none;
        }}
        .divider {{
            height: 2px;
            background: linear-gradient(to right, #1F7368, #63D7C7);
            margin: 30px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">{role_emoji}</div>
            <h1>Welcome to I-Intern!</h1>
        </div>
        
        <div class="content">
            <p style="font-size: 18px;">{greeting}</p>
            
            <div class="welcome-message">
                <h2>🎉 Thank You for Joining!</h2>
                <p style="margin: 0;">We're thrilled to have you as part of our community. I-Intern is dedicated to connecting talented students with amazing internship opportunities.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="features">
                {role_specific_content}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:8081')}/dashboard" class="cta-button">
                    Get Started Now →
                </a>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 30px;">
                <p style="margin: 0;"><strong>💡 Tip:</strong> Complete your profile to increase your chances of success!</p>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0;">If you have any questions or need assistance, we're here to help!</p>
            <p style="margin: 0;"><strong>The I-Intern Team</strong></p>
            
            <div class="divider" style="margin: 20px auto; width: 50%;"></div>
            
            <div class="social-links">
                <p>Connect with us:</p>
                <p>
                    <a href="mailto:support@i-intern.com">📧 support@i-intern.com</a>
                </p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2025 I-Intern. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(email, subject, body, html_body)
