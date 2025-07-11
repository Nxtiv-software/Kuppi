// import Header from "./ui/Header"
// import Hero from "./ui/Hero"
// import Features from "./ui/Features"
// import HowItWorks from "./ui/HowItWorks"
// import Testimonials from "./ui/Testimonials"
// import Footer from "./ui/Footer"
// import StudentOverview from "./features/student-dashboard/StudentOverview"
import BrowseKuppis from "./features/students-dashboard/BrowseKuppi"
import MySessions from "./features/students-dashboard/MySessions"
import Overview from "./features/students-dashboard/Overview"
import Dashboard from "./features/students-dashboard/StudentDasboard"
import StudentDashboard from "./features/students-dashboard/StudentDasboard"
import { HomePage } from "./ui/HomePage"
import { Login } from "./ui/login"
import { Signup } from "./ui/signup"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
