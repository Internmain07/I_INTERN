"""
Check the schema of the destination database
"""
from sqlalchemy import create_engine, text, inspect

DEST_DB = 'postgresql://neondb_owner:npg_pjSFt3Hqki1W@ep-dawn-pine-a1pod47e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

engine = create_engine(DEST_DB)
inspector = inspect(engine)

print("=" * 70)
print("DESTINATION DATABASE SCHEMA")
print("=" * 70)

# Check users table
print("\n📋 USERS TABLE COLUMNS:")
users_columns = inspector.get_columns('users')
for col in users_columns:
    print(f"  - {col['name']}: {col['type']}")

# Check employer_profiles table
print("\n📋 EMPLOYER_PROFILES TABLE COLUMNS:")
employer_columns = inspector.get_columns('employer_profiles')
for col in employer_columns:
    print(f"  - {col['name']}: {col['type']}")

# Check internships table
print("\n📋 INTERNSHIPS TABLE COLUMNS:")
internship_columns = inspector.get_columns('internships')
for col in internship_columns:
    print(f"  - {col['name']}: {col['type']}")

engine.dispose()
