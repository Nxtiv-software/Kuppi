import Header from "./Home/Header"
import Hero from "./Home/Hero"
import HowItWorks from "./Home/HowItWorks"
import Testimonials from "./Home/Testimonials"
import Footer from "./Home/Footer"
import Features from "./Home/Features"

function HomeLayout() {
    return (
        <>
            <Header/>
            <Hero/>
            <Features/>
            <HowItWorks/>
            <Testimonials/>
            <Footer/>
        </>
    )
}

export default HomeLayout
