import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Download,
  TrendingUp,
  Award,
  Users,
  Clock,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../utils/utils';

// Sample Data
const feedbackData = {
  averageRating: 4.8,
  totalReviews: 89,
  ratingDistribution: {
    5: 72,
    4: 12,
    3: 3,
    2: 1,
    1: 1
  }
};

const recentFeedback = [
  {
    id: 1,
    studentName: 'Priya Jayawardena',
    studentInitials: 'PJ',
    rating: 5,
    comment: 'Excellent explanation of binary trees! The way you broke down complex concepts made it really easy to understand. The examples were very practical and relevant.',
    sessionTitle: 'Data Structures & Algorithms',
    date: '2024-06-25',
    helpful: 12
  },
  {
    id: 2,
    studentName: 'Saman Perera',
    studentInitials: 'SP',
    rating: 5,
    comment: 'Great session on SQL joins. The real-world examples really helped me grasp the concepts. Would definitely recommend!',
    sessionTitle: 'Database Systems',
    date: '2024-06-23',
    helpful: 8
  },
  {
    id: 3,
    studentName: 'Nimesha Fernando',
    studentInitials: 'NF',
    rating: 4,
    comment: 'Good session overall. The pace was perfect and the instructor was very patient with questions. Could use more hands-on exercises.',
    sessionTitle: 'Object Oriented Programming',
    date: '2024-06-20',
    helpful: 6
  },
  {
    id: 4,
    studentName: 'Kasun Silva',
    studentInitials: 'KS',
    rating: 5,
    comment: 'Outstanding teaching style! Made complex algorithms feel simple. The step-by-step approach was incredibly helpful.',
    sessionTitle: 'Advanced Algorithms',
    date: '2024-06-18',
    helpful: 15
  }
];

// Star Rating Component
const StarRating = ({ rating, size = 'default' }) => {
  const sizeClasses = {
    small: 'h-3 w-3',
    default: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, subtitle, color }) => {
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

// Review Card Component
const ReviewCard = ({ feedback }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {feedback.studentInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-base">{feedback.studentName}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{new Date(feedback.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>{feedback.sessionTitle}</span>
                </div>
              </div>
              <StarRating rating={feedback.rating} />
            </div>

            {/* Comment */}
            <p className="text-sm text-foreground/90 leading-relaxed">
              {feedback.comment}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ThumbsUp className="h-4 w-4" />
                Helpful ({feedback.helpful})
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const StudentFeedbackShadcn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const positiveReviews = ((feedbackData.ratingDistribution[5] + feedbackData.ratingDistribution[4]) / feedbackData.totalReviews * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {feedbackData.totalReviews} total reviews
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Reviews
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-6xl font-bold text-primary mb-3">
                {feedbackData.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                <StarRating rating={Math.floor(feedbackData.averageRating)} size="large" />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {feedbackData.totalReviews} reviews
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(feedbackData.ratingDistribution)
                .reverse()
                .map(([stars, count]) => {
                  const percentage = (count / feedbackData.totalReviews) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={TrendingUp}
          label="Positive Reviews"
          value={`${positiveReviews}%`}
          subtitle="4+ stars rating"
          color="green-600"
        />
        <StatsCard
          icon={Users}
          label="Would Recommend"
          value="87%"
          subtitle="Based on reviews"
          color="blue-600"
        />
        <StatsCard
          icon={Clock}
          label="Response Rate"
          value="4.2"
          subtitle="Days average"
          color="purple-600"
        />
      </div>

      {/* Strengths Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Most Mentioned Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Clear Explanations',
              'Patient Teaching',
              'Practical Examples',
              'Interactive Sessions',
              'Well Prepared',
              'Responsive',
              'Knowledgeable'
            ].map((strength, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5">
                {strength}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRating === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating('all')}
              >
                All
              </Button>
              <Button
                variant={filterRating === '5' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating('5')}
                className="gap-1"
              >
                5 <Star className="h-3 w-3" />
              </Button>
              <Button
                variant={filterRating === '4' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating('4')}
                className="gap-1"
              >
                4 <Star className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Showing {recentFeedback.length} reviews
          </p>
        </div>

        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <ReviewCard key={feedback.id} feedback={feedback} />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" className="gap-2">
            Load More Reviews
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedbackShadcn;
