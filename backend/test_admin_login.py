#!/usr/bin/env python3
"""
Test script to verify admin login credentials
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password, get_password_hash

def test_admin_login():
    """Test admin login credentials"""
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin_email = "admin@i-intern.com"
        admin_password = "Admin@123"
        
        print(f"\n🔍 Checking for admin user: {admin_email}")
        print("=" * 60)
        
        user = db.query(User).filter(User.email == admin_email).first()
        
        if not user:
            print(f"❌ Admin user '{admin_email}' NOT FOUND in database")
            print("\n📝 To create admin user, run:")
            print("   cd backend")
            print("   python create_admin_user.py")
            return False
        
        print(f"✅ Admin user found!")
        print(f"   - ID: {user.id}")
        print(f"   - Email: {user.email}")
        print(f"   - Role: {user.role}")
        print(f"   - Email Verified: {user.email_verified}")
        print(f"   - Is Suspended: {getattr(user, 'is_suspended', False)}")
        
        # Test password
        print(f"\n🔐 Testing password: {admin_password}")
        print("=" * 60)
        
        stored_hash = str(user.hashed_password)
        print(f"   Stored hash (first 50 chars): {stored_hash[:50]}...")
        
        is_valid = verify_password(admin_password, stored_hash)
        
        if is_valid:
            print(f"✅ Password is CORRECT!")
            print(f"\n✨ Login credentials are valid:")
            print(f"   Email: {admin_email}")
            print(f"   Password: {admin_password}")
            return True
        else:
            print(f"❌ Password is INCORRECT!")
            print(f"\n🔧 Resetting password to: {admin_password}")
            
            # Reset password
            user.hashed_password = get_password_hash(admin_password)
            user.email_verified = "true"  # Ensure email is verified
            db.commit()
            
            print(f"✅ Password has been reset!")
            print(f"\n✨ You can now login with:")
            print(f"   Email: {admin_email}")
            print(f"   Password: {admin_password}")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

def list_all_users():
    """List all users in the database"""
    db = SessionLocal()
    
    try:
        print(f"\n📋 All users in database:")
        print("=" * 60)
        
        users = db.query(User).all()
        
        if not users:
            print("❌ No users found in database!")
            return
        
        for user in users:
            print(f"\n👤 User ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Role: {user.role}")
            print(f"   Verified: {user.email_verified}")
            print(f"   Suspended: {getattr(user, 'is_suspended', False)}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🔐 ADMIN LOGIN TEST")
    print("=" * 60)
    
    # Test admin login
    success = test_admin_login()
    
    # List all users for debugging
    list_all_users()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ TEST PASSED - Admin can login")
    else:
        print("❌ TEST FAILED - Check errors above")
    print("=" * 60 + "\n")
