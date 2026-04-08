import React, { useState, useEffect, useRef } from 'react';
import { siteAPI, leaveAPI } from '../../utils/api';

// Helper to safely format dates to YYYY-MM-DD without UTC timezone drift
const toLocalYMD = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get exactly 00:00:00 in the local timezone for a given date
const getLocalMidnight = (dateInput) => {
  const ymd = toLocalYMD(dateInput);
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const LeaveRequestTab = ({ cleaner }) => {
  const [formData, setFormData] = useState({
    selectedSites: [],
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    emergencyContactNumber: ''
  });

  const [availableSites, setAvailableSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Refs and state for the auto-scroll error highlighting
  const alertBoxRef = useRef(null);
  const [pulseError, setPulseError] = useState(false);

  // Fetch cleaner's sites
  useEffect(() => {
    const fetchSites = async () => {
      if (cleaner?.siteInfo?.length > 0) {
        try {
          setLoadingSites(true);
          const siteIds = cleaner.siteInfo.map(site => {
            if (typeof site.siteId === 'string') return site.siteId;
            if (site.siteId && site.siteId.$oid) return site.siteId.$oid;
            return null;
          })
          .filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));
          
          const response = await siteAPI.getSitesByIds(siteIds);
          setAvailableSites(response.sites || []);
        } catch (error) {
          console.error('Error fetching sites:', error);
        } finally {
          setLoadingSites(false);
        }
      } else {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [cleaner]);

   // Fetch leave history
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await leaveAPI.getCleanerLeaves({ limit: 10, page: 1 });
        if (response.success) {
          setLeaveHistory(response.data.leaves || []);
        }
      } catch (error) {
        console.error('Error fetching leave history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  // Calculate if leave is emergency based on start date (TIMEZONE SAFE)
  useEffect(() => {
    if (formData.startDate) {
      const localStart = getLocalMidnight(formData.startDate);
      const localToday = getLocalMidnight(new Date());
      
      const timeDiff = localStart.getTime() - localToday.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setIsEmergency(dayDiff <= 5 && dayDiff >= 0);
      
      // Check 14-day advance notice for non-emergency
      if (dayDiff > 5 && dayDiff < 14) {
        setValidationError('Standard leave requests MUST be submitted at least 14 days in advance.');
      } else {
        setValidationError('');
      }
    }
  }, [formData.startDate]);

  // Calculate total days (TIMEZONE SAFE)
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const localStart = getLocalMidnight(formData.startDate);
      const localEnd = getLocalMidnight(formData.endDate);
      
      const timeDiff = localEnd.getTime() - localStart.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      setFormData(prev => ({
        ...prev,
        totalDays: dayDiff > 0 ? dayDiff : 0
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSiteSelection = (siteId) => {
    setFormData(prev => {
      const isSelected = prev.selectedSites.includes(siteId);
      return {
        ...prev,
        selectedSites: isSelected
          ? prev.selectedSites.filter(id => id !== siteId)
          : [...prev.selectedSites, siteId]
      };
    });
  };

  const handleSelectAllSites = () => {
    if (availableSites.length === 0) return;
    
    if (formData.selectedSites.length === availableSites.length) {
      setFormData(prev => ({ ...prev, selectedSites: [] }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedSites: availableSites.map(site => site._id)
      }));
    }
  };

  // Trigger error highlight and scroll
  const triggerErrorHighlight = () => {
    alertBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setPulseError(true);
    setTimeout(() => setPulseError(false), 1500); // Remove pulse after 1.5s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation error first so we can scroll to the top!
    if (validationError) {
      triggerErrorHighlight();
      return;
    }

    // Standard Validation
    if (formData.selectedSites.length === 0) {
      alert('Please select at least one site');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('Please select start and end dates');
      return;
    }
    
    // SAFE STRING COMPARISON
    if (toLocalYMD(formData.endDate) < toLocalYMD(formData.startDate)) {
      alert('End date cannot be before start date');
      return;
    }
    
    if (isEmergency && !formData.emergencyContactNumber) {
      alert('Please provide an emergency contact number for emergency leave');
      return;
    }

    setIsSubmitting(true);

    try {
      const leaveRequestData = {
        selectedSites: formData.selectedSites,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        emergencyContactNumber: isEmergency ? formData.emergencyContactNumber : undefined
      };

      const response = await leaveAPI.submitLeaveRequest(leaveRequestData);
      
      if (response.success) {
        alert(isEmergency 
          ? 'Emergency leave request submitted! Management has been notified.' 
          : 'Leave request submitted successfully!'
        );
        
        setFormData({
          selectedSites: [],
          startDate: '',
          endDate: '',
          totalDays: 0,
          reason: '',
          emergencyContactNumber: ''
        });

        const historyResponse = await leaveAPI.getCleanerLeaves({ limit: 10, page: 1 });
        if (historyResponse.success) {
          setLeaveHistory(historyResponse.data.leaves || []);
        }
      } else {
        alert(response.message || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert(error.response?.data?.message || 'Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      const response = await leaveAPI.cancelLeaveRequest(leaveId);
      
      if (response.success) {
        alert('Leave request cancelled successfully');
        const historyResponse = await leaveAPI.getCleanerLeaves({ limit: 10, page: 1 });
        if (historyResponse.success) {
          setLeaveHistory(historyResponse.data.leaves || []);
        }
      } else {
        alert(response.message || 'Failed to cancel leave request');
      }
    } catch (error) {
      console.error('Error cancelling leave request:', error);
      alert(error.response?.data?.message || 'Failed to cancel leave request. Please try again.');
    }
  };

  // TIMEZONE SAFE: Replaced setHours(0) with toLocalYMD
  const getMinDate = () => {
    return toLocalYMD(new Date());
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return toLocalYMD(maxDate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'cancelled': return 'status-inactive';
      default: return 'status-inactive';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="leave-request-tab">
      <h2 className="section-title">Leave Request Form</h2>
      
      {/* Disclaimer / Error Note */}
      <div 
        ref={alertBoxRef}
        className="emergency-alert" 
        style={{ 
          backgroundColor: (isEmergency || validationError) ? '#fff5f5' : '#f0fdf4',
          borderColor: (isEmergency || validationError) ? '#fecaca' : '#bbf7d0',
          transition: 'all 0.3s ease',
          boxShadow: pulseError ? '0 0 0 4px rgba(220, 38, 38, 0.4)' : 'none',
          transform: pulseError ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <div className="alert-icon">
          {(isEmergency || validationError) ? (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="#22A82A" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="alert-content">
          <h3 style={{ color: (isEmergency || validationError) ? '#991b1b' : '#166534', transition: 'color 0.3s', margin: '0 0 0.5rem 0' }}>
            {validationError ? 'Invalid Date Selection' : isEmergency ? 'Emergency Leave Request' : 'Important Notice'}
          </h3>
          <p style={{ color: (isEmergency || validationError) ? '#7f1d1d' : '#166534', margin: 0 }}>
            {isEmergency 
              ? 'This is being processed as an emergency leave request. Management has been notified.' 
              : 'All leave requests must be submitted at least 14 days (2 weeks) in advance. Approval is subject to work coverage and management confirmation.'
            }
            {validationError && (
              <span style={{ display: 'block', marginTop: '8px', color: '#dc2626', fontWeight: '700', fontSize: '1rem' }}>
                {validationError}
              </span>
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="leave-form">
        {/* Site Selection Section */}
        <div className="form-section">
          <div className="form-header">
            <h3 className="form-title">Select Sites for Leave</h3>
            <button
              type="button"
              onClick={handleSelectAllSites}
              className="secondary-btn"
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
            >
              {formData.selectedSites.length === availableSites.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          {loadingSites ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading sites...</p>
            </div>
          ) : availableSites.length === 0 ? (
            <div className="empty-state">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>No sites assigned to you</p>
            </div>
          ) : (
            <div className="sites-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {availableSites.map(site => (
                <div 
                  key={site._id}
                  className={`site-card ${formData.selectedSites.includes(site._id) ? 'selected' : ''}`}
                  onClick={() => handleSiteSelection(site._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="site-card-header">
                    <h3 className="site-name">{site.organization_name} - {site.site_name}</h3>
                  </div>
                  <div className="site-card-body">
                    <div className="site-detail">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{site.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {availableSites.length > 0 && (
            <p className="file-hint" style={{ marginTop: '1rem' }}>
              Selected: {formData.selectedSites.length} of {availableSites.length} sites
            </p>
          )}
        </div>

        {/* Leave Dates Section */}
        <div className="leave-form-section">
          <h3 className="leave-form-title">Leave Dates</h3>
          
          <div className="leave-form-grid">
            <div className="leave-form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                min={getMinDate()}
                max={getMaxDate()}
                style={{ borderColor: validationError ? '#ef4444' : '#e5e7eb' }}
              />
              
              {/* Contextual Warnings */}
              {isEmergency && formData.startDate && (
                <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '600', width: "50vw" }}>
                  ⚠️ This is an emergency leave request 
                </p>
              )}
            </div>
            
            <div className="leave-form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate || getMinDate()}
                max={getMaxDate()}
              />
            </div>
            
            <div className="leave-form-group">
              <label>Total Leave Days</label>
              <div style={{
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                fontWeight: '600',
                color: '#000'
              }}>
                {formData.totalDays} day{formData.totalDays !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        {isEmergency && (
          <div className="leave-form-section">
            <h3 className="leave-form-title">Emergency Contact</h3>
            <div className="leave-form-group">
              <label htmlFor="emergencyContactNumber">
                Emergency Contact Number *
                <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}>
                  &nbsp; - For urgent communication during your leave
                </span>
              </label>
              <input
                type="tel"
                id="emergencyContactNumber"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                placeholder="Enter emergency contact number"
                required={isEmergency}
              />
            </div>
          </div>
        )}

        {/* Reason Section */}
        <div className="leave-form-section">
          <h3 className="leave-form-title">Reason for Leave</h3>
          <div className="leave-form-group">
            <label htmlFor="reason">
              Reason (Optional)
              <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}>
                &nbsp; - Brief explanation for leave
              </span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Please provide a short explanation for your leave request..."
              maxLength="500"
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
              {formData.reason.length}/500 characters
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {formData.selectedSites.length > 0 && formData.startDate && formData.endDate && (
          <div className="leave-form-section" style={{ backgroundColor: isEmergency ? '#fff5f5' : '#f0fdf4' }}>
            <h3 className="leave-form-title" style={{ color: isEmergency ? '#991b1b' : '#166534' }}>
              Leave Request Summary
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Type</h4>
                <p style={{ fontWeight: '600', color: isEmergency ? '#dc2626' : '#22A82A' }}>
                  {isEmergency ? 'Emergency Leave' : 'Standard Leave'}
                </p>
              </div>
              
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Duration</h4>
                <p style={{ fontWeight: '600' }}>
                  {new Date(formData.startDate).toLocaleDateString()} to {new Date(formData.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Sites Affected</h4>
                <p style={{ fontWeight: '600' }}>{formData.selectedSites.length} site(s)</p>
              </div>
              
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Status</h4>
                <span className="status-pending">Pending Approval</span>
              </div>
            </div>
          </div>
        )}

       <div className="leave-form-actions">
          {/* Submit button is enabled even with validation errors so clicking it triggers the scroll */}
          <button 
            type="submit" 
            className="leave-submit-btn"
            disabled={isSubmitting || !formData.selectedSites.length || !formData.startDate || !formData.endDate || (isEmergency && !formData.emergencyContactNumber)}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px' }}></span>
                Submitting...
              </>
            ) : (
              isEmergency ? 'Submit Emergency Leave Request' : 'Submit Leave Request'
            )}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            {isEmergency 
              ? 'Emergency leave requests are processed immediately and management will contact you shortly.'
              : 'Standard leave requests are processed within 2-3 business days.'
            }
          </p>
        </div>
      </form>

      {/* Recent Leave Requests */}
      <div className="recent-requests">
        <h3 className="section-subtitle">Recent Leave Requests</h3>
        
        {loadingHistory ? (
          <div className="loading-state" style={{ padding: '2rem' }}>
            <div className="spinner"></div>
            <p>Loading leave history...</p>
          </div>
        ) : leaveHistory.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No leave requests submitted yet</p>
          </div>
        ) : (
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Sites</th>
                  <th>Duration</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map(leave => (
                  <tr key={leave._id}>
                    <td>{formatDate(leave.submittedAt)}</td>
                    <td>{leave.selectedSites?.length || 0} site(s)</td>
                    <td>
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      <br />
                      <small style={{ color: '#666' }}>{leave.totalDays} day(s)</small>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: leave.isEmergency ? '#fee2e2' : '#dcfce7',
                        color: leave.isEmergency ? '#991b1b' : '#166534',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {leave.isEmergency ? 'Emergency' : 'Standard'}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(leave.status)}>
                        {getStatusText(leave.status)}
                      </span>
                      {leave.rejectionReason && leave.status === 'rejected' && (
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                          <strong>Reason:</strong> {leave.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      {leave.status === 'pending' && (
                        <button
                          onClick={() => handleCancelLeave(leave._id)}
                          className="task-action-btn"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderColor: '#166534', color: '#166534' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestTab;