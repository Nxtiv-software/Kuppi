import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { createTutorSession, getTutorCreatedSessions, scheduleTutorSession, markSessionCompleted } from '../../services/api';
import toast from 'react-hot-toast';

// Schedule Session Modal Component
const ScheduleSessionModal = ({ isOpen, onClose, session, onScheduleSession }) => {
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    meetingPlatform: 'zoom',
    meetingLink: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scheduleData.date || !scheduleData.time) {
      toast.error('Please select date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await onScheduleSession(session._id, scheduleData);
      toast.success('Session scheduled successfully!');
      onClose();
      
      // Reset form
      setScheduleData({
        date: '',
        time: '',
        meetingPlatform: 'zoom',
        meetingLink: '',
        additionalNotes: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Schedule Session</h3>
        <p className="text-gray-600 mb-4">
          <strong>{session.title}</strong><br />
          {session.interestedStudents?.length || 0} students interested
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={scheduleData.date}
              onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
              className="w-full p-2 border rounded-md"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="time"
              value={scheduleData.time}
              onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meeting Platform</label>
            <select
              value={scheduleData.meetingPlatform}
              onChange={(e) => setScheduleData({...scheduleData, meetingPlatform: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="zoom">Zoom</option>
              <option value="google-meet">Google Meet</option>
              <option value="teams">Microsoft Teams</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link</label>
            <input
              type="url"
              value={scheduleData.meetingLink}
              onChange={(e) => setScheduleData({...scheduleData, meetingLink: e.target.value})}
              className="w-full p-2 border rounded-md"
              placeholder="https://zoom.us/j/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              value={scheduleData.additionalNotes}
              onChange={(e) => setScheduleData({...scheduleData, additionalNotes: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Any additional instructions for students..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Session Modal Component
const CreateSessionModal = ({ isOpen, onClose, onCreateSession }) => {
  const { user } = useUser();
  const [sessionData, setSessionData] = useState({
    title: '',
    subject: 'combined-maths',
    topic: '',
    description: '',
    duration: '2',
    feePerStudent: '',
    studentLimitType: 'limited', // 'limited', 'unlimited', 'minimum'
    maxStudents: '',
    minStudents: '',
    schedulingNote: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!sessionData.title || !sessionData.topic || !sessionData.description || !sessionData.feePerStudent) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (sessionData.studentLimitType === 'limited' && (!sessionData.maxStudents || sessionData.maxStudents < 1)) {
      toast.error('Please specify maximum number of students');
      return;
    }

    if (sessionData.studentLimitType === 'minimum' && (!sessionData.minStudents || sessionData.minStudents < 1)) {
      toast.error('Please specify minimum number of students');
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionPayload = {
        ...sessionData,
        tutorId: user.id,
        tutorName: user.fullName || user.firstName || 'Anonymous Tutor',
        tutorEmail: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '',
        maxStudents: sessionData.studentLimitType === 'unlimited' ? 999 : 
                    sessionData.studentLimitType === 'limited' ? parseInt(sessionData.maxStudents) :
                    parseInt(sessionData.minStudents) * 2, // For minimum, set reasonable max
        minStudents: sessionData.studentLimitType === 'minimum' ? parseInt(sessionData.minStudents) : 1,
        status: 'open_for_interest' // New status for tutor-created sessions
      };

      console.log('🚀 Sending session payload:', sessionPayload);

      await onCreateSession(sessionPayload);
      toast.success('Session created successfully! It will appear in Browse Kuppi for students.');
      onClose();
      
      // Reset form
      setSessionData({
        title: '',
        subject: 'combined-maths',
        topic: '',
        description: '',
        duration: '2',
        feePerStudent: '',
        studentLimitType: 'limited',
        maxStudents: '',
        minStudents: '',
        schedulingNote: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Create New Session</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Title *</label>
              <input
                type="text"
                value={sessionData.title}
                onChange={(e) => setSessionData({...sessionData, title: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Advanced Calculus Workshop"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <select
                value={sessionData.subject}
                onChange={(e) => setSessionData({...sessionData, subject: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="combined-maths">Combined Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Topic *</label>
            <input
              type="text"
              value={sessionData.topic}
              onChange={(e) => setSessionData({...sessionData, topic: e.target.value})}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Integration by Parts"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={sessionData.description}
              onChange={(e) => setSessionData({...sessionData, description: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Describe what students will learn in this session..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours)</label>
              <select
                value={sessionData.duration}
                onChange={(e) => setSessionData({...sessionData, duration: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="1">1 Hour</option>
                <option value="1.5">1.5 Hours</option>
                <option value="2">2 Hours</option>
                <option value="2.5">2.5 Hours</option>
                <option value="3">3 Hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fee per Student (Rs.) *</label>
              <input
                type="number"
                value={sessionData.feePerStudent}
                onChange={(e) => setSessionData({...sessionData, feePerStudent: e.target.value})}
                className="w-full p-2 border rounded-md"
                min="0"
                placeholder="500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Student Limit Type *</label>
            <select
              value={sessionData.studentLimitType}
              onChange={(e) => setSessionData({...sessionData, studentLimitType: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="limited">Limited Students (Set Maximum)</option>
              <option value="unlimited">Unlimited Students</option>
              <option value="minimum">Minimum Students Required</option>
            </select>
          </div>

          {sessionData.studentLimitType === 'limited' && (
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Students *</label>
              <input
                type="number"
                value={sessionData.maxStudents}
                onChange={(e) => setSessionData({...sessionData, maxStudents: e.target.value})}
                className="w-full p-2 border rounded-md"
                min="1"
                max="50"
                placeholder="20"
                required
              />
            </div>
          )}

          {sessionData.studentLimitType === 'minimum' && (
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Students Required *</label>
              <input
                type="number"
                value={sessionData.minStudents}
                onChange={(e) => setSessionData({...sessionData, minStudents: e.target.value})}
                className="w-full p-2 border rounded-md"
                min="1"
                max="25"
                placeholder="5"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Session will only be scheduled if this many students show interest</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Scheduling Note</label>
            <textarea
              value={sessionData.schedulingNote}
              onChange={(e) => setSessionData({...sessionData, schedulingNote: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows="2"
              placeholder="Any additional notes about scheduling (optional)..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateSession = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Fetch tutor's created sessions
  const { data: createdSessions, isLoading, error } = useQuery({
    queryKey: ['tutorCreatedSessions'],
    queryFn: getTutorCreatedSessions,
    staleTime: 2 * 60 * 1000,
  });

  const handleCreateSession = async (sessionData) => {
    await createTutorSession(sessionData);
    queryClient.invalidateQueries(['tutorCreatedSessions']);
    queryClient.invalidateQueries(['availableSessions']); // Refresh browse kuppi
  };

  const handleScheduleSession = async (sessionId, scheduleData) => {
    await scheduleTutorSession(sessionId, scheduleData);
    queryClient.invalidateQueries(['tutorCreatedSessions']);
    queryClient.invalidateQueries(['availableSessions']); // Refresh browse kuppi
    queryClient.invalidateQueries(['myScheduledSessions']); // Refresh student schedules
  };

  const handleMarkCompleted = async (sessionId) => {
    if (window.confirm('Are you sure you want to mark this session as completed?')) {
      try {
        await markSessionCompleted(sessionId);
        toast.success('Session marked as completed!');
        queryClient.invalidateQueries(['tutorCreatedSessions']);
        queryClient.invalidateQueries(['availableSessions']);
        queryClient.invalidateQueries(['myScheduledSessions']);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const openScheduleModal = (session) => {
    setSelectedSession(session);
    setScheduleModal(true);
  };

  const getStatusBadge = (status, interestedCount, minStudents, maxStudents) => {
    switch (status) {
      case 'open_for_interest':
        return <Badge className="bg-blue-100 text-blue-800">Open for Interest</Badge>;
      case 'ready_to_schedule':
        return <Badge className="bg-green-100 text-green-800">Ready to Schedule</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Session</h2>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Session</h2>
          <Button
            onClick={() => setCreateModal(true)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + Create New Session
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading sessions: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessions = createdSessions?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Create Session</h2>
          <p className="text-gray-600">Create and manage your teaching sessions</p>
        </div>
        <Button
          onClick={() => setCreateModal(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          + Create New Session
        </Button>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Sessions</div>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Open for Interest</div>
            <div className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === 'open_for_interest').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Scheduled</div>
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-gray-600">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Created Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Created Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No sessions created yet</h3>
              <p className="text-gray-500 mb-4">Create your first session to start teaching!</p>
              <Button
                onClick={() => setCreateModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Your First Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.subject} • {session.topic}</p>
                    </div>
                    {getStatusBadge(session.status, session.interestedStudents?.length || 0, session.minStudents, session.maxStudents)}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{session.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-medium">{session.duration} hours</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fee per Student:</span>
                      <div className="font-medium">Rs. {session.feePerStudent}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Interested Students:</span>
                      <div className="font-medium">{session.interestedStudents?.length || 0}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Limit:</span>
                      <div className="font-medium">
                        {session.maxStudents === 999 ? 'Unlimited' : 
                         `Max: ${session.maxStudents}${session.minStudents > 1 ? ` (Min: ${session.minStudents})` : ''}`}
                      </div>
                    </div>
                  </div>

                  {((session.status === 'open_for_interest' && session.interestedStudents?.length >= session.minStudents) || 
                    session.status === 'ready_to_schedule') && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-green-800 font-medium">Ready to Schedule!</p>
                          <p className="text-green-600 text-sm">You have enough interested students to schedule this session.</p>
                        </div>
                        <Button 
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => openScheduleModal(session)}
                        >
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  )}

                  {session.status === 'scheduled' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-800 font-medium">Session Scheduled</p>
                          <p className="text-blue-600 text-sm">
                            {session.date && `Date: ${new Date(session.date).toLocaleDateString()} at ${session.time}`}
                          </p>
                        </div>
                        <Button 
                          className="bg-gray-600 text-white hover:bg-gray-700"
                          onClick={() => handleMarkCompleted(session._id)}
                        >
                          Mark as Completed
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onCreateSession={handleCreateSession}
      />

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        isOpen={scheduleModal}
        onClose={() => setScheduleModal(false)}
        session={selectedSession}
        onScheduleSession={handleScheduleSession}
      />
    </div>
  );
};

export default CreateSession;