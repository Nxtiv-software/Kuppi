import React from 'react';
import styles from "../students-dashboard/Overview.module.css";

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    {
      title: 'Sessions Attended',
      value: '12',
      subtitle: '+2 this week',
      icon: '📚'
    },
    {
      title: 'Active Polls',
      value: '5',
      subtitle: '3 created by you',
      icon: '📊'
    },
    {
      title: 'Hours Learned',
      value: '24',
      subtitle: 'This month',
      icon: '⏰'
    },
    {
      title: 'Money Saved',
      value: 'Rs. 3,500',
      subtitle: 'Vs individual tutoring',
      icon: '💰'
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <h3 className={styles.statTitle}>{stat.title}</h3>
          </div>
          <div className={styles.statValue}>{stat.value}</div>
          <div className={styles.statSubtitle}>{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    {
      title: 'Create Poll',
      description: 'Start a new poll for a kuppi session',
      icon: '📝',
      color: 'primary'
    },
    {
      title: 'View Schedule',
      description: 'Check your upcoming sessions',
      icon: '📅',
      color: 'secondary'
    },
    {
      title: 'Find Study Group',
      description: 'Join or create a study group',
      icon: '👥',
      color: 'tertiary'
    }
  ];

  return (
    <div className={styles.quickActions}>
      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <div key={index} className={`${styles.actionCard} ${styles[action.color]}`}>
            <div className={styles.actionIcon}>{action.icon}</div>
            <h3 className={styles.actionTitle}>{action.title}</h3>
            <p className={styles.actionDescription}>{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

