# Database Deletion Error Fix

## Problem
When trying to delete internships that have applications, the system was throwing a database constraint error:

```
psycopg2.errors.NotNullViolation: null value in column "internship_id" of relation "applications" violates not-null constraint
```

## Root Cause
The issue was caused by how SQLAlchemy handles relationships when deleting records:

1. The `Internship` model had a relationship to `Application` records
2. When deleting an internship, SQLAlchemy tried to set `internship_id` to NULL in related applications
3. But the database has a NOT NULL constraint on `internship_id`
4. This caused the deletion to fail

## Solution Applied

### 1. Fixed the Delete Endpoint (Immediate Fix)
**File:** `backend/app/api/v1/endpoints/internships.py`

Modified the `delete_internship` function to:
- First query and delete all applications associated with the internship
- Then delete the internship itself
- This respects the foreign key constraint

```python
# Delete all applications associated with this internship first
applications = db.query(ApplicationModel).filter(
    ApplicationModel.internship_id == internship_id
).all()

for application in applications:
    db.delete(application)

# Now delete the internship
db.delete(db_internship)
db.commit()
```

### 2. Updated the Model (Long-term Fix)
**File:** `backend/app/models/internship.py`

Added cascade delete configuration to the relationship:

```python
applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")
```

This tells SQLAlchemy to automatically delete applications when their parent internship is deleted.

### 3. Fixed Cleanup Scripts
**Files:** 
- `backend/cleanup_database.py`
- `backend/remove_test_internships.py`

Updated all deletion operations to properly handle the foreign key relationship by deleting applications first.

### 4. Created Health Check Tool
**File:** `backend/fix_database.py`

Created a utility to:
- Check database health
- Identify orphaned applications (applications referencing deleted internships)
- Fix database integrity issues

## Testing

1. Database health check passed:
   ```bash
   python fix_database.py --health
   ```
   Result: ✓ DATABASE IS HEALTHY - No issues found!

2. Test data cleanup successful:
   ```bash
   python cleanup_database.py
   ```
   Result: Successfully deleted 2 test internships and 3 applications

## Benefits

1. **No More Errors**: Internships can now be deleted without constraint violations
2. **Data Integrity**: Applications are properly cleaned up when internships are deleted
3. **Safety**: All tools properly handle the cascade deletion
4. **Maintainability**: The model-level cascade configuration makes future code simpler

## How to Use Going Forward

### Delete an Internship (API)
Just call the DELETE endpoint - it will automatically handle applications:
```
DELETE /api/v1/internships/{internship_id}
```

### Clean Database (Scripts)
Use any of the cleanup tools:
```bash
# Interactive cleanup
python cleanup_database.py

# Check health
python fix_database.py --health

# Fix issues
python fix_database.py --fix
```

## Files Modified

1. `backend/app/api/v1/endpoints/internships.py` - Fixed delete endpoint
2. `backend/app/models/internship.py` - Added cascade configuration
3. `backend/cleanup_database.py` - Fixed all deletion operations
4. `backend/remove_test_internships.py` - Already had proper deletion logic
5. `backend/fix_database.py` - NEW: Health check and repair tool
6. `backend/CLEANUP_README.md` - Updated documentation

## Next Steps

✅ All fixes applied and tested
✅ Database is healthy
✅ No orphaned records found
✅ Ready to use!

The error should no longer occur when deleting internships through the UI or API.
