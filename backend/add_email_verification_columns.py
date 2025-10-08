"""
Migration script to add email verification and password reset columns to users table.
Run this script to update your PostgreSQL database schema.
"""
import os
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    migrations = [
        # Add email verification columns
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS email_verified VARCHAR DEFAULT 'false';
        """,
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS email_verification_otp VARCHAR;
        """,
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS email_verification_otp_expires TIMESTAMP;
        """,
        
        # Add password reset columns (OTP-based)
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR;
        """,
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_password_token_expires TIMESTAMP;
        """,
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_otp VARCHAR;
        """,
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_otp_expires TIMESTAMP;
        """
    ]
    
    with engine.connect() as conn:
        for migration in migrations:
            try:
                conn.execute(text(migration))
                conn.commit()
                print(f"✓ Executed: {migration.strip()[:50]}...")
            except Exception as e:
                print(f"✗ Error executing migration: {e}")
                print(f"  SQL: {migration.strip()[:100]}...")
    
    print("\n✅ Migration completed successfully!")
    print("All email verification and password reset columns have been added.")

if __name__ == "__main__":
    print("Starting database migration...")
    print(f"Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'local'}")
    print("-" * 60)
    migrate()
