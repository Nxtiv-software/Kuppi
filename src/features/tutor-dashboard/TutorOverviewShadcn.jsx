import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getTutorScheduledSessions,
  getSessionRequests,
  getMyDashboardNotifications,
  markMyDashboardNotificationAsRead,
  markAllMyDashboardNotificationsAsRead,
  deleteMyReadDashboardNotification,
  deleteAllMyReadDashboardNotifications
} from '../../services/api';
import { useUser } from '@clerk/clerk-react';
import { 
  DollarSign, 
  CheckCircle2, 
  Users, 
  Star,
  Calendar,
  TrendingUp,
  Clock,
  BookOpen,
  Video,
  MessageSquare,
  ArrowRight,
  Sparkles,
  UserPlus,
  BarChart3,
  Target,
  Award,
  ChevronRight,
  ExternalLink,
  Bell,
  Mail,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { cn } from '../../utils/utils';
import { toast } from 'sonner';

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon: Icon, color, loading, trend }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          color
        )}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          {subtitle}
          {trend && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </Badge>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, icon: Icon, onClick, variant = 'default' }) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "h-auto flex-col gap-3 p-6 hover:scale-[1.02] transition-all",
        variant === 'default' && "bg-primary hover:bg-primary/90"
      )}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{title}</span>
    </Button>
  );
};

// Session Card Component
const SessionCard = ({ session, type = 'upcoming' }) => {
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Date TBD';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeDisplay = timeString || 'Time TBD';
    
    if (isToday) return `Today, ${timeDisplay}`;
    if (isTomorrow) return `Tomorrow, ${timeDisplay}`;
    
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return `${date.toLocaleDateString('en-US', options)}, ${timeDisplay}`;
  };

  const getStatusVariant = (status) => {
    if (status === 'upcoming' || status === 'scheduled') return 'default';
    if (status === 'ready_to_schedule') return 'secondary';
    return 'outline';
  };

  const getStatusLabel = (status) => {
    if (status === 'upcoming' || status === 'scheduled') return 'Upcoming';
    if (status === 'ready_to_schedule') return 'Ready';
    return status;
  };

  if (type === 'request') {
    return (
      <Card className="group hover:shadow-md transition-all">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold line-clamp-1">{session.title}</h4>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{session.votes?.length || 0} interested</span>
                </div>
                {session.subject && (
                  <Badge variant="outline" className="text-xs">
                    {session.subject.replace('-', ' ')}
                  </Badge>
                )}
              </div>
            </div>
            <Button size="sm" variant="ghost" className="shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold line-clamp-1">{session.title}</h4>
              <Badge variant={getStatusVariant(session.status)} className="shrink-0 text-xs">
                {getStatusLabel(session.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {session.subject && (
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {session.subject.replace('-', ' ')}
                </Badge>
              )}
              {session.enrolledStudents && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {session.enrolledStudents.length} students
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDateTime(session.date, session.time)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Main TutorOverview Component
const TutorOverviewShadcn = ({ onTabChange, focusNotificationsKey = 0 }) => {
  const { user } = useUser();
  const notificationsPanelRef = useRef(null);
  
  // Extract first name from email or Clerk user data
  const getFirstName = () => {
    if (!user) return 'Tutor';
    
    // Check Clerk's firstName property
    if (user.firstName) {
      return user.firstName;
    }
    
    // Check Clerk's fullName property
    if (user.fullName) {
      return user.fullName.split(' ')[0];
    }
    
    // Extract from primary email address
    if (user.primaryEmailAddress?.emailAddress) {
      const emailPrefix = user.primaryEmailAddress.emailAddress.split('@')[0];
      // Capitalize first letter
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    
    // Fallback to emailAddresses array
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      const emailPrefix = user.emailAddresses[0].emailAddress.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    
    return 'Tutor';
  };

  const { data: upcomingSessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ['tutorScheduledSessions'],
    queryFn: getTutorScheduledSessions,
  });

  const { data: sessionRequestsData, isLoading: loadingRequests } = useQuery({
    queryKey: ['sessionRequests'],
    queryFn: getSessionRequests,
  });

  const {
    data: dashboardNotificationsData,
    isLoading: loadingDashboardNotifications,
    refetch: refetchDashboardNotifications
  } = useQuery({
    queryKey: ['myDashboardNotifications', { status: 'all' }],
    queryFn: () => getMyDashboardNotifications({ page: 1, limit: 5, status: 'all' }),
    staleTime: 60 * 1000,
  });

  const upcomingSessions = (upcomingSessionsData?.data || []).filter(
    session => session.status !== 'completed' && session.status !== 'cancelled'
  );
  const sessionRequests = sessionRequestsData?.data || [];

  const allSessions = upcomingSessionsData?.data || [];
  const completedSessions = allSessions.filter(session => session.status === 'completed');

  // Calculate total earnings
  const totalEarnings = completedSessions.reduce((total, session) => {
    const students = session.enrolledStudentsCount || session.enrolledStudentsInfo?.length || session.currentStudents || 0;
    const feePerStudent = session.feePerStudent || 0;
    return total + (students * feePerStudent);
  }, 0);

  const completedSessionsCount = completedSessions.length;

  // Get unique enrolled students count
  const uniqueStudents = new Set();
  allSessions.forEach(session => {
    if (session.enrolledStudentsInfo && Array.isArray(session.enrolledStudentsInfo)) {
      session.enrolledStudentsInfo.forEach(student => {
        uniqueStudents.add(student.id);
      });
    }
  });
  const activeStudentsCount = uniqueStudents.size;

  const stats = [
    {
      title: 'Total Earnings',
      value: `Rs. ${totalEarnings.toLocaleString()}`,
      subtitle: `From ${completedSessionsCount} sessions`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: completedSessionsCount > 0 ? '+12%' : null
    },
    {
      title: 'Completed Sessions',
      value: completedSessionsCount.toString(),
      subtitle: 'Total completed',
      icon: CheckCircle2,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Students',
      value: activeStudentsCount.toString(),
      subtitle: 'Total enrolled',
      icon: Users,
      color: 'bg-purple-500',
      trend: activeStudentsCount > 0 ? '+5' : null
    },
    {
      title: 'Rating',
      value: '4.8',
      subtitle: 'Based on 89 reviews',
      icon: Star,
      color: 'bg-orange-500',
    }
  ];

  const dashboardNotifications = dashboardNotificationsData?.data?.notifications || [];
  const dashboardUnreadCount = dashboardNotificationsData?.data?.unreadCount || 0;
  const dashboardReadCount = dashboardNotifications.filter((item) => item.status === 'read').length;

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await markMyDashboardNotificationAsRead(notificationId);
      refetchDashboardNotifications();
    } catch (error) {
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllMyDashboardNotificationsAsRead();
      refetchDashboardNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error(error.message || 'Failed to mark all notifications as read');
    }
  };

  const handleDeleteReadNotification = async (notificationId) => {
    try {
      await deleteMyReadDashboardNotification(notificationId);
      refetchDashboardNotifications();
      toast.success('Read notification deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete read notification');
    }
  };

  const handleDeleteAllReadNotifications = async () => {
    try {
      await deleteAllMyReadDashboardNotifications();
      refetchDashboardNotifications();
      toast.success('Read notifications deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete read notifications');
    }
  };

  const handleOpenNotificationAction = (notification) => {
    if (!notification?.actionUrl) return;

    const normalizedActionUrl = notification.actionUrl.startsWith('/admin')
      ? notification.actionUrl.replace(/^\/admin(?=\?|$)/, '/admin-dashboard')
      : notification.actionUrl;

    window.location.assign(normalizedActionUrl);
  };

  useEffect(() => {
    if (!focusNotificationsKey) return;

    const timer = setTimeout(() => {
      notificationsPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [focusNotificationsKey]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Welcome back, {getFirstName()}!
              </h2>
              <p className="text-muted-foreground">
                Here's what's happening with your teaching today
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Award className="h-4 w-4 mr-1" />
              Top Rated
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} loading={loadingSessions} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <QuickActionCard
              title="Set Availability"
              icon={Calendar}
              onClick={() => onTabChange('schedule')}
              variant="default"
            />
            <QuickActionCard
              title="View Students"
              icon={UserPlus}
              onClick={() => onTabChange('schedule')}
              variant="outline"
            />
            <QuickActionCard
              title="Analytics"
              icon={BarChart3}
              onClick={() => onTabChange('schedule')}
              variant="outline"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription className="mt-1">
                  {upcomingSessions.length} scheduled
                </CardDescription>
              </div>
              {upcomingSessions.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onTabChange('schedule')}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loadingSessions ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No Upcoming Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any scheduled sessions yet
                </p>
                <Button onClick={() => onTabChange('requests')} size="sm">
                  <Target className="mr-2 h-4 w-4" />
                  View Requests
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            )}
          </CardContent>
          {upcomingSessions.length > 3 && (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => onTabChange('schedule')}
                >
                  View All Sessions
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Session Requests */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Session Requests
                </CardTitle>
                <CardDescription className="mt-1">
                  {sessionRequests.length} pending
                </CardDescription>
              </div>
              {sessionRequests.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onTabChange('requests')}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loadingRequests ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : sessionRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No Pending Requests</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! No new session requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionRequests.slice(0, 2).map((request) => (
                  <div key={request._id} onClick={() => onTabChange('requests')} className="cursor-pointer">
                    <SessionCard session={request} type="request" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {sessionRequests.length > 0 && (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => onTabChange('requests')}
                >
                  View All Requests
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>

      <Card ref={notificationsPanelRef}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Dashboard Notifications
              </CardTitle>
              <CardDescription className="mt-1">
                Messages sent to your role from admin dashboard
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Unread: {dashboardUnreadCount}</Badge>
              <Button size="sm" variant="outline" onClick={handleMarkAllNotificationsRead} disabled={dashboardUnreadCount === 0}>
                Mark All Read
              </Button>
              <Button size="sm" variant="outline" onClick={handleDeleteAllReadNotifications} disabled={dashboardReadCount === 0}>
                Delete Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingDashboardNotifications ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : dashboardNotifications.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No dashboard notifications yet.</div>
          ) : (
            <div className="space-y-2">
              {dashboardNotifications.map((item) => (
                <div key={item._id} className="p-3 rounded-lg border flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.actionUrl && (
                      <Button size="sm" variant="outline" onClick={() => handleOpenNotificationAction(item)}>
                        View
                      </Button>
                    )}
                    {item.status !== 'read' && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkNotificationRead(item._id)}>
                        Mark Read
                      </Button>
                    )}
                    {item.status === 'read' && (
                      <Button size="sm" variant="outline" onClick={() => handleDeleteReadNotification(item._id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Great Performance! 🎉</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You've completed {completedSessionsCount} sessions with a 4.8 star rating. Keep up the excellent work!
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {completedSessionsCount} Sessions
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Star className="h-3 w-3 mr-1" />
                  4.8 Rating
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Users className="h-3 w-3 mr-1" />
                  {activeStudentsCount} Students
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorOverviewShadcn;
