import React, { useState } from 'react';
import styles from './SessionManagement.module.css';

const SessionManagement = () => {
  const [activeView, setActiveView] = useState('pending');

  return (
    <div className={styles.sessionManagement}>
      <div className={styles.header}>
        <h2 className={styles.title}>Session Management</h2>
        <div className={styles.viewToggle}>
          <button 
            className={`${styles.viewButton} ${activeView === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveView('pending')}
          >
            Pending Approvals (12)
          </button>
          <button 
            className={`${styles.viewButton} ${activeView === 'scheduled' ? styles.active : ''}`}
            onClick={() => setActiveView('scheduled')}
          >
            Scheduled Sessions
          </button>
          <button 
            className={`${styles.viewButton} ${activeView === 'live' ? styles.active : ''}`}
            onClick={() => setActiveView('live')}
          >
            Live Sessions (3)
          </button>
          <button 
            className={`${styles.viewButton} ${activeView === 'calendar' ? styles.active : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            Calendar View
          </button>
        </div>
      </div>

      {activeView === 'pending' && (
        <div className={styles.content}>
          <div className={styles.pendingList}>
            <div className={styles.pendingItem}>
              <div className={styles.sessionInfo}>
                <h3 className={styles.sessionTitle}>Advanced Calculus - Integration Techniques</h3>
                <p className={styles.sessionDetails}>Dr. Robert Chen • 25 students interested • Rs. 300/student</p>
                <p className={styles.sessionTime}>Requested for: Tomorrow 3:00 PM - 4:30 PM</p>
              </div>
              <div className={styles.pendingActions}>
                <button className={`${styles.actionButton} ${styles.approve}`}>Approve</button>
                <button className={`${styles.actionButton} ${styles.reject}`}>Reject</button>
                <button className={styles.actionButton}>View Details</button>
              </div>
            </div>
            
            <div className={styles.pendingItem}>
              <div className={styles.sessionInfo}>
                <h3 className={styles.sessionTitle}>Organic Chemistry - Reaction Mechanisms</h3>
                <p className={styles.sessionDetails}>Mr. David Brown • 18 students interested • Rs. 250/student</p>
                <p className={styles.sessionTime}>Requested for: Friday 2:00 PM - 3:30 PM</p>
              </div>
              <div className={styles.pendingActions}>
                <button className={`${styles.actionButton} ${styles.approve}`}>Approve</button>
                <button className={`${styles.actionButton} ${styles.reject}`}>Reject</button>
                <button className={styles.actionButton}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'scheduled' && (
        <div className={styles.content}>
          <p className={styles.placeholder}>Scheduled Sessions view - Coming soon</p>
        </div>
      )}

      {activeView === 'live' && (
        <div className={styles.content}>
          <p className={styles.placeholder}>Live Sessions monitoring - Coming soon</p>
        </div>
      )}

      {activeView === 'calendar' && (
        <div className={styles.content}>
          <p className={styles.placeholder}>Calendar view - Coming soon</p>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;