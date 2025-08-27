import TutorDashboard from "./features/tutor-dashboard/TutorDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SignUp } from "./ui/signup";
import Login from "./ui/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./ui/HomeLayout";
import { Toaster } from "react-hot-toast";
import AboutPage from "./ui/AboutPage";
import ContactUs from "./ui/ContactUs/Contact";
import ContactUsPage from "./ui/ContactUsPage";
import StudentDashboard from "./features/students-dashboard/StudentDasboard";
import SignUpClerk from "./ui/SignUpClerk";
import LoginClerk from "./ui/LoginClerk";
// AUTHENTICATION: Import Clerk components
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

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

// AUTHENTICATION: Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
};

const PublicRoute = ({ children }) => {
  return (
    <SignedOut>
      {children}
    </SignedOut>
  );
};

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
        
        {/* AUTHENTICATION: Protected dashboard routes */}
        <Route 
          path="student-dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="tutor-dashboard" 
          element={
            <ProtectedRoute>
              <TutorDashboard />
            </ProtectedRoute>
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