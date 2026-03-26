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

// Shift API functions
export const shiftAPI = {
  // Get shifts (pass cleanerId and date ranges in params)
  getMyShifts: async (params = {}) => {
    try {
      const response = await api.get('/shifts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  },

  // Clock In or Out
  clockInOut: async (shiftId, action) => {
    try {
      // action should be 'clockIn' or 'clockOut'
      const response = await api.put(`/shifts/${shiftId}/clock`, { action });
      return response.data;
    } catch (error) {
      console.error(`Error with ${action}:`, error);
      throw error;
    }
  }
};

export const auditAPI = {
  // Get cleaner profile
  getAuditsBySite: async (siteId) => {
    try {
      const response = await api.get(`/audits/site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cleaner profile:', error);
      throw error;
    }
  },

  getAuditFile: async (auditId) => {
    try {
      const response = await api.get(`/audits/${auditId}/file`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching audit file:', error);
      throw error;
    }
  },

  getRectificationFile: async (auditId) => {
  try {
    const response = await api.get(`/audits/${auditId}/rectification-file`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error fetching rectification file:', error);
    throw error;
  }
},

  uploadRectification: async (auditId, formData) => {
    try {
      const response = await api.post(`/audits/${auditId}/rectification`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading rectification:', error);
      throw error;
    }
  }
  
};

export const orderAPI = {
  // Fetch orders for a specific site
  getOrdersBySite: async (siteId) => {
    try {
      const response = await api.get(`/orders/site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
};

export const leaveAPI = {
  // Submit leave request
  submitLeaveRequest: async (leaveData) => {
    try {
      const response = await api.post('/leaves', leaveData);
      return response.data;
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw error;
    }
  },


  // Get cleaner's leave requests
  getCleanerLeaves: async (params = {}) => {
    try {
      const response = await api.get('/leaves/my-leaves', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  },

  // Get upcoming leaves
  getUpcomingLeaves: async () => {
    try {
      const response = await api.get('/leaves/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming leaves:', error);
      throw error;
    }
  },

  // Check leave availability
  checkLeaveAvailability: async (startDate, endDate) => {
    try {
      const response = await api.post('/leaves/check-availability', { startDate, endDate });
      return response.data;
    } catch (error) {
      console.error('Error checking leave availability:', error);
      throw error;
    }
  },

  // Cancel leave request
  cancelLeaveRequest: async (leaveId) => {
    try {
      const response = await api.put(`/leaves/${leaveId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling leave request:', error);
      throw error;
    }
  },

  // Get single leave request
  getLeaveRequest: async (leaveId) => {
    try {
      const response = await api.get(`/leaves/${leaveId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave request:', error);
      throw error;
    }
  }
};

// Cleaner Notification API functions
export const cleanerNotificationAPI = {
  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/cleaner-notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cleaner notifications:', error);
      throw error;
    }
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/cleaner-notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/cleaner-notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/cleaner-notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

export default api;