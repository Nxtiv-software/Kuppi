import React, { useEffect, useMemo, useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Bell, 
  Settings,
  Shield,
  BarChart3,
  FileCheck2
} from "lucide-react";
import AdminOverviewShadcn from './AdminOverviewShadcn';
import UserManagementShadcn from './UserManagementShadcn';
import SessionManagementShadcn from './SessionManagementShadcn';
import PollManagementShadcn from './PollManagementShadcn';
import TutorApplicationsShadcn from './TutorApplicationsShadcn';
import PaymentFinanceShadcn from './PaymentFinanceShadcn';
import NotificationsCommunicationShadcn from './NotificationsCommunicationShadcn';
import SystemSettingsShadcn from './SystemSettingsShadcn';
import { cn } from '../../utils/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import { Badge } from '../../components/badge';
import { ThemeToggle } from '../../components/ThemeToggle';
import { getAdminUnreadNotificationCount } from '../../services/adminApi';

const AdminDashboardShadcn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => new Set([
    'overview',
    'users',
    'sessions',
    'polls',
    'tutor-applications',
    'payments',
    'notifications',
    'settings'
  ]), []);

  const resolveTabFromSearch = (search) => {
    const tab = new URLSearchParams(search).get('tab');
    return tab && validTabs.has(tab) ? tab : 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => resolveTabFromSearch(location.search));
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState(false);

  const fetchUnreadNotificationCount = async () => {
    try {
      setLoadingUnreadCount(true);
      const count = await getAdminUnreadNotificationCount();
      setUnreadNotificationCount(count || 0);
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error);
    } finally {
      setLoadingUnreadCount(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotificationCount();
    
    const interval = setInterval(() => {
      fetchUnreadNotificationCount();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchUnreadNotificationCount();
    }
  }, [activeTab]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header - Fixed with iOS Liquid Glass Effect */}
      <header className="flex-none z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-12 mx-auto">
          <div className="flex">
            <a className="flex items-center space-x-2" href="/">
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-lg font-bold">
                Kuppi.lk <span className="text-red-600">Admin</span>
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
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-muted">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="gap-2 data-[state=active]:bg-muted">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="polls" className="gap-2 data-[state=active]:bg-muted">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Polls</span>
              </TabsTrigger>
              <TabsTrigger value="tutor-applications" className="gap-2 data-[state=active]:bg-muted">
                <FileCheck2 className="h-4 w-4" />
                <span className="hidden sm:inline">Tutor Apps</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-muted">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-muted relative">
                <div className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-700 rounded-full"
                    >
                      {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-muted">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-3">
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
              <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
              <p className="text-muted-foreground">
                Platform overview and system management
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Management Header */}
      {activeTab === 'users' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
              <p className="text-muted-foreground">
                Manage students, tutors, and user permissions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Management Header */}
      {activeTab === 'sessions' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Session Management</h2>
              <p className="text-muted-foreground">
                Monitor and manage all platform sessions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Poll Management Header */}
      {activeTab === 'polls' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Poll Management</h2>
              <p className="text-muted-foreground">
                Manage student polls and approval workflow
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tutor Applications Header */}
      {activeTab === 'tutor-applications' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tutor Applications</h2>
              <p className="text-muted-foreground">
                Review and manage student requests to become tutors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payments Header */}
      {activeTab === 'payments' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
              <p className="text-muted-foreground">
                Track transactions, payouts, and revenue
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Header */}
      {activeTab === 'notifications' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Notifications & Communication</h2>
              <p className="text-muted-foreground">
                Send platform announcements and messages
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Header */}
      {activeTab === 'settings' && (
        <div className="flex-none z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5">
          <div className="container max-w-screen-2xl px-12 py-6 mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
              <p className="text-muted-foreground">
                Configure platform settings and preferences
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
              <AdminOverviewShadcn onTabChange={setActiveTab} />
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-0">
              <UserManagementShadcn setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6 mt-0">
              <SessionManagementShadcn />
            </TabsContent>

            <TabsContent value="polls" className="space-y-6 mt-0">
              <PollManagementShadcn />
            </TabsContent>

            <TabsContent value="tutor-applications" className="space-y-6 mt-0">
              <TutorApplicationsShadcn />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6 mt-0">
              <PaymentFinanceShadcn />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-0">
              <NotificationsCommunicationShadcn />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-0">
              <SystemSettingsShadcn />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardShadcn;
