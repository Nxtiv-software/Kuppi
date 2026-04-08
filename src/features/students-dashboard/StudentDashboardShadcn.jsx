import React, { useEffect, useMemo, useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BarChart3, FileText, TrendingUp, Home, Bell } from "lucide-react";
import OverviewShadcn from './OverviewShadcn';
import VoteCreateShadcn from './VoteCreateShadcn';
import MySessionsShadcn from './MySessionsShadcn';
import ProgressShadcn from './ProgressShadcn';
import BrowseKuppisShadcn from './BrowseKuppiShadcn';
import { cn } from '../../utils/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import { ThemeToggle } from '../../components/ThemeToggle';
import { getMyDashboardNotifications } from '../../services/api';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => new Set([
    'overview',
    'browse',
    'vote-create',
    'my-sessions',
    'progress'
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
      console.error('Failed to fetch student unread notifications:', error);
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
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-bold">
                Kuppi.lk
              </span>
            </a>
          </div>
          
          {/* Navigation Tabs - Centered */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="absolute left-1/2 transform -translate-x-1/2">
            <TabsList className="h-10 bg-transparent border-0 p-0">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-muted">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="browse" className="gap-2 data-[state=active]:bg-muted">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </TabsTrigger>
              <TabsTrigger value="vote-create" className="gap-2 data-[state=active]:bg-muted">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Vote & Create</span>
              </TabsTrigger>
              <TabsTrigger value="my-sessions" className="gap-2 data-[state=active]:bg-muted">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">My Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-2 data-[state=active]:bg-muted">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
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

      {/* Dashboard Title Section (Only for Overview) - iOS Liquid Glass Effect */}
      {activeTab === 'overview' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, Garuka! Here's your learning overview.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Browse Sessions Header - iOS Liquid Glass Effect */}
      {activeTab === 'browse' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Browse Sessions</h2>
              <p className="text-muted-foreground">
                Find and join available study sessions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vote & Create Header - iOS Liquid Glass Effect */}
      {activeTab === 'vote-create' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Vote & Create</h2>
              <p className="text-muted-foreground">
                Vote on session topics and create new polls
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Sessions Header - iOS Liquid Glass Effect */}
      {activeTab === 'my-sessions' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Sessions</h2>
              <p className="text-muted-foreground">
                View and manage your scheduled learning sessions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Header - iOS Liquid Glass Effect */}
      {activeTab === 'progress' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Learning Progress</h2>
              <p className="text-muted-foreground">
                Track your learning journey and achievements
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
            <OverviewShadcn onTabChange={setActiveTab} focusNotificationsKey={focusNotificationsKey} />
          </TabsContent>

          <TabsContent value="browse" className="space-y-6 mt-0">
            <BrowseKuppisShadcn />
          </TabsContent>

          <TabsContent value="vote-create" className="space-y-6 mt-0">
            <VoteCreateShadcn />
          </TabsContent>

          <TabsContent value="my-sessions" className="space-y-6 mt-0">
            <MySessionsShadcn />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-0">
            <ProgressShadcn />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
