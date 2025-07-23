import Header from "./ui/Header";
import Hero from "./ui/Hero";
import Features from "./ui/Features";
import HowItWorks from "./ui/HowItWorks";
import Testimonials from "./ui/Testimonials";
import Footer from "./ui/Footer";
import StudentDashboard from "./features/students-dashboard/StudentDasboard";
import TutorDashboard from "./features/tutor-dashboard/TutorDashboard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SignUp } from "./ui/signup";
import Login from "./ui/login";


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
      {/* <Header/>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Testimonials/>
      <Footer/>  */}

      {/* <StudentDashboard /> */}
      {/* <TutorDashboard /> */}
      {/* <SignUp/> */}
       <Login/> 
     
    </QueryClientProvider>
  );
}

export default App;
