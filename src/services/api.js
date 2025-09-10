// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get Clerk session token
const getClerkToken = async () => {
  try {
    // AUTHENTICATION: Get token from Clerk session
    const { session } = window.Clerk || {};
    if (session) {
      const token = await session.getToken();
      console.log('Clerk token retrieved:', token ? 'Token present' : 'No token');
      return token;
    }
    console.log('No Clerk session found');
    return null;
  } catch (error) {
    console.error('Error getting Clerk token:', error);
    return null;
  }
};

// Add request interceptor to add Clerk token
api.interceptors.request.use(
  async (config) => {
    // AUTHENTICATION: Add Clerk token to requests
    // Add authentication token for requests
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} - Token added`);
    } else {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} - No token available`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // AUTHENTICATION: Handle token refresh
      // Uncomment when deploying with authentication
      /*
      try {
        // Try to get a fresh token from Clerk
        const newToken = await getClerkToken();
        
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // If no token available, redirect to login
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
      */
      
      console.error('Authentication error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    // console.log('API: Sending poll data:', JSON.stringify(pollData, null, 2));
    const response = await api.post('/polls', pollData);
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
      validationErrors: error.response?.data?.validationErrors
    });
    console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.message || 'Failed to create poll');
  }
};

// Get all polls with filters
export const getPolls = async (filters = {}) => {
  try {
    const response = await api.get('/polls', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch polls');
  }
};

// Get trending polls
export const getTrendingPolls = async () => {
  try {
    const response = await api.get('/polls/trending');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trending polls');
  }
};

// Vote on a poll
export const voteOnPoll = async (pollId) => {
  try {
    const response = await api.post(`/polls/${pollId}/vote`);
    return response.data;
  } catch (error) {
    console.error('API: Vote failed:', {
      pollId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to vote on poll');
  }
};

// Remove vote from a poll
export const removeVote = async (pollId) => {
  try {
    const response = await api.delete(`/polls/${pollId}/vote`);
    return response.data;
  } catch (error) {
    console.error('API: Remove vote failed:', {
      pollId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to remove vote');
  }
};

// Get poll details
export const getPollDetails = async (pollId) => {
  try {
    const response = await api.get(`/polls/${pollId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch poll details');
  }
};

// Delete a poll
export const deletePoll = async (pollId) => {
  try {
    const response = await api.delete(`/polls/${pollId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete poll');
  }
};

// Get poll statistics
export const getPollStats = async () => {
  try {
    const response = await api.get('/polls/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch poll statistics');
  }
};

// Get session requests for tutors (polls with >50% votes)
export const getSessionRequests = async () => {
  try {
    console.log('📡 API: Fetching session requests...');
    const response = await api.get('/sessions/requests');
    console.log('📡 API: Session requests received:', {
      count: response.data.data?.length || 0,
      requests: response.data.data?.map(req => ({
        id: req._id,
        title: req.title,
        status: req.status,
        acceptedBy: req.acceptedBy,
        declinedBy: req.declinedBy
      })) || []
    });
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to fetch session requests:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch session requests');
  }
};

// Accept a session request
export const acceptSessionRequest = async (pollId) => {
  try {
    console.log('✅ API: Accepting session request:', pollId);
    const response = await api.post(`/sessions/requests/${pollId}/accept`);
    console.log('✅ API: Session request accepted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to accept session request:', {
      pollId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to accept session request');
  }
};

// Decline a session request
export const declineSessionRequest = async (pollId) => {
  try {
    console.log('❌ API: Declining session request:', pollId);
    const response = await api.post(`/sessions/requests/${pollId}/decline`);
    console.log('❌ API: Session request declined successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to decline session request:', {
      pollId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to decline session request');
  }
};

// Schedule a session with tutor details
export const scheduleSession = async (pollId, sessionData) => {
  try {
    console.log('📅 API: Scheduling session for poll:', pollId);
    console.log('📋 Session data being sent:', sessionData);
    
    // Validate required fields
    const requiredFields = ['date', 'time', 'duration', 'feePerStudent', 'maxStudents'];
    const missingFields = requiredFields.filter(field => !sessionData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const response = await api.post(`/sessions/${pollId}/schedule`, sessionData);
    console.log('✅ Session scheduled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Error scheduling session:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    throw new Error(error.response?.data?.message || 'Failed to schedule session');
  }
};

// Get scheduled sessions for students (only for sessions they voted on)
export const getMyScheduledSessions = async () => {
  try {
    console.log('📡 API: Fetching student scheduled sessions...');
    const response = await api.get('/sessions/my-sessions');
    console.log('📡 API: Student sessions received:', {
      count: response.data.data?.length || response.data.sessions?.length || 0,
      sessions: (response.data.data || response.data.sessions || []).map(session => ({
        id: session._id,
        title: session.title,
        meetingLink: session.meetingLink,
        attachments: session.attachments,
        announcements: session.announcements
      }))
    });
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to fetch student sessions:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch scheduled sessions');
  }
};

// Get scheduled sessions for tutors (sessions they are teaching)
export const getTutorScheduledSessions = async () => {
  try {
    const response = await api.get('/sessions/tutor-schedule');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tutor schedule');
  }
};

// Get accepted sessions awaiting scheduling (new function)
export const getAcceptedSessions = async () => {
  try {
    console.log('📡 API: Fetching accepted sessions...');
    const response = await api.get('/sessions/accepted');
    console.log('📡 API: Accepted sessions received:', {
      count: response.data.data?.length || 0,
      sessions: response.data.data?.map(session => ({
        id: session._id,
        title: session.title,
        status: session.status,
        acceptedBy: session.acceptedBy
      })) || []
    });
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to fetch accepted sessions:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch accepted sessions');
  }
};

// Add meeting link to a session
export const addMeetingLink = async (sessionId, meetingLink) => {
  try {
    console.log('🔗 API: Adding meeting link to session:', sessionId);
    const response = await api.post(`/sessions/${sessionId}/meeting-link`, { meetingLink });
    console.log('✅ Meeting link added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to add meeting link:', {
      sessionId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to add meeting link');
  }
};

// Add attachment to a session
export const addSessionAttachment = async (sessionId, file, description = '') => {
  try {
    console.log('📎 API: Adding attachment to session:', sessionId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    
    const response = await api.post(`/sessions/${sessionId}/attachment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Attachment uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to upload attachment:', {
      sessionId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to upload attachment');
  }
};

// Add announcement to a session
export const addSessionAnnouncement = async (sessionId, announcement) => {
  try {
    console.log('📢 API: Adding announcement to session:', sessionId);
    const response = await api.post(`/sessions/${sessionId}/announcement`, { announcement });
    console.log('✅ Announcement posted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Failed to post announcement:', {
      sessionId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to post announcement');
  }
};

// Download attachment from a session
export const downloadAttachment = async (sessionId, fileName, originalName) => {
  try {
    console.log('⬇️ API: Downloading attachment:', { sessionId, fileName });
    
    const response = await api.get(`/sessions/${sessionId}/attachments/${fileName}`, {
      responseType: 'blob'
    });

    // Create blob URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalName || fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ File downloaded successfully:', originalName);
    return { success: true };
  } catch (error) {
    console.error('❌ API: Failed to download attachment:', {
      sessionId,
      fileName,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw new Error(error.response?.data?.message || 'Failed to download attachment');
  }
};

export { api };