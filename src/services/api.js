// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to dynamically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken: refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    const response = await api.post('/polls', pollData);
    return response.data;
  } catch (error) {
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

export { api };