# Delete Profile Picture Feature

## Overview
Added a delete profile picture button that allows users to remove their uploaded avatar/profile picture.

## Changes Made

### 1. Backend API Endpoint
**File**: `backend/app/api/v1/endpoints/profile.py`

Added new `DELETE /api/v1/profile/delete-avatar` endpoint that:
- Validates user has an avatar to delete
- Removes the physical file from the filesystem (`uploads/avatars/`)
- Updates the user's `avatar_url` to `None` in the database
- Returns success message

### 2. Frontend Service
**File**: `frontend/src/services/user.service.ts`

Added `deleteAvatar()` method to `userService` that:
- Sends DELETE request to the backend endpoint
- Includes authentication token in headers
- Returns success/error response

### 3. UI Component
**File**: `frontend/src/apps/interns-dashboard/pages/EditProfilePage.tsx`

Added:
- `handleAvatarDelete()` function that:
  - Validates avatar exists before attempting deletion
  - Calls the `userService.deleteAvatar()` method
  - Updates local state to clear the avatar URL
  - Shows success/error toast notifications
  - Disables button during processing

- Delete button UI that:
  - Only appears when user has an uploaded avatar
  - Shows trash icon with "Delete Profile Picture" text
  - Uses destructive (red) variant for warning
  - Disables during upload/delete operations
  - Full-width button for better mobile UX

## How It Works

1. **User Flow**:
   - User navigates to Edit Profile page
   - If they have a profile picture, a "Delete Profile Picture" button appears below the avatar
   - Clicking the button triggers the delete operation
   - File is removed from server and database is updated
   - Avatar reverts to initials fallback

2. **File Cleanup**:
   - Physical file is removed from `backend/uploads/avatars/` directory
   - If file doesn't exist (edge case), operation continues gracefully
   - Database `avatar_url` field is set to `NULL`

3. **Error Handling**:
   - Validates avatar exists before deletion
   - Shows appropriate error messages via toast
   - Handles network errors gracefully
   - Logs errors to console for debugging

## Testing

To test the feature:

1. Start both servers:
   - Frontend: `http://localhost:8081`
   - Backend: `http://localhost:8001`

2. Login as an intern user

3. Navigate to Profile → Edit Profile

4. Upload a profile picture using the camera icon button

5. Click "Delete Profile Picture" button

6. Verify:
   - Avatar changes to initials fallback
   - Success toast appears
   - File is removed from `backend/uploads/avatars/`
   - Database `avatar_url` is NULL

## Security Considerations

- Endpoint requires authentication (Bearer token)
- Only allows users to delete their own avatar
- Validates file paths to prevent directory traversal
- Uses UUID filenames to prevent conflicts

## Future Enhancements

- Add confirmation dialog before deletion
- Soft delete with retention period
- Add same feature to Company and Admin profiles
- Bulk avatar management for admins
