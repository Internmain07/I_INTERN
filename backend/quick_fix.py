"""
Quick Fix Script - Reset Admin Password and Verify All Users
Run this if login isn't working
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.core.security import get_password_hash

def quick_fix():
    """Quick fix for login issues"""
    db = SessionLocal()
    try:
        print("\n" + "="*60)
        print("🔧 QUICK FIX - Authentication Issues")
        print("="*60)
        
        # 1. Verify all users
        print("\n1️⃣  Verifying all user emails...")
        unverified_users = db.query(User).filter(User.email_verified == "false").all()
        
        if unverified_users:
            for user in unverified_users:
                user.email_verified = "true"
                user.email_verification_otp = None
                user.email_verification_otp_expires = None
                print(f"   ✅ Verified: {user.email}")
                
                # Also verify company record if it's a company user
                if user.role == "company":
                    company = db.query(Company).filter(Company.email == user.email).first()
                    if company:
                        company.is_verified = True
        else:
            print("   ✅ All users already verified")
        
        # 2. Reset/Create admin account
        print("\n2️⃣  Setting up admin account...")
        admin_email = "admin@i-intern.com"
        admin_password = "Admin@123"
        
        admin = db.query(User).filter(User.email == admin_email).first()
        
        if admin:
            admin.hashed_password = get_password_hash(admin_password)
            admin.role = "admin"
            admin.email_verified = "true"
            admin.email_verification_otp = None
            admin.email_verification_otp_expires = None
            if hasattr(admin, 'is_suspended'):
                admin.is_suspended = False
            print(f"   ✅ Admin account updated")
        else:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                role="admin",
                email_verified="true"
            )
            db.add(admin)
            print(f"   ✅ Admin account created")
        
        # 3. Clear any expired OTPs
        print("\n3️⃣  Cleaning up expired OTPs...")
        users_with_otp = db.query(User).filter(
            (User.reset_otp != None) | (User.email_verification_otp != None)
        ).all()
        
        if users_with_otp:
            for user in users_with_otp:
                user.reset_otp = None
                user.reset_otp_expires = None
                print(f"   ✅ Cleaned: {user.email}")
        else:
            print("   ✅ No expired OTPs found")
        
        # Commit all changes
        db.commit()
        
        # 4. Display summary
        print("\n" + "="*60)
        print("✅ QUICK FIX COMPLETED SUCCESSFULLY!")
        print("="*60)
        
        print("\n📋 All Users:")
        all_users = db.query(User).all()
        for user in all_users:
            verified_icon = "✅" if user.email_verified == "true" else "❌"
            print(f"   {verified_icon} {user.email} ({user.role})")
        
        print("\n🔑 Admin Login Credentials:")
        print("="*60)
        print(f"   Email:    {admin_email}")
        print(f"   Password: {admin_password}")
        print("="*60)
        
        print("\n🌐 Login URL:")
        print("   http://localhost:8081/login")
        
        print("\n💡 IMPORTANT:")
        print("   - Password is case-sensitive!")
        print("   - Make sure backend is running (port 8002)")
        print("   - Make sure frontend is running (port 8081)")
        print("   - Clear browser cache or use Incognito mode")
        
        print("\n" + "="*60)
        print("🎉 You can now login!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    quick_fix()
