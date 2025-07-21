import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';

const sessionRequests = [
  {
    id: 1,
    subject: 'Machine Learning Fundamentals',
    topic: 'Neural Networks & Deep Learning',
    studentsCount: 25,
    suggestedRate: 350,
    timePreference: 'Weekday evenings',
    deadline: '2024-07-02',
    difficulty: 'Intermediate',
    duration: '2 hours',
    status: 'pending'
  },
  {
    id: 2,
    subject: 'Data Structures',
    topic: 'Graph Algorithms & Shortest Path',
    studentsCount: 18,
    suggestedRate: 280,
    timePreference: 'Weekend mornings',
    deadline: '2024-06-30',
    difficulty: 'Advanced',
    duration: '1.5 hours',
    status: 'pending'
  },
  {
    id: 3,
    subject: 'Database Design',
    topic: 'Normalization & Query Optimization',
    studentsCount: 22,
    suggestedRate: 300,
    timePreference: 'Flexible',
    deadline: '2024-07-05',
    difficulty: 'Intermediate',
    duration: '2 hours',
    status: 'pending'
  }
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const SessionRequests = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session Requests</h2>
          <p className="text-gray-600">Review and respond to student requests for group sessions</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {sessionRequests.filter(req => req.status === 'pending').length} Pending Requests
        </Badge>
      </div>

      <div className="grid gap-6">
        {sessionRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {request.subject}
                  </CardTitle>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    {request.topic}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getDifficultyColor(request.difficulty)}>
                      {request.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {request.duration}
                    </Badge>
                    <Badge variant="outline">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {new Date(request.deadline).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    Rs. {request.suggestedRate * request.studentsCount}
                  </div>
                  <div className="text-sm text-gray-500">
                    Rs. {request.suggestedRate}/student
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="font-medium">{request.studentsCount} students</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{request.timePreference}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Total: Rs. {request.suggestedRate * request.studentsCount}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Student Interest Breakdown</h4>
                  <div className="flex justify-between text-sm">
                    <span>Confirmed participants: {Math.floor(request.studentsCount * 0.8)}</span>
                    <span>Interested: {request.studentsCount - Math.floor(request.studentsCount * 0.8)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="bg-green-600 hover:bg-green-700 flex-1">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept Request
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Counter Offer
                  </Button>
                  <Button variant="outline" className="px-4 text-red-600 hover:text-red-700">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Decline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionRequests;