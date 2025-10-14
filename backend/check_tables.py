from sqlalchemy import create_engine, inspect, text
from dotenv import load_dotenv
import os

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))
inspector = inspect(engine)

print("=" * 60)
print("DATABASE STRUCTURE ANALYSIS")
print("=" * 60)

tables = inspector.get_table_names()
for table in tables:
    print(f"\n📋 Table: {table}")
    columns = inspector.get_columns(table)
    print(f"   Columns: {len(columns)}")
    for col in columns:
        print(f"      - {col['name']}: {col['type']}")
    
    # Get row count
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
        count = result.scalar()
        print(f"   Rows: {count}")

print(f"\n\nTotal tables: {len(tables)}")
