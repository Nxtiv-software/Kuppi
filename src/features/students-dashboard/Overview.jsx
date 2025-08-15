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

// Upcoming Sessions Component
const UpcomingSessions = () => {
  const sessions = [
    {
      id: 1,
      title: 'Trigonometrics Indentities',
      subtitle: 'Sine rule and cosine rule',
      instructor: 'Dr. Amal Perera',
      date: 'Dec 26, 2025',
      time: '7:00 PM - 9:00 PM',
      students: 15,
      price: 'Rs. 250',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Electronics',
      subtitle: 'Characteristic curves of a diode',
      instructor: 'Prof. Nimal Silva',
      date: 'Dec 27, 2025',
      time: '2:00 PM - 4:00 PM',
      students: 12,
      price: 'Rs. 300',
      status: 'confirmed'
    }
  ];

  return (
    <div className={styles.upcomingSessions}>
      <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
      <div className={styles.sessionsList}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <div className={styles.sessionInfo}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                <p className={styles.sessionSubtitle}>{session.subtitle}</p>
                <p className={styles.instructor}>by {session.instructor}</p>
              </div>
              <div className={styles.statusBadge}>
                <span className={styles.status}>{session.status}</span>
              </div>
            </div>
            
            <div className={styles.sessionDetails}>
              <div className={styles.detailItem}>
                <span className={styles.icon}>📅</span>
                <span>{session.date}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}>⏰</span>
                <span>{session.time}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}>👥</span>
                <span>{session.students} students</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}>💰</span>
                <span>{session.price}</span>
              </div>
            </div>
            
            <div className={styles.sessionActions}>
              <button className={styles.joinButton}>Join Session</button>
              <button className={styles.calendarButton}>Add to Calendar</button>
              <button className={styles.contactButton}>Contact Tutor</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Overview Component
const Overview = () => {
  return (
    <div className={styles.overview}>
      <StatsCards />
      <QuickActions />
      <UpcomingSessions />
    </div>
  );
};

export default Overview;