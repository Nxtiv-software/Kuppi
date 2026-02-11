import React, { useState } from 'react';
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

const NotificationsCommunicationShadcn = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });

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
    type: 'info'
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

  const notifications = [
    {
      id: 1,
      title: 'Session Starting Soon',
      message: 'Your session "Advanced Calculus" starts in 15 minutes',
      type: 'reminder',
      audience: 'Selected Users',
      sentDate: '2026-02-11',
      sentTime: '02:15 PM',
      delivered: 245,
      opened: 198,
      status: 'sent'
    },
    {
      id: 2,
      title: 'Payment Confirmation',
      message: 'Your payment of Rs. 300 has been successfully processed',
      type: 'success',
      audience: 'Individual',
      sentDate: '2026-02-11',
      sentTime: '10:30 AM',
      delivered: 1,
      opened: 1,
      status: 'sent'
    },
    {
      id: 3,
      title: 'New Session Available',
      message: 'New Quantum Physics session available for enrollment',
      type: 'info',
      audience: 'Students',
      sentDate: '2026-02-10',
      sentTime: '04:00 PM',
      delivered: 1420,
      opened: 892,
      status: 'sent'
    }
  ];

  const reminders = [
    {
      id: 1,
      name: 'Session Reminder',
      description: 'Remind students 15 minutes before session starts',
      trigger: '15 minutes before session',
      audience: 'Students',
      status: 'active',
      lastSent: '2026-02-11',
      sentCount: 145
    },
    {
      id: 2,
      name: 'Payment Due',
      description: 'Remind students about pending payments',
      trigger: '1 day before due date',
      audience: 'Students',
      status: 'active',
      lastSent: '2026-02-10',
      sentCount: 23
    },
    {
      id: 3,
      name: 'Tutor Payout Notification',
      description: 'Notify tutors when payout is processed',
      trigger: 'On payout completion',
      audience: 'Tutors',
      status: 'active',
      lastSent: '2026-02-08',
      sentCount: 12
    },
    {
      id: 4,
      name: 'Inactive User Re-engagement',
      description: 'Send reminder to users inactive for 7 days',
      trigger: '7 days of inactivity',
      audience: 'All Users',
      status: 'paused',
      lastSent: '2026-02-05',
      sentCount: 78
    }
  ];

  const handleCreateAnnouncement = () => {
    toast.success('Announcement created successfully');
    setShowNewAnnouncement(false);
    setAnnouncementForm({ title: '', message: '', audience: 'all', priority: 'normal' });
  };

  const handleSendNotification = () => {
    toast.success('Notification sent successfully');
    setShowNewNotification(false);
    setNotificationForm({ title: '', message: '', audience: 'all', type: 'info' });
  };

  const handleDelete = () => {
    toast.success('Item deleted successfully');
    setDeleteDialog({ isOpen: false, id: null });
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
      sent: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Sent' },
      active: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Active' },
      paused: { className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', label: 'Paused' }
    };
    const config = variants[status] || variants.draft;
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {announcements.filter(a => a.status === 'published').length} published
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notifications Sent</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Today</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Reminders</p>
                <p className="text-2xl font-bold">{reminders.filter(r => r.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {reminders.filter(r => r.status === 'paused').length} paused
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">2,090</p>
                <p className="text-xs text-muted-foreground mt-1">Across all content</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          <TabsTrigger value="reminders">Automated Reminders</TabsTrigger>
        </TabsList>

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
                        <th className="text-left p-4 font-medium text-sm">OPENED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notif) => (
                        <tr key={notif.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(notif.type)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{notif.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{notif.message}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{notif.audience}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{formatDate(notif.sentDate)}</div>
                            <div className="text-xs text-muted-foreground">{notif.sentTime}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{notif.delivered}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{notif.opened}</div>
                            <div className="text-xs text-muted-foreground">
                              {((notif.opened / notif.delivered) * 100).toFixed(1)}% rate
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(notif.status)}
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
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className={cn(
                  "border-l-4",
                  reminder.status === 'active' ? "border-l-green-500" : "border-l-orange-500"
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
                            <p className="font-medium">{reminder.trigger}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Audience</p>
                            <p className="font-medium">{reminder.audience}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Sent</p>
                            <p className="font-medium">{formatDate(reminder.lastSent)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Sent</p>
                            <p className="font-medium">{reminder.sentCount} times</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {reminder.status === 'active' ? (
                          <Button size="sm" variant="outline" className="gap-2">
                            Pause
                          </Button>
                        ) : (
                          <Button size="sm" className="gap-2">
                            Activate
                          </Button>
                        )}
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
