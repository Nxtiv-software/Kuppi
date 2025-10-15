import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { getTutorScheduledSessions, addMeetingLink, addSessionAttachment, addSessionAnnouncement, downloadAttachment, markSessionCompleted } from '../../services/api';
import toast from 'react-hot-toast';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': 
    case 'scheduled': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Meeting Link Modal Component
const MeetingLinkModal = ({ isOpen, onClose, session, onSave }) => {
  const [meetingLink, setMeetingLink] = useState(session?.meetingLink || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingLink.trim()) {
      toast.error('Please enter a meeting link');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, meetingLink);
      setMeetingLink('');
      onClose();
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Meeting Link</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link *</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="https://zoom.us/j/..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter Zoom, Google Meet, or any other meeting platform link
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Attachment Modal Component
const AttachmentModal = ({ isOpen, onClose, session, onSave }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, file, description);
      setFile(null);
      setDescription('');
      onClose();
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Attachment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded-md"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported: PDF, Word, PowerPoint, Images (Max 10MB)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Brief description of this file..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Announcement Modal Component
const AnnouncementModal = ({ isOpen, onClose, session, onSave }) => {
  const [announcement, setAnnouncement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      toast.error('Please enter an announcement');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(session._id, announcement);
      setAnnouncement('');
      onClose();
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Special Announcement</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Announcement *</label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Important information for students..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be visible to all students enrolled in this session
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Announcement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MySchedule = () => {
  // Helper function to get student count from various data formats
  const getStudentCount = (session) => {
    // If we have enrolledStudentsInfo array with real user data
    if (session.enrolledStudentsInfo && Array.isArray(session.enrolledStudentsInfo)) {
      return session.enrolledStudentsInfo.length;
    }
    
    // If we have a clean student count number
    if (typeof session.enrolledStudents === 'number') {
      return session.enrolledStudents;
    }
    
    // If we have students field as number
    if (typeof session.students === 'number') {
      return session.students;
    }
    
    // If we have students as array
    if (Array.isArray(session.students)) {
      return session.students.length;
    }
    
    // If students field contains user IDs (fallback)
    if (typeof session.enrolledStudents === 'string' || typeof session.students === 'string') {
      return 1; // At least 1 student if we have ID data
    }
    
    return 0;
  };

  // Helper function to get student display text
  const getStudentDisplayText = (session) => {
    const count = getStudentCount(session);
    return `${count} student${count !== 1 ? 's' : ''}`;
  };
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  
  // Modal states
  const [meetingModal, setMeetingModal] = useState({ isOpen: false, session: null });
  const [attachmentModal, setAttachmentModal] = useState({ isOpen: false, session: null });
  const [announcementModal, setAnnouncementModal] = useState({ isOpen: false, session: null });

  // Fetch tutor's scheduled sessions
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['tutorScheduledSessions'],
    queryFn: getTutorScheduledSessions,
    enabled: isSignedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes - schedule doesn't change frequently
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic polling
  });

  // Handler functions for modals
  const handleAddMeetingLink = async (sessionId, meetingLink) => {
    try {
      await addMeetingLink(sessionId, meetingLink);
      toast.success('Meeting link added successfully!');
      // Invalidate both tutor and student queries so students see updates immediately
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleAddAttachment = async (sessionId, file, description) => {
    try {
      await addSessionAttachment(sessionId, file, description);
      toast.success('Attachment uploaded successfully!');
      // Invalidate both tutor and student queries so students see updates immediately
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleAddAnnouncement = async (sessionId, announcement) => {
    try {
      await addSessionAnnouncement(sessionId, announcement);
      toast.success('Announcement posted successfully!');
      // Invalidate both tutor and student queries so students see updates immediately
      queryClient.invalidateQueries(['tutorScheduledSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleMarkCompleted = async (sessionId, sessionTitle) => {
    if (window.confirm(`Are you sure you want to mark "${sessionTitle}" as completed? This action cannot be undone.`)) {
      try {
        await markSessionCompleted(sessionId);
        toast.success('Session marked as completed successfully!');
        // Refresh data to move session to completed section
        queryClient.invalidateQueries(['tutorScheduledSessions']);
        queryClient.invalidateQueries(['tutorCreatedSessions']);
        queryClient.invalidateQueries(['myScheduledSessions']);
        queryClient.invalidateQueries(['availableSessions']);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-6 text-center">
        <p>Please sign in to view your schedule.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error loading schedule: {error.message}</p>
      </div>
    );
  }

  const upcomingSessions = sessionsData?.data || [];

  if (upcomingSessions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No scheduled sessions yet. Accept session requests to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
          <p className="text-gray-600">Manage your upcoming sessions and availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Set Availability
          </Button>
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Block Time
          </Button>
        </div>
      </div>

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
              <div className="text-2xl font-bold text-green-600">35</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7.5h</div>
              <div className="text-sm text-gray-600">Teaching Hours</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Rs. 10.5K</div>
              <div className="text-sm text-gray-600">Expected Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {upcomingSessions.map((session) => (
          <Card key={session._id || session.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl text-gray-900 mb-1">
                    {session.subject || session.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-3">{session.topic || session.chapter}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {session.sessionType || session.type || 'online'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    Rs. {((session.feePerStudent || 0) * getStudentCount(session)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Rs. {session.feePerStudent || 0}/student
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(session.scheduledDate || session.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{session.scheduledTime || session.time} ({session.duration || '2 hours'})</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>{getStudentDisplayText(session)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="capitalize">{session.sessionType || session.type || 'online'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {session.status === 'confirmed' && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
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
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </div>

                {/* Session Management Actions */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Session Resources</h4>
                    <div className="flex gap-2">
                      {/* Meeting Link Indicator */}
                      {session.meetingLink && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Meeting Link Added
                        </Badge>
                      )}
                      
                      {/* Attachments Indicator */}
                      {session.attachments && session.attachments.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {session.attachments.length} File{session.attachments.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      
                      {/* Announcements Indicator */}
                      {session.announcements && session.announcements.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                          {session.announcements.length} Announcement{session.announcements.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <Button 
                      variant="outline" 
                      className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => setMeetingModal({ isOpen: true, session })}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {session.meetingLink ? 'Update Link' : 'Add Meeting Link'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="text-sm bg-green-50 hover:bg-green-100 text-green-700"
                      onClick={() => setAttachmentModal({ isOpen: true, session })}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Add Attachment
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="text-sm bg-purple-50 hover:bg-purple-100 text-purple-700"
                      onClick={() => setAnnouncementModal({ isOpen: true, session })}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      Add Announcement
                    </Button>

                    <Button 
                      variant="outline" 
                      className="text-sm bg-orange-50 hover:bg-orange-100 text-orange-700"
                      onClick={() => handleMarkCompleted(session._id || session.id, session.title)}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <MeetingLinkModal
        isOpen={meetingModal.isOpen}
        onClose={() => setMeetingModal({ isOpen: false, session: null })}
        session={meetingModal.session}
        onSave={handleAddMeetingLink}
      />
      
      <AttachmentModal
        isOpen={attachmentModal.isOpen}
        onClose={() => setAttachmentModal({ isOpen: false, session: null })}
        session={attachmentModal.session}
        onSave={handleAddAttachment}
      />
      
      <AnnouncementModal
        isOpen={announcementModal.isOpen}
        onClose={() => setAnnouncementModal({ isOpen: false, session: null })}
        session={announcementModal.session}
        onSave={handleAddAnnouncement}
      />
    </div>
  );
};

export default MySchedule;