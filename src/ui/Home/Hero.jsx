import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../../components/Button';
import { ArrowRight, Users, BookOpen, Star, Trophy, Target } from 'lucide-react';
import { getMyTutorApplication } from '../../services/api';
import heroImg from "../../assets/images/student_holding_books.png"
import styles from './Hero.module.css';
import TutorRegistrationForm from './TutorRegistrationForm';

const Hero = () => {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const isSinhala = (text) => /[\u0D80-\u0DFF]/.test(text);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [showTutorForm, setShowTutorForm] = useState(false);
  const [isTutorApproved, setIsTutorApproved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('none');

  const stats = [
    { icon: Users, value: "500+", label: "Active Students" },
    { icon: BookOpen, value: "30+", label: "Expert Tutors" },
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncTutorApplicationStatus = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        localStorage.removeItem('tutorApplicationStatus');
        setIsTutorApproved(false);
        setApplicationStatus('none');
        return;
      }

      try {
        // Always fetch from API - do not pre-populate from localStorage
        const result = await getMyTutorApplication();
        const remoteStatus = result?.data?.status;

        if (remoteStatus === 'pending') {
          localStorage.setItem('tutorApplicationStatus', 'pending');
          setIsTutorApproved(false);
          setApplicationStatus('pending');
          console.log('✅ Application status: PENDING');
        } else if (remoteStatus === 'approved') {
          localStorage.removeItem('tutorApplicationStatus');
          setIsTutorApproved(true);
          setApplicationStatus('approved');
          console.log('✅ Application status: APPROVED');
        } else if (remoteStatus === 'rejected') {
          localStorage.removeItem('tutorApplicationStatus');
          setIsTutorApproved(false);
          setApplicationStatus('rejected');
          console.log('✅ Application status: REJECTED - button should show again');
        } else {
          // No application found (404 or result is null)
          localStorage.removeItem('tutorApplicationStatus');
          setIsTutorApproved(false);
          setApplicationStatus('none');
          console.log('✅ Application status: NONE (no application found)');
        }
      } catch (error) {
        console.error('❌ Error fetching application status:', error);
        localStorage.removeItem('tutorApplicationStatus');
        setIsTutorApproved(false);
        setApplicationStatus('none');
      }
    };

    syncTutorApplicationStatus();
  }, [isLoaded, isSignedIn]);

  const currentUserRole = user?.publicMetadata?.role || user?.privateMetadata?.role;
  const normalizedUserRole = typeof currentUserRole === 'string' ? currentUserRole.toLowerCase() : '';
  
  // Role is the source of truth for whether user is a tutor
  const isAlreadyTutor = normalizedUserRole === 'tutor';
  
  // Show button if: signed in AND NOT already a tutor
  // This works regardless of application status (because role changes when approved)
  const shouldShowTutorButton = isSignedIn && !isAlreadyTutor;
  
  // Show "Applying" state only if pending and not yet a tutor
  const showApplyingState = isSignedIn && applicationStatus === 'pending' && !isAlreadyTutor;

  return (
    <section className={styles.heroSection}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>

          {/* Left Section */}
          <div className={styles.textSection}>
            <h1 className={`${styles.title} ${isSinhala(t('hero.title')) ? styles.sinhalaTitle : ''}`}>
              <Trans i18nKey="hero.title">
                Get the help you need, <span className={styles.highlight}>Right when you need it!</span>
              </Trans>
            </h1>

            <p className={styles.description}>
              {t("hero.description")}
            </p>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <Button
                type="button"
                size="lg"
                className={styles.primaryButton}
              >
                <span>{t("hero.vote")}</span>
                <ArrowRight className={styles.buttonIcon} />
              </Button>

              <Button
                type="button"
                size="lg"
                variant="outline"
                className={styles.secondaryButton}
              >
                {t("hero.explore")}
              </Button>

              {shouldShowTutorButton && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className={`${styles.tutorButton} ${showApplyingState ? styles.tutorButtonApplying : styles.tutorButtonDefault}`}
                  onClick={() => !showApplyingState && navigate('/become-tutor')}
                  disabled={showApplyingState}
                >
                  {showApplyingState ? 'Applying' : 'Become a Tutor'}
                </Button>
              )}
            </div>

            {/* Animated Stats */}
            <div className={styles.statsContainer}>
              <div className={styles.animatedStat}>
                <div className={styles.statIcon}>
                  {React.createElement(stats[currentStatIndex].icon, { className: styles.statIconSvg })}
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats[currentStatIndex].value}</div>
                  <div className={styles.statLabel}>{stats[currentStatIndex].label}</div>
                </div>
              </div>
              
              <div className={styles.staticStats}>
                <div className={styles.statItem}>
                  <Users className={styles.statIconSmall} />
                  <span>500+ Students</span>
                </div>
                <div className={styles.statItem}>
                  <BookOpen className={styles.statIconSmall} />
                  <span>30+ Expert Tutors</span>
                </div>
                <div className={styles.statItem}>
                  <Star className={styles.statIconSmall} />
                  <span>10+ Subjects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Interactive Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <img 
                  src={heroImg} 
                  alt="Student learning online" 
                  className={styles.heroImage} 
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.floatingCard1}>
                    <Target className={styles.cardIcon} />
                    <span>Goal-Oriented Learning</span>
                  </div>
                  <div className={styles.floatingCard2}>
                    <Star className={styles.cardIcon} />
                    <span>Expert Tutors</span>
                  </div>
                  <div className={styles.floatingCard3}>
                    <Trophy className={styles.cardIcon} />
                    <span>Proven Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Tutor Registration Modal - Optional for modal usage */}
      {showTutorForm && (
        <TutorRegistrationForm 
          isOpen={showTutorForm}
          onClose={() => setShowTutorForm(false)}
        />
      )}
    </section>
  );
};

export default Hero;
