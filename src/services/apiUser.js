// src/services/apiUser.js
import { api } from './api';

// User registration function
export async function addUser(userData) {
  try {
    console.log("Sending to backend:", userData);
    const response = await api.post('/auth', userData);
    const { user, accessToken, refreshToken } = response.data;
    console.log(user);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, accessToken, refreshToken };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || "Something went wrong";
    console.error("Signup failed:", errorMessage);
    throw new Error(errorMessage);
  }
}

// Updated login function with refresh token support
export const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful:', data.user.name);
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    const response = await fetch('http://localhost:8000/login/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('Logged out successfully');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// Updated API call function that handles token refresh
export const makeAuthenticatedRequest = async (url, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    window.location.href = '/login';
    return null;
  }

  const makeRequest = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  let response = await makeRequest(accessToken);
  
  if (response.status === 401) {
    const responseData = await response.json();
    
    if (responseData.code === 'TOKEN_EXPIRED') {
      console.log('Token expired, attempting to refresh...');
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return null;
      }

      try {
        const refreshResponse = await fetch('http://localhost:8000/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('accessToken', refreshData.accessToken);
          localStorage.setItem('refreshToken', refreshData.refreshToken);
          response = await makeRequest(refreshData.accessToken);
        } else {
          localStorage.clear();
          window.location.href = '/login';
          return null;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return null;
      }
    } else {
      localStorage.clear();
      window.location.href = '/login';
      return null;
    }
  }

  return response;
};

// Example usage function for making authenticated requests
export const fetchPolls = async () => {
  try {
    const response = await makeAuthenticatedRequest('http://localhost:8000/polls');
    if (response && response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch polls:', error);
    return null;
  }
};