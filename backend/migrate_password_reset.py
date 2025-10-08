"""
Database migration script to add password reset fields to users table
Run this script to update your existing database with the new fields needed for password reset functionality
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_database():
    """Add password reset fields to users table"""
    
    print("Starting database migration for password reset feature...")
    
    try:
        # Create database engine
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as connection:
            # Check if columns already exist
            print("Checking if columns already exist...")
            
            # For PostgreSQL
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' 
                AND column_name IN ('reset_password_token', 'reset_password_token_expires')
            """)
            
            result = connection.execute(check_query)
            existing_columns = [row[0] for row in result]
            
            if 'reset_password_token' in existing_columns and 'reset_password_token_expires' in existing_columns:
                print("✅ Columns already exist. No migration needed.")
                return
            
            # Add columns if they don't exist
            print("Adding new columns...")
            
            if 'reset_password_token' not in existing_columns:
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_password_token VARCHAR(255)
                """))
                print("✅ Added reset_password_token column")
            
            if 'reset_password_token_expires' not in existing_columns:
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_password_token_expires TIMESTAMP
                """))
                print("✅ Added reset_password_token_expires column")
            
            connection.commit()
            print("✅ Database migration completed successfully!")
            
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        print("\nIf you're using SQLite, the migration might fail.")
        print("In that case, you can:")
        print("1. Delete your test.db file")
        print("2. Restart your application to create a fresh database with the new schema")
        sys.exit(1)

if __name__ == "__main__":
    migrate_database()
