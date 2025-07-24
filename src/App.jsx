
import StudentDashboard from "./features/students-dashboard/StudentDasboard";
import TutorDashboard from "./features/tutor-dashboard/TutorDashboard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SignUp } from "./ui/signup";
import Login from "./ui/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./ui/HomeLayout";



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
      <ReactQueryDevtools initialIsOpen={false}/>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="login" element={<Login/>}/>
      </Routes>
      </BrowserRouter> 
    </QueryClientProvider>
  );
}

export default App;
