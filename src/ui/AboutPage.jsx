import React from 'react';
import About1 from './AboutUs/about1';
import About2 from './AboutUs/about2';
import About3 from './AboutUs/about3';
import Header from './Home/Header';
import Footer from './Home/Footer';
import About4 from './AboutUs/about4';


const AboutPage = () => {
  return (
    <div>
        <Header />
       <About1 />
       <About2 />
       <About3 />
       <About4 />
       <Footer />
    </div>
   
  );
};

export default AboutPage;