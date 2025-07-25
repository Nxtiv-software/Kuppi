import React from 'react';
import styles from "../AboutUs/about4.module.css";

const About4 = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.servicesTag}>
          <div className={styles.leftArrow}>→</div>
          <span className={styles.tagText}>Our Mission & Vision</span>
          <div className={styles.rightArrow}>←</div>
        </div>
      </div>

      {/* Mission and Vision Cards */}
      <div className={styles.cardsContainer}>
        {/* Mission Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Our Mission</h2>
          <p className={styles.cardDescription}>
            To make education accessible, collaborative, and affordable for every O/L student in Sri Lanka.
          </p>
          <p className={styles.cardDescription}>
            We believe no student should struggle alone — and no great tutor should go undiscovered.
          </p>
        </div>

        {/* Vision Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Our Vision</h2>
          <p className={styles.cardDescription}>
            To become Sri Lanka's leading student-powered learning platform — where schoolchildren vote, learn, and grow together.
          </p>
          <p className={styles.cardDescription}>
            We aim to transform informal "kuppi culture" into a smart, trusted system for academic success across the island.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About4;