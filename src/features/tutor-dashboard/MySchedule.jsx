import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Edit,
  Plus
} from 'lucide-react';

const upcomingSessions = [
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    topic: 'Binary Trees and Tree Traversal',
    date: '2024-06-27',
    time: '15:00',
    duration: '2 hours',
    students: 15,
    type: 'online',
    status: 'confirmed',
    earnings: 4500
  },
  {
    id: 2,
    title: 'Database Systems',
    topic: 'SQL Joins and Subqueries',
    date: '2024-06-28',
    time: '14:00',
    duration: '1.5 hours',
    students: 12,
    type: 'online',
    status: 'confirmed',
    earnings: 3600
  },
  {
    id: 3,
    title: 'Object Oriented Programming',
    topic: 'Inheritance and Polymorphism',
    date: '2024-06-29',
    time: '16:00',
    duration: '2 hours',
    students: 8,
    type: 'hybrid',
    status: 'pending',
    earnings: 2400
  },
  {
    id: 4,
    title: 'Machine Learning Basics',
    topic: 'Introduction to Neural Networks',
    date: '2024-07-01',
    time: '10:00',
    duration: '3 hours',
    students: 22,
    type: 'online',
    status: 'confirmed',
    earnings: 7700
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'online': return Video;
    case 'offline': return MapPin;
    case 'hybrid': return MapPin;
    default: return Video;
  }
};

const MySchedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
          <p className="text-gray-600">Manage your upcoming sessions and availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Set Availability
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Block Time
          </Button>
        </div>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>This Week Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Sessions Scheduled</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">57</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8.5h</div>
              <div className="text-sm text-gray-600">Teaching Hours</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Rs. 18.2K</div>
              <div className="text-sm text-gray-600">Expected Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <div className="grid gap-6">
        {upcomingSessions.map((session) => {
          const TypeIcon = getTypeIcon(session.type);

          return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-1">
                      {session.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-3">{session.topic}</p>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {session.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      Rs. {session.earnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rs. {Math.round(session.earnings / session.students)}/student
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Session Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      <span>{session.time} ({session.duration})</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      <span>{session.students} students</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <TypeIcon className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="capitalize">{session.type}</span>
                    </div>
                  </div>

                  {/* Progress Bar for Time Until Session */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time until session</span>
                      <span className="text-blue-600">
                        {new Date(session.date) > new Date()
                          ? `${Math.ceil((new Date(session.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                          : 'Today'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: new Date(session.date) > new Date()
                            ? `${100 - (Math.ceil((new Date(session.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) * 10)}%`
                            : '100%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {session.status === 'confirmed' && (
                      <>
                        <Button variant="outline" className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Students
                        </Button>
                      </>
                    )}

                    {session.status === 'pending' && (
                      <Button className="flex-1">
                        Confirm Session
                      </Button>
                    )}

                    <Button variant="outline" className="px-4">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MySchedule;