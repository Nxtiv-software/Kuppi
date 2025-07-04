import React from 'react';
import styles from "../ui/about1.module.css";
import Navbar from './navbar';
import img from "../assets/images/aboutimg.png";

const About1 = () => {
  return (
    <div className={styles.container}>
        {/* <Navbar /> */}
      <div className={styles.content}>
        <div className={styles.textSection}>
          <h1 className={styles.title}>
            We Are Revolutionizing Group Learning in Sri Lanka
          </h1>
          <p className={styles.description}>
            Kuppi.lk empowers students to learn collaboratively by voting for the topics they struggle with.
            <br />
            Our platform makes expert help accessible, affordable, and student-driven.
          </p>
        </div>
        
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>   
            <div className={styles.imagePlaceholder}>
              <img src={img} alt="" className={styles.customImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About1;