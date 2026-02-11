import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  BookOpen,
  TrendingUp,
  Target,
  Award,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Progress as ProgressBar } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../utils/utils';

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300",
          "group-hover:scale-110",
          color
        )}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend && (
            <Badge 
              variant={trend.positive ? "default" : "secondary"}
              className={cn(
                "text-xs h-5",
                trend.positive 
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" 
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              {trend.positive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Subject Progress Card Component
const SubjectProgressCard = ({ subject }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 60) return "bg-blue-600";
    if (progress >= 40) return "bg-yellow-600";
    return "bg-orange-600";
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return "text-green-600 dark:text-green-400";
    if (progress >= 60) return "text-blue-600 dark:text-blue-400";
    if (progress >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">{subject.name}</CardTitle>
            <CardDescription className="text-sm">
              {subject.sessions}/{subject.totalSessions} sessions completed
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-base font-bold px-3 py-1",
                getProgressTextColor(subject.progress)
              )}
            >
              {subject.progress}%
            </Badge>
            {subject.progress >= 80 && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <ProgressBar 
            value={subject.progress} 
            className="h-3"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{subject.totalSessions - subject.sessions} sessions remaining</span>
          </div>
        </div>

        {subject.nextTopic && (
          <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <span className="font-medium">Next Topic:</span>
                <p className="text-muted-foreground">{subject.nextTopic}</p>
              </div>
            </div>
          </div>
        )}

        <Button 
          className="w-full group-hover:shadow-md transition-all"
          size="default"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
};

// Analytics Chart Component
const AnalyticsChart = ({ data, maxValue, timeRange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => {
          const percentage = (item.hours / maxValue) * 100;
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-full flex flex-col items-center">
                <div className="text-xs font-medium text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.hours}h
                </div>
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-primary/80 cursor-pointer relative"
                  style={{ height: `${Math.max(percentage, 5)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      {item.sessions} sessions
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {timeRange === 'week' ? item.day : item.week}
              </div>
            </div>
          );
        })}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Study Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Total: {data.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}h
          </span>
        </div>
      </div>
    </div>
  );
};

// Achievements Component
const AchievementsSection = () => {
  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first session',
      icon: Zap,
      earned: true,
      date: 'Jan 15, 2026'
    },
    {
      title: 'Week Warrior',
      description: '7-day learning streak',
      icon: Flame,
      earned: true,
      date: 'Jan 22, 2026'
    },
    {
      title: 'Math Master',
      description: 'Complete 10 math sessions',
      icon: Award,
      earned: true,
      date: 'Jan 28, 2026'
    },
    {
      title: 'Consistent Learner',
      description: '30-day learning streak',
      icon: Trophy,
      earned: false,
      progress: 12,
      total: 30
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Achievements</CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {achievements.filter(a => a.earned).length}/{achievements.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 transition-all",
                  achievement.earned
                    ? "border-primary/50 bg-primary/5"
                    : "border-dashed border-muted-foreground/30 bg-muted/30"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  achievement.earned
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Earned {achievement.date}
                    </p>
                  ) : achievement.progress !== undefined ? (
                    <div className="mt-2 space-y-1">
                      <ProgressBar 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-1.5"
                      />
                      <p className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.total} days
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Progress Component
const ProgressShadcn = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    {
      title: 'Total Study Hours',
      value: '127',
      subtitle: 'this week',
      icon: Clock,
      color: 'bg-blue-500',
      trend: { positive: true, value: '+8h' }
    },
    {
      title: 'Sessions Completed',
      value: '18',
      subtitle: '94% attendance',
      icon: CheckCircle2,
      color: 'bg-green-500',
      trend: { positive: true, value: '+2' }
    },
    {
      title: 'Current Streak',
      value: '12 days',
      subtitle: 'Personal best!',
      icon: Flame,
      color: 'bg-orange-500',
      trend: { positive: true, value: 'Record!' }
    },
    {
      title: 'Certificates Earned',
      value: '6',
      subtitle: 'this month',
      icon: Trophy,
      color: 'bg-purple-500',
      trend: { positive: true, value: '+3' }
    }
  ];

  const subjects = [
    {
      name: 'Combined Mathematics',
      progress: 85,
      sessions: 8,
      totalSessions: 10,
      nextTopic: 'Integration'
    },
    {
      name: 'Physics',
      progress: 70,
      sessions: 7,
      totalSessions: 10,
      nextTopic: 'Mechanical Properties of Matter'
    },
    {
      name: 'Chemistry',
      progress: 40,
      sessions: 4,
      totalSessions: 10,
      nextTopic: 'Oxygen containing organic compounds'
    }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5, sessions: 1 },
    { day: 'Tue', hours: 1.8, sessions: 1 },
    { day: 'Wed', hours: 3.2, sessions: 2 },
    { day: 'Thu', hours: 2.1, sessions: 1 },
    { day: 'Fri', hours: 4.0, sessions: 2 },
    { day: 'Sat', hours: 3.5, sessions: 2 },
    { day: 'Sun', hours: 2.8, sessions: 1 }
  ];

  const monthlyData = [
    { week: 'Week 1', hours: 12.5, sessions: 6 },
    { week: 'Week 2', hours: 15.2, sessions: 8 },
    { week: 'Week 3', hours: 18.7, sessions: 9 },
    { week: 'Week 4', hours: 14.3, sessions: 7 }
  ];

  const data = timeRange === 'week' ? weeklyData : monthlyData;
  const maxHours = Math.max(...data.map(d => d.hours));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Progress
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track your learning achievements and milestones
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Subject Progress */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Subject Progress
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your learning progress across different subjects
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <SubjectProgressCard key={index} subject={subject} />
          ))}
        </div>
      </div>

      {/* Learning Analytics */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Learning Analytics
              </CardTitle>
              <CardDescription>Your study patterns and trends</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                This Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                This Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnalyticsChart 
            data={data} 
            maxValue={maxHours} 
            timeRange={timeRange}
          />
        </CardContent>
      </Card>

      {/* Achievements */}
      <AchievementsSection />

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Most Improved</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Physics</p>
                <p className="text-xs text-muted-foreground mt-1">+20% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">92%</p>
                <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Study Consistency</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Excellent</p>
                <p className="text-xs text-muted-foreground mt-1">5 days/week average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressShadcn;
