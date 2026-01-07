import React, { useState } from 'react';

const RectificationTab = ({ cleaner }) => {
  const [formData, setFormData] = useState({
    site: '',
    issueType: 'quality',
    description: '',
    dateOccurred: '',
    correctiveAction: '',
    attachments: []
  });

  const [submittedForms, setSubmittedForms] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newForm = {
      ...formData,
      id: Date.now(),
      submittedDate: new Date().toISOString(),
      status: 'pending'
    };
    setSubmittedForms(prev => [newForm, ...prev]);
    
    alert('Rectification form submitted successfully!');
    setFormData({
      site: '',
      issueType: 'quality',
      description: '',
      dateOccurred: '',
      correctiveAction: '',
      attachments: []
    });
  };

  const issueTypes = [
    { value: 'quality', label: 'Quality Issue' },
    { value: 'equipment', label: 'Equipment Problem' },
    { value: 'supplies', label: 'Supplies Shortage' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'other', label: 'Other Issue' }
  ];

  const sites = cleaner?.siteInfo?.map(site => ({
    value: site._id,
    label: site.site_name
  })) || [];

  return (
    <div className="rectification-tab">
      <h2 className="section-title">Rectification Form</h2>
      
      <div className="form-intro">
        <p>
          Use this form to report issues or problems encountered during cleaning assignments.
          Please provide detailed information to help us resolve the issue quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rectification-form">
        <div className="form-section">
          <h3 className="form-title">Issue Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="site">Site *</label>
              <select
                id="site"
                name="site"
                value={formData.site}
                onChange={handleChange}
                required
              >
                <option value="">Select a site</option>
                {sites.map(site => (
                  <option key={site.value} value={site.value}>
                    {site.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="issueType">Issue Type *</label>
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOccurred">Date Occurred *</label>
              <input
                type="date"
                id="dateOccurred"
                name="dateOccurred"
                value={formData.dateOccurred}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Issue Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue in detail. Include what happened, when, and where..."
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Corrective Action</h3>
          
          <div className="form-group">
            <label htmlFor="correctiveAction">
              What corrective action did you take (if any)?
            </label>
            <textarea
              id="correctiveAction"
              name="correctiveAction"
              value={formData.correctiveAction}
              onChange={handleChange}
              rows="3"
              placeholder="Describe any immediate actions taken to address the issue..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-title">Attachments</h3>
          
          <div className="form-group">
            <label htmlFor="attachments">
              Upload supporting photos or documents
            </label>
            <div className="file-upload">
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
              />
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Attached Files:</h4>
                <ul>
                  {formData.attachments.map((file, index) => (
                    <li key={index}>
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Rectification Form
          </button>
          <button type="button" className="cancel-btn">
            Clear Form
          </button>
        </div>
      </form>

      {/* Submitted Forms */}
      <div className="submitted-forms">
        <h3 className="section-subtitle">Submitted Rectification Forms</h3>
        
        {submittedForms.length > 0 ? (
          <div className="forms-table">
            <table>
              <thead>
                <tr>
                  <th>Date Submitted</th>
                  <th>Site</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedForms.map(form => (
                  <tr key={form.id}>
                    <td>{new Date(form.submittedDate).toLocaleDateString()}</td>
                    <td>
                      {sites.find(s => s.value === form.site)?.label || form.site}
                    </td>
                    <td>
                      {issueTypes.find(t => t.value === form.issueType)?.label}
                    </td>
                    <td>
                      <span className={`status-${form.status}`}>
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="view-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No rectification forms submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RectificationTab;