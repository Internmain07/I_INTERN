"""
Interactive Database Cleanup Tool
This script provides an easy-to-use menu for cleaning up test data.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.internship import Internship as InternshipModel
from app.models.application import Application as ApplicationModel
from app.models.company import Company
from datetime import datetime


def show_menu():
    """Display the main menu"""
    print("\n" + "=" * 60)
    print("DATABASE CLEANUP TOOL")
    print("=" * 60)
    print("\n1. View all internships")
    print("2. Remove internships with 'test' in title")
    print("3. Remove internships by company")
    print("4. Remove internships posted before a date")
    print("5. Remove ALL internships (⚠️  Danger!)")
    print("6. View statistics")
    print("0. Exit")
    print("\n" + "-" * 60)


def view_all_internships(session: Session):
    """Show all internships in the database"""
    internships = session.query(InternshipModel).all()
    
    if not internships:
        print("\n✓ No internships found in the database.")
        return
    
    print(f"\n{'ID':<40} {'Title':<30} {'Company':<20} {'Apps':<6}")
    print("-" * 100)
    
    for internship in internships:
        company_name = internship.company.company_name[:19] if internship.company else "N/A"
        title = internship.title[:29] if internship.title else "Untitled"
        app_count = len(internship.applications)
        
        print(f"{internship.id:<40} {title:<30} {company_name:<20} {app_count:<6}")
    
    print("-" * 100)
    print(f"\nTotal: {len(internships)} internship(s)")


def remove_test_internships(session: Session):
    """Remove internships with 'test' in the title"""
    internships = session.query(InternshipModel).filter(
        InternshipModel.title.ilike('%test%')
    ).all()
    
    if not internships:
        print("\n✓ No test internships found.")
        return
    
    print(f"\nFound {len(internships)} internship(s) with 'test' in title:")
    print("-" * 100)
    
    for internship in internships:
        company_name = internship.company.company_name if internship.company else "N/A"
        app_count = len(internship.applications)
        print(f"  • {internship.title} ({company_name})")
        if app_count > 0:
            print(f"    └─ Has {app_count} application(s)")
    
    print("-" * 100)
    
    # Confirm
    confirm = input("\nDelete these internships? (yes/no): ").lower()
    if confirm != 'yes':
        print("Cancelled.")
        return
    
    # Delete
    deleted_count = 0
    deleted_apps = 0
    
    for internship in internships:
        # Delete applications first to avoid foreign key constraint violations
        apps_to_delete = session.query(ApplicationModel).filter(
            ApplicationModel.internship_id == internship.id
        ).all()
        
        for app in apps_to_delete:
            session.delete(app)
            deleted_apps += 1
        
        # Delete internship
        session.delete(internship)
        deleted_count += 1
    
    session.commit()
    print(f"\n✓ Deleted {deleted_count} internship(s) and {deleted_apps} application(s).")


def remove_by_company(session: Session):
    """Remove internships for a specific company"""
    # Show all companies
    companies = session.query(Company).all()
    
    if not companies:
        print("\n✓ No companies found.")
        return
    
    print("\nAvailable companies:")
    print("-" * 80)
    for i, company in enumerate(companies, 1):
        internship_count = len(company.internships)
        print(f"{i}. {company.company_name} ({company.email}) - {internship_count} internship(s)")
    print("-" * 80)
    
    try:
        choice = int(input("\nSelect company number (0 to cancel): "))
        if choice == 0 or choice < 1 or choice > len(companies):
            print("Cancelled.")
            return
        
        selected_company = companies[choice - 1]
        internships = selected_company.internships
        
        if not internships:
            print(f"\n✓ No internships found for {selected_company.company_name}.")
            return
        
        print(f"\nInternships for {selected_company.company_name}:")
        for internship in internships:
            app_count = len(internship.applications)
            print(f"  • {internship.title} ({app_count} application(s))")
        
        # Confirm
        confirm = input(f"\nDelete all {len(internships)} internship(s)? (yes/no): ").lower()
        if confirm != 'yes':
            print("Cancelled.")
            return
        
        # Delete
        deleted_count = 0
        deleted_apps = 0
        
        for internship in internships:
            # Delete applications first to avoid foreign key constraint violations
            apps_to_delete = session.query(ApplicationModel).filter(
                ApplicationModel.internship_id == internship.id
            ).all()
            
            for app in apps_to_delete:
                session.delete(app)
                deleted_apps += 1
            
            session.delete(internship)
            deleted_count += 1
        
        session.commit()
        print(f"\n✓ Deleted {deleted_count} internship(s) and {deleted_apps} application(s).")
        
    except ValueError:
        print("Invalid input.")


def remove_before_date(session: Session):
    """Remove internships posted before a specific date"""
    date_str = input("\nEnter date (YYYY-MM-DD): ")
    
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        internships = session.query(InternshipModel).filter(
            InternshipModel.date_posted < date_obj
        ).all()
        
        if not internships:
            print(f"\n✓ No internships found before {date_str}.")
            return
        
        print(f"\nFound {len(internships)} internship(s) posted before {date_str}:")
        for internship in internships:
            date_posted = internship.date_posted.strftime('%Y-%m-%d') if internship.date_posted else "N/A"
            app_count = len(internship.applications)
            print(f"  • {internship.title} (Posted: {date_posted}, {app_count} apps)")
        
        # Confirm
        confirm = input(f"\nDelete these {len(internships)} internship(s)? (yes/no): ").lower()
        if confirm != 'yes':
            print("Cancelled.")
            return
        
        # Delete
        deleted_count = 0
        deleted_apps = 0
        
        for internship in internships:
            # Delete applications first to avoid foreign key constraint violations
            apps_to_delete = session.query(ApplicationModel).filter(
                ApplicationModel.internship_id == internship.id
            ).all()
            
            for app in apps_to_delete:
                session.delete(app)
                deleted_apps += 1
            
            session.delete(internship)
            deleted_count += 1
        
        session.commit()
        print(f"\n✓ Deleted {deleted_count} internship(s) and {deleted_apps} application(s).")
        
    except ValueError:
        print("Invalid date format. Use YYYY-MM-DD.")


def remove_all_internships(session: Session):
    """Remove ALL internships (dangerous!)"""
    print("\n" + "!" * 60)
    print("⚠️  WARNING: This will delete ALL internships!")
    print("!" * 60)
    
    internships = session.query(InternshipModel).all()
    
    if not internships:
        print("\n✓ No internships to delete.")
        return
    
    total_apps = sum(len(i.applications) for i in internships)
    
    print(f"\nThis will delete:")
    print(f"  • {len(internships)} internship(s)")
    print(f"  • {total_apps} application(s)")
    
    # Double confirm
    confirm1 = input("\nAre you absolutely sure? (yes/no): ").lower()
    if confirm1 != 'yes':
        print("Cancelled.")
        return
    
    confirm2 = input("Type 'DELETE ALL' to confirm: ")
    if confirm2 != 'DELETE ALL':
        print("Cancelled.")
        return
    
    # Delete all
    deleted_count = 0
    deleted_apps = 0
    
    for internship in internships:
        # Delete applications first to avoid foreign key constraint violations
        apps_to_delete = session.query(ApplicationModel).filter(
            ApplicationModel.internship_id == internship.id
        ).all()
        
        for app in apps_to_delete:
            session.delete(app)
            deleted_apps += 1
        
        session.delete(internship)
        deleted_count += 1
    
    session.commit()
    print(f"\n✓ Deleted {deleted_count} internship(s) and {deleted_apps} application(s).")


def show_statistics(session: Session):
    """Show database statistics"""
    total_internships = session.query(InternshipModel).count()
    total_applications = session.query(ApplicationModel).count()
    total_companies = session.query(Company).count()
    
    active_internships = session.query(InternshipModel).filter(
        InternshipModel.status.ilike('active')
    ).count()
    
    test_internships = session.query(InternshipModel).filter(
        InternshipModel.title.ilike('%test%')
    ).count()
    
    print("\n" + "=" * 60)
    print("DATABASE STATISTICS")
    print("=" * 60)
    print(f"\nTotal Internships:      {total_internships}")
    print(f"Active Internships:     {active_internships}")
    print(f"Test Internships:       {test_internships}")
    print(f"Total Applications:     {total_applications}")
    print(f"Total Companies:        {total_companies}")
    print("=" * 60)


def main():
    """Main function"""
    db = SessionLocal()
    
    try:
        while True:
            show_menu()
            choice = input("Select option: ")
            
            if choice == '0':
                print("\nGoodbye!")
                break
            elif choice == '1':
                view_all_internships(db)
            elif choice == '2':
                remove_test_internships(db)
            elif choice == '3':
                remove_by_company(db)
            elif choice == '4':
                remove_before_date(db)
            elif choice == '5':
                remove_all_internships(db)
            elif choice == '6':
                show_statistics(db)
            else:
                print("\n❌ Invalid option. Please try again.")
            
            input("\nPress Enter to continue...")
    
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
