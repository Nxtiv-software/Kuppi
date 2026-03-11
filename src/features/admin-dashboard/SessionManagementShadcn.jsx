import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  Video,
  BookOpen,
  AlertCircle,
  Search,
  Loader2,
  Trash2,
  PlayCircle,
  StopCircle,
  Archive,
  Heart,
  UserCheck,
  Ban,
  FileText
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
import { getAllSessions, deleteSession, cancelSession, forceEndSession } from '../../services/adminApi';

const SessionManagementShadcn = () => {
  const queryClient = useQueryClient();
  const [activeMainTab, setActiveMainTab] = useState('browse'); // 'browse' or 'scheduled'
  const [activeSubTab, setActiveSubTab] = useState('open_interest'); // For Browse Kuppi
  const [activeScheduledTab, setActiveScheduledTab] = useState('all'); // For Scheduled Sessions
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, sessionId: null, sessionTitle: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Get the appropriate status for API call
  const getStatusForAPI = () => {
    if (activeMainTab === 'browse') {
      // Map frontend tab values to database status values
      if (activeSubTab === 'open_interest') {
        return 'open_for_interest';
      }
      return activeSubTab;
    } else {
      return activeScheduledTab;
    }
  };

  // Fetch sessions
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['adminSessions', activeMainTab, activeSubTab, activeScheduledTab, currentPage, searchTerm],
    queryFn: () => getAllSessions({
      page: currentPage,
      limit,
      status: getStatusForAPI(),
      search: searchTerm
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

  // Cancel session mutation
  const cancelSessionMutation = useMutation({
    mutationFn: ({ sessionId, reason }) => cancelSession(sessionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSessions']);
      toast.success('Session cancelled and notifications sent');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel session');
    }
  });

  // Force end session mutation
  const forceEndSessionMutation = useMutation({
    mutationFn: forceEndSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSessions']);
      toast.success('Session ended and data saved');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to end session');
    }
  });

  const sessions = sessionsData?.data?.sessions || [];
  const totalSessions = sessionsData?.data?.total || 0;
  const totalPages = Math.ceil(totalSessions / limit);

  // Get counts for each tab
  const counts = sessionsData?.data?.counts || {};

  const handleSessionAction = (action, sessionId, sessionTitle = '') => {
    setActionDialog({ isOpen: true, action, sessionId, sessionTitle });
  };

  const confirmAction = () => {
    const { action, sessionId } = actionDialog;
    
    switch(action) {
      case 'delete':
        deleteSessionMutation.mutate(sessionId);
        break;
      case 'cancel':
        cancelSessionMutation.mutate({ sessionId, reason: 'Cancelled by admin' });
        break;
      case 'forceEnd':
        forceEndSessionMutation.mutate(sessionId);
        break;
      default:
        break;
    }
    
    setActionDialog({ isOpen: false, action: null, sessionId: null, sessionTitle: null });
  };

  const getStatusBadge = (status) => {
    const variants = {
      open_for_interest: { 
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', 
        label: 'Open to Interest',
        icon: Heart
      },
      ready_to_schedule: { 
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', 
        label: 'Ready to Schedule',
        icon: UserCheck
      },
      scheduled: { 
        className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300', 
        label: 'Scheduled',
        icon: CalendarIcon
      },
      upcoming: { 
        className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300', 
        label: 'Upcoming',
        icon: CalendarIcon
      },
      ongoing: { 
        className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', 
        label: 'Ongoing',
        icon: PlayCircle
      },
      completed: { 
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300', 
        label: 'Completed',
        icon: CheckCircle2
      },
      cancelled: { 
        className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', 
        label: 'Cancelled',
        icon: Ban
      }
    };
    const config = variants[status] || variants.upcoming;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeleteActionConfig = (status) => {
    const configs = {
      open_for_interest: {
        action: 'delete',
        title: 'Delete Session',
        description: 'Students have shown interest in this session. Deleting will notify interested users and archive their interest data.',
        buttonText: 'Delete & Notify',
        variant: 'destructive'
      },
      ready_to_schedule: {
        action: 'cancel',
        title: 'Cancel & Delete Session',
        description: 'Interest threshold met. This will cancel the session and notify all interested users.',
        buttonText: 'Cancel & Delete',
        variant: 'destructive'
      },
      upcoming: {
        action: 'cancel',
        title: 'Cancel Upcoming Session',
        description: 'This will cancel the session and notify all enrolled students and the tutor.',
        buttonText: 'Cancel Session',
        variant: 'destructive'
      },
      ongoing: {
        action: 'forceEnd',
        title: 'Force End Live Session',
        description: 'This will end the live session, save attendance and logs, and finalize any recording.',
        buttonText: 'Force End Session',
        variant: 'destructive'
      },
      completed: {
        action: 'delete',
        title: 'Delete Completed Session',
        description: 'Recording and attendance data will be preserved. The session will be hidden from the main dashboard.',
        buttonText: 'Soft Delete',
        variant: 'destructive'
      },
      cancelled: {
        action: 'delete',
        title: 'Delete Cancelled Session',
        description: 'This session was already cancelled. Safe to remove.',
        buttonText: 'Delete',
        variant: 'destructive'
      }
    };
    return configs[status] || configs.open_for_interest;
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

  const renderSessionCard = (session) => (
    <Card key={session._id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold pr-4">{session.title}</h3>
                {getStatusBadge(session.status)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tutor:</span>
                <span className="text-muted-foreground">{session.tutorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Subject:</span>
                <span className="text-muted-foreground capitalize">{session.subject?.replace('-', ' ')}</span>
              </div>
              {session.date && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span className="text-muted-foreground">{formatDate(session.date)}</span>
                </div>
              )}
              {session.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time:</span>
                  <span className="text-muted-foreground">{session.time}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {(session.status === 'open_for_interest' || session.status === 'ready_to_schedule') ? 'Interested:' : 'Enrolled:'}
                </span>
                <span className="text-muted-foreground">
                  {(session.status === 'open_for_interest' || session.status === 'ready_to_schedule')
                    ? `${session.interestedStudents?.length || 0} / ${session.maxStudents}`
                    : `${session.enrolledStudents?.length || 0} / ${session.maxStudents}`
                  }
                </span>
              </div>
              {session.feePerStudent && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fee:</span>
                  <span className="text-muted-foreground">Rs. {session.feePerStudent}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{session.subject}</Badge>
              {session.source && <Badge variant="secondary">{session.source === 'poll_based' ? 'Poll Based' : 'Tutor Created'}</Badge>}
              {session.status === 'ongoing' && (
                <Badge className="bg-red-100 text-red-700">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[120px]">
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 justify-start"
              onClick={() => {
                setSelectedSession(session);
                setViewDetailsDialog(true);
              }}
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>

            {session.status === 'ongoing' && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 justify-start border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => handleSessionAction('forceEnd', session._id, session.title)}
              >
                <StopCircle className="h-4 w-4" />
                Force End
              </Button>
            )}

            {(session.status === 'upcoming' || session.status === 'ready_to_schedule') && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 justify-start border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => handleSessionAction('cancel', session._id, session.title)}
              >
                <Ban className="h-4 w-4" />
                Cancel
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="gap-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleSessionAction('delete', session._id, session.title)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Session Management</h2>
        <p className="text-muted-foreground">Manage Kuppi sessions, approvals, and monitoring</p>
      </div>

      {/* Main Tabs: Browse Kuppi vs Scheduled Sessions */}
      <Tabs value={activeMainTab} onValueChange={(val) => { setActiveMainTab(val); setCurrentPage(1); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="gap-2">
            <Heart className="h-4 w-4" />
            Browse Kuppi Sessions
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Scheduled Sessions
          </TabsTrigger>
        </TabsList>

        {/* Browse Kuppi Sessions */}
        <TabsContent value="browse" className="space-y-4 mt-6">
          <Tabs value={activeSubTab} onValueChange={(val) => { setActiveSubTab(val); setCurrentPage(1); }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="open_interest" className="gap-2">
                Open to Interest ({counts.open_for_interest || 0})
              </TabsTrigger>
              <TabsTrigger value="ready_to_schedule" className="gap-2">
                Ready to Schedule ({counts.ready_to_schedule || 0})
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
            </TabsList>

            {/* Open to Interest */}
            <TabsContent value="open_interest" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Open to Interest</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Students can express interest • Minimum threshold required
                      </p>
                    </div>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.length > 0 ? (
                    sessions.map(renderSessionCard)
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No sessions open to interest</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ready to Schedule */}
            <TabsContent value="ready_to_schedule" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ready to Schedule</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Interest threshold met • Awaiting schedule confirmation
                      </p>
                    </div>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.length > 0 ? (
                    sessions.map(renderSessionCard)
                  ) : (
                    <div className="text-center py-12">
                      <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No sessions ready to schedule</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trending */}
            <TabsContent value="trending" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Trending / High Demand</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Popular topics based on interest count
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Trending sessions will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Scheduled Sessions */}
        <TabsContent value="scheduled" className="space-y-4 mt-6">
          <Tabs value={activeScheduledTab} onValueChange={(val) => { setActiveScheduledTab(val); setCurrentPage(1); }}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({counts.all || 0})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({counts.upcoming || 0})</TabsTrigger>
              <TabsTrigger value="ongoing" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Ongoing ({counts.ongoing || 0})
              </TabsTrigger>
              <TabsTrigger value="completed">Completed ({counts.completed || 0})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({counts.cancelled || 0})</TabsTrigger>
            </TabsList>

            {/* Common layout for all scheduled session tabs */}
            {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{tabValue} Sessions</CardTitle>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sessions.length > 0 ? (
                      sessions.map(renderSessionCard)
                    ) : (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No {tabValue} sessions found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sessions.length} of {totalSessions} sessions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialog} onOpenChange={setViewDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>Complete information about this session</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedSession.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tutor:</span>
                  <span className="text-muted-foreground ml-2">{selectedSession.tutorName}</span>
                </div>
                <div>
                  <span className="font-medium">Subject:</span>
                  <span className="text-muted-foreground ml-2 capitalize">
                    {selectedSession.subject?.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Topic:</span>
                  <span className="text-muted-foreground ml-2">{selectedSession.topic}</span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>
                  <span className="text-muted-foreground ml-2">{selectedSession.duration} hours</span>
                </div>
                {selectedSession.date && (
                  <div>
                    <span className="font-medium">Date:</span>
                    <span className="text-muted-foreground ml-2">{formatDate(selectedSession.date)}</span>
                  </div>
                )}
                {selectedSession.time && (
                  <div>
                    <span className="font-medium">Time:</span>
                    <span className="text-muted-foreground ml-2">{selectedSession.time}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Max Students:</span>
                  <span className="text-muted-foreground ml-2">{selectedSession.maxStudents}</span>
                </div>
                <div>
                  <span className="font-medium">Current Enrollment:</span>
                  <span className="text-muted-foreground ml-2">
                    {selectedSession.enrolledStudents?.length || selectedSession.interestedStudents?.length || 0}
                  </span>
                </div>
                {selectedSession.feePerStudent && (
                  <div>
                    <span className="font-medium">Fee per Student:</span>
                    <span className="text-muted-foreground ml-2">Rs. {selectedSession.feePerStudent}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{getStatusBadge(selectedSession.status)}</span>
                </div>
                <div>
                  <span className="font-medium">Source:</span>
                  <span className="text-muted-foreground ml-2">
                    {selectedSession.source === 'poll_based' ? 'Poll Based' : 'Tutor Created'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="text-muted-foreground ml-2">{formatDate(selectedSession.createdAt)}</span>
                </div>
              </div>

              {selectedSession.meetingLink && (
                <div className="text-sm">
                  <span className="font-medium">Meeting Link:</span>
                  <a 
                    href={selectedSession.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Join Session
                  </a>
                </div>
              )}

              {selectedSession.whatsappGroupLink && (
                <div className="text-sm">
                  <span className="font-medium">WhatsApp Group:</span>
                  <a 
                    href={selectedSession.whatsappGroupLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline ml-2"
                  >
                    Join Group
                  </a>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, action: null, sessionId: null, sessionTitle: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'cancel' && 'Cancel Session'}
              {actionDialog.action === 'forceEnd' && 'Force End Live Session'}
              {actionDialog.action === 'delete' && 'Delete Session'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'cancel' && 
                `Are you sure you want to cancel "${actionDialog.sessionTitle}"? All enrolled students and the tutor will be notified.`
              }
              {actionDialog.action === 'forceEnd' && 
                `This will immediately end "${actionDialog.sessionTitle}", save attendance and logs, and finalize the recording.`
              }
              {actionDialog.action === 'delete' && 
                `Are you sure you want to delete "${actionDialog.sessionTitle}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionDialog.action === 'cancel' && 'Cancel Session'}
              {actionDialog.action === 'forceEnd' && 'Force End'}
              {actionDialog.action === 'delete' && 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionManagementShadcn;
