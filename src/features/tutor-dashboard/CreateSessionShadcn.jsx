import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  FileText
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
  createTutorSession, 
  getTutorCreatedSessions, 
  scheduleTutorSession, 
  markSessionCompleted 
} from '../../services/api';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';

// Schedule Session Dialog
const ScheduleSessionDialog = ({ isOpen, onClose, session, onScheduleSession }) => {
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scheduleData.date || !scheduleData.time) {
      toast.error('Missing Information', { description: 'Please select date and time' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onScheduleSession(session._id, scheduleData);
      setScheduleData({ date: '', time: '' });
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Session
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{session?.title}</span>
            <br />
            {session?.interestedStudents?.length || 0} students interested
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={scheduleData.date}
              onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              value={scheduleData.time}
              onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Create Session Dialog
const CreateSessionDialog = ({ isOpen, onClose, onCreateSession }) => {
  const { user } = useUser();
  const [sessionData, setSessionData] = useState({
    title: '',
    subject: 'combined-maths',
    topic: '',
    description: '',
    duration: '2',
    feePerStudent: '',
    studentLimitType: 'limited',
    maxStudents: '',
    minStudents: '',
    expectedDate: '',
    expectedTime: '',
    schedulingNote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionData.title || !sessionData.topic || !sessionData.description || !sessionData.feePerStudent || !sessionData.expectedDate || !sessionData.expectedTime) {
      toast.error('Missing Required Fields', { description: 'Please fill in all required fields including expected date and time' });
      return;
    }

    if (sessionData.studentLimitType === 'limited' && (!sessionData.maxStudents || sessionData.maxStudents < 1)) {
      toast.error('Invalid Student Limit', { description: 'Please specify maximum number of students' });
      return;
    }

    if (sessionData.studentLimitType === 'minimum' && (!sessionData.minStudents || sessionData.minStudents < 1)) {
      toast.error('Invalid Minimum', { description: 'Please specify minimum number of students' });
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionPayload = {
        ...sessionData,
        tutorId: user.id,
        tutorName: user.fullName || user.firstName || 'Anonymous Tutor',
        tutorEmail: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '',
        maxStudents: sessionData.studentLimitType === 'unlimited' ? 999 :
          sessionData.studentLimitType === 'limited' ? parseInt(sessionData.maxStudents) :
            parseInt(sessionData.minStudents) * 2,
        minStudents: sessionData.studentLimitType === 'minimum' ? parseInt(sessionData.minStudents) : 1,
        status: 'open_for_interest'
      };

      await onCreateSession(sessionPayload);
      setSessionData({
        title: '',
        subject: 'combined-maths',
        topic: '',
        description: '',
        duration: '2',
        feePerStudent: '',
        studentLimitType: 'limited',
        maxStudents: '',
        minStudents: '',
        expectedDate: '',
        expectedTime: '',
        schedulingNote: ''
      });
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Session
          </DialogTitle>
          <DialogDescription>
            Set up a new teaching session for students to discover
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={sessionData.title}
                onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                placeholder="e.g., Advanced Calculus Workshop"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <select
                id="subject"
                value={sessionData.subject}
                onChange={(e) => setSessionData({ ...sessionData, subject: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="combined-maths">Combined Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={sessionData.topic}
              onChange={(e) => setSessionData({ ...sessionData, topic: e.target.value })}
              placeholder="e.g., Integration by Parts"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={sessionData.description}
              onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Describe what students will learn in this session..."
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                value={sessionData.duration}
                onChange={(e) => setSessionData({ ...sessionData, duration: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="1">1 Hour</option>
                <option value="1.5">1.5 Hours</option>
                <option value="2">2 Hours</option>
                <option value="2.5">2.5 Hours</option>
                <option value="3">3 Hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Fee per Student (Rs.) *</Label>
              <Input
                id="fee"
                type="number"
                value={sessionData.feePerStudent}
                onChange={(e) => setSessionData({ ...sessionData, feePerStudent: e.target.value })}
                min="0"
                placeholder="500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitType">Student Limit Type *</Label>
            <select
              id="limitType"
              value={sessionData.studentLimitType}
              onChange={(e) => setSessionData({ ...sessionData, studentLimitType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="limited">Limited Students (Set Maximum)</option>
              <option value="unlimited">Unlimited Students</option>
              <option value="minimum">Minimum Students Required</option>
            </select>
          </div>

          {sessionData.studentLimitType === 'limited' && (
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Maximum Students *</Label>
              <Input
                id="maxStudents"
                type="number"
                value={sessionData.maxStudents}
                onChange={(e) => setSessionData({ ...sessionData, maxStudents: e.target.value })}
                min="1"
                max="50"
                placeholder="20"
                required
              />
            </div>
          )}

          {sessionData.studentLimitType === 'minimum' && (
            <div className="space-y-2">
              <Label htmlFor="minStudents">Minimum Students Required *</Label>
              <Input
                id="minStudents"
                type="number"
                value={sessionData.minStudents}
                onChange={(e) => setSessionData({ ...sessionData, minStudents: e.target.value })}
                min="1"
                max="25"
                placeholder="5"
                required
              />
              <p className="text-xs text-muted-foreground">
                Session will only be scheduled if this many students show interest
              </p>
            </div>
          )}

          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label className="text-base font-semibold">Expected Schedule</Label>
            <p className="text-xs text-muted-foreground">
              When do you expect to conduct this session? This helps students plan ahead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Date *</Label>
              <Input
                id="expectedDate"
                type="date"
                value={sessionData.expectedDate}
                onChange={(e) => setSessionData({ ...sessionData, expectedDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedTime">Expected Time *</Label>
              <Input
                id="expectedTime"
                type="time"
                value={sessionData.expectedTime}
                onChange={(e) => setSessionData({ ...sessionData, expectedTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedulingNote">Scheduling Note (Optional)</Label>
            <textarea
              id="schedulingNote"
              value={sessionData.schedulingNote}
              onChange={(e) => setSessionData({ ...sessionData, schedulingNote: e.target.value })}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Any additional notes about scheduling..."
              rows="2"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Session'}
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
          <Skeleton className="h-16 w-full" />
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
const SessionCard = ({ session, onSchedule, onMarkCompleted }) => {
  const isReadyToSchedule = session.status === 'ready_to_schedule' || 
    (session.status === 'open_for_interest' && (session.interestedStudents?.length || 0) >= session.minStudents);
  const isScheduled = session.status === 'scheduled' || session.status === 'upcoming';
  const isCompleted = session.status === 'completed';

  const getStatusBadge = () => {
    switch (session.status) {
      case 'open_for_interest':
        return <Badge variant="secondary" className="gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
          <Sparkles className="h-3 w-3" />
          Open for Interest
        </Badge>;
      case 'ready_to_schedule':
        return <Badge className="gap-1 bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Ready to Schedule
        </Badge>;
      case 'upcoming':
      case 'scheduled':
        return <Badge variant="secondary" className="gap-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
          <Calendar className="h-3 w-3" />
          Upcoming
        </Badge>;
      case 'completed':
        return <Badge variant="secondary" className="gap-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>;
      default:
        return <Badge variant="secondary">{session.status}</Badge>;
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300",
      isReadyToSchedule && "border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20",
      isCompleted && "opacity-75 bg-gray-50/50 dark:bg-gray-900/20"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg mt-1",
                isReadyToSchedule ? "bg-green-500/10" : isCompleted ? "bg-gray-500/10" : "bg-primary/10"
              )}>
                <BookOpen className={cn(
                  "h-5 w-5", 
                  isReadyToSchedule ? "text-green-600 dark:text-green-400" : 
                  isCompleted ? "text-gray-600 dark:text-gray-400" : 
                  "text-primary"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  {isReadyToSchedule && (
                    <Badge variant="outline" className="gap-1 text-green-600 dark:text-green-400">
                      <Target className="h-3 w-3" />
                      Priority
                    </Badge>
                  )}
                  {isScheduled && session.date && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {session.subject} • {session.topic}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {session.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">{session.duration}h</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fee/Student</div>
              <div className="font-medium">Rs. {session.feePerStudent}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{session.displayLabel || 'Students'}</div>
              <div className="font-medium">{session.displayCount || 0}</div>
            </div>
          </div>

          {session.studentLimitType === 'minimum' && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded-md bg-blue-500/10">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Min Students</div>
                <div className="font-medium">{session.minStudents || 1}</div>
              </div>
            </div>
          )}

          {session.studentLimitType === 'limited' && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded-md bg-purple-500/10">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Max Students</div>
                <div className="font-medium">{session.maxStudents}</div>
              </div>
            </div>
          )}

          {session.studentLimitType === 'unlimited' && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded-md bg-purple-500/10">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Capacity</div>
                <div className="font-medium">Unlimited</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-green-500/10">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
              <div className="font-medium text-green-600">Rs. {session.totalRevenue || 0}</div>
            </div>
          </div>
        </div>

        {isReadyToSchedule && !isCompleted && (
          <>
            <Separator />
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100 mb-1">Ready to Schedule!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You have enough interested students to schedule this session.
                  </p>
                </div>
                <Button onClick={() => onSchedule(session)} className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </div>
          </>
        )}

        {isScheduled && !isCompleted && (
          <>
            <Separator />
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">Session Scheduled</p>
                  {session.date && (
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {new Date(session.date).toLocaleDateString()} at {session.time}
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={() => onMarkCompleted(session)} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Done
                </Button>
              </div>
            </div>
          </>
        )}

        {isCompleted && (
          <>
            <Separator />
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Session Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.date && new Date(session.date).toLocaleDateString()} • {session.enrolledStudentsCount || 0} students attended
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const SessionCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Component
const CreateSessionShadcn = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [completeDialog, setCompleteDialog] = useState({ isOpen: false, session: null });

  // Filter states
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch sessions (including completed when filter is 'completed' or 'all')
  const includeCompleted = activeFilter === 'completed' || activeFilter === 'all';
  const { data: createdSessions, isLoading, error } = useQuery({
    queryKey: ['tutorCreatedSessions', includeCompleted],
    queryFn: () => getTutorCreatedSessions(includeCompleted),
    staleTime: 2 * 60 * 1000,
  });

  // Handlers
  const handleCreateSession = async (sessionData) => {
    try {
      await createTutorSession(sessionData);
      toast.success('Session Created!', {
        description: 'Your session is now available in Browse Kuppi for students.'
      });
      queryClient.invalidateQueries({ queryKey: ['tutorCreatedSessions'] });
      queryClient.invalidateQueries(['availableSessions']);
    } catch (error) {
      toast.error('Failed to Create', { description: error.message });
      throw error;
    }
  };

  const handleScheduleSession = async (sessionId, scheduleData) => {
    try {
      await scheduleTutorSession(sessionId, scheduleData);
      toast.success('Session Scheduled!', {
        description: 'Students will be notified about the session.'
      });
      queryClient.invalidateQueries({ queryKey: ['tutorCreatedSessions'] });
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
      setScheduleModal(false);
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to Schedule', { description: error.message });
      throw error;
    }
  };

  const confirmMarkCompleted = async () => {
    try {
      await markSessionCompleted(completeDialog.session._id);
      toast.success('Session Completed!', {
        description: 'Great work on completing this session'
      });
      queryClient.invalidateQueries({ queryKey: ['tutorCreatedSessions'] });
      queryClient.invalidateQueries(['availableSessions']);
      setCompleteDialog({ isOpen: false, session: null });
    } catch (error) {
      toast.error('Failed to Complete', { description: error.message });
    }
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-3 py-8">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">Error loading sessions</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessions = createdSessions?.data || [];

  // Apply filters
  const filteredSessions = sessions.filter(session => {
    if (activeFilter !== 'all' && session.status !== activeFilter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        session.title.toLowerCase().includes(searchLower) ||
        session.subject.toLowerCase().includes(searchLower) ||
        session.topic.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate stats
  const filterCounts = {
    all: sessions.length,
    open_for_interest: sessions.filter(s => s.status === 'open_for_interest').length,
    ready_to_schedule: sessions.filter(s => s.status === 'ready_to_schedule').length,
    scheduled: sessions.filter(s => s.status === 'scheduled' || s.status === 'upcoming').length,
    completed: sessions.filter(s => s.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {sessions.length} total session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Session
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          icon={BookOpen}
          label="Total Sessions"
          value={sessions.length}
          color="text-blue-600"
          loading={isLoading}
        />
        <StatsCard
          icon={TrendingUp}
          label="Ready to Schedule"
          value={filterCounts.ready_to_schedule}
          color="text-green-600"
          loading={isLoading}
        />
        <StatsCard
          icon={Calendar}
          label="Scheduled"
          value={filterCounts.scheduled}
          color="text-purple-600"
          loading={isLoading}
        />
        <StatsCard
          icon={Sparkles}
          label="Open for Interest"
          value={filterCounts.open_for_interest}
          color="text-orange-600"
          loading={isLoading}
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={filterCounts.completed}
          color="text-gray-600"
          loading={isLoading}
        />
      </div>

      {/* Search and Filters */}
      {sessions.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, subject, or topic..."
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
                { key: 'all', label: 'All Sessions' },
                { key: 'ready_to_schedule', label: 'Ready to Schedule' },
                { key: 'scheduled', label: 'Scheduled' },
                { key: 'open_for_interest', label: 'Open for Interest' },
                { key: 'completed', label: 'Completed' }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.key)}
                  className="gap-2"
                >
                  <Filter className="h-3.5 w-3.5" />
                  {filter.label} ({filterCounts[filter.key] || 0})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Sessions Created Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create your first session to start teaching!
            </p>
            <Button onClick={() => setCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : filteredSessions.length === 0 ? (
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
                setActiveFilter('all');
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
              Showing {filteredSessions.length} of {sessions.length} sessions
            </p>
          </div>
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onSchedule={(sess) => {
                setSelectedSession(sess);
                setScheduleModal(true);
              }}
              onMarkCompleted={(sess) => setCompleteDialog({ isOpen: true, session: sess })}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateSessionDialog
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onCreateSession={handleCreateSession}
      />

      <ScheduleSessionDialog
        isOpen={scheduleModal}
        onClose={() => {
          setScheduleModal(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onScheduleSession={handleScheduleSession}
      />

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

export default CreateSessionShadcn;
