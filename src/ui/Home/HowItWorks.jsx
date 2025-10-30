import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Users, VideoIcon, TrendingUp } from 'lucide-react';
import styles from './HowItWorks.module.css';

const iconComponents = [MessageSquare, Users, VideoIcon, TrendingUp];

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = t('howItWorks.steps', { returnObjects: true });

  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('howItWorks.heading')}
          </h2>
          <p className={styles.subtitle}>
            {t('howItWorks.subheading')}
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => {
            const Icon = iconComponents[index];

            return (
              <div key={index} className={styles.stepCard}>
                <div className={styles.cardInner}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  
                  <div className={styles.iconContainer}>
                    <Icon className={styles.icon} />
                    <div className={styles.iconRipple}></div>
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.stepTitle}>
                      {step.title}
                    </h3>

                    <p className={styles.stepDescription}>
                      {step.description}
                    </p>
                  </div>

                  <div className={styles.cardGlow}></div>
                </div>

                {index < steps.length - 1 && (
                  <div className={styles.connectionLine}>
                    <div className={styles.connectionArrow}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
