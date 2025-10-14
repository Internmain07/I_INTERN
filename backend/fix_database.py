"""
Database Repair Utility
This script fixes common database issues like orphaned applications.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.internship import Internship as InternshipModel
from app.models.application import Application as ApplicationModel


def fix_orphaned_applications(session: Session, dry_run: bool = True):
    """
    Find and fix applications that reference deleted internships
    
    Args:
        session: Database session
        dry_run: If True, don't actually fix, just show what would be fixed
    """
    
    print("\n" + "=" * 60)
    print("CHECKING FOR ORPHANED APPLICATIONS")
    print("=" * 60)
    
    # Get all applications
    all_applications = session.query(ApplicationModel).all()
    
    if not all_applications:
        print("\n✓ No applications found in database.")
        return
    
    print(f"\nFound {len(all_applications)} application(s) in database.")
    print("Checking for orphaned records...")
    
    orphaned_apps = []
    
    for app in all_applications:
        # Check if internship exists
        if app.internship_id:
            internship = session.query(InternshipModel).filter(
                InternshipModel.id == app.internship_id
            ).first()
            
            if not internship:
                orphaned_apps.append(app)
    
    if not orphaned_apps:
        print("\n✓ No orphaned applications found. Database is healthy!")
        return
    
    print(f"\n⚠️  Found {len(orphaned_apps)} orphaned application(s):")
    print("-" * 60)
    print(f"{'Application ID':<40} {'Intern ID':<12} {'Status':<15}")
    print("-" * 60)
    
    for app in orphaned_apps:
        print(f"{app.id:<40} {app.intern_id:<12} {app.status:<15}")
    
    print("-" * 60)
    
    if dry_run:
        print("\n✓ This was a DRY RUN. No data was deleted.")
        print("  To actually fix these issues, run: python fix_database.py --fix")
        return
    
    # Confirm deletion
    print("\n⚠️  These applications reference non-existent internships.")
    print("They will be deleted to maintain database integrity.")
    confirm = input("\nDelete these orphaned applications? (yes/no): ").lower()
    
    if confirm != 'yes':
        print("Operation cancelled.")
        return
    
    # Delete orphaned applications
    deleted_count = 0
    for app in orphaned_apps:
        session.delete(app)
        deleted_count += 1
    
    session.commit()
    print(f"\n✓ Successfully deleted {deleted_count} orphaned application(s).")
    print("Database integrity restored!")


def show_database_health(session: Session):
    """Show overall database health statistics"""
    
    print("\n" + "=" * 60)
    print("DATABASE HEALTH CHECK")
    print("=" * 60)
    
    # Count records
    total_internships = session.query(InternshipModel).count()
    total_applications = session.query(ApplicationModel).count()
    
    # Count orphaned applications
    orphaned_count = 0
    all_applications = session.query(ApplicationModel).all()
    
    for app in all_applications:
        if app.internship_id:
            internship = session.query(InternshipModel).filter(
                InternshipModel.id == app.internship_id
            ).first()
            if not internship:
                orphaned_count += 1
    
    # Display health status
    print(f"\nTotal Internships:        {total_internships}")
    print(f"Total Applications:       {total_applications}")
    print(f"Orphaned Applications:    {orphaned_count}")
    
    print("\n" + "-" * 60)
    
    if orphaned_count == 0:
        print("✓ DATABASE IS HEALTHY - No issues found!")
    else:
        print(f"⚠️  ISSUES FOUND - {orphaned_count} orphaned application(s)")
        print("   Run: python fix_database.py --fix")
    
    print("=" * 60)


def main():
    """Main function"""
    
    args = sys.argv[1:]
    
    # Parse arguments
    fix_mode = '--fix' in args
    dry_run = not fix_mode
    show_health = '--health' in args or len(args) == 0
    
    # Show help
    if '--help' in args or '-h' in args:
        print(__doc__)
        print("\nUsage:")
        print("  python fix_database.py              # Show health check")
        print("  python fix_database.py --health     # Show health check")
        print("  python fix_database.py --fix        # Fix orphaned applications")
        print("  python fix_database.py --help       # Show this help")
        return
    
    # Create database session
    db = SessionLocal()
    
    try:
        if show_health:
            show_database_health(db)
        
        if fix_mode or (not show_health):
            fix_orphaned_applications(db, dry_run=dry_run)
    
    except KeyboardInterrupt:
        print("\n\nInterrupted by user.")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
