import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import rateLimiter from '../utils/rateLimiter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const CleanerAuthContext = createContext(null);

export const useCleanerAuth = () => {
  const context = useContext(CleanerAuthContext);
  if (!context) {
    throw new Error('useCleanerAuth must be used within a CleanerAuthProvider');
  }
  return context;
};

export const CleanerAuthProvider = ({ children }) => {
  const [cleaner, setCleaner] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper to dispatch auth change events
  const dispatchAuthChange = useCallback(() => {
    window.dispatchEvent(new Event('cleaner-auth-change'));
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('cleaner_token');
    const storedCleaner = localStorage.getItem('cleaner_data');
    const tokenExpiry = localStorage.getItem('cleaner_token_expiry');

    if (storedToken && storedCleaner && tokenExpiry) {
      // Check if token is expired
      if (new Date().getTime() > parseInt(tokenExpiry)) {
        logout();
      } else {
        setToken(storedToken);
        setCleaner(JSON.parse(storedCleaner));
        
        // Set auto logout timer
        const timeUntilExpiry = parseInt(tokenExpiry) - new Date().getTime();
        setTimeout(logout, timeUntilExpiry);
      }
    }
    setLoading(false);
  }, []);

  // Login function with rate limiting
  const login = async (email, password) => {
    try {
      setError(null);
      
      // Check rate limiting
      const rateLimitCheck = rateLimiter.isLocked(email);
      if (rateLimitCheck.locked) {
        return { 
          success: false, 
          error: `Too many attempts. Please try again in ${rateLimitCheck.remainingTime} minutes.`,
          rateLimited: true
        };
      }

      const response = await axios.post(`${API_BASE_URL}/cleaners/login`, {
        email,
        password
      });

      const { token, cleaner: cleanerData } = response.data;
      
      // Reset rate limiter on successful login
      rateLimiter.resetAttempts(email);
      
      // Set token expiry for 7 days
      const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
      
      // Store in localStorage
      localStorage.setItem('cleaner_token', token);
      localStorage.setItem('cleaner_data', JSON.stringify(cleanerData));
      localStorage.setItem('cleaner_token_expiry', expiryTime.toString());
      
      // Set state
      setToken(token);
      setCleaner(cleanerData);
      
      // Dispatch auth change event
      dispatchAuthChange();
      
      // Set auto logout timer
      setTimeout(logout, 7 * 24 * 60 * 60 * 1000);
      
      return { success: true, data: cleanerData };
    } catch (err) {
      // Record failed attempt
      const rateLimitResult = rateLimiter.recordAttempt(email);
      
      let errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      
      if (rateLimitResult.locked) {
        errorMessage = `Too many failed attempts. Please try again in 15 minutes.`;
      } else if (rateLimitResult.attemptsRemaining < 3) {
        errorMessage += ` ${rateLimitResult.attemptsRemaining} attempts remaining.`;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        rateLimited: rateLimitResult.locked
      };
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('cleaner_token');
    localStorage.removeItem('cleaner_data');
    localStorage.removeItem('cleaner_token_expiry');
    setToken(null);
    setCleaner(null);
    
    // Dispatch auth change event
    dispatchAuthChange();
    
    navigate('/cleaner/login');
  }, [navigate, dispatchAuthChange]);

  // Forgot password function with rate limiting
  const forgotPassword = async (email) => {
    try {
      setError(null);
      
      // Check rate limiting for forgot password
      const rateLimitCheck = rateLimiter.isLocked(`forgot-${email}`);
      if (rateLimitCheck.locked) {
        return { 
          success: false, 
          error: `Too many password reset requests. Please try again in ${rateLimitCheck.remainingTime} minutes.`,
          rateLimited: true
        };
      }

      // Record attempt
      const rateLimitResult = rateLimiter.recordAttempt(`forgot-${email}`);
      
      const response = await axios.post(`${API_BASE_URL}/cleaners/forgot-password`, {
        email
      });
      
      if (rateLimitResult.locked) {
        return { 
          success: false, 
          error: 'Too many password reset requests. Please try again in 15 minutes.',
          rateLimited: true
        };
      }
      
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      
      // The backend expects token and newPassword in the request body
      const response = await axios.post(`${API_BASE_URL}/cleaners/reset-password`, {
        token,
        newPassword
      });
      
      return { success: true, message: response.data.message };
    } catch (err) {
      let errorMessage = err.response?.data?.message || 'Failed to reset password.';
      
      // Provide more user-friendly messages
      if (err.response?.status === 400) {
        if (errorMessage.includes('Invalid or expired')) {
          errorMessage = 'This reset link is invalid or has expired. Please request a new one.';
        } else if (errorMessage.includes('Token')) {
          errorMessage = 'The reset token is invalid. Please request a new password reset link.';
        }
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password function (requires authentication)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await axios.put(
        `${API_BASE_URL}/cleaners/profile/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get cleaner profile - memoized to prevent unnecessary re-renders
  const getProfile = useCallback(async () => {
    if (!token) {
      return { success: false, error: 'No authentication token' };
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/cleaners/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedCleaner = response.data.cleaner;
      setCleaner(updatedCleaner);
      localStorage.setItem('cleaner_data', JSON.stringify(updatedCleaner));
      
      return { success: true, data: updatedCleaner };
    } catch (err) {
      // If unauthorized, logout
      if (err.response?.status === 401) {
        logout();
      }
      return { success: false, error: err.response?.data?.message || 'Failed to fetch profile' };
    }
  }, [token, logout]);

  const value = {
    cleaner,
    token,
    loading,
    error,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getProfile,
    isAuthenticated: !!token
  };

  return (
    <CleanerAuthContext.Provider value={value}>
      {children}
    </CleanerAuthContext.Provider>
  );
};

// Protected Route Component - Fixed to prevent unnecessary renders
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCleanerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/cleaner/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};