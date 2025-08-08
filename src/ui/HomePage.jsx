import Header from "./Header"
import Hero from "./Hero"
import Features from "./Home/Features"
import HowItWorks from "./HowItWorks"
import Testimonials from "./Testimonials"
import Footer from "./Footer"

export const HomePage = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <Features/>
        <HowItWorks/>
        <Testimonials/>
        <Footer/>
    </div>
  )
}
