import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Target, ArrowRight } from 'lucide-react';
import styles from "../AboutUs/about1.module.css"; 
import img from "../../assets/images/abt.jpg"; 

const About1 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: "10,000+", label: "Students Empowered" },
    { value: "500+", label: "Expert Tutors" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Learning Support" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    const element = document.querySelector(`.${styles.container}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.gradientOrb}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.textSection}>
          <h1 className={`${styles.title} ${isVisible ? styles.visible : ''}`}>
            We Are Revolutionizing 
            <span className={styles.highlight}> Group Learning</span> in Sri Lanka
          </h1>
          
          <p className={`${styles.description} ${isVisible ? styles.visible : ''}`}>
            Kuppi.lk empowers students to learn collaboratively by voting for the topics they struggle with.
            Our platform makes expert help accessible, affordable, and student-driven.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Users />
              </div>
              <div>
                <h3>Collaborative Learning</h3>
                <p>Students unite to tackle challenging topics together</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Target />
              </div>
              <div>
                <h3>Student-Driven Approach</h3>
                <p>Vote on topics that matter most to your success</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BookOpen />
              </div>
              <div>
                <h3>Expert Guidance</h3>
                <p>Learn from qualified tutors and mentors</p>
              </div>
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.animatedStat}>
              <div className={styles.statValue}>{stats[currentStat].value}</div>
              <div className={styles.statLabel}>{stats[currentStat].label}</div>
            </div>
            <div className={styles.learnMore}>
              <span>Discover Our Impact</span>
              <ArrowRight className={styles.arrowIcon} />
            </div>
          </div>
        </div>
        
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>   
            <div className={styles.imagePlaceholder}>
              <img src={img} alt="Students learning collaboratively" className={styles.customImage} />
              <div className={styles.imageOverlay}>
                <div className={styles.floatingCard1}>
                  <Users className={styles.cardIcon} />
                  <span>10,000+ Active Students</span>
                </div>
                <div className={styles.floatingCard2}>
                  <Target className={styles.cardIcon} />
                  <span>Goal-Oriented Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About1;