import React from 'react';
import styles from "../ui/about2.module.css";
import img from "../assets/images/about2.png";

const About2 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.servicesTag}>
            <div className={styles.leftArrow}>→</div>
                <span className={styles.tagText}>Our Story</span>
            <div className={styles.rightArrow}>←</div>
        </div>

      <h1 className={styles.mainTitle}>
        The Journey Behind Kuppi.lk
      </h1>

      <p className={styles.subtitle}>
        Making tough subjects easier — together.
      </p>

      <div className={styles.mainContent}>
    
        <div className={styles.textSection}>
          <p className={styles.paragraph}>
            Kuppi.lk was born from one simple truth: most students struggle silently with certain chapters, especially during their O/L exams. Extra classes are expensive, and not everyone can afford private tutoring. That's where we come in.
          </p>
          <p className={styles.paragraph}>
            We created Kuppi.lk to help O/L students come together, vote on the chapters they find most difficult, and learn as a group — with help from experienced tutors. Instead of paying for one-on-one classes, students split the cost, making it affordable for everyone.
          </p>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <img src={img} alt="" className={styles.customImage} />
          </div>
        </div>
      </div>

      <div className={styles.bottomTagline}>
        Kuppi.lk makes learning easier, smarter, and more social — just the way it should be.
      </div>
    </div>
  );
};

export default About2;