import React, { useState } from 'react';
import styles from "../students-dashboard/MySessions.module.css";

// Session Filters Component
const SessionFilters = ({ filter, setFilter }) => {
  const filters = [
    { id: 'all', label: 'All Sessions', count: 24 },
    { id: 'upcoming', label: 'Upcoming', count: 3 },
    { id: 'completed', label: 'Completed', count: 18 },
    { id: 'cancelled', label: 'Cancelled', count: 3 }
  ];

  return (
    <div className={styles.sessionFilters}>
      <div className={styles.filterTabs}>
        {filters.map((filterItem) => (
          <button
            key={filterItem.id}
            className={`${styles.filterTab} ${filter === filterItem.id ? styles.active : ''}`}
            onClick={() => setFilter(filterItem.id)}
          >
            {filterItem.label}
            <span className={styles.filterCount}>({filterItem.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sessions List Component
const SessionsList = ({ filter }) => {
  const allSessions = [
    {
      id: 1,
      title: 'React Hooks Workshop',
      subject: 'Web Development',
      instructor: 'John Smith',
      date: 'Dec 28, 2024',
      time: '2:00 PM - 4:00 PM',
      students: 15,
      price: 'Rs. 400',
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      materials: ['React Hooks Guide.pdf', 'Code Examples.zip']
    },
    {
      id: 2,
      title: 'Database Design Fundamentals',
      subject: 'Database Systems',
      instructor: 'Dr. Sarah Wilson',
      date: 'Dec 25, 2024',
      time: '10:00 AM - 12:00 PM',
      students: 20,
      price: 'Rs. 350',
      status: 'completed',
      rating: 4.8,
      materials: ['ER Diagrams.pdf', 'SQL Queries.txt'],
      notes: 'Excellent session covering normalization and indexing concepts.'
    },
    {
      id: 3,
      title: 'Machine Learning Basics',
      subject: 'Artificial Intelligence',
      instructor: 'Prof. Mike Chen',
      date: 'Dec 30, 2024',
      time: '7:00 PM - 9:00 PM',
      students: 12,
      price: 'Rs. 500',
      status: 'upcoming',
      meetingLink: 'https://zoom.us/j/123456789',
      materials: ['ML Introduction.pdf']
    },
    {
      id: 4,
      title: 'JavaScript ES6 Features',
      subject: 'Web Development',
      instructor: 'Anna Rodriguez',
      date: 'Dec 20, 2024',
      time: '6:00 PM - 8:00 PM',
      students: 18,
      price: 'Rs. 300',
      status: 'completed',
      rating: 4.5,
      materials: ['ES6 Examples.js', 'Practice Exercises.zip'],
      notes: 'Great overview of arrow functions, destructuring, and modules.'
    },
    {
      id: 5,
      title: 'Data Structures Deep Dive',
      subject: 'Computer Science',
      instructor: 'Dr. Robert Kim',
      date: 'Dec 15, 2024',
      time: '3:00 PM - 5:00 PM',
      students: 25,
      price: 'Rs. 450',
      status: 'cancelled',
      reason: 'Instructor unavailable due to emergency'
    }
  ];

  const filteredSessions = filter === 'all' 
    ? allSessions 
    : allSessions.filter(session => session.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#2563eb';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

 const renderSessionActions = (session) => {
    switch (session.status) {
      case 'upcoming':
        return (
          <div className={styles.sessionActions}>
            <button className={styles.joinButton}>Join Session</button>
            {session.meetingLink && (
              <a 
                href={session.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                Meeting Link
              </a>
            )}
            <button className={styles.contactButton}>Contact Instructor</button>
          </div>
        );
      case 'completed':
        return (
          <div className={styles.sessionActions}>
            <button className={styles.downloadButton}>Download Materials</button>
            <button className={styles.reviewButton}>Leave Review</button>
            <button className={styles.certificateButton}>Get Certificate</button>
          </div>
        );
      case 'cancelled':
        return (
          <div className={styles.sessionActions}>
            <button className={styles.refundButton}>Request Refund</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.sessionsList}>
      {filteredSessions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3 className={styles.emptyTitle}>No sessions found</h3>
          <p className={styles.emptyText}>
            {filter === 'all' 
              ? 'You haven\'t enrolled in any sessions yet.' 
              : `No ${filter} sessions found.`}
          </p>
        </div>
      ) : (
        filteredSessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <div className={styles.sessionInfo}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                <p className={styles.sessionSubject}>{session.subject}</p>
                <p className={styles.sessionInstructor}>by {session.instructor}</p>
              </div>
              <div 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(session.status) }}
              >
                {session.status}
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
              {session.rating && (
                <div className={styles.detailItem}>
                  <span className={styles.icon}>⭐</span>
                  <span>{session.rating}/5.0</span>
                </div>
              )}
            </div>

            {session.materials && session.materials.length > 0 && (
              <div className={styles.materialsSection}>
                <h4 className={styles.materialsTitle}>Materials:</h4>
                <div className={styles.materialsList}>
                  {session.materials.map((material, index) => (
                    <span key={index} className={styles.material}>
                      📎 {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {session.notes && (
              <div className={styles.notesSection}>
                <h4 className={styles.notesTitle}>Notes:</h4>
                <p className={styles.notesText}>{session.notes}</p>
              </div>
            )}

            {session.reason && (
              <div className={styles.reasonSection}>
                <h4 className={styles.reasonTitle}>Cancellation Reason:</h4>
                <p className={styles.reasonText}>{session.reason}</p>
              </div>
            )}

            {renderSessionActions(session)}
          </div>
        ))
      )}
    </div>
  );
};

// Main My Sessions Component
const MySessions = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className={styles.mySessions}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Sessions</h2>
        <p className={styles.subtitle}>Manage your enrolled and completed sessions</p>
      </div>
      
      <SessionFilters filter={filter} setFilter={setFilter} />
      <SessionsList filter={filter} />
    </div>
  );
};

export default MySessions;