// import Header from "./ui/Header"
// import Hero from "./ui/Hero"
// import Features from "./ui/Features"
// import HowItWorks from "./ui/HowItWorks"
// import Testimonials from "./ui/Testimonials"
// import Footer from "./ui/Footer"
// import StudentOverview from "./features/student-dashboard/StudentOverview"

import TutorDashboard from "./features/tutor-dashboard/TutorDashboard"
import StudentDashboard from "./features/students-dashboard/StudentDasboard"
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={<StudentDashboard/>} />
        </Routes>
      </Router>
    </> 
  )
}

export default App
