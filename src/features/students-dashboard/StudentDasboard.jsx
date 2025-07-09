import React, { useState } from 'react';

import styles from "../students-dashboard/StudentDashboard.module.css";
import Overview from './Overview';
import VoteCreate from './VoteCreate';
import MySessions from './MySessions';
import Progress from './Progress';
import BrowseKuppis from './BrowseKuppi';

// Header Component
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Kuppi.lk</span>
        </div>
        <div className={styles.userSection}>
          <div className={styles.notifications}>
            <span className={styles.notificationIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </div>
          <div className={styles.userProfile}>
            <img 
              src="https://via.placeholder.com/40x40" 
              alt="User Profile" 
              className={styles.profileImage}
            />
            <span className={styles.userName}>John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vote-create', label: 'Vote & Create' },
    { id: 'my-sessions', label: 'My Sessions' },
    { id: 'progress', label: 'Progress' },
    { id: 'browse-kuppis', label: 'Browse Kuppis' }
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Main Dashboard Component
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'vote-create':
        return <VoteCreate />;
      case 'my-sessions':
        return <MySessions />;
      case 'progress':
        return <Progress />;
      case 'browse-kuppis':
        return <BrowseKuppis />;
      default:
        return <Overview />; // Default to Overview if no tab is selected
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>My Learning Dashboard</h1>
          <p className={styles.subtitle}>Track your kuppi sessions and learning progress</p>
        </div>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;