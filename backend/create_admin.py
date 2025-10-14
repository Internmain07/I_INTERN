#!/usr/bin/env python3
"""
Admin Account Creation Script
Creates an admin user account for the i-Intern platform.

Usage:
    python create_admin.py

This script will:
1. Connect to the database
2. Create an admin user with specified credentials
3. Confirm successful creation
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def create_admin_user(db: Session, email: str, password: str, name: str = "Admin"):
    """
    Create an admin user account
    
    Args:
        db: Database session
        email: Admin email address
        password: Admin password
        name: Admin name (default: "Admin")
    
    Returns:
        User: Created admin user object
    """
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == email).first()
    if existing_admin:
        print(f"❌ Admin user with email '{email}' already exists!")
        print(f"   User ID: {existing_admin.id}")
        print(f"   Role: {existing_admin.role}")
        print(f"\n💡 You can login with this email and reset the password if needed.\n")
        return existing_admin
    
    # Fix the sequence issue for the users table
    try:
        db.execute(text("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))
        db.commit()
    except Exception:
        pass  # Sequence might not need adjustment
    
    # Create hashed password
    hashed_password = get_password_hash(password)
    
    # Create admin user
    admin_user = User(
        email=email,
        hashed_password=hashed_password,
        role="admin",
        name=name,
        email_verified="true",
        is_suspended=False
    )
    
    try:
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("=" * 60)
        print("✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"📧 Email:    {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 Name:     {name}")
        print(f"🆔 User ID:  {admin_user.id}")
        print(f"📋 Role:     {admin_user.role}")
        print("=" * 60)
        print("\n⚠️  IMPORTANT: Save these credentials securely!")
        print("💡 TIP: You can now login with these credentials at the admin dashboard.\n")
        
        return admin_user
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {e}")
        raise


def main():
    """Main function to create admin user"""
    
    print("\n" + "=" * 60)
    print("🔧 i-Intern Admin Account Creation")
    print("=" * 60 + "\n")
    
    # Admin credentials - Change these as needed
    ADMIN_EMAIL = "admin@i-intern.com"
    ADMIN_PASSWORD = "Admin@2024"
    ADMIN_NAME = "System Administrator"
    
    print("Creating admin account with the following details:")
    print(f"  Email: {ADMIN_EMAIL}")
    print(f"  Name:  {ADMIN_NAME}")
    print("\n⏳ Connecting to database...\n")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create admin user
        create_admin_user(
            db=db,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            name=ADMIN_NAME
        )
        
    except Exception as e:
        print(f"\n❌ Failed to create admin account: {e}")
        sys.exit(1)
    finally:
        db.close()
        print("🔌 Database connection closed.\n")


if __name__ == "__main__":
    main()
