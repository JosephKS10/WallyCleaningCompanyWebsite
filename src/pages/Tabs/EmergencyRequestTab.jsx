import React, { useState } from 'react';

const EmergencyRequestTab = ({ cleaner }) => {
  const [formData, setFormData] = useState({
    emergencyType: 'sickness',
    description: '',
    location: '',
    contactNumber: cleaner?.contactNumber || '',
    immediateAction: '',
    expectedReturn: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement emergency request submission
    alert('Emergency request submitted! Management has been notified.');
    setFormData({
      emergencyType: 'sickness',
      description: '',
      location: '',
      contactNumber: cleaner?.contactNumber || '',
      immediateAction: '',
      expectedReturn: ''
    });
  };

  const emergencyTypes = [
    { value: 'sickness', label: 'Sudden Illness' },
    { value: 'accident', label: 'Accident' },
    { value: 'family', label: 'Family Emergency' },
    { value: 'transport', label: 'Transport Issues' },
    { value: 'other', label: 'Other Emergency' }
  ];

  return (
    <div className="emergency-request-tab">
      <h2 className="section-title">Emergency Request Form</h2>
      
      <div className="emergency-alert">
        <div className="alert-icon">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="alert-content">
          <h3>Emergency Use Only</h3>
          <p>
            This form is for emergency situations only. For non-emergency matters,
            please use the Leave Request Form or contact management during business hours.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="form-section">
          <h3 className="form-title">Emergency Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emergencyType">Emergency Type *</label>
              <select
                id="emergencyType"
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleChange}
                required
              >
                {emergencyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Current Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where are you located?"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Emergency Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe the emergency situation in detail..."
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Contact Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expectedReturn">Expected Return Date/Time</label>
              <input
                type="datetime-local"
                id="expectedReturn"
                name="expectedReturn"
                value={formData.expectedReturn}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Immediate Action Required</h3>
          
          <div className="form-group">
            <label htmlFor="immediateAction">
              What immediate action is required from management? *
            </label>
            <textarea
              id="immediateAction"
              name="immediateAction"
              value={formData.immediateAction}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Need replacement for my shift, Require medical assistance, etc."
              required
            />
          </div>
        </div>

        <div className="emergency-contact">
          <h3 className="form-title">Emergency Contacts</h3>
          <div className="contact-list">
            <div className="contact-item">
              <h4>Management Emergency Line</h4>
              <p className="contact-number">1300 424 066</p>
              <p className="contact-hours">Available 24/7</p>
            </div>
            
            <div className="contact-item">
              <h4>On-call Supervisor</h4>
              <p className="contact-number">0412 345 678</p>
              <p className="contact-hours">After hours only</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          
          <p className="form-note">
            By submitting, you acknowledge this is a genuine emergency.
            False reports may result in disciplinary action.
          </p>
          <button type="submit" className="emergency-submit-btn">
            Submit Emergency Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyRequestTab;