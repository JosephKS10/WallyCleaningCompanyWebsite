import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cleaner_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('cleaner_token');
      localStorage.removeItem('cleaner_data');
      localStorage.removeItem('cleaner_token_expiry');
      window.location.href = '/cleaner/login';
    }
    return Promise.reject(error);
  }
);

// Site API functions
export const siteAPI = {
  // Get sites by IDs
  getSitesByIds: async (siteIds) => {
    try {
      const response = await api.post('/sites/by-ids', { siteIds });
      return response.data;
    } catch (error) {
      console.error('Error fetching sites by IDs:', error);
      throw error;
    }
  },

  // Get single site
  getSite: async (siteId) => {
    try {
      const response = await api.get(`/sites/${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching site:', error);
      throw error;
    }
  }
};

// Cleaner API functions
export const cleanerAPI = {
  // Get cleaner profile
  getProfile: async () => {
    try {
      const response = await api.get('/cleaners/profile/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching cleaner profile:', error);
      throw error;
    }
  },

  // Update cleaner profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/cleaners/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating cleaner profile:', error);
      throw error;
    }
  }
};

export default api;