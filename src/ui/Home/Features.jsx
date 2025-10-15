import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Users, Clock, DollarSign, ArrowRight } from 'lucide-react';
import styles from './Features.module.css';

const Features = () => {
  const { t, i18n } = useTranslation();
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const featureItems = t('features.items', { returnObjects: true });

  const icons = [Brain, Users, Clock, DollarSign];
  const gradients = [
    'linear-gradient(135deg, #2563eb, #1d4ed8)',     // Blue - for learning/brain
    'linear-gradient(135deg, #059669, #047857)',     // Green - for community/users
    'linear-gradient(135deg, #dc2626, #b91c1c)',     // Red - for urgency/time
    'linear-gradient(135deg, #7c3aed, #6d28d9)'      // Purple - for premium/money
  ];

  const accentColors = [
    'rgba(37, 99, 235, 0.1)',    // Light blue
    'rgba(5, 150, 105, 0.1)',    // Light green  
    'rgba(220, 38, 38, 0.1)',    // Light red
    'rgba(124, 58, 237, 0.1)'    // Light purple
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(`.${styles.featureCard}`);
            cards.forEach((card, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...new Set([...prev, index])]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.featuresSection} ref={sectionRef}>
      <div className={styles.backgroundPattern}>
        <div className={styles.patternDot}></div>
        <div className={styles.patternDot}></div>
        <div className={styles.patternDot}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('features.heading')}
          </h2>
          
          <p className={styles.subtitle}>
            {t('features.subheading')}
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {featureItems.map((feature, index) => {
            const Icon = icons[index];
            const isVisible = visibleCards.includes(index);
            const isHovered = hoveredCard === index;

            return (
              <div 
                key={index}
                className={`${styles.featureCard} ${isVisible ? styles.visible : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  '--delay': `${index * 0.2}s`,
                  '--gradient': gradients[index],
                  '--accent-color': accentColors[index]
                }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.iconContainer}>
                    <div className={styles.iconWrapper}>
                      <Icon className={styles.icon} />
                    </div>
                    <div className={styles.iconRipple}></div>
                  </div>
                  
                  <div className={styles.content}>
                    <h3 className={`${styles.featureTitle} ${i18n.language === 'si' ? styles.sinhalaTitle : ''}`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`${styles.featureDescription} ${i18n.language === 'si' ? styles.sinhalaText : ''}`}>
                      {feature.description}
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.learnMore}>
                      <span>Learn More</span>
                      <ArrowRight className={`${styles.arrowIcon} ${isHovered ? styles.arrowHovered : ''}`} />
                    </div>
                  </div>

                  <div className={styles.cardGlow}></div>
                  <div className={styles.cardBorder}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Elements */}
        <div className={styles.decorativeElements}>
          <div className={styles.floatingElement1}></div>
          <div className={styles.floatingElement2}></div>
          <div className={styles.floatingElement3}></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
