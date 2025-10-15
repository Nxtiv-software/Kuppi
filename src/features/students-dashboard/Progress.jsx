import React, { useState } from 'react';
import { IoTimeOutline, IoCheckmarkDoneOutline, IoFlameOutline, IoTrophyOutline } from 'react-icons/io5';
import styles from "../students-dashboard/Progress.module.css";

// Progress Stats Component
const ProgressStats = () => {
  const stats = [
    {
      title: 'Total Study Hours',
      value: '127',
      subtitle: '+8 this week',
      icon: <IoTimeOutline />,
      color: '#2563eb'
    },
    {
      title: 'Sessions Completed',
      value: '18',
      subtitle: '94% attendance rate',
      icon: <IoCheckmarkDoneOutline />,
      color: '#10b981'
    },
    {
      title: 'Current Streak',
      value: '12 days',
      subtitle: 'Personal best!',
      icon: <IoFlameOutline />,
      color: '#f59e0b'
    },
    {
      title: 'Certificates Earned',
      value: '6',
      subtitle: '3 this month',
      icon: <IoTrophyOutline />,
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
      name: 'Combined Mathematics',
      progress: 85,
      sessions: 8,
      totalSessions: 10,
      color: '#2bc2ecff',
      nextTopic: 'Intergration'
    },
    {
      name: 'Physics',
      progress: 70,
      sessions: 7,
      totalSessions: 10,
      color: '#b9b010ff',
      nextTopic: 'Mechanical Properties of Matter'
    },
    {
      name: 'Chemistry',
      progress: 40,
      sessions: 4,
      totalSessions: 10,
      color: '#8b5cf6',
      nextTopic: 'Oxygen containing organic compounds'
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

// Learning Analytics Component
const LearningAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const weeklyData = [
    { day: 'Mon', hours: 2.5, sessions: 1 },
    { day: 'Tue', hours: 1.8, sessions: 1 },
    { day: 'Wed', hours: 3.2, sessions: 2 },
    { day: 'Thu', hours: 2.1, sessions: 1 },
    { day: 'Fri', hours: 4.0, sessions: 2 },
    { day: 'Sat', hours: 3.5, sessions: 2 },
    { day: 'Sun', hours: 2.8, sessions: 1 }
  ];

  const monthlyData = [
    { week: 'Week 1', hours: 12.5, sessions: 6 },
    { week: 'Week 2', hours: 15.2, sessions: 8 },
    { week: 'Week 3', hours: 18.7, sessions: 9 },
    { week: 'Week 4', hours: 14.3, sessions: 7 }
  ];

  const data = timeRange === 'week' ? weeklyData : monthlyData;
  const maxHours = Math.max(...data.map(d => d.hours));



  return (
    <div className={styles.learningAnalytics}>
      <div className={styles.analyticsHeader}>
        <h3 className={styles.sectionTitle}>Learning Analytics</h3>
        <div className={styles.timeRangeSelector}>
          <button
            className={`${styles.timeButton} ${timeRange === 'week' ? styles.active : ''}`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button
            className={`${styles.timeButton} ${timeRange === 'month' ? styles.active : ''}`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {data.map((item, index) => (
            <div key={index} className={styles.chartBar}>
              <div 
                className={styles.barFill}
                style={{ 
                  height: `${(item.hours / maxHours) * 100}%`,
                  backgroundColor: '#2563eb'
                }}
              />
              <div className={styles.barValue}>{item.hours}h</div>
              <div className={styles.barLabel}>
                {timeRange === 'week' ? item.day : item.week}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Progress Component
const Progress = () => {
  return (
    <div className={styles.progress}>
      <div className={styles.header}>
        <h2 className={styles.title}>Learning Progress</h2>
        <p className={styles.subtitle}>Track your learning journey and achievements</p>
      </div>
      
      <ProgressStats />
      <SubjectProgress />
      <LearningAnalytics />
    </div>
  );
};

export default Progress;