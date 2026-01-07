import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCleanerAuth } from '../../contexts/CleanerAuthContext';
import './CleanerAuth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, error: authError } = useCleanerAuth();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsSubmitting(true);
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setIsSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

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
            <h2 className="cleaner-auth-title">Check Your Email</h2>
            <p className="cleaner-auth-subtitle">
              If an account exists with {email}, you will receive a password reset link shortly.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/cleaner/login')}
              className="cleaner-auth-btn"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cleaner-auth-container">
      <div className="cleaner-auth-card">
        <div className="cleaner-auth-header">
          <h2 className="cleaner-auth-title">Reset Your Password</h2>
          <p className="cleaner-auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {authError && (
          <div className="cleaner-auth-error">
            {authError}
          </div>
        )}
        
        <form className="cleaner-auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`form-input ${emailError ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          
          <button
            type="submit"
            className="cleaner-auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loader"></span>
            ) : (
              'Send Reset Link'
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

export default ForgotPassword;