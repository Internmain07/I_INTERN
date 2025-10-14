"""
Comprehensive Login and Forgot Password Diagnostic Tool
Run this to diagnose authentication issues
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password, get_password_hash
from datetime import datetime, timedelta
import random

def main_menu():
    """Display main menu"""
    print("\n" + "="*60)
    print("🔧 Authentication Diagnostic Tool")
    print("="*60)
    print("\n1. List all users")
    print("2. Test login credentials")
    print("3. Test forgot password (simulate OTP)")
    print("4. Verify all users' emails")
    print("5. Reset a user's password")
    print("6. Create/Update admin account")
    print("7. Check user details")
    print("8. Exit")
    print("\n" + "="*60)
    
    choice = input("\nSelect option (1-8): ")
    return choice

def list_all_users():
    """List all users in database"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        print("\n" + "="*60)
        print(f"📋 Total Users: {len(users)}")
        print("="*60)
        
        if not users:
            print("No users found in database!")
        else:
            for i, user in enumerate(users, 1):
                verified_status = "✅" if user.email_verified == "true" else "❌"
                print(f"\n{i}. {user.email}")
                print(f"   Role: {user.role}")
                print(f"   Verified: {verified_status} ({user.email_verified})")
                print(f"   ID: {user.id}")
                if hasattr(user, 'is_suspended'):
                    suspended = "🚫 SUSPENDED" if user.is_suspended else "✅ Active"
                    print(f"   Status: {suspended}")
        
        print("\n" + "="*60)
    finally:
        db.close()

def test_login():
    """Test login credentials"""
    email = input("\n📧 Enter email: ")
    password = input("🔑 Enter password: ")
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        print("\n" + "="*60)
        print("🔍 Login Test Results")
        print("="*60)
        
        if not user:
            print(f"❌ NO USER FOUND with email: {email}")
            print("\n💡 Suggestion: Check if email is correct or create account")
            return
        
        print(f"✅ User found: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Email verified: {user.email_verified}")
        
        # Check password
        password_match = verify_password(password, str(user.hashed_password))
        
        if password_match:
            print(f"\n✅ PASSWORD CORRECT")
        else:
            print(f"\n❌ PASSWORD INCORRECT")
            print(f"   The password you entered doesn't match")
        
        # Check email verification
        if user.email_verified == "false":
            print(f"\n⚠️  EMAIL NOT VERIFIED")
            print(f"   Login will fail with 403 Forbidden")
            print(f"   Run option 4 to verify this email")
        elif user.email_verified == "true" and password_match:
            print(f"\n🎉 LOGIN SHOULD WORK!")
            print(f"   All checks passed")
        
        # Check suspension
        if hasattr(user, 'is_suspended') and user.is_suspended:
            print(f"\n🚫 ACCOUNT SUSPENDED")
            print(f"   Login will fail with 403 Forbidden")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def simulate_forgot_password():
    """Simulate forgot password flow"""
    email = input("\n📧 Enter email: ")
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        print("\n" + "="*60)
        print("🔑 Forgot Password Simulation")
        print("="*60)
        
        if not user:
            print(f"✅ Response: 'If an account exists with that email...'")
            print(f"❌ Reality: NO USER FOUND with email: {email}")
            return
        
        print(f"✅ User found: {user.email}")
        
        # Generate OTP
        reset_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        # Store OTP
        user.reset_otp = reset_otp
        user.reset_otp_expires = expires_at
        db.commit()
        
        print(f"\n✅ OTP Generated: {reset_otp}")
        print(f"   Expires at: {expires_at.strftime('%Y-%m-%d %H:%M:%S')} UTC")
        print(f"\n💡 In production, this OTP would be sent via email")
        print(f"   Use this OTP to reset password in the app")
        
        print("\n📋 Next steps:")
        print(f"   1. Go to http://localhost:8081/forgot-password")
        print(f"   2. Enter email: {email}")
        print(f"   3. Enter OTP: {reset_otp}")
        print(f"   4. Set new password")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def verify_all_users():
    """Verify all unverified users"""
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.email_verified == "false").all()
        
        print("\n" + "="*60)
        print("✉️  Email Verification")
        print("="*60)
        
        if not users:
            print("✅ All users are already verified!")
        else:
            print(f"\n📋 Found {len(users)} unverified user(s):")
            for user in users:
                print(f"   - {user.email} ({user.role})")
            
            confirm = input(f"\n⚠️  Verify all {len(users)} user(s)? (yes/no): ")
            
            if confirm.lower() in ['yes', 'y']:
                for user in users:
                    user.email_verified = "true"
                    user.email_verification_otp = None
                    user.email_verification_otp_expires = None
                    print(f"   ✅ Verified: {user.email}")
                
                db.commit()
                print(f"\n🎉 Successfully verified all users!")
            else:
                print("\n❌ Verification cancelled")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def reset_password():
    """Reset a user's password"""
    email = input("\n📧 Enter email: ")
    new_password = input("🔑 Enter new password: ")
    
    if len(new_password) < 6:
        print("❌ Password must be at least 6 characters")
        return
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        print("\n" + "="*60)
        print("🔐 Password Reset")
        print("="*60)
        
        if not user:
            print(f"❌ NO USER FOUND with email: {email}")
            return
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        
        # Clear any reset tokens
        user.reset_otp = None
        user.reset_otp_expires = None
        
        db.commit()
        
        print(f"✅ Password updated for: {user.email}")
        print(f"   New password: {new_password}")
        print(f"\n💡 You can now login with:")
        print(f"   Email: {user.email}")
        print(f"   Password: {new_password}")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def create_admin():
    """Create or update admin account"""
    print("\n" + "="*60)
    print("👤 Admin Account Setup")
    print("="*60)
    
    email = input("\n📧 Admin email (default: admin@i-intern.com): ") or "admin@i-intern.com"
    password = input("🔑 Admin password (default: Admin@123): ") or "Admin@123"
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"\n🔄 Updating existing admin account...")
            user.hashed_password = get_password_hash(password)
            user.role = "admin"
            user.email_verified = "true"
            action = "updated"
        else:
            print(f"\n➕ Creating new admin account...")
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                role="admin",
                email_verified="true"
            )
            db.add(user)
            action = "created"
        
        db.commit()
        
        print(f"\n✅ Admin account {action} successfully!")
        print(f"\n📋 Admin Credentials:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: admin")
        print(f"   Verified: ✅ Yes")
        
        print("\n💡 You can now login at:")
        print(f"   http://localhost:8081/login")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def check_user_details():
    """Check detailed info for a user"""
    email = input("\n📧 Enter email: ")
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        print("\n" + "="*60)
        print("👤 User Details")
        print("="*60)
        
        if not user:
            print(f"❌ NO USER FOUND with email: {email}")
            return
        
        print(f"\n✅ User found!")
        print(f"\n📧 Email: {user.email}")
        print(f"🎭 Role: {user.role}")
        print(f"🆔 ID: {user.id}")
        print(f"✉️  Email Verified: {user.email_verified}")
        
        if hasattr(user, 'name') and user.name:
            print(f"👤 Name: {user.name}")
        
        if hasattr(user, 'skills') and user.skills:
            print(f"🎯 Skills: {user.skills}")
        
        if hasattr(user, 'is_suspended'):
            suspended = "Yes 🚫" if user.is_suspended else "No ✅"
            print(f"🚫 Suspended: {suspended}")
        
        # Check for pending OTPs
        if hasattr(user, 'email_verification_otp') and user.email_verification_otp:
            print(f"\n📧 Email Verification OTP: {user.email_verification_otp}")
            if hasattr(user, 'email_verification_otp_expires'):
                print(f"   Expires: {user.email_verification_otp_expires}")
        
        if hasattr(user, 'reset_otp') and user.reset_otp:
            print(f"\n🔑 Password Reset OTP: {user.reset_otp}")
            if hasattr(user, 'reset_otp_expires'):
                print(f"   Expires: {user.reset_otp_expires}")
                if user.reset_otp_expires < datetime.utcnow():
                    print(f"   ⚠️  EXPIRED")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

def main():
    """Main function"""
    while True:
        choice = main_menu()
        
        if choice == '1':
            list_all_users()
        elif choice == '2':
            test_login()
        elif choice == '3':
            simulate_forgot_password()
        elif choice == '4':
            verify_all_users()
        elif choice == '5':
            reset_password()
        elif choice == '6':
            create_admin()
        elif choice == '7':
            check_user_details()
        elif choice == '8':
            print("\n👋 Goodbye!\n")
            break
        else:
            print("\n❌ Invalid option. Please select 1-8.\n")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 I-Intern Authentication Diagnostic Tool")
    print("="*60)
    print("This tool helps diagnose and fix authentication issues")
    print("="*60)
    
    main()
