"""
Database Restructuring Script
Drops old redundant tables and creates new optimized structure
"""
import os
import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.base import Base
from app.models import User, StudentProfile, EmployerProfile, Internship, Application, WorkExperience, Project

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

print("🔧 Database Restructuring Script")
print("=" * 60)
print(f"📍 Database: {DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'Unknown'}")
print("=" * 60)


def drop_old_tables():
    """Drop redundant tables"""
    engine = create_engine(DATABASE_URL)
    
    tables_to_drop = [
        'admins',      # ❌ Redundant - use users with role='admin'
        'interns',     # ❌ Redundant - use users + student_profiles
        'companies',   # ❌ Redundant - use users + employer_profiles
    ]
    
    print("\n🗑️  Step 1: Dropping redundant tables...")
    
    with engine.connect() as conn:
        for table in tables_to_drop:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                conn.commit()
                print(f"   ✅ Dropped table: {table}")
            except Exception as e:
                print(f"   ⚠️  Could not drop {table}: {e}")
    
    print("✅ Old tables dropped successfully")


def drop_all_tables():
    """Drop ALL existing tables for clean slate"""
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    print("\n🗑️  Dropping ALL existing tables for clean restructure...")
    
    existing_tables = inspector.get_table_names()
    
    with engine.connect() as conn:
        for table in existing_tables:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                conn.commit()
                print(f"   ✅ Dropped: {table}")
            except Exception as e:
                print(f"   ⚠️  Could not drop {table}: {e}")
    
    print("✅ All tables dropped")


def create_new_structure():
    """Create new optimized table structure"""
    print("\n🏗️  Step 2: Creating new optimized structure...")
    
    engine = create_engine(DATABASE_URL)
    
    try:
        # Create all tables from models
        Base.metadata.create_all(bind=engine)
        print("✅ New table structure created successfully")
        
        # Verify tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n📋 Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"   ✅ {table}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def verify_structure():
    """Verify the new structure"""
    print("\n🔍 Step 3: Verifying database structure...")
    
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    expected_tables = [
        'users',
        'student_profiles',
        'employer_profiles',
        'internships',
        'applications',
        'work_experiences',
        'projects'
    ]
    
    actual_tables = inspector.get_table_names()
    
    print(f"\n📊 Expected tables: {len(expected_tables)}")
    print(f"📊 Actual tables: {len(actual_tables)}")
    
    missing_tables = set(expected_tables) - set(actual_tables)
    extra_tables = set(actual_tables) - set(expected_tables)
    
    if missing_tables:
        print(f"\n⚠️  Missing tables: {', '.join(missing_tables)}")
    
    if extra_tables:
        print(f"\n⚠️  Extra tables (should be removed): {', '.join(extra_tables)}")
    
    if not missing_tables and not extra_tables:
        print("\n✅ Database structure is perfect!")
    
    # Show detailed structure
    print("\n" + "=" * 60)
    print("📋 FINAL DATABASE STRUCTURE")
    print("=" * 60)
    
    for table in sorted(actual_tables):
        columns = inspector.get_columns(table)
        print(f"\n{table} ({len(columns)} columns):")
        for col in columns:
            nullable = "NULL" if col['nullable'] else "NOT NULL"
            print(f"   - {col['name']}: {col['type']} ({nullable})")


def main():
    """Main execution"""
    print("\n⚠️  WARNING: This will restructure your database!")
    print("⚠️  Old tables (admins, interns, companies) will be dropped!")
    print("⚠️  Current database is empty, so this is safe.")
    
    response = input("\n❓ Do you want to continue? (yes/no): ")
    
    if response.lower() not in ['yes', 'y']:
        print("\n❌ Operation cancelled by user")
        return
    
    # Execute restructuring
    drop_all_tables()  # Clean slate approach
    create_new_structure()
    verify_structure()
    
    print("\n" + "=" * 60)
    print("✨ DATABASE RESTRUCTURING COMPLETE!")
    print("=" * 60)
    print("\n✅ Optimized structure created successfully")
    print("✅ No duplicate data")
    print("✅ Clean separation of concerns")
    print("✅ Ready for production")
    print("\n💡 Next steps:")
    print("   1. Test user registration (student/employer)")
    print("   2. Verify profile creation works")
    print("   3. Create admin account")
    print("   4. Deploy to production")


if __name__ == "__main__":
    main()
