import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { getTutorScheduledSessions, addMeetingLink, addSessionAttachment, addSessionAnnouncement, downloadAttachment, markSessionCompleted } from '../../services/api';
import WhatsAppGroupManager from '../../components/WhatsAppGroupManager';
import toast from 'react-hot-toast';

const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming':
    case 'confirmed': 
    case 'scheduled': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'upcoming': return 'Upcoming';
    case 'scheduled': return 'Upcoming'; // Map 'scheduled' to 'Upcoming'
    case 'confirmed': return 'Confirmed';
    case 'pending': return 'Pending';
    case 'cancelled': return 'Cancelled';
    case 'completed': return 'Completed';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
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
  const [whatsappModal, setWhatsappModal] = useState({ isOpen: false, session: null });

  // Filter states
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

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

  const upcomingSessions = sessionsData?.data?.filter(session => 
    session.status !== 'ready_to_schedule' // Extra safety: exclude ready_to_schedule sessions
  ) || [];

  // Filter sessions based on completion status and search
  const filteredSessions = upcomingSessions.filter(session => {
    // Categorize sessions
    const isCompleted = session.status === 'completed';
    const isUpcoming = !isCompleted;
    const isToday = session.date && new Date(session.date).toDateString() === new Date().toDateString();

    // Apply filter
    if (activeFilter === 'upcoming' && !isUpcoming) return false;
    if (activeFilter === 'completed' && !isCompleted) return false;
    if (activeFilter === 'today' && (!isToday || isCompleted)) return false;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (session.title && session.title.toLowerCase().includes(searchLower)) ||
        (session.subject && session.subject.toLowerCase().includes(searchLower)) ||
        (session.topic && session.topic.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Sort sessions: upcoming by date (earliest first), completed by date (most recent first)
  const sortedSessions = filteredSessions.sort((a, b) => {
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';
    
    if (aCompleted === bCompleted && a.date && b.date) {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return aCompleted ? bDate - aDate : aDate - bDate; // Completed: recent first, Upcoming: earliest first
    }
    
    return aCompleted ? 1 : -1; // Upcoming sessions first
  });

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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: 'upcoming', label: '📅 Upcoming', count: upcomingSessions.filter(s => s.status !== 'completed').length },
                { key: 'today', label: '⏰ Today', count: upcomingSessions.filter(s => s.date && new Date(s.date).toDateString() === new Date().toDateString() && s.status !== 'completed').length },
                { key: 'completed', label: '✅ Completed', count: upcomingSessions.filter(s => s.status === 'completed').length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {sortedSessions.length} of {upcomingSessions.length} sessions
          </p>
        </div>
        {sortedSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">
                <div className="text-gray-400 text-4xl mb-4">
                  {activeFilter === 'completed' ? '✅' : activeFilter === 'today' ? '⏰' : '📅'}
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No {activeFilter} sessions
                </h3>
                <p className="text-gray-500">
                  {activeFilter === 'completed' ? 'Complete some sessions to see them here' : 
                   activeFilter === 'today' ? 'No sessions scheduled for today' :
                   'No upcoming sessions scheduled'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedSessions.map((session) => {
            const isToday = session.date && new Date(session.date).toDateString() === new Date().toDateString();
            const isCompleted = session.status === 'completed';
            
            return (
              <Card key={session._id || session.id} className={`hover:shadow-lg transition-shadow duration-300 ${
                isCompleted ? 'opacity-75 border-gray-300' : 
                isToday ? 'border-green-400 bg-green-50' : 'border-blue-200'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className={`text-xl ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                          {session.subject || session.title}
                        </CardTitle>
                        {isCompleted && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            ✅ Completed
                          </span>
                        )}
                        {isToday && !isCompleted && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            ⏰ Today
                          </span>
                        )}
                      </div>
                      <p className={`mb-3 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                        {session.topic || session.chapter}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusLabel(session.status)}
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

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
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
                      onClick={() => setWhatsappModal({ isOpen: true, session })}
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp Group
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="text-sm bg-amber-50 hover:bg-amber-100 text-amber-700"
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
            );
          })
        )}
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

      {/* WhatsApp Group Manager Modal */}
      {whatsappModal.isOpen && whatsappModal.session && (
        <WhatsAppGroupManager
          session={whatsappModal.session}
          isTutor={true}
          onClose={() => setWhatsappModal({ isOpen: false, session: null })}
        />
      )}
    </div>
  );
};

export default MySchedule;