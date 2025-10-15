import { useUser } from '@clerk/clerk-react';

// User roles enum
export const USER_ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  ADMIN: 'admin'
};

// Hook to get user role from Clerk metadata
export const useUserRole = () => {
  const { user } = useUser();
  
  // Get role from user metadata (you'll need to set this in Clerk)
  // For now, we'll use a mock function - replace with actual role logic
  const getUserRole = () => {
    if (!user) return null;
    
    // Check user metadata for role
    // This assumes you've set the role in Clerk user metadata
    const role = user.publicMetadata?.role || user.privateMetadata?.role;
    
    if (role) return role;
    
    // Fallback: determine role based on email or other criteria
    // This is just an example - replace with your actual logic
    const email = user.emailAddresses[0]?.emailAddress || '';
    
    if (email.includes('admin@') || email.includes('administrator@')) {
      return USER_ROLES.ADMIN;
    } else if (email.includes('tutor@') || email.includes('teacher@')) {
      return USER_ROLES.TUTOR;
    } else {
      return USER_ROLES.STUDENT; // default role
    }
  };
  
  return {
    user,
    role: getUserRole(),
    isStudent: () => getUserRole() === USER_ROLES.STUDENT,
    isTutor: () => getUserRole() === USER_ROLES.TUTOR,
    isAdmin: () => getUserRole() === USER_ROLES.ADMIN,
  };
};

// Function to check if user has required role
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

// Function to check if user has any of the required roles
export const hasAnyRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || !Array.isArray(requiredRoles)) return false;
  return requiredRoles.includes(userRole);
};