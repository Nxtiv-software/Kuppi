import React from 'react';
import styles from "../ui/about3.module.css";
import img1 from "../assets/images/about3img1.png";
import img2 from "../assets/images/about3img2.png";
import img3 from "../assets/images/about3img3.png";

const About3 = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.servicesTag}>
          <div className={styles.leftArrow}>→</div>
          <span className={styles.tagText}>Our Services</span>
          <div className={styles.rightArrow}>←</div>
        </div>
        <h1 className={styles.mainHeading}>What We Offer</h1>
        <p className={styles.description}>
          Kuppi.lk is more than just group learning. We offer smart, student-first solutions to make
          academic support accessible, collaborative, and effective — all through technology.
        </p>
      </div>


      <div className={styles.servicesGrid}>

        <div className={styles.serviceCard}>
          <div className={styles.imageContainer}>
            <img src={img1} alt="Topic-Based Kuppi Sessions" className={styles.serviceImage} />
          </div>
          <h3 className={styles.serviceTitle}>Topic-Based Kuppi Sessions</h3>
          <p className={styles.serviceDescription}>
            Students vote on tough topics or chapters, and we organize group sessions with expert tutors based on real demand.
          </p>
        </div>

        
        <div className={styles.serviceCard}>
          <div className={styles.imageContainer}>
            <img src={img2} alt="Crash Course Packs" className={styles.serviceImage} />
          </div>
          <h3 className={styles.serviceTitle}>Crash Course Packs</h3>
          <p className={styles.serviceDescription}>
            Intensive revision bundles (like 'Integration in 2 Days') designed for last-minute prep and exam season survival.
          </p>
        </div>

        
        <div className={styles.serviceCard}>
          <div className={styles.imageContainer}>
            <img src={img3} alt="Post-Session Study Groups" className={styles.serviceImage} />
          </div>
          <h3 className={styles.serviceTitle}>Post-Session Study Groups</h3>
          <p className={styles.serviceDescription}>
            Automatically join WhatsApp or Discord groups after a session to continue peer learning and discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About3;