import React from 'react';
import styles from './StudentFeedback.module.css';

const feedbackData = {
  averageRating: 4.8,
  totalReviews: 89,
  ratingDistribution: {
    5: 72,
    4: 12,
    3: 3,
    2: 1,
    1: 1
  }
};

const recentFeedback = [
  {
    id: 1,
    studentName: 'Priya Jayawardena',
    studentInitials: 'PJ',
    rating: 5,
    comment: 'Excellent explanation of binary trees! The way you broke down complex concepts made it really easy to understand. The examples were very practical and relevant.',
    sessionTitle: 'Data Structures & Algorithms',
    date: '2024-06-25',
    helpful: 12
  },
  {
    id: 2,
    studentName: 'Saman Perera',
    studentInitials: 'SP',
    rating: 5,
    comment: 'Great session on SQL joins. The real-world examples really helped me grasp the concepts. Would definitely recommend!',
    sessionTitle: 'Database Systems',
    date: '2024-06-23',
    helpful: 8
  },
  {
    id: 3,
    studentName: 'Nimesha Fernando',
    studentInitials: 'NF',
    rating: 4,
    comment: 'Good session overall. The pace was perfect and the instructor was very patient with questions. Could use more hands-on exercises.',
    sessionTitle: 'Object Oriented Programming',
    date: '2024-06-20',
    helpful: 6
  }
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`${styles.star} ${index < rating ? styles.filled : styles.empty}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ));
};

const StudentFeedback = () => {
  return (
    <div className={styles.feedback}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Student Feedback</h2>
          <p className={styles.subtitle}>View reviews and ratings from your students</p>
        </div>
        <button className={styles.exportButton}>
          <svg className={styles.exportIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Export Reviews
        </button>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.ratingCard}>
          <h3 className={styles.cardTitle}>Overall Rating</h3>
          <div className={styles.overallRating}>
            <div className={styles.ratingValue}>
              {feedbackData.averageRating}
            </div>
            <div className={styles.starsContainer}>
              {renderStars(Math.floor(feedbackData.averageRating))}
            </div>
            <p className={styles.ratingSubtext}>
              Based on {feedbackData.totalReviews} reviews
            </p>
          </div>
        </div>

        <div className={styles.ratingCard}>
          <h3 className={styles.cardTitle}>Rating Distribution</h3>
          <div className={styles.distributionList}>
            {Object.entries(feedbackData.ratingDistribution)
              .reverse()
              .map(([stars, count]) => (
                <div key={stars} className={styles.distributionItem}>
                  <div className={styles.starLabel}>
                    <span className={styles.starNumber}>{stars}</span>
                    <svg className={styles.starIcon} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(count / feedbackData.totalReviews) * 100}%`
                      }}
                    />
                  </div>
                  <span className={styles.countLabel}>{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewsContainer}>
        <h3 className={styles.cardTitle}>Recent Reviews</h3>
        <div className={styles.reviewsList}>
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.avatar}>
                  {feedback.studentInitials}
                </div>
                
                <div className={styles.reviewContent}>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewerInfo}>
                      <h4>{feedback.studentName}</h4>
                      <div className={styles.reviewDetails}>
                        <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{feedback.sessionTitle}</span>
                      </div>
                    </div>
                    
                    <div className={styles.reviewRating}>
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  
                  <p className={styles.reviewText}>{feedback.comment}</p>
                  
                  <div className={styles.reviewActions}>
                    <button className={styles.actionButton}>
                      <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({feedback.helpful})
                    </button>
                    <button className={styles.actionButton}>
                      <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className={styles.loadMoreButton}>Load More Reviews</button>
      </div>

      <div className={styles.summaryContainer}>
        <h3 className={styles.cardTitle}>Feedback Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles.green}`}>
            <div className={`${styles.summaryValue} ${styles.green}`}>95%</div>
            <div className={styles.summaryLabel}>Positive Reviews</div>
            <div className={styles.summarySubtext}>4+ stars</div>
          </div>
          
          <div className={`${styles.summaryCard} ${styles.blue}`}>
            <div className={`${styles.summaryValue} ${styles.blue}`}>87%</div>
            <div className={styles.summaryLabel}>Would Recommend</div>
            <div className={styles.summarySubtext}>Based on reviews</div>
          </div>
          
          <div className={`${styles.summaryCard} ${styles.purple}`}>
            <div className={`${styles.summaryValue} ${styles.purple}`}>4.2</div>
            <div className={styles.summaryLabel}>Response Rate</div>
            <div className={styles.summarySubtext}>Days average</div>
          </div>
        </div>
        
        <div className={styles.strengthsSection}>
          <h4 className={styles.strengthsTitle}>Most Mentioned Strengths</h4>
          <div className={styles.strengthsList}>
            <span className={styles.strengthBadge}>Clear Explanations</span>
            <span className={styles.strengthBadge}>Patient Teaching</span>
            <span className={styles.strengthBadge}>Practical Examples</span>
            <span className={styles.strengthBadge}>Interactive Sessions</span>
            <span className={styles.strengthBadge}>Well Prepared</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;