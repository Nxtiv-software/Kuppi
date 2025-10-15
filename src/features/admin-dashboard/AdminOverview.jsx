import React from 'react';
import styles from './AdminOverview.module.css';

const AdminOverview = ({ setActiveTab }) => {
  return (
    <div className={styles.overview}>
      {/* User Statistics Cards */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Statistics</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Total Users</h3>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className={styles.statValue}>2,847</div>
            <p className={styles.statSubtitle}>+156 this month</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Student Users</h3>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className={styles.statValue}>2,234</div>
            <p className={styles.statSubtitle}>78.5% of total users</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Tutor Users</h3>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className={styles.statValue}>613</div>
            <p className={styles.statSubtitle}>21.5% of total users</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Active Users</h3>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className={styles.statValue}>1,892</div>
            <p className={styles.statSubtitle}>66.4% activity rate</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment Information</h2>
        <div className={styles.paymentGrid}>
          <div className={styles.paymentCard}>
            <div className={styles.paymentHeader}>
              <h3 className={styles.paymentTitle}>This Month Income</h3>
              <svg className={styles.paymentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className={styles.paymentValue}>Rs. 234,500</div>
            <p className={styles.paymentSubtitle}>+18.2% from last month</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.paymentHeader}>
              <h3 className={styles.paymentTitle}>Pending Payouts</h3>
              <svg className={styles.paymentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.paymentValue}>Rs. 45,200</div>
            <p className={styles.paymentSubtitle}>23 pending transactions</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.paymentHeader}>
              <h3 className={styles.paymentTitle}>Service Fee Revenue</h3>
              <svg className={styles.paymentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className={styles.paymentValue}>Rs. 28,140</div>
            <p className={styles.paymentSubtitle}>12% of total income</p>
          </div>
        </div>
      </div>

      {/* Sessions by Subject & Engagement Metrics */}
      <div className={styles.metricsGrid}>
        {/* Upcoming Sessions by Subject */}
        <div className={styles.metricsCard}>
          <div className={styles.metricsHeader}>
            <h2 className={styles.metricsTitle}>Upcoming Sessions by Subject</h2>
          </div>
          <div className={styles.subjectList}>
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <h4 className={styles.subjectName}>Mathematics</h4>
                <p className={styles.subjectDetails}>24 sessions • 342 students</p>
              </div>
              <span className={styles.subjectCount}>24</span>
            </div>
            
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <h4 className={styles.subjectName}>Computer Science</h4>
                <p className={styles.subjectDetails}>18 sessions • 267 students</p>
              </div>
              <span className={styles.subjectCount}>18</span>
            </div>
            
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <h4 className={styles.subjectName}>Physics</h4>
                <p className={styles.subjectDetails}>15 sessions • 198 students</p>
              </div>
              <span className={styles.subjectCount}>15</span>
            </div>
            
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <h4 className={styles.subjectName}>Chemistry</h4>
                <p className={styles.subjectDetails}>12 sessions • 156 students</p>
              </div>
              <span className={styles.subjectCount}>12</span>
            </div>
            
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <h4 className={styles.subjectName}>Biology</h4>
                <p className={styles.subjectDetails}>9 sessions • 123 students</p>
              </div>
              <span className={styles.subjectCount}>9</span>
            </div>
          </div>
          <button 
            className={styles.viewAllButton}
            onClick={() => setActiveTab('sessions')}
          >
            View All Sessions
          </button>
        </div>

        {/* Engagement Metrics */}
        <div className={styles.metricsCard}>
          <div className={styles.metricsHeader}>
            <h2 className={styles.metricsTitle}>Engagement Metrics</h2>
          </div>
          <div className={styles.engagementList}>
            <div className={styles.engagementItem}>
              <div className={styles.engagementLabel}>
                <span className={styles.engagementName}>Session Completion Rate</span>
                <span className={styles.engagementValue}>94.2%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '94.2%'}}></div>
              </div>
            </div>
            
            <div className={styles.engagementItem}>
              <div className={styles.engagementLabel}>
                <span className={styles.engagementName}>Average Session Rating</span>
                <span className={styles.engagementValue}>4.6/5</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '92%'}}></div>
              </div>
            </div>
            
            <div className={styles.engagementItem}>
              <div className={styles.engagementLabel}>
                <span className={styles.engagementName}>Student Retention</span>
                <span className={styles.engagementValue}>87.3%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '87.3%'}}></div>
              </div>
            </div>
            
            <div className={styles.engagementItem}>
              <div className={styles.engagementLabel}>
                <span className={styles.engagementName}>Tutor Activity</span>
                <span className={styles.engagementValue}>78.9%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '78.9%'}}></div>
              </div>
            </div>
            
            <div className={styles.engagementItem}>
              <div className={styles.engagementLabel}>
                <span className={styles.engagementName}>Payment Success Rate</span>
                <span className={styles.engagementValue}>96.8%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '96.8%'}}></div>
              </div>
            </div>
          </div>
          <button 
            className={styles.viewAllButton}
            onClick={() => setActiveTab('users')}
          >
            View Detailed Analytics
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button 
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={() => setActiveTab('users')}
          >
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className={styles.actionText}>Manage Users</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.outline}`}
            onClick={() => setActiveTab('sessions')}
          >
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={styles.actionText}>Review Sessions</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.outline}`}
            onClick={() => setActiveTab('payments')}
          >
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className={styles.actionText}>Payment Overview</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.outline}`}
            onClick={() => setActiveTab('notifications')}
          >
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.525 13h6.645l.071-.07a7 7 0 0110.486-7.855l1.803 1.803A9.98 9.98 0 0121 12v.5M4.525 13L11 6.5V3h2l3.5 3.5-7 7z" />
            </svg>
            <span className={styles.actionText}>Send Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;