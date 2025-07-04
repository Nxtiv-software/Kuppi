import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './ui/HomePage'
import AboutPage from './ui/AboutPage'
import Navbar from './ui/navbar'

function App() {

  return (
    <>
      <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/popular" element= /> */}
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/contact" element= />
          <Route path="/login" element= />
          <Route path="/signup" element= /> */}
        </Routes>
      </div>
    </Router>

    </>
  )
}

export default App
