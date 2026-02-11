import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduledSessions, getPolls, getTrendingPolls } from '../../services/api';
import { useUser } from '@clerk/clerk-react';
import { 
  BookOpen, 
  BarChart3, 
  Clock, 
  Calendar,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
  Timer,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ThemeToggle } from '../../components/ThemeToggle';
import { cn } from '../../utils/utils';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-[60px] mb-1" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50 cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</div>
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs mt-2 font-medium",
            trend.positive ? "text-green-600" : "text-red-600"
          )}>
            <TrendingUp className={cn(
              "h-3 w-3",
              !trend.positive && "rotate-180"
            )} />
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SessionCard = ({ session, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
    return timeString;
  };

  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
              {session.title}
            </h4>
            <Badge variant="secondary" className="text-xs shrink-0">
              {session.subject?.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(session.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(session.time)}
            </span>
            {session.enrolledStudents && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {session.enrolledStudents.length}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {session.status === 'completed' && (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
        {session.status === 'scheduled' && (
          <Badge variant="outline">
            Upcoming
          </Badge>
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default function OverviewShadcn({ onTabChange }) {
  const { isSignedIn, user } = useUser();

  const { data: sessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ['myScheduledSessions'],
    queryFn: getMyScheduledSessions,
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  const { data: pollsData, isLoading: loadingPolls } = useQuery({
    queryKey: ['polls', { status: 'all' }],
    queryFn: () => getPolls({ status: 'all' }),
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  const { data: trendingPollsData } = useQuery({
    queryKey: ['trendingPolls'],
    queryFn: getTrendingPolls,
    enabled: isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  const sessions = sessionsData?.sessions || [];
  const regularPolls = pollsData?.data?.polls || [];
  const trendingPolls = trendingPollsData?.data || [];

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const upcomingSessions = sessions.filter(s => 
    s.status === 'scheduled' || s.status === 'upcoming'
  ).slice(0, 5);

  const activePolls = regularPolls.filter(p => p.status === 'active' || p.status === 'accepted');
  const activeTrendingPolls = trendingPolls.filter(p => p.status === 'active' || p.status === 'accepted');
  const totalActivePolls = activePolls.length + activeTrendingPolls.length;

  const myPolls = [...activePolls, ...activeTrendingPolls].filter(p => 
    p.creatorInfo?.id === user?.id || p.creator?.id === user?.id || p.createdBy === user?.id
  );

  const hoursLearned = completedSessions.reduce((total, session) => {
    return total + (parseFloat(session.duration) || 0);
  }, 0);

  const activeSessionsCount = sessions.filter(s => 
    s.status !== 'completed' && s.status !== 'cancelled'
  ).length;

  const stats = [
    {
      title: 'Total Sessions',
      value: sessions.length.toString(),
      subtitle: `${completedSessions.length} completed`,
      icon: GraduationCap,
      trend: completedSessions.length > 0 ? { positive: true, value: '+12% from last month' } : null
    },
    {
      title: 'Active Polls',
      value: totalActivePolls.toString(),
      subtitle: `${myPolls.length} created by you`,
      icon: BarChart3,
    },
    {
      title: 'Learning Hours',
      value: `${hoursLearned.toFixed(1)}h`,
      subtitle: 'Total learning time',
      icon: Timer,
    },
    {
      title: 'Upcoming',
      value: activeSessionsCount.toString(),
      subtitle: 'Sessions enrolled',
      icon: Calendar,
    }
  ];

  const progress = completedSessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0;

  return (
    <div className="flex-1 space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.title}
            {...stat}
            loading={loadingSessions || loadingPolls}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Sessions */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Your next scheduled learning sessions
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onTabChange?.('my-sessions')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No upcoming sessions</p>
                <p className="text-sm mt-1">Browse available sessions to get started</p>
                <Button className="mt-4" variant="outline" onClick={() => onTabChange?.('browse')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Sessions
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session._id || session.id} session={session} onClick={() => {}} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Your overall learning statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="text-sm font-medium">{completedSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm">Upcoming</span>
                </div>
                <span className="text-sm font-medium">{activeSessionsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-600" />
                  <span className="text-sm">Active Polls</span>
                </div>
                <span className="text-sm font-medium">{myPolls.length}</span>
              </div>
            </div>

            <Separator />

            <div className="pt-2">
              <Button className="w-full" size="sm" onClick={() => onTabChange?.('progress')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Detailed Statistics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onTabChange?.('browse')}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Browse Sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find and join available study sessions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Explore
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onTabChange?.('vote-create')}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Create Poll</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a poll for a new study session
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Create
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onTabChange?.('my-sessions')}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">My Sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View all your enrolled sessions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
