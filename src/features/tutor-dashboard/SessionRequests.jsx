import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { getSessionRequests, acceptSessionRequest, declineSessionRequest, scheduleSession } from '../../services/api';
import toast from 'react-hot-toast';

// Schedule Session Modal Component
const ScheduleSessionModal = ({ isOpen, onClose, pollData, onSchedule }) => {
  const [sessionDetails, setSessionDetails] = useState({
    date: '',
    time: '',
    feePerStudent: '',
    subject: pollData?.subject || '',
    topic: pollData?.chapter || '',
    duration: '2',
    maxStudents: pollData?.maxStudents || 20
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionDetails.date || !sessionDetails.time || !sessionDetails.feePerStudent) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSchedule(sessionDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Schedule Session</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <input
              type="text"
              value={sessionDetails.subject}
              onChange={(e) => setSessionDetails({...sessionDetails, subject: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Topic *</label>
            <input
              type="text"
              value={sessionDetails.topic}
              onChange={(e) => setSessionDetails({...sessionDetails, topic: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={sessionDetails.date}
              onChange={(e) => setSessionDetails({...sessionDetails, date: e.target.value})}
              className="w-full p-2 border rounded-md"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="time"
              value={sessionDetails.time}
              onChange={(e) => setSessionDetails({...sessionDetails, time: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fee per Student (Rs.) *</label>
            <input
              type="number"
              value={sessionDetails.feePerStudent}
              onChange={(e) => setSessionDetails({...sessionDetails, feePerStudent: e.target.value})}
              className="w-full p-2 border rounded-md"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (hours)</label>
            <select
              value={sessionDetails.duration}
              onChange={(e) => setSessionDetails({...sessionDetails, duration: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="1">1 hour</option>
              <option value="1.5">1.5 hours</option>
              <option value="2">2 hours</option>
              <option value="2.5">2.5 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Schedule Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSubjectDisplayName = (subject) => {
  const subjectMap = {
    'data-structures': 'Data Structures',
    'algorithms': 'Algorithms',
    'database': 'Database Systems',
    'web-dev': 'Web Development',
    'mobile-dev': 'Mobile Development',
    'combined-maths': 'Combined Mathematics',
    'physics': 'Physics',
    'chemistry': 'Chemistry'
  };
  return subjectMap[subject] || subject;
};

const getTimeSlotDisplay = (timeSlot) => {
  const timeSlotMap = {
    'morning': 'Morning (8AM - 12PM)',
    'afternoon': 'Afternoon (12PM - 4PM)',
    'evening': 'Evening (4PM - 8PM)'
  };
  return timeSlotMap[timeSlot] || timeSlot;
};

const SessionRequests = () => {
  const queryClient = useQueryClient();
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, pollData: null });

  // Fetch session requests (polls with >50% votes)
  const { data: sessionRequests, isLoading, error } = useQuery({
    queryKey: ['sessionRequests'],
    queryFn: getSessionRequests,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAcceptRequest = async (pollId) => {
    try {
      await acceptSessionRequest(pollId);
      toast.success('Session request accepted! You can now schedule the session.');
      
      // Find the poll data for scheduling
      const pollData = sessionRequests.data.find(req => req._id === pollId);
      setScheduleModal({ isOpen: true, pollData });
      
      // Refresh the session requests
      queryClient.invalidateQueries(['sessionRequests']);
    } catch (error) {
      toast.error(error.message);
      console.error('Error accepting session request:', error);
    }
  };

  const handleDeclineRequest = async (pollId) => {
    if (!window.confirm('Are you sure you want to decline this session request?')) {
      return;
    }

    try {
      await declineSessionRequest(pollId);
      toast.success('Session request declined.');
      queryClient.invalidateQueries(['sessionRequests']);
    } catch (error) {
      toast.error(error.message);
      console.error('Error declining session request:', error);
    }
  };

  const handleScheduleSession = async (sessionDetails) => {
    try {
      await scheduleSession(scheduleModal.pollData._id, sessionDetails);
      toast.success('Session scheduled successfully! Students who voted will see it in their dashboard.');
      setScheduleModal({ isOpen: false, pollData: null });
      queryClient.invalidateQueries(['sessionRequests']);
    } catch (error) {
      toast.error(error.message);
      console.error('Error scheduling session:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Session Requests</h2>
            <p className="text-gray-600">Loading session requests...</p>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Session Requests</h2>
            <p className="text-red-600">Error loading session requests: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const requests = sessionRequests?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session Requests</h2>
          <p className="text-gray-600">Review and respond to student requests for group sessions (polls with &gt;50% votes)</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {requests.length} Available Requests
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Requests</h3>
              <p className="text-gray-600">No polls have reached the 50% vote threshold yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => {
            const votePercentage = (request.voteCount / request.maxStudents) * 100;
            
            // Debug: Log poll reaching threshold
            if (votePercentage >= 50) {
              console.log(`🎉 Poll "${request.title}" reached ${Math.round(votePercentage)}% votes (${request.voteCount}/${request.maxStudents}) - Available for scheduling!`);
            }
            
            return (
              <Card key={request._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {request.title}
                      </CardTitle>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        {getSubjectDisplayName(request.subject)} - {request.chapter}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-green-100 text-green-800">
                          {Math.round(votePercentage)}% Voted
                        </Badge>
                        <Badge variant="outline">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getTimeSlotDisplay(request.timeSlot)}
                        </Badge>
                        <Badge variant="outline">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Preferred: {new Date(request.preferredDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {request.voteCount} / {request.maxStudents}
                      </div>
                      <div className="text-sm text-gray-500">
                        students interested
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span className="font-medium">{request.voteCount} students voted</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Created by {request.creator?.name || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Max: {request.maxStudents} students</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Vote Progress</h4>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Current votes: {request.voteCount}</span>
                        <span>{Math.round(votePercentage)}% of capacity</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: `${Math.min(votePercentage, 100)}%`}}></div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accept & Schedule
                      </Button>
                      <Button 
                        variant="outline" 
                        className="px-4 text-red-600 hover:text-red-700"
                        onClick={() => handleDeclineRequest(request._id)}
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, pollData: null })}
        pollData={scheduleModal.pollData}
        onSchedule={handleScheduleSession}
      />
    </div>
  );
};

export default SessionRequests;
