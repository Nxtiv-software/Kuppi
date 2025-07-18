import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/avatar';
import {
  Star,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

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
    comment: 'Amazing introduction to machine learning! Complex topics explained in simple terms. The interactive approach made learning enjoyable.',
    sessionTitle: 'Machine Learning Basics',
    date: '2024-06-18',
    helpful: 15
  },
  {
    id: 5,
    studentName: 'Amila Rathnayake',
    studentInitials: 'AR',
    rating: 4,
    comment: 'Very knowledgeable instructor. The session was well-structured and informative. Looking forward to more sessions.',
    sessionTitle: 'Web Development',
    date: '2024-06-15',
    helpful: 9
  }
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));
};

const StudentFeedback = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Feedback</h2>
          <p className="text-gray-600">View reviews and ratings from your students</p>
        </div>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Export Reviews
        </Button>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {feedbackData.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.floor(feedbackData.averageRating))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {feedbackData.totalReviews} reviews
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(feedbackData.ratingDistribution)
                .reverse()
                .map(([stars, count]) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${(count / feedbackData.totalReviews) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {feedback.studentInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{feedback.studentName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{feedback.sessionTitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{feedback.comment}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({feedback.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline">Load More Reviews</Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
              <div className="text-sm text-gray-600">Positive Reviews</div>
              <div className="text-xs text-gray-500 mt-1">4+ stars</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
              <div className="text-xs text-gray-500 mt-1">Based on reviews</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">4.2</div>
              <div className="text-sm text-gray-600">Response Rate</div>
              <div className="text-xs text-gray-500 mt-1">Days average</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Most Mentioned Strengths</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Clear Explanations</Badge>
              <Badge variant="outline">Patient Teaching</Badge>
              <Badge variant="outline">Practical Examples</Badge>
              <Badge variant="outline">Interactive Sessions</Badge>
              <Badge variant="outline">Well Prepared</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFeedback;