import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';

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
  }
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
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
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Export Reviews
        </Button>
      </div>

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
                      <svg className="h-3 w-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    {feedback.studentInitials}
                  </div>
                  
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
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({feedback.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
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