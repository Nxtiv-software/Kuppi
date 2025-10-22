import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions, getPolls, getTrendingPolls } from '../../services/api';
import { useUser } from '@clerk/clerk-react';
import { IoBookOutline, IoStatsChartOutline, IoTrendingUpOutline, IoCashOutline, IoCalendarOutline, IoPeopleOutline, IoCreateOutline, IoTimeOutline } from 'react-icons/io5';
import styles from "../students-dashboard/Overview.module.css";

// Stats Cards Component with Real Data
const StatsCards = () => {
  const { user, isSignedIn } = useUser();

  // Fetch student's sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch regular polls
  const { data: pollsData } = useQuery({
    queryKey: ['polls', { status: 'all' }],
    queryFn: () => getPolls({ status: 'all' }),
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch trending polls
  const { data: trendingPollsData } = useQuery({
    queryKey: ['trendingPolls'],
    queryFn: getTrendingPolls,
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  // Calculate stats from real data
  const sessions = sessionsData?.sessions || [];
  const regularPolls = pollsData?.data?.polls || [];
  const trendingPolls = trendingPollsData?.data || [];

  // 1. Sessions Attended: Count completed sessions
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const sessionsAttended = completedSessions.length;

  // 2. Active Polls: Count all active polls (regular + trending) + accepted polls
  const activePolls = regularPolls.filter(p => p.status === 'active' || p.status === 'accepted');
  const activeTrendingPolls = trendingPolls.filter(p => p.status === 'active' || p.status === 'accepted');
  const totalActivePolls = activePolls.length + activeTrendingPolls.length;

  // Count polls created by current user
  const myPolls = [...activePolls, ...activeTrendingPolls].filter(p => 
    p.creatorInfo?.id === user?.id || p.creator?.id === user?.id || p.createdBy === user?.id
  );

  // 3. Hours Learned: Sum of completed session durations
  const hoursLearned = completedSessions.reduce((total, session) => {
    const duration = parseFloat(session.duration) || 0;
    return total + duration;
  }, 0);

  // 4. Active Sessions: Count sessions that are not completed
  const activeSessions = sessions.filter(s => 
    s.status !== 'completed' && s.status !== 'cancelled'
  );
  const activeSessionsCount = activeSessions.length;

  const stats = [
    {
      title: 'Sessions Attended',
      value: sessionsAttended.toString(),
      subtitle: `${sessionsAttended} completed`,
      icon: <IoBookOutline />
    },
    {
      title: 'Active Polls',
      value: totalActivePolls.toString(),
      subtitle: `${myPolls.length} created by you`,
      icon: <IoStatsChartOutline />
    },
    {
      title: 'Hours Learned',
      value: `${hoursLearned.toFixed(1)}h`,
      subtitle: 'From completed sessions',
      icon: <IoTimeOutline />
    },
    {
      title: 'Active Sessions',
      value: activeSessionsCount.toString(),
      subtitle: 'Enrolled & upcoming',
      icon: <IoCalendarOutline />
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
const QuickActions = ({ setActiveTab }) => {
  const actions = [
    {
      title: 'Create Poll',
      description: 'Start a new poll for a kuppi session',
      icon: <IoCreateOutline />,
      color: 'primary',
      onClick: () => setActiveTab('vote-create')
    },
    {
      title: 'View Schedule',
      description: 'Check your upcoming sessions',
      icon: <IoCalendarOutline />,
      color: 'secondary',
      onClick: () => setActiveTab('my-sessions')
    },
    {
      title: 'Find Study Group',
      description: 'Join or create a study group',
      icon: <IoPeopleOutline />,
      color: 'tertiary',
      onClick: () => {} // Placeholder for future implementation
    }
  ];

  return (
    <div className={styles.quickActions}>
      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <div 
            key={index} 
            className={`${styles.actionCard} ${styles[action.color]}`}
            onClick={action.onClick}
            style={{ cursor: action.onClick ? 'pointer' : 'default' }}
          >
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
const UpcomingSessions = ({ setActiveTab }) => {
  const { user, isSignedIn } = useUser();

  // Fetch scheduled sessions for the current user
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    enabled: isSignedIn, // Only fetch when user is signed in
    staleTime: 3 * 60 * 1000, // 3 minutes - session data doesn't change very frequently
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic polling
  });

  // Filter for upcoming sessions only
  const upcomingSessions = sessionsData?.sessions?.filter(session => 
    session.status === 'scheduled' || session.status === 'upcoming'
  ) || [];

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isSignedIn) {
    return (
      <div className={styles.upcomingSessions}>
        <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
        <div className={styles.emptyState}>
          <p>Please sign in to view your upcoming sessions</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.upcomingSessions}>
        <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
        <div className={styles.loadingState}>
          <p>Loading your upcoming sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.upcomingSessions}>
        <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
        <div className={styles.errorState}>
          <p>Error loading sessions: {error.message}</p>
        </div>
      </div>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <div className={styles.upcomingSessions}>
        <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
        <div className={styles.emptyState}>
          <p>No upcoming sessions scheduled. Vote on polls to get sessions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.upcomingSessions}>
      <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
      <div className={styles.sessionsList}>
        {upcomingSessions.slice(0, 3).map((session) => (
          <div key={session._id} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <div className={styles.sessionInfo}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                <p className={styles.sessionSubtitle}>{session.subject} - {session.topic}</p>
                <p className={styles.instructor}>by {session.tutorName}</p>
              </div>
              <div className={styles.statusBadge}>
                <span className={styles.status}>
                  {session.status === 'scheduled' ? 'confirmed' : session.status}
                </span>
              </div>
            </div>
            
            <div className={styles.sessionDetails}>
              <div className={styles.detailItem}>
                <span className={styles.icon}><IoCalendarOutline /></span>
                <span>{formatDate(session.date)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}><IoTimeOutline /></span>
                <span>{formatTime(session.time)} ({session.duration || '60'} min)</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}><IoPeopleOutline /></span>
                <span>{session.currentStudents || 0}/{session.maxStudents} students</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}><IoCashOutline /></span>
                <span>Rs. {session.feePerStudent || 'TBA'}</span>
              </div>
            </div>
            
            <div className={styles.sessionActions}>
              {session.meetingLink ? (
                <a 
                  href={session.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.joinButton}
                >
                  Join Session
                </a>
              ) : (
                <button className={styles.joinButton} disabled>
                  Meeting link pending
                </button>
              )}
              <button className={styles.calendarButton}>Add to Calendar</button>
              {session.tutorEmail && (
                <a 
                  href={`mailto:${session.tutorEmail}`}
                  className={styles.contactButton}
                >
                  Contact Tutor
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Show "View All" link if there are more sessions */}
      {upcomingSessions.length > 3 && (
        <div className={styles.viewAllSessions}>
          <button 
            className={styles.viewAllButton}
            onClick={() => setActiveTab('my-sessions')}
          >
            View All Sessions ({upcomingSessions.length})
          </button>
        </div>
      )}
    </div>
  );
};

// Main Overview Component
const Overview = ({ setActiveTab }) => {
  return (
    <div className={styles.overview}>
      <StatsCards />
      <QuickActions setActiveTab={setActiveTab} />
      <UpcomingSessions setActiveTab={setActiveTab} />
    </div>
  );
};

export default Overview;