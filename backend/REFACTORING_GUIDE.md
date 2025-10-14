# Refactoring Guide: Company → EmployerProfile

This document tracks the changes needed to migrate from `Company` model to `EmployerProfile` model.

## Changes Made

### 1. deps.py ✅
- Changed `from app.models.company import Company` to `from app.models.company import EmployerProfile`
- Updated `get_current_active_company()` to return `EmployerProfile` and query by `user_id`
- Changed role check from `"company"` to `"employer"`
- Updated `get_current_active_intern()` to check for `"employer"` instead of `"company"`

## Changes Needed

### 2. auth.py
- Change import from `Company` to `EmployerProfile`
- Update role checks from `"company"` to `"employer"`
- Update company creation logic to create `EmployerProfile` instead
- Link employer_profile via `user_id` instead of separate ID

### 3. companies.py
- Change import from `Company` to `EmployerProfile`
- Update all function signatures using `Company` to use `EmployerProfile`
- Update all queries to use `EmployerProfile`

### 4. applications.py
- Change import from `Company` to `EmployerProfile`
- Update queries to fetch employer profile via internship's `employer_profile_id`
- Update all references to company fields

### 5. internships.py
- Change import from `Company` to `EmployerProfile`
- Update queries to use `employer_profile_id` correctly

### 6. landing.py
- Change import from `Company` to `EmployerProfile`
- Update count query to use `EmployerProfile`

### 7. admin.py
- Change import from `Company` to `EmployerProfile`
- Update all admin functions to work with `EmployerProfile`

## Key Schema Differences

### Old (Company)
- Separate `id` (UUID string)
- Had `email` field directly
- Accessed via `Company.email`

### New (EmployerProfile)
- `id` is INTEGER (auto-increment)
- Linked to User via `user_id` (ONE-TO-ONE)
- No email field (use `employer_profile.user.email`)
- Access user fields via relationship: `employer_profile.user.field_name`

## Role Name Changes
- Old: `"company"`
- New: `"employer"`

## Important Relationships
```python
# Old way
company = db.query(Company).filter(Company.email == email).first()

# New way
user = db.query(User).filter(User.email == email, User.role == "employer").first()
employer_profile = db.query(EmployerProfile).filter(EmployerProfile.user_id == user.id).first()

# Or via relationship
employer_profile = user.employer_profile
```
