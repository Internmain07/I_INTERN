"""
Database Backup Script - Export data before clearing
Creates a JSON backup of all data in the database
"""
import os
import sys
import json
from datetime import datetime
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

def backup_database():
    """Create a JSON backup of all database tables"""
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("💾 Database Backup Script")
        print("=" * 60)
        
        inspector = inspect(engine)
        table_names = inspector.get_table_names()
        
        print(f"📋 Found {len(table_names)} tables to backup")
        
        backup_data = {
            "backup_date": datetime.now().isoformat(),
            "database": DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'Unknown',
            "tables": {}
        }
        
        total_rows = 0
        
        for table in table_names:
            print(f"📦 Backing up {table}...", end=" ")
            
            # Get column names
            columns = [col['name'] for col in inspector.get_columns(table)]
            
            # Fetch all rows
            result = session.execute(text(f"SELECT * FROM {table}"))
            rows = result.fetchall()
            
            # Convert rows to dictionaries
            table_data = []
            for row in rows:
                row_dict = {}
                for idx, col in enumerate(columns):
                    value = row[idx]
                    # Convert non-serializable types
                    if isinstance(value, datetime):
                        value = value.isoformat()
                    row_dict[col] = value
                table_data.append(row_dict)
            
            backup_data["tables"][table] = {
                "columns": columns,
                "rows": table_data,
                "count": len(table_data)
            }
            
            total_rows += len(table_data)
            print(f"✅ {len(table_data)} rows")
        
        # Create backups directory if it doesn't exist
        backup_dir = "database_backups"
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate backup filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = os.path.join(backup_dir, f"backup_{timestamp}.json")
        
        # Save backup to file
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2, default=str)
        
        print("\n" + "=" * 60)
        print("✅ Backup completed successfully!")
        print(f"📁 Backup file: {backup_file}")
        print(f"📊 Total rows backed up: {total_rows}")
        print(f"💾 File size: {os.path.getsize(backup_file) / 1024:.2f} KB")
        print("=" * 60)
        
        session.close()
        
    except Exception as e:
        print(f"\n❌ Backup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    backup_database()
