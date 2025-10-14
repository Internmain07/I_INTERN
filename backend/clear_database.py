"""
Clear Database Script - Remove all data while preserving tables
This script truncates all tables in the database to prepare for deployment
"""
import os
import sys
from sqlalchemy import create_engine, text, MetaData, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

print("🗄️  Database Clear Script for Deployment")
print("=" * 60)
print(f"📍 Database: {DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'Unknown'}")
print("=" * 60)

def clear_database():
    """Clear all data from all tables while preserving the table structure"""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        print("\n🔍 Connecting to database...")
        
        # Get all table names
        inspector = inspect(engine)
        table_names = inspector.get_table_names()
        
        if not table_names:
            print("⚠️  No tables found in the database")
            return
        
        print(f"\n📋 Found {len(table_names)} tables:")
        for table in table_names:
            print(f"   - {table}")
        
        print("\n⚠️  WARNING: This will delete ALL DATA from these tables!")
        print("⚠️  Table structures will be preserved.")
        response = input("\n❓ Are you sure you want to continue? (yes/no): ")
        
        if response.lower() not in ['yes', 'y']:
            print("\n❌ Operation cancelled by user")
            return
        
        print("\n🧹 Starting data cleanup...")
        print("💡 Using DELETE method (Neon-compatible)")
        
        # Define the correct order to delete tables (respecting foreign keys)
        # Child tables first, then parent tables
        ordered_tables = [
            'applications',      # References internships and users
            'work_experiences',  # References users/student_profiles
            'projects',          # References users/student_profiles
            'internships',       # References companies
            'employer_profiles', # References users and companies
            'student_profiles',  # References users
            'interns',          # References users
            'admins',           # References users
            'companies',        # Parent table
            'users',            # Parent table
        ]
        
        # Add any tables not in the ordered list
        for table in table_names:
            if table not in ordered_tables:
                ordered_tables.append(table)
        
        cleared_count = 0
        failed_tables = []
        total_deleted = 0
        
        # Delete from each table in order
        for table in ordered_tables:
            if table not in table_names:
                continue
                
            try:
                # Use a new connection for each operation
                with engine.connect() as conn:
                    # Get row count before deletion
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    row_count = result.scalar()
                    
                    if row_count > 0:
                        # Delete all rows from the table
                        conn.execute(text(f"DELETE FROM {table}"))
                        conn.commit()
                        print(f"   ✅ Cleared {table} ({row_count} rows deleted)")
                        cleared_count += 1
                        total_deleted += row_count
                    else:
                        print(f"   ⏭️  {table} (already empty)")
                        
            except Exception as e:
                failed_tables.append((table, str(e)))
                print(f"   ❌ Failed to clear {table}: {e}")
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 CLEANUP SUMMARY")
        print("=" * 60)
        print(f"✅ Tables cleared: {cleared_count}")
        print(f"📊 Total rows deleted: {total_deleted}")
        print(f"⏭️  Empty tables: {len([t for t in table_names if t in ordered_tables]) - cleared_count - len(failed_tables)}")
        
        if failed_tables:
            print(f"\n❌ Failed tables: {len(failed_tables)}")
            for table, error in failed_tables:
                print(f"   - {table}: {error[:100]}")
        
        if failed_tables:
            print("\n⚠️  Some tables failed to clear. Trying again...")
            # Retry failed tables
            for table, _ in failed_tables:
                try:
                    with engine.connect() as conn:
                        result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                        row_count = result.scalar()
                        if row_count > 0:
                            conn.execute(text(f"DELETE FROM {table}"))
                            conn.commit()
                            print(f"   ✅ Retry successful: {table} ({row_count} rows deleted)")
                except Exception as e:
                    print(f"   ❌ Retry failed: {table}")
        
        print("\n✨ Database is now ready for deployment!")
        print("💡 All table structures are preserved")
        print("💡 You can now populate with production data")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def verify_database_empty():
    """Verify that all tables are empty"""
    try:
        engine = create_engine(DATABASE_URL)
        
        print("\n🔍 Verifying database is empty...")
        
        inspector = inspect(engine)
        table_names = inspector.get_table_names()
        
        non_empty_tables = []
        
        with engine.connect() as conn:
            for table in table_names:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                row_count = result.scalar()
                
                if row_count > 0:
                    non_empty_tables.append((table, row_count))
        
        if non_empty_tables:
            print("\n⚠️  WARNING: Some tables still have data:")
            for table, count in non_empty_tables:
                print(f"   - {table}: {count} rows")
            return False
        else:
            print("\n✅ Verification complete: All tables are empty")
            print("🎉 Database is ready for production deployment!")
            return True
        
    except Exception as e:
        print(f"\n❌ Verification failed: {e}")
        return False

if __name__ == "__main__":
    clear_database()
    verify_database_empty()
