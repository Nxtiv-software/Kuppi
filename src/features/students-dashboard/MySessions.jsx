import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions, downloadAttachment } from '../../services/api';
import styles from "../students-dashboard/MySessions.module.css";
import toast from 'react-hot-toast';

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

  // Handle different response structures from backend
  const allSessions = sessionsData.sessions || sessionsData.data || [];
  
  console.log('📊 SessionsList - Data structure:', {
    hasSessionsData: !!sessionsData,
    hasSessions: !!(sessionsData.sessions),
    hasData: !!(sessionsData.data),
    totalSessions: allSessions.length,
    firstSessionSample: allSessions[0] ? {
      id: allSessions[0]._id,
      title: allSessions[0].title,
      hasAttachments: !!allSessions[0].attachments,
      attachmentsCount: allSessions[0].attachments?.length || 0
    } : null
  });

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

  const handleDownloadAttachment = async (sessionId, attachment) => {
    try {
      console.log('🔽 Starting download:', { sessionId, attachment });
      
      const result = await downloadAttachment(sessionId, attachment);
      
      if (result.success) {
        toast.success(`Downloaded ${attachment.originalName || attachment.filename || 'file'}`);
      } else {
        toast.error('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading file');
    }
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
      {filteredSessions.map((session) => {
        // Debug: Log session data to see attachments
        console.log('🔍 Student Session Debug:', {
          id: session._id,
          title: session.title,
          meetingLink: session.meetingLink,
          attachments: session.attachments,
          announcements: session.announcements,
          status: session.status
        });

        return (
          <div key={session._id} className={`${styles.sessionCard} ${styles[session.status]} ${styles.compact}`}>
            {/* Enhanced Debug Logging with Real User Data */}
            {(() => {
              console.log('🔍 Enhanced Session Debug with Real User Data:', {
                id: session._id,
                title: session.title,
                // Real User Data
                tutorInfo: session.tutorInfo,
                pollCreatorInfo: session.pollDetails?.creatorInfo,
                pollAcceptorInfo: session.pollDetails?.acceptorInfo,
                enrolledStudentsInfo: session.enrolledStudentsInfo,
                // Legacy data for comparison
                tutorName: session.tutorName,
                pollCreator: session.pollDetails?.creator,
                acceptedBy: session.acceptedBy,
                // Resources
                meetingLink: session.meetingLink,
                attachments: session.attachments,
                announcements: session.announcements,
                status: session.status
              });
              return null;
            })()}
            
            {/* Status Indicator Strip */}
            <div className={`${styles.statusStrip} ${styles[session.status]}`}></div>
            
            {/* Main Card Header */}
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                <div className={styles.sessionSubject}>
                  📚 {session.subject} {session.topic && `• ${session.topic}`}
                </div>
              </div>
              <div className={styles.headerRight}>
                <span className={`${styles.statusBadge} ${styles[session.status]}`}>
                  {session.status === 'scheduled' ? 'upcoming' : session.status}
                </span>
                {session.feePerStudent && (
                  <div className={styles.feeDisplay}>Rs. {session.feePerStudent}</div>
                )}
              </div>
            </div>

            {/* Compact Session Meta */}
            <div className={styles.sessionMetaCompact}>
              <div className={styles.metaGrid}>
                <div className={styles.metaCell}>
                  <span className={styles.metaIcon}>📅</span>
                  <span className={styles.metaText}>{formatDate(session.date)}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaIcon}>⏰</span>
                  <span className={styles.metaText}>{formatTime(session.time)}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaIcon}>👥</span>
                  <span className={styles.metaText}>{session.currentStudents || session.enrolledStudentsInfo?.length || 0}/{session.maxStudents || '∞'}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaIcon}>👨‍🏫</span>
                  <span className={styles.metaText}>
                    {session.tutorInfo?.name || 
                     session.tutorName || 
                     'TBA'}
                  </span>
                  {session.tutorInfo?.email && (
                    <a 
                      href={`mailto:${session.tutorInfo.email}`} 
                      className={styles.tutorEmailLink}
                      title={`Email ${session.tutorInfo.name}`}
                    >
                      📧
                    </a>
                  )}
                </div>
              </div>
              
              {(session.status === 'scheduled' || session.status === 'upcoming') && (
                <SessionCountdown session={session} />
              )}
            </div>

            {/* Session Description (if exists) */}
            {session.description && (
              <div className={styles.descriptionCompact}>
                <p>{session.description}</p>
              </div>
            )}

            {/* Poll Context (Enhanced with Real User Data) */}
            {session.pollDetails && (
              <div className={styles.pollContextCompact}>
                <div className={styles.pollHeaderCompact}>
                  <span className={styles.pollIcon}>🗳️</span>
                  <span className={styles.pollTitle}>Poll: {session.pollDetails.title}</span>
                  <span className={styles.pollVotes}>{session.pollDetails.voteCount || session.voteCount || 0} votes</span>
                </div>
                
                <div className={styles.pollPeopleCompact}>
                  {/* Enhanced Poll Creator with Real Data */}
                  <div className={styles.pollPerson}>
                    <span className={styles.personRole}>Creator:</span>
                    <span className={styles.personName}>
                      {session.pollDetails.creatorInfo?.name || 
                       session.pollDetails.creator?.name || 
                       session.creator?.name || 
                       'Anonymous'}
                    </span>
                    {(session.pollDetails.creatorInfo?.email || session.pollDetails.creator?.email) && (
                      <span className={styles.personEmail}>
                        📧 {session.pollDetails.creatorInfo?.email || session.pollDetails.creator?.email}
                      </span>
                    )}
                  </div>
                  
                  {/* Enhanced Poll Acceptor with Real Data */}
                  {(session.acceptedBy || session.pollDetails.acceptorInfo) && (
                    <div className={styles.pollPerson}>
                      <span className={styles.personRole}>Accepted:</span>
                      <span className={styles.personName}>
                        {session.pollDetails.acceptorInfo?.name || 
                         session.acceptedBy?.name || 
                         session.tutorName || 
                         'Tutor'}
                      </span>
                      {(session.pollDetails.acceptorInfo?.email || session.acceptedBy?.email) && (
                        <span className={styles.personEmail}>
                          📧 {session.pollDetails.acceptorInfo?.email || session.acceptedBy?.email}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons & Resources */}
            {(session.status === 'scheduled' || session.status === 'upcoming') && (
              <div className={styles.sessionActionsCompact}>
                {/* Join Button */}
                {session.meetingLink ? (
                  <a 
                    href={session.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.joinButtonPrimary}
                  >
                    🔗 Join Session
                  </a>
                ) : (
                  <button className={styles.joinButtonDisabled} disabled>
                    Meeting link pending
                  </button>
                )}

                {/* Quick Resources */}
                <div className={styles.quickResources}>
                  {session.attachments && session.attachments.length > 0 && (
                    <div className={styles.resourceItem}>
                      <span className={styles.resourceIcon}>📎</span>
                      <span className={styles.resourceCount}>{session.attachments.length} files</span>
                    </div>
                  )}
                  
                  {session.announcements && session.announcements.length > 0 && (
                    <div className={styles.resourceItem}>
                      <span className={styles.resourceIcon}>📢</span>
                      <span className={styles.resourceCount}>{session.announcements.length} updates</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expandable Resources Section */}
            {((session.attachments && session.attachments.length > 0) || 
              (session.announcements && session.announcements.length > 0) ||
              (session.enrolledStudentsInfo && session.enrolledStudentsInfo.length > 0)) && (
              <div className={styles.expandableResources}>
                {/* Enrolled Students Info */}
                {session.enrolledStudentsInfo && session.enrolledStudentsInfo.length > 0 && (
                  <div className={styles.resourceSection}>
                    <div className={styles.resourceHeader}>👥 Enrolled Students ({session.enrolledStudentsInfo.length})</div>
                    <div className={styles.studentsGrid}>
                      {session.enrolledStudentsInfo.slice(0, 5).map((student, index) => (
                        <div key={index} className={styles.studentItem}>
                          <div className={styles.studentIcon}>👤</div>
                          <div className={styles.studentDetails}>
                            <span className={styles.studentName}>
                              {student.name || student.firstName || 'Student'}
                            </span>
                            {student.email && (
                              <span className={styles.studentEmail}>
                                {student.email}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {session.enrolledStudentsInfo.length > 5 && (
                        <div className={styles.moreStudents}>
                          +{session.enrolledStudentsInfo.length - 5} more students
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Announcements */}
                {session.announcements && session.announcements.length > 0 && (
                  <div className={styles.resourceSection}>
                    <div className={styles.resourceHeader}>📢 Announcements</div>
                    {session.announcements.slice(-2).map((announcement, index) => (
                      <div key={index} className={styles.announcementCompact}>
                        <p>{announcement.message || announcement}</p>
                        {(announcement.addedAt || announcement.createdAt) && (
                          <small>
                            {new Date(announcement.addedAt || announcement.createdAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Attachments */}
                {session.attachments && session.attachments.length > 0 && (
                  <div className={styles.resourceSection}>
                    <div className={styles.resourceHeader}>📎 Materials</div>
                    <div className={styles.attachmentsGrid}>
                      {session.attachments.map((attachment, index) => (
                        <div key={index} className={styles.attachmentCompact}>
                          <div className={styles.attachmentIcon}>
                            {(attachment.mimeType || attachment.fileType)?.includes('pdf') ? '📄' : 
                             (attachment.mimeType || attachment.fileType)?.includes('image') ? '🖼️' : '📁'}
                          </div>
                          <div className={styles.attachmentDetails}>
                            <span className={styles.attachmentName}>
                              {attachment.originalName || attachment.filename || attachment.name || `File ${index + 1}`}
                            </span>
                            {(attachment.fileSize || attachment.size) && (
                              <span className={styles.attachmentSize}>
                                {((attachment.fileSize || attachment.size) / 1024 / 1024).toFixed(1)}MB
                              </span>
                            )}
                          </div>
                          <button 
                            className={styles.downloadButtonCompact}
                            onClick={() => handleDownloadAttachment(session._id, attachment)}
                            title="Download"
                          >
                            ⬇️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Completed Session Info */}
            {session.status === 'completed' && (
              <div className={styles.completedInfo}>
                {session.rating && (
                  <div className={styles.ratingDisplay}>
                    {'⭐'.repeat(Math.floor(session.rating))} {session.rating}/5
                  </div>
                )}
                {session.notes && (
                  <div className={styles.notesCompact}>
                    <strong>Notes:</strong> {session.notes}
                  </div>
                )}
              </div>
            )}

            {/* Cancelled Session Info */}
            {session.status === 'cancelled' && session.reason && (
              <div className={styles.cancelledInfo}>
                <span className={styles.cancelIcon}>❌</span>
                <span className={styles.cancelReason}>{session.reason}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Main MySessions Component
const MySessions = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { 
    data: sessionsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className={styles.mySessionsContainer}>
        <div className={styles.mySessionsHeader}>
          <h2>My Sessions</h2>
          <p>Loading your scheduled sessions...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mySessionsContainer}>
        <div className={styles.mySessionsHeader}>
          <h2>My Sessions</h2>
          <div className={styles.errorState}>
            <p>Failed to load sessions. Please try again.</p>
            <button onClick={refetch} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mySessionsContainer}>
      <div className={styles.mySessionsHeader}>
        <h2>My Sessions</h2>
        <p>View and manage your scheduled learning sessions</p>
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
