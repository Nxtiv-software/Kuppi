import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions } from '../../services/api';
import styles from "../students-dashboard/MySessions.module.css";

// Session Filters Component
const SessionFilters = ({ filter, setFilter, sessionsData }) => {
  const sessions = sessionsData?.data || [];
  
  const getCount = (status) => {
    if (status === 'all') return sessions.length;
    return sessions.filter(session => session.status === status).length;
  };

  const filters = [
    { id: 'all', label: 'All Sessions', count: getCount('all') },
    { id: 'upcoming', label: 'Upcoming', count: getCount('upcoming') },
    { id: 'completed', label: 'Completed', count: getCount('completed') },
    { id: 'cancelled', label: 'Cancelled', count: getCount('cancelled') }
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
const SessionsList = ({ filter, sessionsData }) => {
  if (!sessionsData) return null;

  const allSessions = sessionsData.data || [];

  // Filter sessions based on selected filter
  const filteredSessions = filter === 'all' 
    ? allSessions 
    : allSessions.filter(session => session.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (filteredSessions.length === 0) {
    return (
      <div className={styles.sessionsList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No {filter === 'all' ? '' : filter} sessions found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't joined any sessions yet. Vote on polls to get sessions scheduled!"
              : `No ${filter} sessions at the moment.`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sessionsList}>
      {filteredSessions.map((session) => (
        <div key={session._id} className={`${styles.sessionCard} ${styles[session.status]}`}>
          <div className={styles.sessionHeader}>
            <div className={styles.sessionInfo}>
              <h3 className={styles.sessionTitle}>{session.title}</h3>
              <p className={styles.sessionSubject}>
                {session.subject} - {session.topic}
              </p>
              <p className={styles.sessionInstructor}>
                👨‍🏫 Instructor: {session.tutor?.name || session.tutorName || 'TBA'}
              </p>
            </div>
            <div className={styles.sessionStatus}>
              <span className={`${styles.statusBadge} ${styles[session.status]}`}>
                {session.status}
              </span>
            </div>
          </div>

          <div className={styles.sessionDetails}>
            <div className={styles.sessionMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📅</span>
                <span className={styles.metaLabel}>Date:</span>
                <span className={styles.metaValue}>{formatDate(session.date)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>⏰</span>
                <span className={styles.metaLabel}>Time:</span>
                <span className={styles.metaValue}>
                  {formatTime(session.time)} ({session.duration || '2'} hrs)
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>👥</span>
                <span className={styles.metaLabel}>Students:</span>
                <span className={styles.metaValue}>{session.enrolledStudents || session.maxStudents || 'TBA'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>💰</span>
                <span className={styles.metaLabel}>Fee:</span>
                <span className={styles.metaValue}>Rs. {session.feePerStudent || 'TBA'}</span>
              </div>
            </div>

            {session.description && (
              <div className={styles.sessionDescription}>
                <h4>Description</h4>
                <p>{session.description}</p>
              </div>
            )}

            {session.status === 'upcoming' && (
              <div className={styles.sessionActions}>
                {session.meetingLink ? (
                  <a 
                    href={session.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.joinButton}
                  >
                    🔗 Join Session
                  </a>
                ) : (
                  <button className={styles.joinButtonDisabled} disabled>
                    Meeting link will be shared soon
                  </button>
                )}
                {session.materials && session.materials.length > 0 && (
                  <div className={styles.materials}>
                    <h4>Materials:</h4>
                    <ul>
                      {session.materials.map((material, index) => (
                        <li key={index}>📄 {material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {session.status === 'completed' && (
              <div className={styles.completedSession}>
                {session.rating && (
                  <div className={styles.sessionRating}>
                    <span>Rating: {'⭐'.repeat(Math.floor(session.rating))} ({session.rating})</span>
                  </div>
                )}
                {session.notes && (
                  <div className={styles.sessionNotes}>
                    <h4>Your Notes:</h4>
                    <p>{session.notes}</p>
                  </div>
                )}
                {session.materials && session.materials.length > 0 && (
                  <div className={styles.materials}>
                    <h4>Materials:</h4>
                    <ul>
                      {session.materials.map((material, index) => (
                        <li key={index}>📄 {material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {session.status === 'cancelled' && session.reason && (
              <div className={styles.cancelReason}>
                <h4>Cancellation Reason:</h4>
                <p>{session.reason}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main MySessions Component
const MySessions = () => {
  const [filter, setFilter] = useState('all');

  // Fetch scheduled sessions for the current user
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className={styles.mySessions}>
        <div className={styles.sessionHeader}>
          <h2 className={styles.pageTitle}>My Sessions</h2>
          <p className={styles.pageDescription}>Loading your scheduled sessions...</p>
        </div>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mySessions}>
        <div className={styles.sessionHeader}>
          <h2 className={styles.pageTitle}>My Sessions</h2>
          <p className={styles.pageDescription}>Error loading your sessions</p>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>❌</div>
          <h3>Error Loading Sessions</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mySessions}>
      <div className={styles.sessionHeader}>
        <h2 className={styles.pageTitle}>My Sessions</h2>
        <p className={styles.pageDescription}>
          View and manage your scheduled learning sessions
        </p>
      </div>
      
      <SessionFilters filter={filter} setFilter={setFilter} sessionsData={sessionsData} />
      <SessionsList filter={filter} sessionsData={sessionsData} />
    </div>
  );
};

export default MySessions;
