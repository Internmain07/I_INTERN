"""
Quick script to test login credentials
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password

def test_login(email: str, password: str):
    """Test if login credentials work"""
    db = SessionLocal()
    try:
        # Find user
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ No user found with email: {email}")
            print("\n📋 Available users:")
            all_users = db.query(User).all()
            for u in all_users:
                print(f"   - {u.email} ({u.role}) - Verified: {u.email_verified}")
            return
        
        print(f"✅ User found: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Email verified: {user.email_verified}")
        
        # Check password
        if verify_password(password, str(user.hashed_password)):
            print(f"✅ Password is correct!")
            
            if user.email_verified == "false":
                print(f"⚠️  Email is NOT verified - login will fail with 403")
                print(f"   Run: python verify_user_email.py {user.email}")
            else:
                print(f"✅ Email is verified - login should work!")
        else:
            print(f"❌ Password is INCORRECT")
            print(f"   The password you entered doesn't match the stored hash")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    print("\n" + "="*60)
    print("🔐 Test Login Credentials")
    print("="*60 + "\n")
    
    if len(sys.argv) >= 3:
        email = sys.argv[1]
        password = sys.argv[2]
    else:
        email = input("Enter email: ")
        password = input("Enter password: ")
    
    print()
    test_login(email, password)
    print()
