import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  Paperclip,
  Megaphone,
  MessageCircle,
  CheckCircle2,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  BookOpen,
  Link as LinkIcon,
  X,
  Upload,
  AlertCircle,
  Award,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Skeleton } from '../../components/ui/skeleton';
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
import { 
  getTutorScheduledSessions, 
  addMeetingLink, 
  addSessionAttachment, 
  addSessionAnnouncement, 
  markSessionCompleted 
} from '../../services/api';
import WhatsAppGroupManager from '../../components/WhatsAppGroupManager';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';

// Helper Functions
const getStudentCount = (session) => {
  if (session.enrolledStudentsInfo && Array.isArray(session.enrolledStudentsInfo)) {
    return session.enrolledStudentsInfo.length;
  }
  if (typeof session.enrolledStudents === 'number') return session.enrolledStudents;
  if (typeof session.students === 'number') return session.students;
  if (Array.isArray(session.students)) return session.students.length;
  return 0;
};

// Meeting Link Dialog
const MeetingLinkDialog = ({ isOpen, onClose, session, onSave }) => {
  const [meetingLink, setMeetingLink] = useState(session?.meetingLink || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingLink.trim()) {
      toast.error('Missing Link', { description: 'Please enter a meeting link' });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, meetingLink);
      setMeetingLink('');
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            {session?.meetingLink ? 'Update' : 'Add'} Meeting Link
          </DialogTitle>
          <DialogDescription>
            Share the online meeting link with your students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link *</Label>
            <Input
              id="meetingLink"
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Zoom, Google Meet, or any meeting platform link
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              <LinkIcon className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Attachment Dialog
const AttachmentDialog = ({ isOpen, onClose, session, onSave }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Missing File', { description: 'Please select a file to upload' });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, file, description);
      setFile(null);
      setDescription('');
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-primary" />
            Add Attachment
          </DialogTitle>
          <DialogDescription>
            Share study materials and resources with students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
              required
            />
            <p className="text-xs text-muted-foreground">
              PDF, Word, PowerPoint, Images (Max 10MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Brief description of this file..."
              rows="3"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Upload className="h-4 w-4" />
              {isLoading ? 'Uploading...' : 'Upload File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Announcement Dialog
const AnnouncementDialog = ({ isOpen, onClose, session, onSave }) => {
  const [announcement, setAnnouncement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      toast.error('Missing Announcement', { description: 'Please enter an announcement' });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, announcement);
      setAnnouncement('');
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Add Special Announcement
          </DialogTitle>
          <DialogDescription>
            Share important information with all enrolled students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement">Announcement *</Label>
            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Important information for students..."
              rows="4"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to all students enrolled in this session
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Megaphone className="h-4 w-4" />
              {isLoading ? 'Posting...' : 'Post Announcement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className={cn("text-3xl font-bold", color)}>{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", `bg-${color.replace('text-', '')}/10`)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Session Card Component
const SessionCard = ({ session, onMeetingLink, onAttachment, onAnnouncement, onWhatsApp, onMarkCompleted }) => {
  const isToday = session.date && new Date(session.date).toDateString() === new Date().toDateString();
  const isCompleted = session.status === 'completed';
  const studentCount = getStudentCount(session);
  const totalEarnings = (session.feePerStudent || 0) * studentCount;

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 hover:scale-[1.01]",
      isCompleted && "opacity-60",
      isToday && !isCompleted && "border-green-500 bg-green-50/50 dark:bg-green-950/20"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg mt-1",
                isCompleted ? "bg-muted" : "bg-primary/10"
              )}>
                <BookOpen className={cn("h-5 w-5", isCompleted ? "text-muted-foreground" : "text-primary")} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className={cn("text-xl", isCompleted && "text-muted-foreground")}>
                    {session.subject || session.title}
                  </CardTitle>
                  {isCompleted && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  {isToday && !isCompleted && (
                    <Badge className="gap-1 bg-green-600">
                      <Clock className="h-3 w-3" />
                      Today
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {session.topic || session.chapter}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant={isCompleted ? "secondary" : "default"}>
                {session.status === 'scheduled' || session.status === 'upcoming' ? 'Upcoming' : 
                 session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Video className="h-3 w-3" />
                {session.sessionType || 'Online'}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <div className={cn(
              "inline-flex flex-col items-end p-3 rounded-lg border",
              isCompleted ? "bg-muted border-border" : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
            )}>
              <div className={cn("text-2xl font-bold", isCompleted ? "text-muted-foreground" : "text-green-600 dark:text-green-400")}>
                Rs. {totalEarnings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Rs. {session.feePerStudent || 0}/student
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">
                {new Date(session.scheduledDate || session.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="font-medium">{session.scheduledTime || session.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Students</div>
              <div className="font-medium">{studentCount} enrolled</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">{session.duration || '2 hours'}</div>
            </div>
          </div>
        </div>

        {/* Resource Indicators */}
        {(session.meetingLink || (session.attachments && session.attachments.length > 0) || 
          (session.announcements && session.announcements.length > 0)) && (
          <div className="flex flex-wrap gap-2">
            {session.meetingLink && (
              <Badge variant="secondary" className="gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                <LinkIcon className="h-3 w-3" />
                Meeting Link Added
              </Badge>
            )}
            {session.attachments && session.attachments.length > 0 && (
              <Badge variant="secondary" className="gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                <Paperclip className="h-3 w-3" />
                {session.attachments.length} File{session.attachments.length > 1 ? 's' : ''}
              </Badge>
            )}
            {session.announcements && session.announcements.length > 0 && (
              <Badge variant="secondary" className="gap-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                <Megaphone className="h-3 w-3" />
                {session.announcements.length} Announcement{session.announcements.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Session Resources</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
              onClick={() => onMeetingLink(session)}
            >
              <Video className="h-4 w-4" />
              {session.meetingLink ? 'Update Link' : 'Add Meeting'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
              onClick={() => onWhatsApp(session)}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Group
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
              onClick={() => onAttachment(session)}
            >
              <Paperclip className="h-4 w-4" />
              Add File
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
              onClick={() => onAnnouncement(session)}
            >
              <Megaphone className="h-4 w-4" />
              Announce
            </Button>

            {!isCompleted && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 justify-start text-green-600 hover:text-green-700 dark:text-green-400"
                onClick={() => onMarkCompleted(session)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Done
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const SessionCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <Skeleton className="h-20 w-24 rounded-lg" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

// Main Component
const MyScheduleShadcn = () => {
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  // Modal states
  const [meetingModal, setMeetingModal] = useState({ isOpen: false, session: null });
  const [attachmentModal, setAttachmentModal] = useState({ isOpen: false, session: null });
  const [announcementModal, setAnnouncementModal] = useState({ isOpen: false, session: null });
  const [whatsappModal, setWhatsappModal] = useState({ isOpen: false, session: null });
  const [completeDialog, setCompleteDialog] = useState({ isOpen: false, session: null });

  // Filter states
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch sessions
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['tutorScheduledSessions'],
    queryFn: getTutorScheduledSessions,
    enabled: isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  // Handlers
  const handleAddMeetingLink = async (sessionId, meetingLink) => {
    try {
      await addMeetingLink(sessionId, meetingLink);
      toast.success('Meeting Link Added!', {
        description: 'Students can now join your session'
      });
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error('Failed to Add Link', { description: error.message });
      throw error;
    }
  };

  const handleAddAttachment = async (sessionId, file, description) => {
    try {
      await addSessionAttachment(sessionId, file, description);
      toast.success('File Uploaded!', {
        description: 'Students can now access this resource'
      });
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error('Upload Failed', { description: error.message });
      throw error;
    }
  };

  const handleAddAnnouncement = async (sessionId, announcement) => {
    try {
      await addSessionAnnouncement(sessionId, announcement);
      toast.success('Announcement Posted!', {
        description: 'All students have been notified'
      });
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error('Failed to Post', { description: error.message });
      throw error;
    }
  };

  const confirmMarkCompleted = async () => {
    try {
      await markSessionCompleted(completeDialog.session._id);
      toast.success('Session Completed!', {
        description: 'Great work on completing this session'
      });
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
      setCompleteDialog({ isOpen: false, session: null });
    } catch (error) {
      toast.error('Failed to Complete', { description: error.message });
    }
  };

  if (!isSignedIn) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please sign in to view your schedule.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-3 py-8">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">Error loading schedule</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessions = sessionsData?.data?.filter(s => s.status !== 'ready_to_schedule') || [];

  // Apply filters
  const filteredSessions = sessions.filter(session => {
    const isCompleted = session.status === 'completed';
    const isToday = session.date && new Date(session.date).toDateString() === new Date().toDateString();

    if (activeFilter === 'upcoming' && isCompleted) return false;
    if (activeFilter === 'completed' && !isCompleted) return false;
    if (activeFilter === 'today' && (!isToday || isCompleted)) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (session.title && session.title.toLowerCase().includes(searchLower)) ||
        (session.subject && session.subject.toLowerCase().includes(searchLower)) ||
        (session.topic && session.topic.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Sort sessions
  const sortedSessions = filteredSessions.sort((a, b) => {
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';

    if (aCompleted === bCompleted && a.date && b.date) {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return aCompleted ? bDate - aDate : aDate - bDate;
    }

    return aCompleted ? 1 : -1;
  });

  // Calculate stats
  const upcomingSessions = sessions.filter(s => s.status !== 'completed');
  const totalStudents = upcomingSessions.reduce((acc, s) => acc + getStudentCount(s), 0);
  const totalHours = upcomingSessions.reduce((acc, s) => {
    const duration = s.duration ? parseFloat(s.duration) : 2;
    return acc + duration;
  }, 0);
  const totalEarnings = upcomingSessions.reduce((acc, s) => {
    return acc + ((s.feePerStudent || 0) * getStudentCount(s));
  }, 0);

  const filterCounts = {
    upcoming: sessions.filter(s => s.status !== 'completed').length,
    today: sessions.filter(s => 
      s.date && new Date(s.date).toDateString() === new Date().toDateString() && s.status !== 'completed'
    ).length,
    completed: sessions.filter(s => s.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={CalendarIcon}
          label="Sessions Scheduled"
          value={upcomingSessions.length}
          color="text-blue-600"
          loading={isLoading}
        />
        <StatsCard
          icon={Users}
          label="Total Students"
          value={totalStudents}
          color="text-green-600"
          loading={isLoading}
        />
        <StatsCard
          icon={Clock}
          label="Teaching Hours"
          value={`${totalHours}h`}
          color="text-purple-600"
          loading={isLoading}
        />
        <StatsCard
          icon={DollarSign}
          label="Expected Earnings"
          value={`Rs. ${(totalEarnings / 1000).toFixed(1)}K`}
          color="text-orange-600"
          loading={isLoading}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions by title, subject, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
              { key: 'today', label: 'Today', icon: Clock },
              { key: 'completed', label: 'Completed', icon: CheckCircle2 }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className="gap-2"
              >
                <filter.icon className="h-3.5 w-3.5" />
                {filter.label} ({filterCounts[filter.key]})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {isLoading ? (
        <div className="space-y-4">
          <SessionCardSkeleton />
          <SessionCardSkeleton />
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Scheduled Sessions</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Accept session requests to see them here!
            </p>
          </CardContent>
        </Card>
      ) : sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveFilter('upcoming');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {sortedSessions.length} of {sessions.length} sessions
            </p>
          </div>
          {sortedSessions.map((session) => (
            <SessionCard
              key={session._id || session.id}
              session={session}
              onMeetingLink={(sess) => setMeetingModal({ isOpen: true, session: sess })}
              onAttachment={(sess) => setAttachmentModal({ isOpen: true, session: sess })}
              onAnnouncement={(sess) => setAnnouncementModal({ isOpen: true, session: sess })}
              onWhatsApp={(sess) => setWhatsappModal({ isOpen: true, session: sess })}
              onMarkCompleted={(sess) => setCompleteDialog({ isOpen: true, session: sess })}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <MeetingLinkDialog
        isOpen={meetingModal.isOpen}
        onClose={() => setMeetingModal({ isOpen: false, session: null })}
        session={meetingModal.session}
        onSave={handleAddMeetingLink}
      />

      <AttachmentDialog
        isOpen={attachmentModal.isOpen}
        onClose={() => setAttachmentModal({ isOpen: false, session: null })}
        session={attachmentModal.session}
        onSave={handleAddAttachment}
      />

      <AnnouncementDialog
        isOpen={announcementModal.isOpen}
        onClose={() => setAnnouncementModal({ isOpen: false, session: null })}
        session={announcementModal.session}
        onSave={handleAddAnnouncement}
      />

      {whatsappModal.isOpen && whatsappModal.session && (
        <WhatsAppGroupManager
          session={whatsappModal.session}
          isTutor={true}
          onClose={() => setWhatsappModal({ isOpen: false, session: null })}
        />
      )}

      <AlertDialog 
        open={completeDialog.isOpen} 
        onOpenChange={(open) => !open && setCompleteDialog({ isOpen: false, session: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Session as Completed?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{completeDialog.session?.title}" as completed? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMarkCompleted}>
              Mark as Completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyScheduleShadcn;
