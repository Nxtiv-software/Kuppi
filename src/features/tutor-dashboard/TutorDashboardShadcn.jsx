import React, { useEffect, useMemo, useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Calendar, BookOpen, MessageCircle, GraduationCap, Bell } from "lucide-react";
import TutorOverviewShadcn from './TutorOverviewShadcn';
import SessionRequestsShadcn from './SessionRequestsShadcn';
import MyScheduleShadcn from './MyScheduleShadcn';
import CreateSessionShadcn from './CreateSessionShadcn';
import StudentFeedbackShadcn from './StudentFeedbackShadcn';
import { cn } from '../../utils/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import { ThemeToggle } from '../../components/ThemeToggle';
import { getMyDashboardNotifications } from '../../services/api';

const TutorDashboardShadcn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => new Set([
    'overview',
    'requests',
    'schedule',
    'create-session',
    'feedback'
  ]), []);

  const resolveTabFromSearch = (search) => {
    const tab = new URLSearchParams(search).get('tab');
    return tab && validTabs.has(tab) ? tab : 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => resolveTabFromSearch(location.search));
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [focusNotificationsKey, setFocusNotificationsKey] = useState(0);

  const handleBellClick = () => {
    setActiveTab('overview');
    setFocusNotificationsKey((prev) => prev + 1);
  };

  const fetchUnreadNotificationCount = async () => {
    try {
      const response = await getMyDashboardNotifications({ page: 1, limit: 1, status: 'all' });
      setUnreadNotificationCount(response?.data?.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch tutor unread notifications:', error);
    }
  };

  useEffect(() => {
    fetchUnreadNotificationCount();
    const interval = setInterval(fetchUnreadNotificationCount, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tabFromUrl = resolveTabFromSearch(location.search);
    setActiveTab((currentTab) => (currentTab === tabFromUrl ? currentTab : tabFromUrl));
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate(
        {
          pathname: location.pathname,
          search: `?${params.toString()}`
        },
        { replace: true }
      );
    }
  }, [activeTab, location.pathname, location.search, navigate]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header - Fixed with iOS Liquid Glass Effect */}
      <header className="flex-none z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-12 mx-auto">
          <div className="flex">
            <a className="flex items-center space-x-2" href="/">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg font-bold">
                Kuppi.lk
              </span>
            </a>
          </div>
          
          {/* Navigation Tabs - Centered */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="absolute left-1/2 transform -translate-x-1/2">
            <TabsList className="h-10 bg-transparent border-0 p-0">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-muted">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 data-[state=active]:bg-muted">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Session Requests</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-muted">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">My Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="create-session" className="gap-2 data-[state=active]:bg-muted">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Create Session</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="gap-2 data-[state=active]:bg-muted">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBellClick}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent transition-colors"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] leading-5 text-center font-semibold">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2.25rem",
                    height: "2.25rem",
                  },
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Overview Header - iOS Liquid Glass Effect */}
      {activeTab === 'overview' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tutor Dashboard</h2>
              <p className="text-muted-foreground">
                Manage your sessions, schedule, and student interactions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Requests Header - iOS Liquid Glass Effect */}
      {activeTab === 'requests' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Session Requests</h2>
              <p className="text-muted-foreground">
                Review and accept student session requests
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Schedule Header - iOS Liquid Glass Effect */}
      {activeTab === 'schedule' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Schedule</h2>
              <p className="text-muted-foreground">
                View and manage your teaching schedule
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Header - iOS Liquid Glass Effect */}
      {activeTab === 'create-session' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Create Session</h2>
              <p className="text-muted-foreground">
                Set up a new teaching session for students
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Header - iOS Liquid Glass Effect */}
      {activeTab === 'feedback' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Student Feedback</h2>
              <p className="text-muted-foreground">
                View ratings and reviews from your students
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6 mt-0">
              <TutorOverviewShadcn onTabChange={setActiveTab} focusNotificationsKey={focusNotificationsKey} />
            </TabsContent>

            <TabsContent value="requests" className="space-y-6 mt-0">
              <SessionRequestsShadcn />
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6 mt-0">
              <MyScheduleShadcn />
            </TabsContent>

            <TabsContent value="create-session" className="space-y-6 mt-0">
              <CreateSessionShadcn />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6 mt-0">
              <StudentFeedbackShadcn />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardShadcn;
