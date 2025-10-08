# Delete Profile Picture Feature - Testing Guide

## ✅ Implementation Complete

The delete profile picture feature has been successfully implemented across the full stack.

## 📋 What Was Added

### 1. Backend API (`/api/v1/profile/delete-avatar`)
- **Method**: DELETE
- **Authentication**: Required (Bearer token)
- **Location**: `backend/app/api/v1/endpoints/profile.py`
- **Functionality**:
  - Validates user has an avatar to delete
  - Removes physical file from `uploads/avatars/` directory
  - Sets `avatar_url` to NULL in database
  - Returns success message

### 2. Frontend Service Method
- **Method**: `userService.deleteAvatar()`
- **Location**: `frontend/src/services/user.service.ts`
- **Returns**: `Promise<{ message: string }>`

### 3. UI Component
- **Location**: `frontend/src/apps/interns-dashboard/pages/EditProfilePage.tsx`
- **Features**:
  - Delete button (red/destructive variant)
  - Only visible when avatar exists
  - Trash icon + "Delete Profile Picture" text
  - Disabled during upload/delete operations
  - Toast notifications for success/error

## 🧪 How to Test

### Step 1: Access the Application
1. Open browser to: **http://localhost:8081**
2. Login as an intern user:
   - Email: `test@intern.com` (or your test user)
   - Password: (your test password)

### Step 2: Navigate to Profile
1. Click on **Profile** in the sidebar/menu
2. Or go directly to: **http://localhost:8081/interns/profile**

### Step 3: Upload a Profile Picture (if not already uploaded)
1. Click the **camera icon** button on the avatar
2. Select an image file (JPEG, PNG, GIF, or WebP)
3. Wait for upload to complete
4. Verify the image appears

### Step 4: Test Delete Functionality
1. Look for the **"Delete Profile Picture"** button below the avatar
2. The button should be:
   - ✅ Visible (red/destructive style)
   - ✅ Showing trash icon
   - ✅ Full width
3. Click the **"Delete Profile Picture"** button
4. Verify:
   - ✅ Success toast appears
   - ✅ Avatar changes to initials fallback
   - ✅ Delete button disappears
   - ✅ Physical file removed from `backend/uploads/avatars/`

### Step 5: Verify Database Update
The `avatar_url` field in the database should be NULL after deletion.

## 🔍 Backend Verification

Check the backend terminal output for debug logs:
```
DEBUG: Deleting avatar for user test@intern.com
DEBUG: Deleted avatar file: uploads/avatars/[filename].png
DEBUG: Successfully deleted avatar
```

Check the HTTP response in browser DevTools:
```
DELETE /api/v1/profile/delete-avatar
Status: 200 OK
Response: { "message": "Avatar deleted successfully" }
```

## 🎯 Expected Behavior

### Before Delete:
- Avatar image displayed
- "Delete Profile Picture" button visible
- Camera icon button enabled

### During Delete:
- Button disabled with loading state
- "Processing..." message shown

### After Delete:
- Avatar shows user initials (fallback)
- "Delete Profile Picture" button hidden
- Success toast notification
- Can upload new avatar using camera button

## 🐛 Error Scenarios to Test

### 1. No Avatar to Delete
- **Action**: Try to delete when no avatar exists
- **Expected**: Error toast "No avatar to delete"

### 2. Network Error
- **Action**: Disconnect network and try to delete
- **Expected**: Error toast with failure message

### 3. Unauthorized Access
- **Action**: Try to call endpoint without token
- **Expected**: 401 Unauthorized

## 📊 Current Server Status

### Frontend
- **URL**: http://localhost:8081
- **Status**: ✅ Running (Vite with HMR)

### Backend
- **URL**: http://localhost:8001
- **Status**: ✅ Running (Uvicorn with auto-reload)
- **Recent Reload**: Detected changes in profile.py ✅

## 🔐 Security Features

- ✅ Authentication required (Bearer token)
- ✅ Users can only delete their own avatar
- ✅ File path validation (uses UUID filenames)
- ✅ Graceful handling of missing files
- ✅ Database transaction with rollback on error

## 📝 API Documentation

### DELETE /api/v1/profile/delete-avatar

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "message": "Avatar deleted successfully"
}
```

**Error Responses:**

**404 Not Found** (No avatar to delete):
```json
{
  "detail": "No avatar to delete"
}
```

**401 Unauthorized** (No/invalid token):
```json
{
  "detail": "Not authenticated"
}
```

**500 Internal Server Error**:
```json
{
  "detail": "Failed to delete avatar: <error message>"
}
```

## 🚀 Quick Test Commands

### Check if avatar file exists:
```bash
ls -la /home/rahul/I_INTERN/backend/uploads/avatars/
```

### Watch backend logs:
```bash
# Already running in terminal - just watch the output
```

### Test API directly with curl:
```bash
# Get your auth token from browser localStorage
TOKEN="your_auth_token_here"

# Delete avatar
curl -X DELETE http://localhost:8001/api/v1/profile/delete-avatar \
  -H "Authorization: Bearer $TOKEN"
```

## ✨ Success Indicators

1. ✅ Backend endpoint created and loaded
2. ✅ Frontend service method added
3. ✅ UI component updated with delete button
4. ✅ Delete handler implemented with error handling
5. ✅ Toast notifications working
6. ✅ File cleanup working
7. ✅ Database update working
8. ✅ HMR updated frontend without full reload

**Feature is ready for use! 🎉**
