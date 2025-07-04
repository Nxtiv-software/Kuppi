import React from 'react';
import Navbar from "../ui/navbar";
import styles from "../ui/home1.module.css";
import img from "../assets/images/homeimg.png"

const Home1 = () => {
  return (
    <div className={styles.container}>
      {/* <Navbar /> */}
      {/* Main Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            Get the help you need, Right when you need it!
          </h1>
          <p className={styles.subtitle}>
            Running out of time? You're not alone, Join a Kuppi and catch up fast.
          </p>

          {/* Hero Section with Image Placeholder and Quote Bubbles */}
          <div className={styles.heroSection}>
            {/* Left Quote Bubble */}
            <div className={`${styles.quoteBubble} ${styles.leftBubble}`}>
              <div className={styles.bubbleContent}>
                Struggling with a chapter? Vote it in. We'll organize the session.
              </div>
              <div className={styles.bubbleArrow}></div>
            </div>

            {/* Main Image Placeholder */}
            <div className={styles.imageContainer}>
              <img src={img}  alt="" className={styles.mainImage}/>
            </div>

            {/* Right Quote Bubble */}
            <div className={`${styles.quoteBubble} ${styles.rightBubble}`}>
              <div className={styles.bubbleContent}>
                Your struggle = Our priority.
              </div>
              <div className={styles.bubbleArrowRight}></div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Home1;