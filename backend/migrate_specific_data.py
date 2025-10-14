"""
Script to migrate specific internships and employer profiles from source to destination database
Handles schema differences between the two databases
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

# Source database (where we get data from)
SOURCE_DB = 'postgresql://neondb_owner:npg_Jco38PMBDbfI@ep-restless-union-a19y0d23-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Destination database (where we put data)
DEST_DB = 'postgresql://neondb_owner:npg_pjSFt3Hqki1W@ep-dawn-pine-a1pod47e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

def get_session(database_url):
    """Create a database session"""
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    return Session(), engine

def fetch_employer_profiles(session, user_ids):
    """Fetch employer profiles from source database"""
    query = text("""
        SELECT * FROM employer_profiles 
        WHERE user_id IN :user_ids
    """)
    result = session.execute(query, {"user_ids": tuple(user_ids)})
    columns = result.keys()
    profiles = [dict(zip(columns, row)) for row in result.fetchall()]
    return profiles

def fetch_users(session, user_ids):
    """Fetch users from source database - only common fields"""
    query = text("""
        SELECT id, email, hashed_password, role, 
               first_name, last_name, phone_number,
               created_at, updated_at, is_verified
        FROM users 
        WHERE id IN :user_ids
    """)
    result = session.execute(query, {"user_ids": tuple(user_ids)})
    columns = result.keys()
    users = [dict(zip(columns, row)) for row in result.fetchall()]
    return users

def fetch_internships(session, employer_ids):
    """Fetch internships posted by specific employers"""
    query = text("""
        SELECT * FROM internships 
        WHERE employer_id IN :employer_ids
    """)
    result = session.execute(query, {"employer_ids": tuple(employer_ids)})
    columns = result.keys()
    internships = [dict(zip(columns, row)) for row in result.fetchall()]
    return internships

def get_or_create_employer_profile_id(dest_session, user_id):
    """Get existing employer profile ID or create one"""
    query = text("SELECT id FROM employer_profiles WHERE user_id = :user_id")
    result = dest_session.execute(query, {"user_id": user_id}).fetchone()
    return result[0] if result else None

def insert_users(dest_session, users):
    """Insert or update users in destination database with schema mapping"""
    inserted = 0
    updated = 0
    
    for user in users:
        # Map source fields to destination fields
        full_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
        if not full_name:
            full_name = user['email'].split('@')[0]  # Use email prefix if no name
        
        dest_user = {
            'id': user['id'],
            'email': user['email'],
            'hashed_password': user['hashed_password'],
            'role': user['role'],
            'is_active': True,
            'is_suspended': False,
            'full_name': full_name,
            'phone': user.get('phone_number'),
            'avatar_url': None,
            'email_verified': user.get('is_verified', False),
            'email_verification_otp': None,
            'email_verification_otp_expires': None,
            'reset_otp': None,
            'reset_otp_expires': None,
            'created_at': user.get('created_at', datetime.now()),
            'updated_at': user.get('updated_at', datetime.now())
        }
        
        # Check if user exists
        check_query = text("SELECT id FROM users WHERE id = :id")
        exists = dest_session.execute(check_query, {"id": dest_user['id']}).fetchone()
        
        if exists:
            # Update existing user
            update_query = text("""
                UPDATE users SET
                    email = :email,
                    hashed_password = :hashed_password,
                    role = :role,
                    is_active = :is_active,
                    full_name = :full_name,
                    phone = :phone,
                    email_verified = :email_verified,
                    updated_at = :updated_at
                WHERE id = :id
            """)
            dest_session.execute(update_query, dest_user)
            updated += 1
            print(f"✓ Updated user: {dest_user['email']} (ID: {dest_user['id']})")
        else:
            # Insert new user
            insert_query = text("""
                INSERT INTO users (
                    id, email, hashed_password, role, 
                    is_active, is_suspended, full_name, phone, 
                    avatar_url, email_verified, email_verification_otp,
                    email_verification_otp_expires, reset_otp, reset_otp_expires,
                    created_at, updated_at
                ) VALUES (
                    :id, :email, :hashed_password, :role,
                    :is_active, :is_suspended, :full_name, :phone,
                    :avatar_url, :email_verified, :email_verification_otp,
                    :email_verification_otp_expires, :reset_otp, :reset_otp_expires,
                    :created_at, :updated_at
                )
            """)
            dest_session.execute(insert_query, dest_user)
            inserted += 1
            print(f"✓ Inserted user: {dest_user['email']} (ID: {dest_user['id']})")
    
    return inserted, updated

def insert_employer_profiles(dest_session, profiles):
    """Insert or update employer profiles in destination database with schema mapping"""
    inserted = 0
    updated = 0
    
    for profile in profiles:
        # Map source fields to destination fields
        dest_profile = {
            'user_id': profile['user_id'],
            'company_name': profile.get('company_name', 'Unknown Company'),
            'company_description': profile.get('company_description'),
            'contact_person': None,
            'contact_number': None,
            'website': profile.get('website'),
            'industry': profile.get('industry'),
            'logo_url': profile.get('company_logo_url'),
            'address': None,
            'city': None,
            'state': None,
            'country': None,
            'pincode': None,
            'is_verified': True,
            'notification_preferences': None,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Check if profile exists
        check_query = text("SELECT id FROM employer_profiles WHERE user_id = :user_id")
        result = dest_session.execute(check_query, {"user_id": dest_profile['user_id']}).fetchone()
        
        if result:
            # Update existing profile
            dest_profile['id'] = result[0]
            update_query = text("""
                UPDATE employer_profiles SET
                    company_name = :company_name,
                    company_description = :company_description,
                    website = :website,
                    industry = :industry,
                    logo_url = :logo_url,
                    is_verified = :is_verified,
                    updated_at = :updated_at
                WHERE user_id = :user_id
            """)
            dest_session.execute(update_query, dest_profile)
            updated += 1
            print(f"✓ Updated employer profile: {dest_profile['company_name']} (User ID: {dest_profile['user_id']}, Profile ID: {dest_profile['id']})")
        else:
            # Insert new profile
            insert_query = text("""
                INSERT INTO employer_profiles (
                    user_id, company_name, company_description, contact_person,
                    contact_number, website, industry, logo_url, address,
                    city, state, country, pincode, is_verified,
                    notification_preferences, created_at, updated_at
                ) VALUES (
                    :user_id, :company_name, :company_description, :contact_person,
                    :contact_number, :website, :industry, :logo_url, :address,
                    :city, :state, :country, :pincode, :is_verified,
                    :notification_preferences, :created_at, :updated_at
                )
                RETURNING id
            """)
            result = dest_session.execute(insert_query, dest_profile)
            new_id = result.fetchone()[0]
            inserted += 1
            print(f"✓ Inserted employer profile: {dest_profile['company_name']} (User ID: {dest_profile['user_id']}, Profile ID: {new_id})")
    
    return inserted, updated

def insert_internships(dest_session, internships, employer_id_map):
    """Insert or update internships in destination database with schema mapping"""
    inserted = 0
    updated = 0
    skipped = 0
    
    for internship in internships:
        employer_id = internship['employer_id']
        
        # Get the employer_profile_id for this employer
        profile_query = text("SELECT id FROM employer_profiles WHERE user_id = :user_id")
        profile_result = dest_session.execute(profile_query, {"user_id": employer_id}).fetchone()
        
        if not profile_result:
            print(f"⚠ Skipped internship '{internship['title']}' - employer profile not found for user ID {employer_id}")
            skipped += 1
            continue
            
        employer_profile_id = profile_result[0]
        
        # Map source fields to destination fields
        # Note: destination uses VARCHAR for ID, source uses INTEGER
        # We'll generate a new UUID for destination or keep the original ID as string
        internship_id = str(internship['id'])
        
        # Map job_type to type
        job_type_mapping = {
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'remote': 'Remote',
            'hybrid': 'Hybrid',
            'internship': 'Internship'
        }
        
        # Extract numeric stipend
        stipend_value = 0
        if internship.get('stipend'):
            stipend_str = str(internship.get('stipend'))
            digits = ''.join(filter(str.isdigit, stipend_str))
            if digits:
                stipend_value = int(digits)
        
        dest_internship = {
            'id': internship_id,
            'title': internship.get('title', 'Untitled Position'),
            'description': internship.get('description'),
            'employer_profile_id': employer_profile_id,
            'is_suspended': False,
            'location': internship.get('location'),
            'stipend': stipend_value,
            'duration': internship.get('duration'),
            'type': job_type_mapping.get(internship.get('job_type', '').lower(), 'Internship'),
            'level': 'Entry',
            'category': 'General',
            'skills': internship.get('skills_required'),
            'requirements': internship.get('qualifications'),
            'benefits': internship.get('responsibilities'),
            'required_skills': internship.get('skills_required'),
            'deadline': internship.get('deadline_date'),
            'date_posted': internship.get('posted_date'),
            'status': 'active' if internship.get('is_active', True) else 'closed',
            'archived_at': None,
            'created_at': internship.get('posted_date', datetime.now()),
            'updated_at': datetime.now()
        }
        
        # Check if internship exists
        check_query = text("SELECT id FROM internships WHERE id = :id")
        exists = dest_session.execute(check_query, {"id": dest_internship['id']}).fetchone()
        
        if exists:
            # Update existing internship
            update_query = text("""
                UPDATE internships SET
                    title = :title,
                    description = :description,
                    employer_profile_id = :employer_profile_id,
                    is_suspended = :is_suspended,
                    location = :location,
                    stipend = :stipend,
                    duration = :duration,
                    type = :type,
                    level = :level,
                    category = :category,
                    skills = :skills,
                    requirements = :requirements,
                    benefits = :benefits,
                    required_skills = :required_skills,
                    deadline = :deadline,
                    date_posted = :date_posted,
                    status = :status,
                    updated_at = :updated_at
                WHERE id = :id
            """)
            dest_session.execute(update_query, dest_internship)
            updated += 1
            print(f"✓ Updated internship: {dest_internship['title']} (ID: {dest_internship['id']})")
        else:
            # Insert new internship
            insert_query = text("""
                INSERT INTO internships (
                    id, title, description, employer_profile_id, is_suspended,
                    location, stipend, duration, type, level, category,
                    skills, requirements, benefits, required_skills,
                    deadline, date_posted, status, archived_at,
                    created_at, updated_at
                ) VALUES (
                    :id, :title, :description, :employer_profile_id, :is_suspended,
                    :location, :stipend, :duration, :type, :level, :category,
                    :skills, :requirements, :benefits, :required_skills,
                    :deadline, :date_posted, :status, :archived_at,
                    :created_at, :updated_at
                )
            """)
            dest_session.execute(insert_query, dest_internship)
            inserted += 1
            print(f"✓ Inserted internship: {dest_internship['title']} (ID: {dest_internship['id']})")
    
    return inserted, updated, skipped

def main():
    """Main migration function"""
    print("=" * 70)
    print("MIGRATING DATA FROM SOURCE TO DESTINATION DATABASE")
    print("=" * 70)
    
    # User IDs to migrate
    user_ids = [6, 9]
    employer_ids = [6, 9]
    
    print(f"\n📊 Target Users: {user_ids}")
    print(f"📊 Target Employers: {employer_ids}")
    
    try:
        # Connect to source database
        print("\n🔌 Connecting to SOURCE database...")
        source_session, source_engine = get_session(SOURCE_DB)
        print("✓ Connected to source database")
        
        # Connect to destination database
        print("\n🔌 Connecting to DESTINATION database...")
        dest_session, dest_engine = get_session(DEST_DB)
        print("✓ Connected to destination database")
        
        # Fetch data from source
        print("\n" + "=" * 70)
        print("FETCHING DATA FROM SOURCE DATABASE")
        print("=" * 70)
        
        print("\n📥 Fetching users...")
        users = fetch_users(source_session, user_ids)
        print(f"✓ Found {len(users)} users")
        for user in users:
            print(f"  - {user['email']} (ID: {user['id']}, Role: {user['role']})")
        
        print("\n📥 Fetching employer profiles...")
        profiles = fetch_employer_profiles(source_session, user_ids)
        print(f"✓ Found {len(profiles)} employer profiles")
        for profile in profiles:
            print(f"  - {profile['company_name']} (User ID: {profile['user_id']})")
        
        print("\n📥 Fetching internships...")
        internships = fetch_internships(source_session, employer_ids)
        print(f"✓ Found {len(internships)} internships")
        for internship in internships:
            print(f"  - {internship['title']} (ID: {internship['id']}, Employer ID: {internship['employer_id']})")
        
        # Insert data into destination
        print("\n" + "=" * 70)
        print("INSERTING DATA INTO DESTINATION DATABASE")
        print("=" * 70)
        
        print("\n📤 Inserting users...")
        users_inserted, users_updated = insert_users(dest_session, users)
        
        print("\n📤 Inserting employer profiles...")
        profiles_inserted, profiles_updated = insert_employer_profiles(dest_session, profiles)
        
        # Create employer ID mapping (user_id -> employer_profile_id)
        employer_id_map = {}
        for user_id in user_ids:
            profile_id = get_or_create_employer_profile_id(dest_session, user_id)
            if profile_id:
                employer_id_map[user_id] = profile_id
        
        print("\n📤 Inserting internships...")
        internships_inserted, internships_updated, internships_skipped = insert_internships(dest_session, internships, employer_id_map)
        
        # Commit changes
        print("\n💾 Committing changes...")
        dest_session.commit()
        print("✓ Changes committed successfully")
        
        # Summary
        print("\n" + "=" * 70)
        print("MIGRATION SUMMARY")
        print("=" * 70)
        print(f"\n👥 Users:")
        print(f"   - Inserted: {users_inserted}")
        print(f"   - Updated: {users_updated}")
        print(f"\n🏢 Employer Profiles:")
        print(f"   - Inserted: {profiles_inserted}")
        print(f"   - Updated: {profiles_updated}")
        print(f"\n💼 Internships:")
        print(f"   - Inserted: {internships_inserted}")
        print(f"   - Updated: {internships_updated}")
        print(f"   - Skipped: {internships_skipped}")
        
        print("\n✅ MIGRATION COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        dest_session.rollback()
        
    finally:
        # Close connections
        source_session.close()
        dest_session.close()
        source_engine.dispose()
        dest_engine.dispose()
        print("\n🔌 Database connections closed")

if __name__ == "__main__":
    main()
