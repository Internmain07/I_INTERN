"""
Create an admin user for the I-Intern platform.
Run this script once to create the default admin account.
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import sys

def create_admin_user(email: str = "admin@i-intern.com", password: str = "Admin@123"):
    """Create an admin user with the specified credentials"""
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == email).first()
        
        if existing_admin:
            print(f"⚠️  Admin user already exists: {email}")
            print(f"   Role: {existing_admin.role}")
            print(f"   Email Verified: {existing_admin.email_verified}")
            
            # Update if needed
            if existing_admin.email_verified != "true":
                existing_admin.email_verified = "true"
                db.commit()
                print(f"   ✅ Email verification updated to: true")
            
            return True
        
        # Create new admin user
        admin_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            role="admin",
            name="Administrator",
            email_verified="true",  # Admin doesn't need email verification
            email_verification_otp=None,
            email_verification_otp_expires=None
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("\n" + "="*60)
        print("✅ Admin User Created Successfully!")
        print("="*60)
        print(f"\n📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 Role: admin")
        print(f"✅ Email Verified: true")
        print("\n" + "="*60)
        print("⚠️  IMPORTANT: Change this password after first login!")
        print("="*60 + "\n")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("\n🔐 Admin User Creation Tool\n")
    
    # Allow custom credentials via command line
    if len(sys.argv) >= 3:
        email = sys.argv[1]
        password = sys.argv[2]
        print(f"Creating admin with custom credentials...")
        create_admin_user(email, password)
    else:
        print("Creating admin with default credentials...")
        create_admin_user()
        print("\n💡 Usage: python create_admin_user.py <email> <password>")
        print("   Example: python create_admin_user.py admin@mycompany.com MySecurePass123!")
