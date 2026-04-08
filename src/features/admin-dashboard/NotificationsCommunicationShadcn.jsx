import React, { useEffect, useMemo, useState } from 'react';
import {
  Megaphone,
  Bell,
  Clock,
  Send,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Info,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';
import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  getCommunicationCampaigns,
  sendCommunicationCampaign,
  getReminderRules,
  createReminderRule,
  updateReminderRule,
  toggleReminderRuleStatus,
  runReminderRule
} from '../../services/adminApi';

const NotificationsCommunicationShadcn = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [reminderRules, setReminderRules] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    message: '',
    audience: 'all',
    actionUrl: '',
    customRecipientEmails: ''
  });
  const [reminderForm, setReminderForm] = useState({
    name: '',
    description: '',
    triggerLabel: '',
    audience: 'students',
    channel: 'email',
    scheduleType: 'one_time',
    scheduledFor: '',
    repeatEveryMinutes: '',
    templateSubject: '',
    templateMessage: '',
    actionUrl: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    audience: 'all',
    priority: 'normal'
  });

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    audience: 'all',
    type: 'info',
    actionUrl: '',
    customRecipientEmails: ''
  });

  const announcements = [
    {
      id: 1,
      title: 'Platform Maintenance Schedule',
      message: 'System maintenance scheduled for February 15, 2026, from 2:00 AM to 4:00 AM. Limited service availability expected.',
      audience: 'All Users',
      priority: 'high',
      status: 'published',
      publishedDate: '2026-02-08',
      views: 1234,
      type: 'maintenance'
    },
    {
      id: 2,
      title: 'New Subject Added: Data Science',
      message: 'We are excited to announce the addition of Data Science sessions to our platform. Students can now enroll in specialized data science courses.',
      audience: 'Students',
      priority: 'normal',
      status: 'published',
      publishedDate: '2026-02-05',
      views: 856,
      type: 'feature'
    },
    {
      id: 3,
      title: 'Tutor Verification Process Update',
      message: 'Updated tutor verification requirements now include additional qualification documents. All pending applications will be reviewed under new guidelines.',
      audience: 'Tutors',
      priority: 'normal',
      status: 'draft',
      publishedDate: null,
      views: 0,
      type: 'policy'
    }
  ];

  const outgoingNotifications = campaigns;
  const reminders = reminderRules;

  const handleCreateAnnouncement = () => {
    toast.success('Announcement created successfully');
    setShowNewAnnouncement(false);
    setAnnouncementForm({ title: '', message: '', audience: 'all', priority: 'normal' });
  };

  const fetchCampaignData = async () => {
    try {
      setCampaignLoading(true);
      const response = await getCommunicationCampaigns({ page: 1, limit: 20 });
      setCampaigns(response?.data?.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch communication campaigns:', error);
      toast.error('Failed to load sent notifications');
    } finally {
      setCampaignLoading(false);
    }
  };

  const fetchReminderData = async () => {
    try {
      setReminderLoading(true);
      const response = await getReminderRules({ page: 1, limit: 20 });
      setReminderRules(response?.data?.reminders || []);
    } catch (error) {
      console.error('Failed to fetch reminder rules:', error);
      toast.error('Failed to load reminders');
    } finally {
      setReminderLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      const customRecipientEmails = notificationForm.audience === 'custom'
        ? notificationForm.customRecipientEmails?.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

      await sendCommunicationCampaign({
        title: notificationForm.title,
        message: notificationForm.message,
        audience: notificationForm.audience,
        actionUrl: notificationForm.actionUrl || '',
        customRecipientEmails
      });

      toast.success('Notification sent successfully');
      setShowNewNotification(false);
      setNotificationForm({ title: '', message: '', audience: 'all', type: 'info', actionUrl: '', customRecipientEmails: '' });
      fetchCampaignData();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const handleSaveReminder = async () => {
    try {
      const payload = {
        name: reminderForm.name,
        description: reminderForm.description,
        triggerLabel: reminderForm.triggerLabel,
        audience: reminderForm.audience,
        channel: reminderForm.channel,
        scheduleType: reminderForm.scheduleType,
        scheduledFor: reminderForm.scheduledFor || undefined,
        repeatEveryMinutes: reminderForm.repeatEveryMinutes ? Number(reminderForm.repeatEveryMinutes) : undefined,
        templateSubject: reminderForm.templateSubject,
        templateMessage: reminderForm.templateMessage,
        actionUrl: reminderForm.actionUrl || ''
      };

      if (editingReminderId) {
        await updateReminderRule(editingReminderId, payload);
        toast.success('Reminder updated successfully');
      } else {
        await createReminderRule(payload);
        toast.success('Reminder created successfully');
      }

      setShowNewReminder(false);
      setEditingReminderId(null);
      setReminderForm({
        name: '',
        description: '',
        triggerLabel: '',
        audience: 'students',
        channel: 'email',
        scheduleType: 'one_time',
        scheduledFor: '',
        repeatEveryMinutes: '',
        templateSubject: '',
        templateMessage: '',
        actionUrl: ''
      });
      fetchReminderData();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to save reminder');
    }
  };

  const handleDelete = () => {
    toast.success('Item deleted successfully');
    setDeleteDialog({ isOpen: false, id: null });
  };

  const handleEditReminder = (reminder) => {
    setEditingReminderId(reminder._id);
    setReminderForm({
      name: reminder.name || '',
      description: reminder.description || '',
      triggerLabel: reminder.triggerLabel || reminder.trigger || '',
      audience: reminder.audience || 'students',
      channel: reminder.channel || 'email',
      scheduleType: reminder.scheduleType || 'one_time',
      scheduledFor: reminder.scheduledFor ? String(reminder.scheduledFor).slice(0, 16) : '',
      repeatEveryMinutes: reminder.repeatEveryMinutes ? String(reminder.repeatEveryMinutes) : '',
      templateSubject: reminder.templateSubject || reminder.name || '',
      templateMessage: reminder.templateMessage || reminder.description || '',
      actionUrl: reminder.actionUrl || ''
    });
    setShowNewReminder(true);
  };

  const handleToggleReminder = async (reminderId) => {
    try {
      await toggleReminderRuleStatus(reminderId);
      toast.success('Reminder status updated');
      fetchReminderData();
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      toast.error('Failed to update reminder status');
    }
  };

  const handleRunReminder = async (reminderId) => {
    try {
      await runReminderRule(reminderId);
      toast.success('Reminder run completed');
      fetchReminderData();
    } catch (error) {
      console.error('Failed to run reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to run reminder');
    }
  };

  const fetchInboxNotifications = async (pageNumber = page) => {
    try {
      setNotificationLoading(true);
      const response = await getAdminNotifications({
        page: pageNumber,
        limit: 20,
        status: statusFilter,
        category: categoryFilter,
        severity: severityFilter
      });

      const data = response?.data || {};
      setAdminNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (error) {
      console.error('Failed to fetch admin inbox notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAdminNotificationAsRead(notificationId);
      toast.success('Notification marked as read');
      fetchInboxNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      toast.success('All notifications marked as read');
      fetchInboxNotifications(1);
      setPage(1);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleViewAction = (actionUrl, notification) => {
    if (!actionUrl) return;

    let normalizedActionUrl = actionUrl.startsWith('/admin')
      ? actionUrl.replace(/^\/admin(?=\?|$)/, '/admin-dashboard')
      : actionUrl;

    try {
      const redirectUrl = new URL(normalizedActionUrl, window.location.origin);
      const isPollTab = redirectUrl.searchParams.get('tab') === 'polls';
      const hasPollStatus = Boolean(redirectUrl.searchParams.get('pollStatus'));
      const isForceClosedNotification =
        (notification?.title || '').toLowerCase().includes('force closed') ||
        (notification?.message || '').toLowerCase().includes('force-closed');

      if (isPollTab && !hasPollStatus && isForceClosedNotification) {
        redirectUrl.searchParams.set('pollStatus', 'expired');
        normalizedActionUrl = `${redirectUrl.pathname}${redirectUrl.search}`;
      }
    } catch (error) {
      // Fallback to normalizedActionUrl if URL parsing fails
    }

    window.location.assign(normalizedActionUrl);
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: { className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'High Priority' },
      normal: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Normal' },
      low: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300', label: 'Low Priority' }
    };
    const config = variants[priority] || variants.normal;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      published: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Published' },
      draft: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300', label: 'Draft' },
      sending: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Sending' },
      sent: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Sent' },
      failed: { className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'Failed' },
      active: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Active' },
      paused: { className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', label: 'Paused' },
      completed: { className: 'bg-muted text-muted-foreground', label: 'Completed' },
      unread: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Unread' },
      read: { className: 'bg-muted text-muted-foreground', label: 'Read' }
    };
    const config = variants[status] || variants.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const variants = {
      tutor_application: { className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', label: 'Tutor App' },
      session: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Session' },
      poll: { className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300', label: 'Poll' },
      integration: { className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', label: 'Integration' },
      system: { className: 'bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300', label: 'System' }
    };
    const config = variants[category] || variants.system;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      critical: { className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'Critical' },
      warning: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300', label: 'Warning' },
      info: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Info' }
    };
    const config = variants[severity] || variants.info;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'feature': return <Info className="h-4 w-4 text-blue-600" />;
      case 'policy': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'reminder': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (activeTab === 'inbox') {
      fetchInboxNotifications(page);
    }
  }, [activeTab, page, statusFilter, categoryFilter, severityFilter]);

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchCampaignData();
    }

    if (activeTab === 'reminders') {
      fetchReminderData();
    }
  }, [activeTab]);

  const filteredInboxNotifications = useMemo(() => {
    if (!searchTerm.trim()) return adminNotifications;
    const keyword = searchTerm.toLowerCase();
    return adminNotifications.filter((item) =>
      String(item.title || '').toLowerCase().includes(keyword) ||
      String(item.message || '').toLowerCase().includes(keyword)
    );
  }, [adminNotifications, searchTerm]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const criticalTodayCount = adminNotifications.filter(
    (item) => item.severity === 'critical' && new Date(item.createdAt) >= today
  ).length;

  const warningTodayCount = adminNotifications.filter(
    (item) => item.severity === 'warning' && new Date(item.createdAt) >= today
  ).length;

  const totalThisWeekCount = adminNotifications.filter(
    (item) => new Date(item.createdAt) >= weekStart
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Notifications</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Today</p>
                <p className="text-2xl font-bold">{criticalTodayCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Immediate attention</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings Today</p>
                <p className="text-2xl font-bold">{warningTodayCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Monitor closely</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Info className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total This Week</p>
                <p className="text-2xl font-bold">{totalThisWeekCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Recent activity</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox">Admin Inbox</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          <TabsTrigger value="reminders">Automated Reminders</TabsTrigger>
        </TabsList>

        {/* Admin Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Admin Inbox Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => fetchInboxNotifications(page)}>
                      <Filter className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button className="gap-2" onClick={handleMarkAllAsRead}>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark All Read
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Categories</option>
                    <option value="tutor_application">Tutor Applications</option>
                    <option value="session">Sessions</option>
                    <option value="poll">Polls</option>
                    <option value="integration">Integrations</option>
                    <option value="system">System</option>
                  </select>

                  <select
                    value={severityFilter}
                    onChange={(e) => {
                      setSeverityFilter(e.target.value);
                      setPage(1);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {notificationLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Loading notifications...</div>
              ) : filteredInboxNotifications.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  No notifications found for current filters.
                </div>
              ) : (
                filteredInboxNotifications.map((item) => (
                  <Card
                    key={item._id}
                    className={cn(
                      'border-l-4',
                      item.severity === 'critical' && 'border-l-red-500',
                      item.severity === 'warning' && 'border-l-yellow-500',
                      item.severity === 'info' && 'border-l-blue-500'
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(item.category)}
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                          </div>

                          <p className="text-sm text-muted-foreground">{item.message}</p>

                          <div className="flex items-center gap-3 flex-wrap">
                            {getStatusBadge(item.status)}
                            {getSeverityBadge(item.severity)}
                            {getCategoryBadge(item.category)}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDateTime(item.createdAt)}</span>
                            </div>
                            {item.sourceType && (
                              <Badge variant="outline">{item.sourceType}</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {item.actionUrl && (
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => handleViewAction(item.actionUrl, item)}>
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          )}

                          {item.status !== 'read' && (
                            <Button size="sm" className="gap-2" onClick={() => handleMarkAsRead(item._id)}>
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page || page} of {pagination.totalPages || 1}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1 || notificationLoading}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={notificationLoading || page >= (pagination.totalPages || 1)}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Platform Announcements</CardTitle>
                <Button className="gap-2" onClick={() => setShowNewAnnouncement(true)}>
                  <Plus className="h-4 w-4" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(announcement.type)}
                          <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{announcement.message}</p>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          {getStatusBadge(announcement.status)}
                          {getPriorityBadge(announcement.priority)}
                          <Badge variant="outline">{announcement.audience}</Badge>
                          {announcement.publishedDate && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(announcement.publishedDate)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{announcement.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {announcement.status === 'draft' && (
                          <Button size="sm" className="gap-2">
                            <Send className="h-4 w-4" />
                            Publish
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => setDeleteDialog({ isOpen: true, id: announcement.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Push & Email Notifications</CardTitle>
                <Button className="gap-2" onClick={() => setShowNewNotification(true)}>
                  <Send className="h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">TYPE</th>
                        <th className="text-left p-4 font-medium text-sm">TITLE</th>
                        <th className="text-left p-4 font-medium text-sm">AUDIENCE</th>
                        <th className="text-left p-4 font-medium text-sm">SENT</th>
                        <th className="text-left p-4 font-medium text-sm">DELIVERED</th>
                        <th className="text-left p-4 font-medium text-sm">FAILED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignLoading ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                            Loading campaigns...
                          </td>
                        </tr>
                      ) : campaigns.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                            No campaigns sent yet.
                          </td>
                        </tr>
                      ) : campaigns.map((campaign) => (
                        <tr key={campaign._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(campaign.audience === 'students' ? 'info' : campaign.audience === 'tutors' ? 'success' : 'reminder')}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{campaign.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{campaign.message}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{String(campaign.audience || 'all').replace('_', ' ')}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{formatDateTime(campaign.sentAt || campaign.createdAt)}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{campaign.deliveredCount || 0}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{campaign.failedCount || 0}</div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(campaign.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automated Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Automated Reminders</CardTitle>
                <Button className="gap-2" onClick={() => {
                  setEditingReminderId(null);
                  setReminderForm({
                    name: '',
                    description: '',
                    triggerLabel: '',
                    audience: 'students',
                    channel: 'email',
                    scheduleType: 'one_time',
                    scheduledFor: '',
                    repeatEveryMinutes: '',
                    templateSubject: '',
                    templateMessage: '',
                    actionUrl: ''
                  });
                  setShowNewReminder(true);
                }}>
                  <Plus className="h-4 w-4" />
                  New Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminderLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading reminders...</div>
              ) : reminders.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No reminders created yet.</div>
              ) : reminders.map((reminder) => (
                <Card key={reminder._id} className={cn(
                  "border-l-4",
                  reminder.status === 'active'
                    ? "border-l-green-500"
                    : reminder.status === 'completed'
                      ? "border-l-gray-500"
                      : "border-l-orange-500"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{reminder.name}</h3>
                          {getStatusBadge(reminder.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Trigger</p>
                            <p className="font-medium">{reminder.triggerLabel || reminder.trigger}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Audience</p>
                            <p className="font-medium">{reminder.audience}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Sent</p>
                            <p className="font-medium">{formatDate(reminder.lastRunAt || reminder.lastSent)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Sent</p>
                            <p className="font-medium">{reminder.runCount || reminder.sentCount || 0} times</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleEditReminder(reminder)}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {reminder.status === 'active' ? (
                          <Button size="sm" variant="outline" className="gap-2" onClick={() => handleToggleReminder(reminder._id)}>
                            Pause
                          </Button>
                        ) : (
                          <Button size="sm" className="gap-2" onClick={() => handleToggleReminder(reminder._id)}>
                            Activate
                          </Button>
                        )}
                        <Button size="sm" variant="secondary" className="gap-2" onClick={() => handleRunReminder(reminder._id)}>
                          <Send className="h-4 w-4" />
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Announcement Dialog */}
      <Dialog open={showNewAnnouncement} onOpenChange={setShowNewAnnouncement}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>Send an important message to your platform users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Announcement title..."
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Announcement message..."
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Audience</label>
                <select
                  value={announcementForm.audience}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, audience: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="tutors">Tutors Only</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  value={announcementForm.priority}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement}>
              Create Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Notification Dialog */}
      <Dialog open={showNewNotification} onOpenChange={setShowNewNotification}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Push Notification</DialogTitle>
            <DialogDescription>Send an instant notification to selected users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Notification title..."
                value={notificationForm.title}
                onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Notification message..."
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Audience</label>
                <select
                  value={notificationForm.audience}
                  onChange={(e) => setNotificationForm({ ...notificationForm, audience: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="tutors">Tutors Only</option>
                  <option value="admins">Admins Only</option>
                  <option value="custom">Custom Emails</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Action URL</label>
              <Input
                placeholder="/admin-dashboard?tab=..."
                value={notificationForm.actionUrl}
                onChange={(e) => setNotificationForm({ ...notificationForm, actionUrl: e.target.value })}
              />
            </div>
            {notificationForm.audience === 'custom' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Recipient Emails</label>
                <Textarea
                  placeholder="one@email.com, two@email.com"
                  value={notificationForm.customRecipientEmails}
                  onChange={(e) => setNotificationForm({ ...notificationForm, customRecipientEmails: e.target.value })}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewNotification(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} className="gap-2">
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={showNewReminder} onOpenChange={setShowNewReminder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReminderId ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
            <DialogDescription>Configure an automated email reminder rule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                placeholder="Session Reminder"
                value={reminderForm.name}
                onChange={(e) => setReminderForm({ ...reminderForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe what this reminder does..."
                value={reminderForm.description}
                onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Trigger Label</label>
              <Input
                placeholder="15 minutes before session starts"
                value={reminderForm.triggerLabel}
                onChange={(e) => setReminderForm({ ...reminderForm, triggerLabel: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Audience</label>
                <select
                  value={reminderForm.audience}
                  onChange={(e) => setReminderForm({ ...reminderForm, audience: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="students">Students</option>
                  <option value="tutors">Tutors</option>
                  <option value="admins">Admins</option>
                  <option value="all">All Users</option>
                  <option value="custom">Custom Emails</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Channel</label>
                <select
                  value={reminderForm.channel}
                  onChange={(e) => setReminderForm({ ...reminderForm, channel: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Schedule Type</label>
                <select
                  value={reminderForm.scheduleType}
                  onChange={(e) => setReminderForm({ ...reminderForm, scheduleType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="one_time">One Time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Scheduled For</label>
                <Input
                  type="datetime-local"
                  value={reminderForm.scheduledFor}
                  onChange={(e) => setReminderForm({ ...reminderForm, scheduledFor: e.target.value })}
                />
              </div>
            </div>
            {reminderForm.scheduleType === 'recurring' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Repeat Every Minutes</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="60"
                  value={reminderForm.repeatEveryMinutes}
                  onChange={(e) => setReminderForm({ ...reminderForm, repeatEveryMinutes: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Template Subject</label>
              <Input
                placeholder="Reminder subject..."
                value={reminderForm.templateSubject}
                onChange={(e) => setReminderForm({ ...reminderForm, templateSubject: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Template Message</label>
              <Textarea
                placeholder="Reminder message..."
                value={reminderForm.templateMessage}
                onChange={(e) => setReminderForm({ ...reminderForm, templateMessage: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Action URL</label>
              <Input
                placeholder="/admin-dashboard?tab=..."
                value={reminderForm.actionUrl}
                onChange={(e) => setReminderForm({ ...reminderForm, actionUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewReminder(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReminder} className="gap-2">
              <Send className="h-4 w-4" />
              {editingReminderId ? 'Update Reminder' : 'Create Reminder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationsCommunicationShadcn;
