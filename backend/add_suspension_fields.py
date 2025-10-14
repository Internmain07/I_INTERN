#!/usr/bin/env python3
"""
Database Migration Script
Adds is_suspended fields to users and internships tables.

Usage:
    python add_suspension_fields.py
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.db.session import SessionLocal


def migrate_database():
    """Add is_suspended columns to users and internships tables"""
    
    db = SessionLocal()
    
    try:
        print("\n" + "=" * 60)
        print("🔧 Database Migration: Adding Suspension Fields")
        print("=" * 60 + "\n")
        
        # Add is_suspended column to users table
        print("⏳ Adding is_suspended column to users table...")
        try:
            db.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE
            """))
            db.commit()
            print("✅ Successfully added is_suspended column to users table")
        except Exception as e:
            print(f"⚠️  Note: {e}")
            db.rollback()
        
        # Add is_suspended column to internships table
        print("⏳ Adding is_suspended column to internships table...")
        try:
            db.execute(text("""
                ALTER TABLE internships 
                ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE
            """))
            db.commit()
            print("✅ Successfully added is_suspended column to internships table")
        except Exception as e:
            print(f"⚠️  Note: {e}")
            db.rollback()
        
        print("\n" + "=" * 60)
        print("✅ DATABASE MIGRATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\n💡 You can now proceed with creating the admin account.\n")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    migrate_database()
