# Role-Based Access Control (RBAC) System

## Overview
This system implements role-based access control to ensure users can only access dashboards appropriate to their assigned role.

## User Roles
- **STUDENT**: Can only access `/student-dashboard`
- **TUTOR**: Can only access `/tutor-dashboard`  
- **ADMIN**: Can only access `/admin-dashboard`

## How It Works

### 1. Role Detection
The system detects user roles using the `useUserRole` hook from `utils/roleUtils.js`:

```javascript
import { useUserRole, USER_ROLES } from '../utils/roleUtils';

const { role, isStudent, isTutor, isAdmin } = useUserRole();
```

### 2. Role Storage
User roles are stored in Clerk's user metadata:
- `user.publicMetadata.role` - Primary location
- `user.privateMetadata.role` - Fallback location

### 3. Role Assignment
Roles can be assigned through:
- **Admin Dashboard**: Using the User Management section
- **During Registration**: Set role during signup process
- **Development Tool**: Visit `/manage-role` (remove in production)

### 4. Route Protection
Routes are protected using the `RoleProtectedRoute` component:

```javascript
<Route 
  path="student-dashboard" 
  element={
    <RoleProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
      <StudentDashboard />
    </RoleProtectedRoute>
  } 
/>
```

## Implementation Guide

### Setting Up User Roles

1. **During Registration (Recommended)**
   ```javascript
   // In your signup component
   await user.update({
     publicMetadata: {
       role: USER_ROLES.STUDENT // or TUTOR/ADMIN
     }
   });
   ```

2. **Via Admin Dashboard**
   - Admins can assign roles through the User Management section
   - Navigate to Admin Dashboard > User Management > Role Assignment

3. **For Development/Testing**
   - Visit `/manage-role` to manually set your role
   - **Important**: Remove this route in production

### Role-Based Navigation

The Header component automatically shows the appropriate dashboard button based on user role:

```javascript
// In Header.jsx
{role === USER_ROLES.STUDENT ? (
  <StudentDashBoardButton />
) : role === USER_ROLES.TUTOR ? (
  <TuttorDashBoardButton />
) : role === USER_ROLES.ADMIN ? (
  <AdminDashBoardButton />
) : (
  <StudentDashBoardButton /> // Default fallback
)}
```

### Automatic Redirects

If a user tries to access a dashboard they don't have permission for, they are automatically redirected to their appropriate dashboard.

## Security Features

1. **Route-Level Protection**: Each dashboard route is protected by role
2. **Automatic Redirects**: Unauthorized users are redirected to appropriate dashboards
3. **Authentication Required**: All dashboard routes require authentication via Clerk
4. **Fallback Handling**: Users without roles default to student access

## Development Notes

### Setting Default Roles
In `roleUtils.js`, you can modify the fallback logic:

```javascript
// Current fallback logic
if (email.includes('admin@')) {
  return USER_ROLES.ADMIN;
} else if (email.includes('tutor@')) {
  return USER_ROLES.TUTOR;
} else {
  return USER_ROLES.STUDENT; // Default
}
```

### Testing Different Roles
1. Visit `/manage-role` while logged in
2. Select desired role and click "Update Role"
3. Page will refresh with new role applied
4. Try accessing different dashboard URLs to test protection

### Production Checklist
- [ ] Remove `/manage-role` route
- [ ] Implement proper role assignment during registration
- [ ] Set up admin controls for role management
- [ ] Configure Clerk metadata permissions
- [ ] Test all role transitions thoroughly

## File Structure
```
src/
├── utils/
│   └── roleUtils.js          # Role utilities and constants
├── components/
│   ├── RoleProtectedRoute.jsx # Role-based route protection
│   ├── DashboardRedirect.jsx  # Auto-redirect to appropriate dashboard
│   └── RoleManager.jsx        # Development role management tool
└── features/
    ├── admin-dashboard/       # Admin-only dashboard
    ├── tutor-dashboard/       # Tutor-only dashboard
    └── students-dashboard/    # Student-only dashboard
```

## Troubleshooting

### User Can't Access Any Dashboard
- Check if user has a role assigned: `console.log(user.publicMetadata.role)`
- Verify user is authenticated: `console.log(user)`
- Check role detection logic in `roleUtils.js`

### Role Not Updating
- Ensure role is set in Clerk metadata
- Try refreshing the page after role change
- Check browser console for errors

### Wrong Dashboard Showing
- Verify role constants match between components
- Check role assignment in Clerk dashboard
- Confirm route protection is correctly configured

## Best Practices

1. **Always use role constants** from `USER_ROLES` instead of strings
2. **Implement role assignment during registration** for production
3. **Use the `useUserRole` hook** for consistent role detection
4. **Test all role combinations** thoroughly before deployment
5. **Remove development tools** (`/manage-role`) in production builds