import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Users,
  DollarSign,
  Calendar as CalendarIcon,
  Video,
  BookOpen,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
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
import { getAllSessions, deleteSession } from '../../services/adminApi';

const SessionManagementShadcn = () => {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, sessionId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Map frontend status to backend status
  const statusMap = {
    'all': 'all',
    'scheduled': 'scheduled',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };

  // Fetch sessions
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['adminSessions', activeView, currentPage, subjectFilter],
    queryFn: () => getAllSessions({
      page: currentPage,
      limit,
      status: statusMap[activeView] || 'all',
      subject: subjectFilter
    }),
    keepPreviousData: true,
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSessions']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('Session deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete session');
    }
  });

  const sessions = sessionsData?.data?.sessions || [];
  const totalSessions = sessionsData?.data?.total || 0;
  const totalPages = Math.ceil(totalSessions / limit);

  const handleSessionAction = (action, sessionId) => {
    setActionDialog({ isOpen: true, action, sessionId });
  };

  const confirmAction = () => {
    const { action, sessionId } = actionDialog;
    
    if (action === 'delete') {
      deleteSessionMutation.mutate(sessionId);
    }
    
    setActionDialog({ isOpen: false, action: null, sessionId: null });
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Scheduled' },
      completed: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'Cancelled' },
      active: { className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', label: 'Active' }
    };
    const config = variants[status] || variants.scheduled;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Failed to load sessions</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {error?.message || 'An error occurred while fetching sessions'}
              </p>
              <Button size="sm" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredPendingSessions = pendingSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="gap-2">
            Pending Approvals
            <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              {pendingSessions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Sessions</TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            Live Sessions
            <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
              {liveSessions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Pending Approvals Tab */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Session Approvals</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPendingSessions.length > 0 ? (
                filteredPendingSessions.map((session) => (
                  <Card key={session.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{session.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{session.tutor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{session.students} students interested</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>Rs. {session.price}/student</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Requested for:</span>
                            <span className="text-muted-foreground">
                              {formatDate(session.requestedDate)} {session.startTime} - {session.endTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{session.subject}</Badge>
                            <Badge variant="secondary">{session.level}</Badge>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleSessionAction('approve', session.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                            onClick={() => handleSessionAction('reject', session.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setSelectedSession(session)}
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending sessions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Sessions Tab */}
        <TabsContent value="scheduled" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{session.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{session.tutor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{session.students} students enrolled</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>Rs. {session.price}/student</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Scheduled:</span>
                          <span className="text-muted-foreground">
                            {formatDate(session.scheduledDate)} {session.startTime} - {session.endTime}
                          </span>
                        </div>

                        <Badge variant="outline">{session.subject}</Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Sessions Tab */}
        <TabsContent value="live" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Video className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">{session.tutor}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {session.participants}/{session.students} participants
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{session.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Live Now
                          </Badge>
                          <Badge variant="outline">{session.subject}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Monitor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSession.title}</DialogTitle>
              <DialogDescription>Session details and information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tutor</p>
                  <p className="font-medium">{selectedSession.tutor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedSession.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Interested</p>
                  <p className="font-medium">{selectedSession.students}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Student</p>
                  <p className="font-medium">Rs. {selectedSession.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedSession.requestedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedSession.startTime} - {selectedSession.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedSession.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">{selectedSession.level}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedSession.description}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  handleSessionAction('approve', selectedSession.id);
                  setSelectedSession(null);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, action: null, sessionId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'approve' && 'Are you sure you want to approve this session? The tutor will be notified and students can enroll.'}
              {actionDialog.action === 'reject' && 'Are you sure you want to reject this session? The tutor will be notified of the rejection.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionManagementShadcn;
