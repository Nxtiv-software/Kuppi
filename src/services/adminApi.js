// src/services/adminApi.js
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
    const { session } = window.Clerk || {};
    if (session) {
      const token = await session.getToken();
      return token;
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

// Admin Overview
export const getAdminOverview = async () => {
  const response = await api.get('/api/admin/overview');
  return response.data;
};

// System Analytics
export const getSystemAnalytics = async (period = 30) => {
  const response = await api.get('/api/admin/analytics', {
    params: { period }
  });
  return response.data;
};

// User Management
export const getAllUsers = async ({ page = 1, limit = 20, role = 'all', search = '' }) => {
  const response = await api.get('/api/admin/users', {
    params: { page, limit, role, search }
  });
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/api/admin/users/${userId}`);
  return response.data;
};

export const createUser = async ({ email, username, password, role = 'student' }) => {
  const response = await api.post('/api/admin/users', {
    email,
    username,
    password,
    role
  });
  return response.data;
};

export const updateUser = async ({ userId, username, email, role }) => {
  const response = await api.put(`/api/admin/users/${userId}`, {
    username,
    email,
    role
  });
  return response.data;
};

export const updateUserRole = async ({ userId, role }) => {
  const response = await api.patch(`/api/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
};

// Session Management
export const getAllSessions = async ({ 
  page = 1, 
  limit = 20, 
  status = 'all', 
  subject = 'all',
  source = 'all',
  tutorId = '',
  search = ''
}) => {
  const response = await api.get('/api/admin/sessions', {
    params: { page, limit, status, subject, source, tutorId, search }
  });
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/api/admin/sessions/${sessionId}`);
  return response.data;
};

export const cancelSession = async (sessionId, reason = '') => {
  const response = await api.patch(`/api/admin/sessions/${sessionId}/cancel`, { reason });
  return response.data;
};

export const forceEndSession = async (sessionId) => {
  const response = await api.patch(`/api/admin/sessions/${sessionId}/force-end`);
  return response.data;
};

// Poll Management
export const getAllPolls = async ({ 
  page = 1, 
  limit = 20, 
  status = 'active',
  search = '' 
}) => {
  const response = await api.get('/api/admin/polls', {
    params: { page, limit, status, search }
  });
  return response.data;
};

export const deletePoll = async (pollId) => {
  const response = await api.delete(`/api/admin/polls/${pollId}`);
  return response.data;
};

export const updatePollStatus = async (pollId, status, reason = '') => {
  const response = await api.patch(`/api/admin/polls/${pollId}/status`, { status, reason });
  return response.data;
};

export const forceClosePoll = async (pollId) => {
  const response = await api.patch(`/api/admin/polls/${pollId}/force-close`);
  return response.data;
};

// Tutor Applications Management
export const getTutorApplications = async ({ page = 1, limit = 20, status = 'all' }) => {
  const response = await api.get('/api/tutor-applications', {
    params: { page, limit, status }
  });
  return response.data;
};

export const approveTutorApplication = async (applicationId) => {
  const response = await api.patch(`/api/tutor-applications/${applicationId}/approve`);
  return response.data;
};

export const rejectTutorApplication = async (applicationId, adminNote = '') => {
  const response = await api.patch(`/api/tutor-applications/${applicationId}/reject`, { adminNote });
  return response.data;
};

export const deleteTutorApplication = async (applicationId) => {
  const response = await api.delete(`/api/tutor-applications/${applicationId}`);
  return response.data;
};

export const updateTutorApplicationEmail = async (applicationId, email) => {
  const response = await api.patch(`/api/tutor-applications/${applicationId}/email`, { email });
  return response.data;
};

export default {
  getAdminOverview,
  getSystemAnalytics,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getAllSessions,
  deleteSession,
  cancelSession,
  forceEndSession,
  getAllPolls,
  deletePoll,
  updatePollStatus,
  forceClosePoll,
  getTutorApplications,
  approveTutorApplication,
  rejectTutorApplication,
  deleteTutorApplication,
  updateTutorApplicationEmail,
};
