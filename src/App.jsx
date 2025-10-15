import TutorDashboard from "./features/tutor-dashboard/TutorDashboard";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "./ui/HomeLayout";
import { Toaster } from "react-hot-toast";
import AboutPage from "./ui/AboutPage";
import ContactUs from "./ui/ContactUs/Contact";
import ContactUsPage from "./ui/ContactUsPage";
import StudentDashboard from "./features/students-dashboard/StudentDasboard";
import SignUpClerk from "./ui/SignUpClerk";
import LoginClerk from "./ui/LoginClerk";
import TutorRegistrationPage from "./ui/Home/TutorRegistrationPage";
// AUTHENTICATION: Import Clerk components
import { SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
// ROLE-BASED ACCESS: Import role-based components
import { RoleProtectedRoute, PublicRoute } from './components/RoleProtectedRoute';
import { USER_ROLES } from './utils/roleUtils';
import DashboardRedirect from './components/DashboardRedirect';
import RoleManager from './components/RoleManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Note: ProtectedRoute and PublicRoute are now imported from RoleProtectedRoute component

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        
        {/* AUTHENTICATION: Protected auth routes */}
        <Route 
          path="signup" 
          element={
            <PublicRoute>
              <SignUpClerk />
            </PublicRoute>
          } 
        />
        <Route 
          path="login" 
          element={
            <PublicRoute>
              <LoginClerk />
            </PublicRoute>
          } 
        />
        
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="become-tutor" element={<TutorRegistrationPage />} />
        
        {/* DEVELOPMENT: Role management route (remove in production) */}
        <Route 
          path="manage-role" 
          element={
            <RoleProtectedRoute allowedRoles={[USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN]}>
              <RoleManager />
            </RoleProtectedRoute>
          } 
        />
        
        {/* ROLE-BASED: Dashboard redirect route */}
        <Route 
          path="dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={[USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN]}>
              <DashboardRedirect />
            </RoleProtectedRoute>
          } 
        />
        
        {/* ROLE-BASED: Protected dashboard routes */}
        <Route 
          path="student-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="tutor-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={[USER_ROLES.TUTOR]}>
              <TutorDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="admin-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          } 
        />
        
        {/* AUTHENTICATION: Redirect to sign-in for protected routes */}
        <Route 
          path="*" 
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          } 
        />
      </Routes>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;