import React, { useState } from 'react';
import styles from './NotificationsCommunication.module.css';

const NotificationsCommunication = () => {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className={styles.notifications}>
      <div className={styles.header}>
        <h2 className={styles.title}>Notifications & Communication</h2>
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'announcements' ? styles.active : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Push Notifications
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'reminders' ? styles.active : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            Automated Reminders
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'announcements' && (
          <div>
            <h3>Platform Announcements</h3>
            <p className={styles.placeholder}>Announcement management - Coming soon</p>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div>
            <h3>Push & Email Notifications</h3>
            <p className={styles.placeholder}>Notification system - Coming soon</p>
          </div>
        )}
        {activeTab === 'reminders' && (
          <div>
            <h3>Automated Reminders</h3>
            <p className={styles.placeholder}>Reminder management - Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsCommunication;