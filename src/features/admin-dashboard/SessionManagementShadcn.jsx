import React, { useState } from 'react';
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
  Filter
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

const SessionManagementShadcn = () => {
  const [activeView, setActiveView] = useState('pending');
  const [selectedSession, setSelectedSession] = useState(null);
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, sessionId: null });
  const [searchTerm, setSearchTerm] = useState('');

  const pendingSessions = [
    {
      id: 1,
      title: 'Advanced Calculus - Integration Techniques',
      tutor: 'Dr. Robert Chen',
      students: 25,
      price: 300,
      requestedDate: '2026-02-12',
      startTime: '3:00 PM',
      endTime: '4:30 PM',
      duration: '1.5 hours',
      subject: 'Mathematics',
      level: 'Advanced',
      description: 'Advanced integration techniques including substitution, integration by parts, and partial fractions.'
    },
    {
      id: 2,
      title: 'Organic Chemistry - Reaction Mechanisms',
      tutor: 'Mr. David Brown',
      students: 18,
      price: 250,
      requestedDate: '2026-02-14',
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      duration: '1.5 hours',
      subject: 'Chemistry',
      level: 'Intermediate',
      description: 'Comprehensive coverage of organic reaction mechanisms and their applications.'
    },
    {
      id: 3,
      title: 'Quantum Physics - Wave-Particle Duality',
      tutor: 'Prof. Lisa Anderson',
      students: 32,
      price: 350,
      requestedDate: '2026-02-13',
      startTime: '5:00 PM',
      endTime: '6:30 PM',
      duration: '1.5 hours',
      subject: 'Physics',
      level: 'Advanced',
      description: 'Exploring the fundamental principles of quantum mechanics and wave-particle duality.'
    }
  ];

  const scheduledSessions = [
    {
      id: 4,
      title: 'Biology - Cell Structure',
      tutor: 'Ms. Emily Davis',
      students: 22,
      price: 280,
      scheduledDate: '2026-02-13',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      status: 'scheduled',
      subject: 'Biology'
    },
    {
      id: 5,
      title: 'Computer Science - Data Structures',
      tutor: 'Dr. James Wilson',
      students: 28,
      price: 320,
      scheduledDate: '2026-02-14',
      startTime: '4:00 PM',
      endTime: '5:30 PM',
      status: 'scheduled',
      subject: 'Computer Science'
    }
  ];

  const liveSessions = [
    {
      id: 6,
      title: 'Physics - Thermodynamics',
      tutor: 'Prof. Lisa Anderson',
      students: 35,
      participants: 32,
      startTime: '2:00 PM',
      duration: '45 minutes elapsed',
      subject: 'Physics'
    },
    {
      id: 7,
      title: 'Mathematics - Linear Algebra',
      tutor: 'Dr. Robert Chen',
      students: 28,
      participants: 26,
      startTime: '1:30 PM',
      duration: '1 hour 15 minutes elapsed',
      subject: 'Mathematics'
    },
    {
      id: 8,
      title: 'Chemistry - Electrochemistry',
      tutor: 'Mr. David Brown',
      students: 20,
      participants: 18,
      startTime: '2:30 PM',
      duration: '30 minutes elapsed',
      subject: 'Chemistry'
    }
  ];

  const handleSessionAction = (action, sessionId) => {
    setActionDialog({ isOpen: true, action, sessionId });
  };

  const confirmAction = () => {
    const { action, sessionId } = actionDialog;
    
    switch(action) {
      case 'approve':
        toast.success('Session approved successfully');
        break;
      case 'reject':
        toast.error('Session rejected');
        break;
      default:
        break;
    }
    
    setActionDialog({ isOpen: false, action: null, sessionId: null });
  };

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
