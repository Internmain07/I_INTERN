"""
Script to manually verify a user's email in the database.
Use this for development/testing when you don't have access to email OTP.
"""
from app.db.session import SessionLocal
from app.models.user import User
import sys

def verify_user_email(email: str):
    """Mark a user's email as verified"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ User with email '{email}' not found")
            return False
        
        if user.email_verified == "true":
            print(f"✅ User '{email}' is already verified")
            return True
        
        # Mark email as verified
        user.email_verified = "true"
        user.email_verification_otp = None
        user.email_verification_otp_expires = None
        db.commit()
        
        print(f"✅ Successfully verified email for user: {email}")
        print(f"   Role: {user.role}")
        print(f"   User can now login!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()

def list_unverified_users():
    """List all users who haven't verified their email"""
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.email_verified == "false").all()
        
        if not users:
            print("✅ No unverified users found!")
            return
        
        print(f"\n📋 Found {len(users)} unverified user(s):\n")
        for user in users:
            print(f"  • {user.email} ({user.role})")
            if user.email_verification_otp:
                print(f"    OTP: {user.email_verification_otp}")
                print(f"    Expires: {user.email_verification_otp_expires}")
        print()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔐 Email Verification Helper")
    print("="*60 + "\n")
    
    if len(sys.argv) > 1:
        email = sys.argv[1]
        verify_user_email(email)
    else:
        list_unverified_users()
        print("💡 Usage:")
        print("   python verify_user_email.py <email>")
        print("\n   Example:")
        print("   python verify_user_email.py user@example.com")
        print()
