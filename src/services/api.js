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
      return await session.getToken();
    }
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
    }
    
    return config;
  },
  (error) => {
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
    throw new Error(error.response?.data?.message || 'Failed to vote on poll');
  }
};

// Remove vote from a poll
export const removeVote = async (pollId) => {
  try {
    const response = await api.delete(`/polls/${pollId}/vote`);
    return response.data;
  } catch (error) {
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
    const response = await api.get('/sessions/requests');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session requests');
  }
};

// Accept a session request
export const acceptSessionRequest = async (pollId) => {
  try {
    const response = await api.post(`/sessions/requests/${pollId}/accept`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to accept session request');
  }
};

// Decline a session request
export const declineSessionRequest = async (pollId) => {
  try {
    const response = await api.post(`/sessions/requests/${pollId}/decline`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to decline session request');
  }
};

// Schedule a session with tutor details
export const scheduleSession = async (pollId, sessionData) => {
  try {
    const response = await api.post(`/sessions/${pollId}/schedule`, sessionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to schedule session');
  }
};

// Get scheduled sessions for students (only for sessions they voted on)
export const getMyScheduledSessions = async () => {
  try {
    const response = await api.get('/sessions/my-sessions');
    return response.data;
  } catch (error) {
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

export { api };