import React from 'react';
import {
  Users,
  GraduationCap,
  UserCheck,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  Target,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BarChart3,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../utils/utils';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, subtitle, color, trend }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          color
        )}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          {subtitle}
          {trend && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </Badge>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

// Payment Card Component
const PaymentCard = ({ icon: Icon, label, value, subtitle, color }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-3 rounded-lg", `bg-${color}/10`)}>
            <Icon className={cn("h-6 w-6", `text-${color}`)} />
          </div>
        </div>
        <div className={cn("text-3xl font-bold mb-1", `text-${color}`)}>
          {value}
        </div>
        <div className="text-sm font-medium text-foreground mb-1">
          {label}
        </div>
        <div className="text-xs text-muted-foreground">
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, icon: Icon, onClick, variant = 'default' }) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "h-auto flex-col gap-3 p-6 hover:scale-[1.02] transition-all",
        variant === 'default' && "bg-primary hover:bg-primary/90"
      )}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{title}</span>
    </Button>
  );
};

// Subject List Item Component
const SubjectItem = ({ name, sessions, students, count }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground">
          {sessions} sessions • {students} students
        </p>
      </div>
      <Badge variant="secondary" className="text-lg font-bold min-w-[3rem] justify-center">
        {count}
      </Badge>
    </div>
  );
};

// Engagement Metric Component
const EngagementMetric = ({ label, value, percentage }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground font-semibold">{value}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

// Main Component
const AdminOverviewShadcn = ({ onTabChange }) => {
  const userStats = [
    {
      label: 'Total Users',
      value: '2,847',
      subtitle: '+156 this month',
      icon: Users,
      color: 'bg-blue-500',
      trend: '+5.8%'
    },
    {
      label: 'Student Users',
      value: '2,234',
      subtitle: '78.5% of total users',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      label: 'Tutor Users',
      value: '613',
      subtitle: '21.5% of total users',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      label: 'Active Users',
      value: '1,892',
      subtitle: '66.4% activity rate',
      icon: Zap,
      color: 'bg-orange-500',
      trend: '+12.3%'
    }
  ];

  const paymentStats = [
    {
      label: 'This Month Income',
      value: 'Rs. 234,500',
      subtitle: '+18.2% from last month',
      icon: DollarSign,
      color: 'green-600'
    },
    {
      label: 'Pending Payouts',
      value: 'Rs. 45,200',
      subtitle: '23 pending transactions',
      icon: Clock,
      color: 'amber-600'
    },
    {
      label: 'Service Fee Revenue',
      value: 'Rs. 28,140',
      subtitle: '12% of total income',
      icon: TrendingUp,
      color: 'blue-600'
    }
  ];

  const subjects = [
    { name: 'Mathematics', sessions: 24, students: 342, count: 24 },
    { name: 'Computer Science', sessions: 18, students: 267, count: 18 },
    { name: 'Physics', sessions: 15, students: 198, count: 15 },
    { name: 'Chemistry', sessions: 12, students: 156, count: 12 },
    { name: 'Biology', sessions: 9, students: 123, count: 9 }
  ];

  const engagementMetrics = [
    { label: 'Session Completion Rate', value: '94.2%', percentage: 94.2 },
    { label: 'Average Session Rating', value: '4.6/5', percentage: 92 },
    { label: 'Student Retention', value: '87.3%', percentage: 87.3 },
    { label: 'Tutor Activity', value: '78.9%', percentage: 78.9 },
    { label: 'Payment Success Rate', value: '96.8%', percentage: 96.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50/50 dark:from-red-950/20 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Admin Control Panel
              </h2>
              <p className="text-muted-foreground">
                Monitor platform performance and manage all system operations
              </p>
            </div>
            <Badge variant="secondary" className="text-sm bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              <Sparkles className="h-4 w-4 mr-1" />
              Full Access
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">User Statistics</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Payment Information</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onTabChange('payments')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {paymentStats.map((stat, index) => (
            <PaymentCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Sessions & Engagement Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions by Subject */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Sessions by Subject
                </CardTitle>
                <CardDescription className="mt-1">
                  Upcoming sessions distribution
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {subjects.map((subject, index) => (
                <SubjectItem key={index} {...subject} />
              ))}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => onTabChange('sessions')}
            >
              View All Sessions
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Engagement Metrics
                </CardTitle>
                <CardDescription className="mt-1">
                  Platform performance indicators
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {engagementMetrics.map((metric, index) => (
                <EngagementMetric key={index} {...metric} />
              ))}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => onTabChange('users')}
            >
              View Detailed Analytics
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <QuickActionCard
            title="Manage Users"
            icon={Users}
            onClick={() => onTabChange('users')}
            variant="default"
          />
          <QuickActionCard
            title="Review Sessions"
            icon={BookOpen}
            onClick={() => onTabChange('sessions')}
            variant="outline"
          />
          <QuickActionCard
            title="Payment Overview"
            icon={DollarSign}
            onClick={() => onTabChange('payments')}
            variant="outline"
          />
          <QuickActionCard
            title="Send Notifications"
            icon={Target}
            onClick={() => onTabChange('notifications')}
            variant="outline"
          />
        </div>
      </div>

      {/* System Health Insights */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Platform Health: Excellent 🎉</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All systems operational. 94.2% session completion rate and 96.8% payment success rate.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <Users className="h-3 w-3 mr-1" />
                  2,847 Users
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <BookOpen className="h-3 w-3 mr-1" />
                  78 Active Sessions
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.2% Growth
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewShadcn;
