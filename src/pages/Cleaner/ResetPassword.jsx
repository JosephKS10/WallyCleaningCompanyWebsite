import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCleanerAuth } from '../../contexts/CleanerAuthContext';
import './CleanerAuth.css';



const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL parameter
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { resetPassword, error: authError } = useCleanerAuth();
  const navigate = useNavigate();

  // Check if token exists in URL
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await resetPassword(token, formData.newPassword);
    
    if (result.success) {
      setIsSubmitted(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/cleaner/login');
      }, 3000);
    } else {
      // If token is invalid or expired
      if (result.error && (result.error.includes('Invalid') || result.error.includes('expired'))) {
        setTokenValid(false);
      }
    }
    
    setIsSubmitting(false);
  };

  // Token invalid or expired
  if (!tokenValid) {
    return (
      <div className="cleaner-auth-container">
        <div className="cleaner-auth-card">
          <div className="cleaner-auth-header">
            <div className="error-icon">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="cleaner-auth-title">Invalid or Expired Link</h2>
            <p className="cleaner-auth-subtitle">
              This password reset link is invalid or has expired.
              Please request a new password reset link.
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/cleaner/forgot-password" className="cleaner-auth-btn block text-center">
              Request New Reset Link
            </Link>
          </div>
          
          <div className="mt-4">
            <Link to="/cleaner/login" className="cleaner-auth-footer-link block text-center">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success page
  if (isSubmitted) {
    return (
      <div className="cleaner-auth-container">
        <div className="cleaner-auth-card">
          <div className="cleaner-auth-header">
            <div className="success-icon">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="cleaner-auth-title">Password Reset Successful!</h2>
            <p className="cleaner-auth-subtitle">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/cleaner/login" className="cleaner-auth-btn block text-center">
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="cleaner-auth-container">
      <div className="cleaner-auth-card">
        <div className="cleaner-auth-header">
          <h2 className="cleaner-auth-title">Set New Password</h2>
          <p className="cleaner-auth-subtitle">
            Please enter your new password below. Make sure it's at least 8 characters long.
          </p>
        </div>
        
        {authError && (
          <div className="cleaner-auth-error">
            {authError}
          </div>
        )}
        
        <form className="cleaner-auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter new password (min. 8 characters)"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            <PasswordStrengthIndicator password={formData.newPassword} />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button
            type="submit"
            className="cleaner-auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loader"></span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        
        <div className="cleaner-auth-footer">
          <p className="cleaner-auth-footer-text">
            Remember your password?{' '}
            <Link to="/cleaner/login" className="cleaner-auth-footer-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(pwd)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(pwd)) strength++;
    
    // Contains numbers
    if (/[0-9]/.test(pwd)) strength++;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 2) return { label: 'Weak', className: 'weak' };
    if (strength <= 4) return { label: 'Fair', className: 'fair' };
    return { label: 'Good', className: 'good' };
  };

  const strength = calculateStrength(password);
  const { label, className } = getStrengthLabel(strength);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-meter">
        <div className={`strength-fill ${className}`}></div>
      </div>
      <p className={`strength-text ${className}`}>
        Password strength: {label}
      </p>
    </div>
  );
};


export default ResetPassword;