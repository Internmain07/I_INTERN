"""
Script to verify only NEW users (registered after a specific date).
Leaves existing unverified users untouched.
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.models.company import Company
from datetime import datetime, timedelta
import sys

def verify_new_users(hours_ago=24):
    """
    Verify users who registered within the last X hours.
    Default: last 24 hours
    """
    db = SessionLocal()
    try:
        # Calculate cutoff time
        cutoff_time = datetime.utcnow() - timedelta(hours=hours_ago)
        
        # Get unverified users
        users = db.query(User).filter(User.email_verified == "false").all()
        
        if not users:
            print("✅ No unverified users found!")
            return
        
        # Filter users based on OTP creation time (proxy for registration time)
        new_users = []
        for user in users:
            # If user has OTP and it was created recently, they're a new signup
            if user.email_verification_otp_expires:
                # OTP expires 10 minutes after creation, so we can estimate creation time
                otp_created = user.email_verification_otp_expires - timedelta(minutes=10)
                if otp_created >= cutoff_time:
                    new_users.append(user)
        
        if not new_users:
            print(f"ℹ️  No new users registered in the last {hours_ago} hours.")
            print(f"   Total unverified users: {len(users)}")
            print(f"   But none are recent signups.\n")
            return
        
        print(f"\n🔓 Found {len(new_users)} new user(s) to verify (registered in last {hours_ago} hours):\n")
        
        for user in new_users:
            user.email_verified = "true"
            user.email_verification_otp = None
            user.email_verification_otp_expires = None
            print(f"  ✅ Verified: {user.email} ({user.role})")
            
            # Also verify company record if it's a company user
            if user.role == "company":
                company = db.query(Company).filter(Company.email == user.email).first()
                if company:
                    company.is_verified = True
                    print(f"     └─ Company record also verified")
        
        db.commit()
        print(f"\n✅ Successfully verified {len(new_users)} new user(s)!")
        print(f"   Existing {len(users) - len(new_users)} unverified users left untouched.\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

def verify_specific_email(email: str):
    """Verify a specific user by email"""
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
        
        # Also verify company record if it's a company user
        if user.role == "company":
            company = db.query(Company).filter(Company.email == user.email).first()
            if company:
                company.is_verified = True
                print(f"✅ Verified company record for: {email}")
        
        db.commit()
        
        print(f"✅ Successfully verified: {email} ({user.role})")
        print(f"   User can now login!\n")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔐 Verify NEW Users Only")
    print("="*60 + "\n")
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--all":
            # Verify all users registered in last 24 hours
            verify_new_users(24)
        elif sys.argv[1] == "--hours":
            # Custom time range
            hours = int(sys.argv[2]) if len(sys.argv) > 2 else 24
            verify_new_users(hours)
        else:
            # Verify specific email
            verify_specific_email(sys.argv[1])
    else:
        print("💡 Usage Options:\n")
        print("   1. Verify new users from last 24 hours:")
        print("      python verify_new_users.py --all\n")
        print("   2. Verify new users from last X hours:")
        print("      python verify_new_users.py --hours 48\n")
        print("   3. Verify specific email:")
        print("      python verify_new_users.py user@example.com\n")
