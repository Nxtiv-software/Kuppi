import React, { useState } from 'react';
import styles from './ContentManagement.module.css';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className={styles.contentManagement}>
      <div className={styles.header}>
        <h2 className={styles.title}>Content & Learning Material</h2>
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval (8)
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'approved' ? styles.active : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved Content
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'rejected' ? styles.active : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected Content
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'pending' && (
          <div>
            <h3>Pending Material Reviews</h3>
            <p className={styles.placeholder}>Content approval interface - Coming soon</p>
          </div>
        )}
        {activeTab === 'approved' && (
          <div>
            <h3>Approved Learning Materials</h3>
            <p className={styles.placeholder}>Approved content management - Coming soon</p>
          </div>
        )}
        {activeTab === 'rejected' && (
          <div>
            <h3>Rejected Content</h3>
            <p className={styles.placeholder}>Rejected content review - Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;