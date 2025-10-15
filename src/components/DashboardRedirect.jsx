import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole, USER_ROLES } from '../utils/roleUtils';

// Component to redirect users to their role-appropriate dashboard
const DashboardRedirect = () => {
  const { role } = useUserRole();

  // Get redirect path based on role
  const getRedirectPath = () => {
    switch (role) {
      case USER_ROLES.STUDENT:
        return '/student-dashboard';
      case USER_ROLES.TUTOR:
        return '/tutor-dashboard';
      case USER_ROLES.ADMIN:
        return '/admin-dashboard';
      default:
        // Default to student dashboard if role is not determined
        return '/student-dashboard';
    }
  };

  return <Navigate to={getRedirectPath()} replace />;
};

export default DashboardRedirect;