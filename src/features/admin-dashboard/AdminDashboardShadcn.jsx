import React, { useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Bell, 
  Settings,
  Shield
} from "lucide-react";
import AdminOverviewShadcn from './AdminOverviewShadcn';
import UserManagementShadcn from './UserManagementShadcn';
import SessionManagementShadcn from './SessionManagementShadcn';
import PaymentFinanceShadcn from './PaymentFinanceShadcn';
import NotificationsCommunicationShadcn from './NotificationsCommunicationShadcn';
import SystemSettingsShadcn from './SystemSettingsShadcn';
import { cn } from '../../utils/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import { ThemeToggle } from '../../components/ThemeToggle';

const AdminDashboardShadcn = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
              <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-muted">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-muted">
                <Bell className="h-4 w-4" />
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
