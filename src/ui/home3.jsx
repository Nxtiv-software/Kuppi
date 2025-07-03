import React from 'react';
import styles from "../ui/home3.module.css";
import img1 from "../assets/images/home3img1.png";
import img2 from "../assets/images/home3img2.png";
import img3 from "../assets/images/home3img3.png";
import img4 from "../assets/images/home3img4.png";
const Home3 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>How it works?</h1>
        
        <div className={styles.stepsContainer}>
          {/* Step 1 - Vote (Left side, top) */}
          <div className={styles.stepWrapper1}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Vote</h3>
                <p className={styles.stepDescription}>
                  Choose the topic you need help with.
                </p>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}>
                <img 
                  src={img1} 
                  alt="Vote illustration" 
                  className={styles.stepImage}
                />
              </div>
            </div>
          </div>

          {/* Curved line 1 */}
          <svg className={styles.curveLine1} viewBox="0 0 500 150" fill="none">
            <path 
              d="M 80 30 Q 250 120 420 80" 
              stroke="#9CA3AF" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>

          {/* Step 2 - Get matched (Right side) */}
          <div className={styles.stepWrapper2}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Get matched</h3>
                <p className={styles.stepDescription}>
                  We find others like you and organize a session.
                </p>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}>
                <img 
                  src={img2} 
                  alt="Get matched illustration" 
                  className={styles.stepImage}
                />
              </div>
            </div>
          </div>

          {/* Curved line 2 */}
          <svg className={styles.curveLine2} viewBox="0 0 500 150" fill="none">
            <path 
              d="M 420 30 Q 250 120 80 80" 
              stroke="#9CA3AF" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>

          {/* Step 3 - Join the Session (Left side) */}
          <div className={styles.stepWrapper3}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Join the Session</h3>
                <p className={styles.stepDescription}>
                  Learn with an expert tutor, right when you need it.
                </p>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}>
                <img 
                  src={img3} 
                  alt="Join session illustration" 
                  className={styles.stepImage}
                />
              </div>
            </div>
          </div>

          {/* Curved line 3 */}
          <svg className={styles.curveLine3} viewBox="0 0 500 150" fill="none">
            <path 
              d="M 80 30 Q 250 120 420 80" 
              stroke="#9CA3AF" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>

          {/* Step 4 - Catch Up, Together (Right side) */}
          <div className={styles.stepWrapper4}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Catch Up, Together</h3>
                <p className={styles.stepDescription}>
                  Review, ask questions, and get back on track.
                </p>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}>
                <img 
                  src={img4} 
                  alt="Catch up together illustration" 
                  className={styles.stepImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home3;