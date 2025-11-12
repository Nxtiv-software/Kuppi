import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions, downloadAttachment, getWhatsAppGroupLink } from '../../services/api';
import { IoTimeOutline, IoBookOutline, IoBulbOutline } from 'react-icons/io5';
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
      <span className={styles.countdownIcon}><IoTimeOutline /></span>
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
          <div className={styles.emptyIcon}><IoBookOutline /></div>
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
                <IoBulbOutline /> <strong>How it works:</strong> Vote on polls → Polls reach 50% → Tutors schedule sessions → You get notified!
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

            {/* Additional Creator Data Debug */}
            {(() => {
              console.log('👤 MySessions Creator Data Analysis:', {
                sessionId: session._id,
                sessionTitle: session.title,
                // All possible creator data sources
                'session.pollDetails?.creatorInfo': session.pollDetails?.creatorInfo,
                'session.pollDetails?.creatorName': session.pollDetails?.creatorName,
                'session.pollDetails?.creator': session.pollDetails?.creator,
                'session.creator': session.creator,
                // What will be displayed
                displayName: session.pollDetails?.creatorInfo?.name || 
                           session.pollDetails?.creatorInfo?.firstName ||
                           session.pollDetails?.creatorName ||
                           session.pollDetails?.creator?.name || 
                           session.pollDetails?.creator?.firstName ||
                           session.creator?.name || 
                           session.creator?.firstName ||
                           'Anonymous'
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
                  {session.status === 'upcoming' ? 'Upcoming' : 
                   session.status === 'scheduled' ? 'Upcoming' : 
                   session.status.charAt(0).toUpperCase() + session.status.slice(1)}
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

                {/* WhatsApp Group Button */}
                <button 
                  onClick={() => handleJoinWhatsApp(session._id)}
                  className={styles.whatsappButton}
                  title="Join WhatsApp Group"
                >
                  <svg className={styles.whatsappIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Group
                </button>

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

  // Handler for joining WhatsApp group
  const handleJoinWhatsApp = async (sessionId) => {
    try {
      const response = await getWhatsAppGroupLink(sessionId);
      if (response.success && response.data.whatsappGroupLink) {
        window.open(response.data.whatsappGroupLink, '_blank');
        toast.success('Opening WhatsApp group...');
      } else {
        toast.error('WhatsApp group link not available yet');
      }
    } catch (error) {
      console.error('Error fetching WhatsApp link:', error);
      toast.error('Failed to get WhatsApp group link');
    }
  };

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
