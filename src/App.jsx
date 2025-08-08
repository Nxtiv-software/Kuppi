
import TutorDashboard from "./features/tutor-dashboard/TutorDashboard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SignUp } from "./ui/signup";
import Login from "./ui/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./ui/HomeLayout";
import {Toaster } from "react-hot-toast";
import AboutPage from "./ui/AboutPage";
import ContactUs from "./ui/ContactUs/Contact";
import ContactUsPage from "./ui/ContactUsPage";
import StudentDashboard from "./features/students-dashboard/StudentDasboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactUsPage />} />
          <Route path="session" element={<StudentDashboard />} />
          
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
    
    // <StudentDashboard />
    // <AboutPage />
  );
}

export default App;
