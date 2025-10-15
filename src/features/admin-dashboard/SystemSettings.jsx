import React, { useState } from 'react';
import styles from './SystemSettings.module.css';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className={styles.systemSettings}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Settings</h2>
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General Settings
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'fees' ? styles.active : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Service Fees
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'session-rules' ? styles.active : ''}`}
            onClick={() => setActiveTab('session-rules')}
          >
            Session Rules
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security & Privacy
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'general' && (
          <div>
            <h3>General Platform Settings</h3>
            <p className={styles.placeholder}>Platform configuration - Coming soon</p>
          </div>
        )}
        {activeTab === 'fees' && (
          <div>
            <h3>Service Fee Configuration</h3>
            <p className={styles.placeholder}>Fee management - Coming soon</p>
          </div>
        )}
        {activeTab === 'session-rules' && (
          <div>
            <h3>Session Rules & Requirements</h3>
            <p className={styles.placeholder}>Session rule configuration - Coming soon</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div>
            <h3>Security & Privacy Settings</h3>
            <p className={styles.placeholder}>Security configuration - Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;