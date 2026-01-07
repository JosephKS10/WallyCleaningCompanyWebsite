import React, { useState } from 'react';

const LeaveRequestTab = ({ cleaner }) => {
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    supportingDocument: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      supportingDocument: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement leave request submission
    alert('Leave request submitted successfully!');
    setFormData({
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
      emergencyContact: '',
      supportingDocument: null
    });
  };

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
  ];

  return (
    <div className="leave-request-tab">
      <h2 className="section-title">Leave Request Form</h2>
      


      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-section">
          <h3 className="form-title">Leave Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="leaveType">Leave Type *</label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
              >
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Reason for Leave</h3>
          
          <div className="form-group">
            <label htmlFor="reason">Reason *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Please provide details about your leave request..."
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Emergency Contact</h3>
          
          <div className="form-group">
            <label htmlFor="emergencyContact">
              Emergency Contact Number *
            </label>
            <input
              type="tel"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Enter emergency contact number"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Supporting Documents</h3>
          
          <div className="form-group">
            <label htmlFor="supportingDocument">
              Upload Supporting Document (if required)
            </label>
            <input
              type="file"
              id="supportingDocument"
              name="supportingDocument"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="file-hint">
              For sick leave, please upload a medical certificate.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Leave Request
          </button>
        </div>
      </form>

      {/* Recent Leave Requests */}
      <div className="recent-requests">
        <h3 className="section-subtitle">Recent Leave Requests</h3>
        <div className="requests-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dec 15, 2025</td>
                <td>Annual Leave</td>
                <td>3 days</td>
                <td><span className="status-approved">Approved</span></td>
              </tr>
              <tr>
                <td>Nov 10, 2025</td>
                <td>Sick Leave</td>
                <td>2 days</td>
                <td><span className="status-approved">Approved</span></td>
              </tr>
              <tr>
                <td>Pending</td>
                <td>--</td>
                <td>--</td>
                <td><span className="status-pending">No requests</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestTab;