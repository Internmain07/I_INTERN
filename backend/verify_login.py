"""
Quick verification that all users can login with Password123
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password

def verify_all_users():
    db = SessionLocal()
    users = db.query(User).all()
    
    test_password = "Password123"
    
    print("\n" + "="*70)
    print("🔐 VERIFYING ALL USER LOGINS")
    print("="*70)
    print(f"\nTesting password: {test_password}\n")
    
    all_good = True
    for user in users:
        print(f"Testing: {user.email}")
        print(f"  Role: {user.role}")
        print(f"  Email Verified: {user.email_verified}")
        
        # Check password
        can_login = verify_password(test_password, str(user.hashed_password))
        
        if can_login and user.email_verified == "true":
            print(f"  ✅ LOGIN WILL WORK!")
        elif not can_login:
            print(f"  ❌ Password doesn't match!")
            all_good = False
        elif user.email_verified == "false":
            print(f"  ❌ Email not verified!")
            all_good = False
        
        print()
    
    print("="*70)
    if all_good:
        print("✅ ALL USERS CAN LOGIN!")
        print(f"\nAll users should use password: {test_password}")
    else:
        print("❌ SOME USERS HAVE ISSUES!")
        print("\nRun: python reset_user_password.py")
    print("="*70 + "\n")
    
    db.close()

if __name__ == "__main__":
    verify_all_users()
