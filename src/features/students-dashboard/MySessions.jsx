import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions } from '../../services/api';
import styles from "../students-dashboard/MySessions.module.css";

// Utility function to calculate time until session
const getTimeUntilSession = (sessionDate, sessionTime) => {
  const sessionDateTime = new Date(`${sessionDate.split('T')[0]}T${sessionTime}`);
  const now = new Date();
  const timeDiff = sessionDateTime - now;

  if (timeDiff <= 0) return null;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Loading Skeleton Component
const SessionSkeleton = () => (
  <div className={styles.sessionCard}>
    <div className={styles.sessionHeader}>
      <div className={styles.sessionInfo}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
        <div className={`${styles.skeleton} ${styles.skeletonSubject}`}></div>
        <div className={`${styles.skeleton} ${styles.skeletonInstructor}`}></div>
      </div>
      <div className={styles.sessionStatus}>
        <div className={`${styles.skeleton} ${styles.skeletonBadge}`}></div>
      </div>
    </div>
    <div className={styles.sessionDetails}>
      <div className={styles.sessionMeta}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.metaItem}>
            <div className={`${styles.skeleton} ${styles.skeletonMeta}`}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className={styles.sessionsList}>
    {[1, 2, 3].map(i => (
      <SessionSkeleton key={i} />
    ))}
  </div>
);
const SessionCountdown = ({ session }) => {
  const [timeLeft, setTimeLeft] = useState(
    getTimeUntilSession(session.date, session.time)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilSession(session.date, session.time));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [session.date, session.time]);

  if (!timeLeft) return null;

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownIcon}>⏱️</span>
      <span className={styles.countdownText}>Starts in {timeLeft}</span>
    </div>
  );
};

// Session Filters Component
const SessionFilters = ({ filter, setFilter, sortBy, setSortBy, sessionsData }) => {
  const sessions = sessionsData?.sessions || [];
  
  const getCount = (status) => {
    if (status === 'all') return sessions.length;
    if (status === 'upcoming') {
      return sessions.filter(session => 
        session.status === 'scheduled' || session.status === 'upcoming'
      ).length;
    }
    return sessions.filter(session => session.status === status).length;
  };

  const filters = [
    { id: 'all', label: 'All Sessions', count: getCount('all') },
    { id: 'upcoming', label: 'Upcoming', count: getCount('upcoming') },
    { id: 'completed', label: 'Completed', count: getCount('completed') },
    { id: 'cancelled', label: 'Cancelled', count: getCount('cancelled') }
  ];

  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'subject', label: 'Sort by Subject' },
    { value: 'status', label: 'Sort by Status' },
    { value: 'tutor', label: 'Sort by Tutor' }
  ];

  return (
    <div className={styles.sessionFilters}>
      <div className={styles.filtersHeader}>
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
        <div className={styles.sortControls}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Sessions List Component
const SessionsList = ({ filter, sortBy, sessionsData }) => {
  if (!sessionsData) return null;

  const allSessions = sessionsData.sessions || [];

  // Filter sessions based on selected filter
  let filteredSessions = filter === 'all' 
    ? allSessions 
    : allSessions.filter(session => {
        // Map status values to match the backend response
        if (filter === 'upcoming') {
          return session.status === 'scheduled' || session.status === 'upcoming';
        }
        return session.status === filter;
      });

  // Sort sessions based on selected sort option
  filteredSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'subject':
        return (a.subject || '').localeCompare(b.subject || '');
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'tutor':
        return (a.tutorName || '').localeCompare(b.tutorName || '');
      default:
        return 0;
    }
  });

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
              ? "No scheduled sessions yet. Keep voting on polls - when they reach 50% votes, tutors can schedule sessions for you!"
              : `No ${filter} sessions at the moment.`
            }
          </p>
          {filter === 'all' && (
            <div className={styles.emptyActions}>
              <p className={styles.emptyHint}>
                💡 <strong>How it works:</strong> Vote on polls → Polls reach 50% → Tutors schedule sessions → You get notified!
              </p>
            </div>
          )}
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
                {session.subject} {session.topic && `- ${session.topic}`}
              </p>
              <p className={styles.sessionInstructor}>
                👨‍🏫 Tutor: {session.tutorName || 'TBA'}
                {session.tutorEmail && (
                  <a href={`mailto:${session.tutorEmail}`} className={styles.tutorEmail}>
                    ({session.tutorEmail})
                  </a>
                )}
              </p>
            </div>
            <div className={styles.sessionStatus}>
              <span className={`${styles.statusBadge} ${styles[session.status]}`}>
                {session.status === 'scheduled' ? 'upcoming' : session.status}
              </span>
              {(session.status === 'scheduled' || session.status === 'upcoming') && (
                <SessionCountdown session={session} />
              )}
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
                  {formatTime(session.time)} ({session.duration || '60'} min)
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>👥</span>
                <span className={styles.metaLabel}>Students:</span>
                <span className={styles.metaValue}>
                  {session.currentStudents || 0}/{session.maxStudents || 'TBA'}
                </span>
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

            {/* Show original poll details for context */}
            {session.pollDetails && (
              <div className={styles.pollContext}>
                <h4>🗳️ Original Poll</h4>
                <div className={styles.pollInfo}>
                  <strong>{session.pollDetails.title}</strong>
                  <p>{session.pollDetails.description}</p>
                  <small>{session.pollDetails.subject} - {session.pollDetails.chapter}</small>
                </div>
              </div>
            )}

            {(session.status === 'scheduled' || session.status === 'upcoming') && (
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
                    <h4>📚 Materials:</h4>
                    <ul>
                      {session.materials.map((material, index) => (
                        <li key={index}>📄 {material}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {session.notes && (
                  <div className={styles.sessionNotes}>
                    <h4>📝 Notes:</h4>
                    <p>{session.notes}</p>
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
  const [sortBy, setSortBy] = useState('date');

  // Fetch scheduled sessions for the current user with auto-refresh
  const { data: sessionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every minute
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchIntervalInBackground: true, // Keep refreshing in background
  });

  if (isLoading) {
    return (
      <div className={styles.mySessions}>
        <div className={styles.sessionHeader}>
          <h2 className={styles.pageTitle}>My Sessions</h2>
          <p className={styles.pageDescription}>Loading your scheduled sessions...</p>
        </div>
        <div className={styles.sessionFilters}>
          <div className={styles.filterTabs}>
            {['All Sessions', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
              <div key={tab} className={`${styles.skeleton} ${styles.skeletonTab}`}></div>
            ))}
          </div>
          <div className={styles.sortControls}>
            <div className={`${styles.skeleton} ${styles.skeletonSort}`}></div>
          </div>
        </div>
        <LoadingSkeleton />
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
          <button 
            onClick={() => refetch()} 
            className={styles.retryButton}
          >
            🔄 Retry
          </button>
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
      
      <SessionFilters 
        filter={filter} 
        setFilter={setFilter} 
        sortBy={sortBy}
        setSortBy={setSortBy}
        sessionsData={sessionsData} 
      />
      <SessionsList 
        filter={filter} 
        sortBy={sortBy}
        sessionsData={sessionsData} 
      />
    </div>
  );
};

export default MySessions;
