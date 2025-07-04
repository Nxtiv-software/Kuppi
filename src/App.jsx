import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home1 from './ui/home1'
import Home2 from './ui/home2'
import Home3 from './ui/home3'
import HomePage from './ui/HomePage'
import AboutPage from './ui/AboutPage'
import Navbar from './ui/navbar'

function App() {

  return (
    <>
      <Navbar />
      {/* <HomePage /> */}
      <AboutPage />
    </>
  )
}

export default App
