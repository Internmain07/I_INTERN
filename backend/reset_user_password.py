"""
User Password Reset Tool
This script helps reset passwords for users who can't login
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from sqlalchemy import text

def list_all_users():
    """List all users in the database"""
    db = SessionLocal()
    users = db.query(User).all()
    
    print("\n" + "="*70)
    print("📋 ALL USERS IN DATABASE")
    print("="*70)
    print(f"\nTotal users: {len(users)}\n")
    
    for i, user in enumerate(users, 1):
        print(f"{i}. Email: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Email Verified: {user.email_verified}")
        print(f"   Suspended: {getattr(user, 'is_suspended', False)}")
        print()
    
    db.close()
    return users

def reset_user_password(email: str, new_password: str):
    """Reset password for a specific user"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ User not found: {email}")
            db.close()
            return False
        
        # Hash the new password
        hashed_password = get_password_hash(new_password)
        
        # Update user password
        user.hashed_password = hashed_password
        
        # Also make sure email is verified
        user.email_verified = "true"
        
        # Make sure not suspended
        if hasattr(user, 'is_suspended'):
            user.is_suspended = False
        
        db.commit()
        
        print("\n" + "="*70)
        print("✅ PASSWORD RESET SUCCESSFUL!")
        print("="*70)
        print(f"📧 Email:    {email}")
        print(f"🔑 New Password: {new_password}")
        print(f"👤 Role:     {user.role}")
        print(f"✉️  Email Verified: {user.email_verified}")
        print("="*70)
        print("\n💡 You can now login with these credentials!\n")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error resetting password: {e}")
        db.rollback()
        db.close()
        return False

def reset_all_passwords_to_default():
    """Reset all user passwords to a default password for testing"""
    db = SessionLocal()
    
    default_password = "Password123"
    
    print("\n" + "="*70)
    print("⚠️  RESET ALL PASSWORDS TO DEFAULT")
    print("="*70)
    print(f"\nThis will reset ALL user passwords to: {default_password}")
    confirm = input("Are you sure? (yes/no): ")
    
    if confirm.lower() != 'yes':
        print("❌ Cancelled")
        db.close()
        return
    
    try:
        users = db.query(User).all()
        hashed_password = get_password_hash(default_password)
        
        count = 0
        for user in users:
            user.hashed_password = hashed_password
            user.email_verified = "true"
            if hasattr(user, 'is_suspended'):
                user.is_suspended = False
            count += 1
        
        db.commit()
        
        print("\n✅ SUCCESS!")
        print(f"Reset {count} user passwords to: {default_password}")
        print("\nUsers can now login with:")
        for user in users:
            print(f"  - {user.email} / {default_password}")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

def test_user_login(email: str, password: str):
    """Test if credentials work"""
    db = SessionLocal()
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print(f"❌ User not found: {email}")
        db.close()
        return False
    
    print(f"\n🔍 Testing login for: {email}")
    print(f"   Role: {user.role}")
    print(f"   Email Verified: {user.email_verified}")
    
    if user.email_verified == "false":
        print(f"   ❌ Email not verified - login will fail!")
        db.close()
        return False
    
    if hasattr(user, 'is_suspended') and user.is_suspended:
        print(f"   ❌ Account is suspended!")
        db.close()
        return False
    
    is_valid = verify_password(password, str(user.hashed_password))
    
    if is_valid:
        print(f"   ✅ Password is CORRECT!")
        print(f"   ✅ Login should work!")
        db.close()
        return True
    else:
        print(f"   ❌ Password is INCORRECT!")
        db.close()
        return False

def interactive_menu():
    """Interactive menu for password management"""
    while True:
        print("\n" + "="*70)
        print("🔧 USER PASSWORD MANAGEMENT TOOL")
        print("="*70)
        print("\n1. List all users")
        print("2. Reset password for specific user")
        print("3. Reset all passwords to default (Password123)")
        print("4. Test login credentials")
        print("5. Exit")
        print()
        
        choice = input("Select option (1-5): ").strip()
        
        if choice == "1":
            list_all_users()
            
        elif choice == "2":
            list_all_users()
            email = input("\nEnter user email: ").strip()
            password = input("Enter new password: ").strip()
            if email and password:
                reset_user_password(email, password)
            else:
                print("❌ Email and password required")
                
        elif choice == "3":
            reset_all_passwords_to_default()
            
        elif choice == "4":
            email = input("\nEnter email: ").strip()
            password = input("Enter password: ").strip()
            if email and password:
                test_user_login(email, password)
            else:
                print("❌ Email and password required")
                
        elif choice == "5":
            print("\n👋 Goodbye!\n")
            break
            
        else:
            print("❌ Invalid option")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Interactive mode
        interactive_menu()
    elif len(sys.argv) == 3:
        # Command line mode: python reset_user_password.py email password
        email = sys.argv[1]
        password = sys.argv[2]
        reset_user_password(email, password)
    else:
        print("\nUsage:")
        print("  Interactive mode: python reset_user_password.py")
        print("  Command line:     python reset_user_password.py email password")
        print()
