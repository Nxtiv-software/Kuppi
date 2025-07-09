import React, { useState } from 'react';
import styles from "../students-dashboard/Progress.module.css";

// Progress Stats Component
const ProgressStats = () => {
  const stats = [
    {
      title: 'Total Study Hours',
      value: '127',
      subtitle: '+8 this week',
      icon: '⏱️',
      color: '#2563eb'
    },
    {
      title: 'Sessions Completed',
      value: '18',
      subtitle: '94% attendance rate',
      icon: '✅',
      color: '#10b981'
    },
    {
      title: 'Current Streak',
      value: '12 days',
      subtitle: 'Personal best!',
      icon: '🔥',
      color: '#f59e0b'
    },
    {
      title: 'Certificates Earned',
      value: '6',
      subtitle: '3 this month',
      icon: '🏆',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className={styles.progressStats}>
      <h3 className={styles.sectionTitle}>Your Progress</h3>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div 
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <h4 className={styles.statTitle}>{stat.title}</h4>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statSubtitle}>{stat.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subject Progress Component
const SubjectProgress = () => {
  const subjects = [
    {
      name: 'Web Development',
      progress: 85,
      sessions: 8,
      totalSessions: 10,
      color: '#2563eb',
      nextTopic: 'React State Management'
    },
    {
      name: 'Data Structures',
      progress: 70,
      sessions: 7,
      totalSessions: 10,
      color: '#10b981',
      nextTopic: 'Graph Algorithms'
    },
    {
      name: 'Database Systems',
      progress: 60,
      sessions: 6,
      totalSessions: 10,
      color: '#f59e0b',
      nextTopic: 'Query Optimization'
    },
    {
      name: 'Machine Learning',
      progress: 40,
      sessions: 4,
      totalSessions: 10,
      color: '#8b5cf6',
      nextTopic: 'Neural Networks'
    },
    {
      name: 'Mobile Development',
      progress: 25,
      sessions: 2,
      totalSessions: 8,
      color: '#ef4444',
      nextTopic: 'React Native Basics'
    }
  ];

  return (
    <div className={styles.subjectProgress}>
      <h3 className={styles.sectionTitle}>Subject Progress</h3>
      <div className={styles.subjectsGrid}>
        {subjects.map((subject, index) => (
          <div key={index} className={styles.subjectCard}>
            <div className={styles.subjectHeader}>
              <h4 className={styles.subjectName}>{subject.name}</h4>
              <span className={styles.progressPercentage}>{subject.progress}%</span>
            </div>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${subject.progress}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>
            </div>

            <div className={styles.subjectDetails}>
              <div className={styles.sessionCount}>
                {subject.sessions}/{subject.totalSessions} sessions completed
              </div>
              <div className={styles.nextTopic}>
                Next: {subject.nextTopic}
              </div>
            </div>

            <button 
              className={styles.continueButton}
              style={{ backgroundColor: subject.color }}
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

