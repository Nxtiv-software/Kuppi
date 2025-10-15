import React from 'react';
import styles from './TutorOverview.module.css';

const TutorOverview = ({ setActiveTab }) => {
  return (
    <div className={styles.overview}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>This Month Earnings</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className={styles.statValue}>Rs. 45,000</div>
          <p className={styles.statSubtitle}>+12% from last month</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Sessions This Month</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className={styles.statValue}>18</div>
          <p className={styles.statSubtitle}>+3 from last month</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Active Students</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className={styles.statValue}>156</div>
          <p className={styles.statSubtitle}>+8 new this week</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Rating</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className={styles.statValue}>4.8</div>
          <p className={styles.statSubtitle}>Based on 89 reviews</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={`${styles.actionButton} ${styles.primary}`}>
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={styles.actionText}>Set Availability</span>
          </button>
          <button className={`${styles.actionButton} ${styles.outline}`}>
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className={styles.actionText}>View Students</span>
          </button>
          <button className={`${styles.actionButton} ${styles.outline}`}>
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className={styles.actionText}>Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity & Upcoming Sessions */}
      <div className={styles.sessionsGrid}>
        <div className={styles.sessionContainer}>
          <div className={styles.sessionHeader}>
            <h2 className={styles.sessionHeaderTitle}>Upcoming Sessions</h2>
          </div>
          <div className={styles.sessionList}>
            <div className={`${styles.sessionItem} ${styles.confirmed}`}>
              <div className={styles.sessionItemHeader}>
                <div>
                  <h4 className={styles.sessionTitle}>Data Structures & Algorithms</h4>
                  <p className={styles.sessionDetails}>Binary Trees • 15 students</p>
                  <p className={styles.sessionTime}>Today, 3:00 PM</p>
                </div>
                <span className={`${styles.badge} ${styles.confirmed}`}>Confirmed</span>
              </div>
            </div>
            
            <div className={`${styles.sessionItem} ${styles.confirmed}`}>
              <div className={styles.sessionItemHeader}>
                <div>
                  <h4 className={styles.sessionTitle}>Database Systems</h4>
                  <p className={styles.sessionDetails}>SQL Joins • 12 students</p>
                  <p className={styles.sessionTime}>Tomorrow, 2:00 PM</p>
                </div>
                <span className={`${styles.badge} ${styles.confirmed}`}>Confirmed</span>
              </div>
            </div>
            
            <div className={`${styles.sessionItem} ${styles.pending}`}>
              <div className={styles.sessionItemHeader}>
                <div>
                  <h4 className={styles.sessionTitle}>Object Oriented Programming</h4>
                  <p className={styles.sessionDetails}>Inheritance • 8 students</p>
                  <p className={`${styles.sessionTime} ${styles.pending}`}>Friday, 4:00 PM</p>
                </div>
                <span className={`${styles.badge} ${styles.pending}`}>Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sessionContainer}>
          <div className={styles.sessionHeader}>
            <h2 className={styles.sessionHeaderTitle}>Session Requests</h2>
          </div>
          <div className={styles.sessionList}>
            <div className={styles.requestItem}>
              <div className={styles.requestHeader}>
                <div>
                  <h4 className={styles.requestTitle}>Machine Learning Basics</h4>
                  <p className={styles.requestDetails}>22 students interested</p>
                  <p className={styles.requestRate}>Suggested rate: Rs. 300/student</p>
                </div>
                <div className={styles.requestActions}>
                  <button className={styles.acceptButton}>
                    <svg className={styles.acceptIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.requestItem}>
              <div className={styles.requestHeader}>
                <div>
                  <h4 className={styles.requestTitle}>Web Development</h4>
                  <p className={styles.requestDetails}>18 students interested</p>
                  <p className={styles.requestRate}>Suggested rate: Rs. 250/student</p>
                </div>
                <div className={styles.requestActions}>
                  <button className={styles.acceptButton}>
                    <svg className={styles.acceptIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                </div>
              </div>
            </div>
            
            <button className={styles.viewAllButton}>View All Requests</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorOverview;