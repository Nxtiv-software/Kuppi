import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions, downloadAttachment, getWhatsAppGroupLink } from '../../services/api';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Download,
  FileText,
  Image as ImageIcon,
  File,
  Bell,
  CheckCircle2,
  XCircle,
  Timer,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../utils/utils';

// Utility function to calculate time until session
const getTimeUntilSession = (sessionDate, sessionTime) => {
  const sessionDateTime = new Date(`${sessionDate.split('T')[0]}T${sessionTime}`);
  const now = new Date();
  const timeDiff = sessionDateTime - now;

  if (timeDiff <= 0) return null;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { days, hours, minutes, text: `${days}d ${hours}h` };
  if (hours > 0) return { days: 0, hours, minutes, text: `${hours}h ${minutes}m` };
  return { days: 0, hours: 0, minutes, text: `${minutes}m` };
};

// Loading Skeleton Component
const SessionSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
);

// Countdown Component
const SessionCountdown = ({ session }) => {
  const [timeLeft, setTimeLeft] = useState(
    getTimeUntilSession(session.date, session.time)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilSession(session.date, session.time));
    }, 60000);

    return () => clearInterval(timer);
  }, [session.date, session.time]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        Starts in {timeLeft.text}
      </span>
    </div>
  );
};

// Session Card Component
const SessionCard = ({ session, onJoinWhatsApp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDownloadAttachment = async (sessionId, attachment) => {
    try {
      const result = await downloadAttachment(sessionId, attachment);
      if (result.success) {
        toast.success('File Downloaded', {
          description: `${attachment.originalName || attachment.filename || 'file'} downloaded successfully`,
        });
      } else {
        toast.error('Download Failed', {
          description: 'Unable to download the file',
        });
      }
    } catch (error) {
      toast.error('Download Error', {
        description: error.message || 'An error occurred while downloading',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
      case 'upcoming':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (mimeType?.includes('image')) return <ImageIcon className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const hasResources = (session.attachments?.length > 0) || 
                       (session.announcements?.length > 0) || 
                       (session.enrolledStudentsInfo?.length > 0);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-xl font-bold line-clamp-1">
              {session.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {session.subject?.replace('-', ' ')}
              </Badge>
              {session.topic && (
                <span className="text-xs text-muted-foreground">• {session.topic}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusColor(session.status)} className="shrink-0">
              {session.status === 'upcoming' || session.status === 'scheduled' ? 'Upcoming' : 
               session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
            {session.feePerStudent && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                Rs. {session.feePerStudent}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Meta Information */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatDate(session.date)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatTime(session.time)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {session.currentStudents || session.enrolledStudentsInfo?.length || 0}/{session.maxStudents || '∞'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium truncate">
              {session.tutorInfo?.name || session.tutorName || 'TBA'}
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        {(session.status === 'scheduled' || session.status === 'upcoming') && (
          <SessionCountdown session={session} />
        )}

        {/* Description */}
        {session.description && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        {(session.status === 'scheduled' || session.status === 'upcoming') && (
          <div className="flex gap-2">
            {session.meetingLink ? (
              <Button 
                asChild 
                className="flex-1"
                size="default"
              >
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="mr-2 h-4 w-4" />
                  Join Session
                </a>
              </Button>
            ) : (
              <Button className="flex-1" disabled>
                <Video className="mr-2 h-4 w-4" />
                Link Pending
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => onJoinWhatsApp(session._id)}
              title="Join WhatsApp Group"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            {session.tutorInfo?.email && (
              <Button 
                variant="outline"
                asChild
                title={`Email ${session.tutorInfo.name}`}
              >
                <a href={`mailto:${session.tutorInfo.email}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Resources Quick Info */}
        {hasResources && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {session.attachments?.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>{session.attachments.length} files</span>
              </div>
            )}
            {session.announcements?.length > 0 && (
              <div className="flex items-center gap-1">
                <Bell className="h-3.5 w-3.5" />
                <span>{session.announcements.length} updates</span>
              </div>
            )}
            {session.enrolledStudentsInfo?.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{session.enrolledStudentsInfo.length} enrolled</span>
              </div>
            )}
          </div>
        )}

        {/* Completed Session Info */}
        {session.status === 'completed' && session.rating && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {'⭐'.repeat(Math.floor(session.rating))}
                <span className="text-sm font-medium text-green-700 dark:text-green-300 ml-1">
                  {session.rating}/5
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Info */}
        {session.status === 'cancelled' && session.reason && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <XCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive">{session.reason}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Expandable Resources Section */}
      {hasResources && (
        <>
          <Separator />
          <CardFooter className="flex-col p-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span>Resources & Details</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isExpanded && (
              <div className="w-full px-6 pb-6 pt-2 space-y-4">
                {/* Enrolled Students */}
                {session.enrolledStudentsInfo?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Enrolled Students ({session.enrolledStudentsInfo.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {session.enrolledStudentsInfo.slice(0, 6).map((student, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {(student.name || student.firstName || 'S')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {student.name || student.firstName || 'Student'}
                            </p>
                            {student.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {student.email}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {session.enrolledStudentsInfo.length > 6 && (
                        <div className="flex items-center justify-center p-2 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                          +{session.enrolledStudentsInfo.length - 6} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Announcements */}
                {session.announcements?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Announcements
                    </h4>
                    <div className="space-y-2">
                      {session.announcements.slice(-3).reverse().map((announcement, index) => (
                        <div key={index} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm">{announcement.message || announcement}</p>
                          {(announcement.addedAt || announcement.createdAt) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(announcement.addedAt || announcement.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {session.attachments?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Materials
                    </h4>
                    <div className="space-y-2">
                      {session.attachments.map((attachment, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                            {getFileIcon(attachment.mimeType || attachment.fileType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {attachment.originalName || attachment.filename || attachment.name || `File ${index + 1}`}
                            </p>
                            {(attachment.fileSize || attachment.size) && (
                              <p className="text-xs text-muted-foreground">
                                {((attachment.fileSize || attachment.size) / 1024 / 1024).toFixed(1)} MB
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadAttachment(session._id, attachment)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

// Main Component
const MySessionsShadcn = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { 
    data: sessionsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const allSessions = sessionsData?.sessions || sessionsData?.data || [];

  // Filter sessions
  let filteredSessions = filter === 'all' 
    ? allSessions 
    : allSessions.filter(session => {
        if (filter === 'upcoming') {
          return session.status === 'scheduled' || session.status === 'upcoming';
        }
        return session.status === filter;
      });

  // Sort sessions
  filteredSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'subject':
        return (a.subject || '').localeCompare(b.subject || '');
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'tutor':
        return (a.tutorName || '').localeCompare(b.tutorName || '');
      default:
        return 0;
    }
  });

  const getCount = (status) => {
    if (status === 'all') return allSessions.length;
    if (status === 'upcoming') {
      return allSessions.filter(session => 
        session.status === 'scheduled' || session.status === 'upcoming'
      ).length;
    }
    return allSessions.filter(session => session.status === status).length;
  };

  const handleJoinWhatsApp = async (sessionId) => {
    try {
      const response = await getWhatsAppGroupLink(sessionId);
      if (response.success && response.data.whatsappGroupLink) {
        window.open(response.data.whatsappGroupLink, '_blank');
        toast.success('Opening WhatsApp Group', {
          description: 'Redirecting to WhatsApp...',
        });
      } else {
        toast.error('Link Not Available', {
          description: 'WhatsApp group link not available yet',
        });
      }
    } catch (error) {
      toast.error('Failed to Get Link', {
        description: error.message || 'Unable to fetch WhatsApp group link',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Sessions</h2>
          <p className="text-muted-foreground">Loading your scheduled sessions...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <SessionSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Sessions</h2>
          <p className="text-muted-foreground">View and manage your scheduled learning sessions</p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="font-semibold mb-2">Failed to Load Sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't fetch your sessions. Please try again.
            </p>
            <Button onClick={refetch}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All Sessions', count: getCount('all'), icon: BookOpen },
    { id: 'upcoming', label: 'Upcoming', count: getCount('upcoming'), icon: Calendar },
    { id: 'completed', label: 'Completed', count: getCount('completed'), icon: CheckCircle2 },
    { id: 'cancelled', label: 'Cancelled', count: getCount('cancelled'), icon: XCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Sessions</h2>
        <p className="text-muted-foreground">View and manage your scheduled learning sessions</p>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Filter Sessions</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="subject">Sort by Subject</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
                <SelectItem value="tutor">Sort by Tutor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filters.map((filterItem) => {
              const Icon = filterItem.icon;
              return (
                <button
                  key={filterItem.id}
                  onClick={() => setFilter(filterItem.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    filter === filterItem.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    filter === filterItem.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="text-center">
                    <div className="text-sm font-medium">{filterItem.label}</div>
                    <div className="text-xs text-muted-foreground">({filterItem.count})</div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  No {filter === 'all' ? '' : filter} sessions found
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {filter === 'all' 
                    ? "No scheduled sessions yet. Keep voting on polls - when they reach 50% votes, tutors can schedule sessions for you!"
                    : `No ${filter} sessions at the moment.`
                  }
                </p>
              </div>
              {filter === 'all' && (
                <div className="flex items-start gap-2 p-4 mt-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      How it works:
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Vote on polls → Polls reach 50% → Tutors schedule sessions → You get notified!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSessions.map((session) => (
            <SessionCard 
              key={session._id} 
              session={session}
              onJoinWhatsApp={handleJoinWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessionsShadcn;
