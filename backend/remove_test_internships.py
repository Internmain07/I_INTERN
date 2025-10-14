"""
Script to remove test internships from the database.
This script helps clean up test data during development.

Usage:
    python remove_test_internships.py [options]

Options:
    --all           Remove all internships (use with caution!)
    --test          Remove internships with 'test' in title (case-insensitive)
    --dry-run       Show what would be deleted without actually deleting
    --company-id    Remove internships for a specific company ID
    --before-date   Remove internships posted before a specific date (YYYY-MM-DD)
"""

import sys
import os
from datetime import datetime

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.internship import Internship as InternshipModel
from app.models.application import Application as ApplicationModel


def remove_test_internships(
    session: Session,
    remove_all: bool = False,
    test_only: bool = True,
    company_id: str = None,
    before_date: str = None,
    dry_run: bool = True
):
    """
    Remove internships based on specified criteria
    
    Args:
        session: Database session
        remove_all: If True, remove all internships (dangerous!)
        test_only: If True, only remove internships with 'test' in title
        company_id: If specified, only remove internships for this company
        before_date: If specified, only remove internships posted before this date
        dry_run: If True, don't actually delete, just show what would be deleted
    """
    
    query = session.query(InternshipModel)
    
    # Apply filters
    if test_only and not remove_all:
        query = query.filter(InternshipModel.title.ilike('%test%'))
    
    if company_id:
        query = query.filter(InternshipModel.company_id == company_id)
    
    if before_date:
        try:
            date_obj = datetime.strptime(before_date, '%Y-%m-%d').date()
            query = query.filter(InternshipModel.date_posted < date_obj)
        except ValueError:
            print(f"Invalid date format: {before_date}. Use YYYY-MM-DD")
            return
    
    # Get internships to be deleted
    internships_to_delete = query.all()
    
    if not internships_to_delete:
        print("No internships found matching the criteria.")
        return
    
    print(f"\n{'DRY RUN - ' if dry_run else ''}Found {len(internships_to_delete)} internship(s) to delete:\n")
    print("-" * 100)
    print(f"{'ID':<40} {'Title':<35} {'Company ID':<20} {'Date Posted':<15}")
    print("-" * 100)
    
    for internship in internships_to_delete:
        company_name = internship.company.company_name if internship.company else "N/A"
        date_posted = internship.date_posted.strftime('%Y-%m-%d') if internship.date_posted else "N/A"
        
        print(f"{internship.id:<40} {internship.title[:34]:<35} {company_name[:19]:<20} {date_posted:<15}")
        
        # Count and show applications
        app_count = len(internship.applications)
        if app_count > 0:
            print(f"  └─ ⚠️  Has {app_count} application(s) that will also be deleted!")
    
    print("-" * 100)
    print(f"\nTotal: {len(internships_to_delete)} internship(s)")
    
    # Calculate total applications that will be deleted
    total_applications = sum(len(i.applications) for i in internships_to_delete)
    if total_applications > 0:
        print(f"⚠️  Warning: {total_applications} application(s) will also be deleted!")
    
    if dry_run:
        print("\n✓ This was a DRY RUN. No data was deleted.")
        print("  To actually delete, run without --dry-run flag.")
        return
    
    # Confirm deletion
    print("\n⚠️  WARNING: This action cannot be undone!")
    confirmation = input("Type 'DELETE' to confirm deletion: ")
    
    if confirmation != 'DELETE':
        print("Deletion cancelled.")
        return
    
    # Perform deletion
    deleted_count = 0
    deleted_apps_count = 0
    
    for internship in internships_to_delete:
        # Delete associated applications first (due to foreign key)
        app_count = len(internship.applications)
        for app in internship.applications:
            session.delete(app)
            deleted_apps_count += 1
        
        # Delete the internship
        session.delete(internship)
        deleted_count += 1
    
    # Commit the changes
    session.commit()
    
    print(f"\n✓ Successfully deleted {deleted_count} internship(s) and {deleted_apps_count} application(s).")


def main():
    """Main function to parse arguments and execute deletion"""
    
    # Parse command line arguments
    args = sys.argv[1:]
    
    remove_all = '--all' in args
    test_only = '--test' in args or (not remove_all)  # Default to test only
    dry_run = '--dry-run' in args
    
    company_id = None
    before_date = None
    
    # Parse company-id
    if '--company-id' in args:
        idx = args.index('--company-id')
        if idx + 1 < len(args):
            company_id = args[idx + 1]
    
    # Parse before-date
    if '--before-date' in args:
        idx = args.index('--before-date')
        if idx + 1 < len(args):
            before_date = args[idx + 1]
    
    # Show help
    if '--help' in args or '-h' in args:
        print(__doc__)
        return
    
    # Safety check
    if remove_all and not dry_run:
        print("⚠️  WARNING: --all flag will delete ALL internships!")
        print("Please add --dry-run first to see what will be deleted.")
        return
    
    # Create database session
    db = SessionLocal()
    
    try:
        print("=" * 100)
        print("INTERNSHIP CLEANUP UTILITY")
        print("=" * 100)
        
        if dry_run:
            print("\n🔍 DRY RUN MODE - No data will be deleted\n")
        
        # Execute deletion
        remove_test_internships(
            session=db,
            remove_all=remove_all,
            test_only=test_only,
            company_id=company_id,
            before_date=before_date,
            dry_run=dry_run
        )
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
