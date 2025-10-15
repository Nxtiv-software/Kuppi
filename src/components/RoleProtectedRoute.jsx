import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useUserRole, hasAnyRole, USER_ROLES } from '../utils/roleUtils';

// Component to show when user doesn't have required role
const UnauthorizedAccess = () => {
  const { role } = useUserRole();
  
  // Redirect to appropriate dashboard based on user's role
  const getRedirectPath = () => {
    switch (role) {
      case USER_ROLES.STUDENT:
        return '/student-dashboard';
      case USER_ROLES.TUTOR:
        return '/tutor-dashboard';
      case USER_ROLES.ADMIN:
        return '/admin-dashboard';
      default:
        return '/';
    }
  };
  
  return <Navigate to={getRedirectPath()} replace />;
};

// Role-based protected route component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  return (
    <SignedIn>
      <RoleBasedAccess allowedRoles={allowedRoles}>
        {children}
      </RoleBasedAccess>
    </SignedIn>
  );
};

// Component that checks role-based access
const RoleBasedAccess = ({ children, allowedRoles }) => {
  const { role } = useUserRole();
  
  // If no role specified, allow access (backward compatibility)
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }
  
  // If user has required role, show content
  if (hasAnyRole(role, allowedRoles)) {
    return children;
  }
  
  // If user doesn't have required role, redirect to appropriate dashboard
  return <UnauthorizedAccess />;
};

// Public route component (unchanged)
const PublicRoute = ({ children }) => {
  return (
    <SignedOut>
      {children}
    </SignedOut>
  );
};

export { RoleProtectedRoute, PublicRoute, UnauthorizedAccess };