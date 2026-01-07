import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCleanerAuth } from '../../contexts/CleanerAuthContext';
import './CleanerAuth.css';

const CleanerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError } = useCleanerAuth();
  const navigate = useNavigate();

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/cleaner/dashboard');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="cleaner-auth-container">
      <div className="cleaner-auth-card">
        <div className="cleaner-auth-header">
          <h2 className="cleaner-auth-title">Cleaner Login</h2>
          <p className="cleaner-auth-subtitle">Welcome back to your dashboard</p>
        </div>
        
        {(authError || errors.general) && (
          <div className="cleaner-auth-error">
            {authError || errors.general}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-options">
            <Link to="/cleaner/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="cleaner-auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loader"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="cleaner-auth-footer">
          <p className="cleaner-auth-footer-text">
            Having trouble logging in?{' '}
            <Link to="/contact" className="cleaner-auth-footer-link">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CleanerLogin;