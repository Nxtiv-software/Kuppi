import React from 'react'
import Header from "./ui/Header"
import Hero from "./ui/Hero"
import Features from "./ui/Features"
import HowItWorks from "./ui/HowItWorks"
import Testimonials from "./ui/Testimonials"
import Footer from "./ui/Footer"

function HomeLayout() {
  return (
    <><Header/>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Testimonials/>
      <Footer/></>
  )
}
export default HomeLayout