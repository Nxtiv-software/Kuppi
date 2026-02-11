import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Check, 
  X, 
  Filter,
  BookOpen,
  User,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
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
  getSessionRequests, 
  acceptSessionRequest, 
  declineSessionRequest, 
  scheduleSession, 
  getAcceptedSessions 
} from '../../services/api';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';

// Schedule Session Modal Component
const ScheduleSessionModal = ({ isOpen, onClose, pollData, onSchedule }) => {
  const [sessionDetails, setSessionDetails] = useState({
    date: '',
    time: '',
    feePerStudent: '',
    subject: pollData?.subject || '',
    topic: pollData?.chapter || '',
    duration: '2',
    maxStudents: pollData?.maxStudents || 20
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionDetails.date || !sessionDetails.time || !sessionDetails.feePerStudent) {
      toast.error('Missing Required Fields', {
        description: 'Please fill in all required fields'
      });
      return;
    }
    onSchedule(sessionDetails);
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
            Set up the session details for {pollData?.title}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={sessionDetails.subject}
              onChange={(e) => setSessionDetails({...sessionDetails, subject: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={sessionDetails.topic}
              onChange={(e) => setSessionDetails({...sessionDetails, topic: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={sessionDetails.date}
                onChange={(e) => setSessionDetails({...sessionDetails, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={sessionDetails.time}
                onChange={(e) => setSessionDetails({...sessionDetails, time: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">Fee per Student (Rs.) *</Label>
            <Input
              id="fee"
              type="number"
              value={sessionDetails.feePerStudent}
              onChange={(e) => setSessionDetails({...sessionDetails, feePerStudent: e.target.value})}
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              value={sessionDetails.duration}
              onChange={(e) => setSessionDetails({...sessionDetails, duration: e.target.value})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="1">1 hour</option>
              <option value="1.5">1.5 hours</option>
              <option value="2">2 hours</option>
              <option value="2.5">2.5 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Schedule Session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Helper Functions
const getSubjectDisplayName = (subject) => {
  const subjectMap = {
    'data-structures': 'Data Structures',
    'algorithms': 'Algorithms',
    'database': 'Database Systems',
    'web-dev': 'Web Development',
    'mobile-dev': 'Mobile Development',
    'combined-maths': 'Combined Mathematics',
    'physics': 'Physics',
    'chemistry': 'Chemistry'
  };
  return subjectMap[subject] || subject;
};

const getTimeSlotDisplay = (timeSlot) => {
  const timeSlotMap = {
    'morning': 'Morning (8AM - 12PM)',
    'afternoon': 'Afternoon (12PM - 4PM)',
    'evening': 'Evening (4PM - 8PM)'
  };
  return timeSlotMap[timeSlot] || timeSlot;
};

// Request Card Component
const RequestCard = ({ request, onAccept, onDecline }) => {
  const votePercentage = (request.voteCount / request.maxStudents) * 100;
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-1">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {request.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {getSubjectDisplayName(request.subject)} • {request.chapter}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="gap-1.5 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                {Math.round(votePercentage)}% Voted
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-3 w-3" />
                {getTimeSlotDisplay(request.timeSlot)}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Calendar className="h-3 w-3" />
                {new Date(request.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-flex flex-col items-end p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-3xl font-bold text-primary">
                {request.voteCount}
              </div>
              <div className="text-xs text-muted-foreground">
                of {request.maxStudents}
              </div>
              <div className="text-xs font-medium text-primary mt-1">
                interested
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm leading-relaxed text-foreground/90">
            {request.description}
          </p>
        </div>

        {/* Vote Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Vote Progress</span>
            <span className="text-muted-foreground">
              {request.voteCount} / {request.maxStudents} students
            </span>
          </div>
          <Progress value={votePercentage} className="h-2" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Created by</div>
              <div className="font-medium">{request.creator?.name || request.creatorInfo?.name || 'Unknown'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Capacity</div>
              <div className="font-medium">Max {request.maxStudents} students</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 gap-2"
            onClick={() => onAccept(request._id)}
          >
            <Check className="h-4 w-4" />
            Accept & Schedule
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => onDecline(request._id)}
          >
            <X className="h-4 w-4" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Accepted Session Card Component
const AcceptedSessionCard = ({ session, onSchedule }) => {
  const votePercentage = (session.voteCount / session.maxStudents) * 100;
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">
                  {session.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {session.chapter}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="gap-1.5 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Accepted
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                {getSubjectDisplayName(session.subject)}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-3 w-3" />
                {getTimeSlotDisplay(session.timeSlot)}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Calendar className="h-3 w-3" />
                {new Date(session.preferredDate).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{session.description}</p>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-semibold">{session.voteCount}</span> of <span className="font-semibold">{session.maxStudents}</span> students
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(votePercentage)}% capacity
          </div>
        </div>

        <Button 
          className="w-full gap-2"
          onClick={() => onSchedule(session)}
        >
          <Calendar className="h-4 w-4" />
          Schedule This Session
        </Button>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const RequestCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <Skeleton className="h-20 w-20 rounded-lg" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-2 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  </Card>
);

// Main Component
const SessionRequestsShadcn = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, pollData: null });
  const [declineDialog, setDeclineDialog] = useState({ isOpen: false, requestId: null });
  
  // Filter and search states
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUserId = user?.id;

  // Fetch session requests
  const { data: sessionRequests, isLoading, error } = useQuery({
    queryKey: ['sessionRequests'],
    queryFn: getSessionRequests,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch accepted sessions
  const { data: acceptedSessions, isLoading: acceptedLoading } = useQuery({
    queryKey: ['acceptedSessions'],
    queryFn: getAcceptedSessions,
    staleTime: 2 * 60 * 1000,
  });

  const handleAcceptRequest = async (pollId) => {
    try {
      await acceptSessionRequest(pollId);
      
      const pollData = sessionRequests.data.find(req => req._id === pollId);
      setScheduleModal({ isOpen: true, pollData });
      
      toast.success('Request Accepted!', {
        description: 'You can now schedule the session with students.'
      });
      
      queryClient.invalidateQueries(['sessionRequests']);
      queryClient.invalidateQueries(['acceptedSessions']);
    } catch (error) {
      toast.error('Failed to Accept', {
        description: error.message
      });
    }
  };

  const handleDeclineRequest = (pollId) => {
    setDeclineDialog({ isOpen: true, requestId: pollId });
  };

  const confirmDecline = async () => {
    try {
      await declineSessionRequest(declineDialog.requestId);
      toast.success('Request Declined', {
        description: 'The session request has been declined.'
      });
      queryClient.invalidateQueries(['sessionRequests']);
      setDeclineDialog({ isOpen: false, requestId: null });
    } catch (error) {
      toast.error('Failed to Decline', {
        description: error.message
      });
    }
  };

  const handleScheduleSession = async (sessionDetails) => {
    try {
      await scheduleSession(scheduleModal.pollData._id, sessionDetails);
      toast.success('Session Scheduled!', {
        description: 'Students who voted will see it in their dashboard.'
      });
      setScheduleModal({ isOpen: false, pollData: null });
      queryClient.invalidateQueries(['sessionRequests']);
      queryClient.invalidateQueries(['acceptedSessions']);
      queryClient.invalidateQueries(['tutorScheduledSessions']);
    } catch (error) {
      toast.error('Failed to Schedule', {
        description: error.message
      });
    }
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-3 py-8">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">Error loading session requests</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const requests = sessionRequests?.data || [];
  const accepted = acceptedSessions?.data || [];

  // Filter logic
  const filteredRequests = requests.filter(request => {
    if (request.status === 'accepted' || request.status === 'scheduled') return false;
    if (request.acceptedBy && request.acceptedBy.length > 0) return false;
    if (request.declinedBy && Array.isArray(request.declinedBy) && currentUserId) {
      if (request.declinedBy.includes(currentUserId)) return false;
    }
    return true;
  });

  // Apply search and filters
  const applyFiltersAndSearch = (sessions) => {
    let filtered = sessions;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(session => session.subject === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.chapter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const finalFilteredRequests = applyFiltersAndSearch(filteredRequests);

  // Get unique subjects for filters
  const subjects = [...new Set(filteredRequests.map(r => r.subject))];
  const filterCounts = {
    all: filteredRequests.length,
    ...subjects.reduce((acc, subject) => ({
      ...acc,
      [subject]: filteredRequests.filter(r => r.subject === subject).length
    }), {})
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {filteredRequests.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, subject, or chapter..."
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
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className="gap-2"
              >
                <Filter className="h-3.5 w-3.5" />
                All Subjects ({filterCounts.all || 0})
              </Button>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={activeFilter === subject ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(subject)}
                >
                  {getSubjectDisplayName(subject)} ({filterCounts[subject] || 0})
                </Button>
              ))}
            </div>

            {/* Active Filters */}
            {(activeFilter !== 'all' || searchTerm) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Active:</span>
                {activeFilter !== 'all' && (
                  <Badge variant="secondary">
                    {getSubjectDisplayName(activeFilter)}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary">
                    "{searchTerm}"
                  </Badge>
                )}
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Requests */}
      {isLoading ? (
        <div className="space-y-4">
          <RequestCardSkeleton />
          <RequestCardSkeleton />
        </div>
      ) : finalFilteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {filteredRequests.length === 0 ? (
              <>
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Session Requests</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  No polls have reached the 50% vote threshold yet. Check back soon!
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {finalFilteredRequests.length} of {filteredRequests.length} requests
            </p>
          </div>
          {finalFilteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
            />
          ))}
        </div>
      )}

      {/* Accepted Sessions Section */}
      <Separator className="my-8" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Accepted Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Sessions awaiting scheduling
            </p>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            {accepted.length} Pending
          </Badge>
        </div>

        {acceptedLoading ? (
          <RequestCardSkeleton />
        ) : accepted.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Accepted Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Accept a request above to schedule a session
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {accepted.map((session) => (
              <AcceptedSessionCard
                key={session._id}
                session={session}
                onSchedule={(sess) => setScheduleModal({ isOpen: true, pollData: sess })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ScheduleSessionModal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, pollData: null })}
        pollData={scheduleModal.pollData}
        onSchedule={handleScheduleSession}
      />

      <AlertDialog open={declineDialog.isOpen} onOpenChange={(open) => !open && setDeclineDialog({ isOpen: false, requestId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Session Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The request will be removed from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDecline} className="bg-destructive hover:bg-destructive/90">
              Decline Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionRequestsShadcn;
