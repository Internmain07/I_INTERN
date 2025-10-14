# Student Profile Data Storage Fix

## Problem
Student profile details (education, skills, bio, etc.) were not being properly stored in the `student_profiles` table, making them invisible to companies viewing applicant details.

## Root Cause
1. **Incorrect data storage**: The profile endpoints were attempting to store student-specific data directly on the `users` table instead of the `student_profiles` table
2. **Missing relationships**: The `student_profiles` table was not being populated when students updated their profiles
3. **Schema mismatch**: The User model doesn't have student-specific fields, causing data to be lost

## Solution Implemented

### 1. Updated Profile Endpoints (`app/api/v1/endpoints/profile.py`)

#### Education Endpoint
- **GET `/api/profile/education`**: Now reads from `student_profiles` table
- **PUT `/api/profile/education`**: Now writes to `student_profiles` table
- Automatically creates `StudentProfile` record if it doesn't exist

#### New Student Profile Endpoint
- **GET `/api/profile/student-profile`**: Get complete student profile
- **PUT `/api/profile/student-profile`**: Update complete student profile
- Handles all fields:
  - Education: university, major, graduation_year, grading_type, grading_score
  - Personal: date_of_birth, location, bio
  - Professional: linkedin_url, github_url, portfolio_url
  - Skills: skills (JSON array)
  - Career: career_goals, internship_preferences
  - Documents: resume_url, certifications

### 2. Updated User Profile Endpoint (`app/api/v1/endpoints/users.py`)

#### Profile Update
- **PUT `/api/users/profile`**: Now intelligently separates data:
  - **User fields** (stored in `users` table):
    - full_name, phone, avatar_url
  - **Student Profile fields** (stored in `student_profiles` table):
    - education, location, bio, links, skills, etc.

#### Profile Get
- **GET `/api/users/profile`**: Returns combined data from both tables

### 3. Updated Schema (`app/schemas/user_profile.py`)

- Added field validator to extract student profile data from the relationship
- Maps frontend field names to database field names:
  - `linkedin` → `linkedin_url`
  - `github` → `github_url`
  - `portfolio` → `portfolio_url`

## Database Structure

### `users` table (Common fields for all users)
```
- id (Primary Key)
- email
- hashed_password
- role ('student', 'employer', 'admin')
- full_name
- phone
- avatar_url
- is_active
- is_suspended
- email_verified
- created_at
- updated_at
```

### `student_profiles` table (Student-specific data)
```
- id (Primary Key)
- user_id (Foreign Key → users.id, UNIQUE)
- date_of_birth
- location
- bio
- university
- major
- graduation_year
- grading_type
- grading_score
- linkedin_url
- github_url
- portfolio_url
- skills (JSON array)
- career_goals
- internship_preferences
- resume_url
- certifications
- created_at
- updated_at
```

### `applications` table (Already correctly structured)
```
- id (UUID)
- student_id (Foreign Key → users.id)
- internship_id
- status
- application_date
- offer_sent_date
- offer_response_date
- hired_date
```

## How Companies View Applicant Data

The `applications.py` endpoint (`/api/applications/company/all-applicants`) already correctly:
1. Retrieves the student via `application.student` relationship
2. Accesses `student.student_profile` to get education, skills, bio, etc.
3. Returns complete applicant information including:
   - Education details
   - Skills
   - Work experiences
   - Projects
   - Bio and professional links

## Testing the Fix

### 1. Test Student Profile Creation/Update

```bash
# Login as a student
POST /api/auth/login
{
  "email": "deepakumars700@gmail.com",
  "password": "your_password"
}

# Update student profile with education
PUT /api/profile/education
{
  "university": "Not specified",
  "major": "Not specified",
  "graduation_year": null,
  "grading_type": null,
  "grading_score": null
}

# Or update complete student profile
PUT /api/profile/student-profile
{
  "university": "Stanford University",
  "major": "Computer Science",
  "graduation_year": "2026",
  "grading_type": "GPA",
  "grading_score": "3.8",
  "skills": ["Python", "React", "Machine Learning"],
  "bio": "Passionate about AI and web development",
  "location": "California, USA",
  "linkedin_url": "https://linkedin.com/in/yourprofile",
  "github_url": "https://github.com/yourprofile"
}
```

### 2. Verify Data in Database

```sql
-- Check if student profile was created
SELECT * FROM student_profiles WHERE user_id = <your_user_id>;

-- Verify the relationship
SELECT u.id, u.email, u.full_name, 
       sp.university, sp.major, sp.skills, sp.bio
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.email = 'deepakumars700@gmail.com';
```

### 3. Test Company View of Applicants

```bash
# Login as a company
POST /api/auth/login
{
  "email": "company@example.com",
  "password": "company_password"
}

# View applicants (should now show student profile details)
GET /api/applications/company/all-applicants

# View specific applicant
GET /api/applications/applicant/{application_id}
```

Expected response should include:
```json
{
  "application_id": "...",
  "name": "Student Name",
  "university": "Stanford University",
  "major": "Computer Science",
  "graduation_year": "2026",
  "grading_type": "GPA",
  "grading_score": "3.8",
  "skills": ["Python", "React", "Machine Learning"],
  "bio": "Passionate about AI...",
  "linkedin": "https://linkedin.com/in/...",
  "github": "https://github.com/...",
  "education": {
    "university": "Stanford University",
    "major": "Computer Science",
    ...
  }
}
```

## Migration Considerations

### For Existing Users
If you have existing student users who may have tried to save profile data to the wrong table:

1. **Check for orphaned data**: Data might exist only in memory or was discarded
2. **Students need to re-enter**: Ask students to update their profiles again
3. **Automatic profile creation**: The new endpoints will automatically create `student_profiles` records

### Manual Data Migration (if needed)
If you somehow have student data in a different location, you can migrate it:

```python
from app.models.user import User
from app.models.student_profile_optimized import StudentProfile
from app.db.session import SessionLocal

db = SessionLocal()

# Get all students
students = db.query(User).filter(User.role == 'student').all()

for student in students:
    # Check if student profile exists
    if not student.student_profile:
        # Create new profile
        profile = StudentProfile(user_id=student.id)
        db.add(profile)
        print(f"Created profile for {student.email}")

db.commit()
```

## Frontend Changes Needed

### Update API calls to use new endpoints

```typescript
// Instead of updating user profile with all fields
// Separate into user fields and student profile fields

// Update basic user info
await api.put('/api/users/profile', {
  full_name: 'John Doe',
  phone: '+1234567890',
});

// Update student-specific info
await api.put('/api/profile/student-profile', {
  university: 'Stanford University',
  major: 'Computer Science',
  graduation_year: '2026',
  skills: ['Python', 'React'],
  bio: 'Passionate developer...',
  // ... other student fields
});
```

## Benefits

1. ✅ **Proper data separation**: Student data is now in the correct table
2. ✅ **Relationship integrity**: Uses proper SQLAlchemy relationships
3. ✅ **Visible to companies**: Companies can now see complete student profiles
4. ✅ **Scalable**: Easy to add new student-specific fields
5. ✅ **Type safety**: Proper schema validation for all fields
6. ✅ **Automatic creation**: Student profiles are created automatically when needed

## Next Steps

1. **Test thoroughly**: Ensure all endpoints work correctly
2. **Update frontend**: Modify profile update forms to use correct endpoints
3. **Notify students**: Ask existing students to update their profiles
4. **Monitor logs**: Watch for any errors in profile creation/updates
5. **Add validation**: Consider adding more field validation in schemas
