"""
Migration script to add OTP fields to users table for password reset
"""
import sys
from sqlalchemy import create_engine, Column, String, DateTime, text
from sqlalchemy.exc import OperationalError
from app.core.config import settings

def add_otp_fields():
    """Add reset_otp and reset_otp_expires columns to users table"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Check if columns already exist
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' 
                AND column_name IN ('reset_otp', 'reset_otp_expires');
            """))
            existing_columns = [row[0] for row in result]
            
            # Add reset_otp column if it doesn't exist
            if 'reset_otp' not in existing_columns:
                print("Adding reset_otp column...")
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_otp VARCHAR;
                """))
                conn.commit()
                print("✓ reset_otp column added successfully")
            else:
                print("✓ reset_otp column already exists")
            
            # Add reset_otp_expires column if it doesn't exist
            if 'reset_otp_expires' not in existing_columns:
                print("Adding reset_otp_expires column...")
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_otp_expires TIMESTAMP;
                """))
                conn.commit()
                print("✓ reset_otp_expires column added successfully")
            else:
                print("✓ reset_otp_expires column already exists")
            
            print("\nMigration completed successfully!")
            print("\nNew columns added:")
            print("  - reset_otp (VARCHAR) - Stores 6-digit OTP")
            print("  - reset_otp_expires (TIMESTAMP) - OTP expiration time")
            
        except OperationalError as e:
            print(f"Error during migration: {str(e)}")
            sys.exit(1)

if __name__ == "__main__":
    print("Starting OTP fields migration...")
    print(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'local'}")
    print("-" * 50)
    add_otp_fields()
