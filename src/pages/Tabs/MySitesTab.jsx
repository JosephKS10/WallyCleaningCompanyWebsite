import React, { useState } from 'react';

const MySitesTab = ({ cleaner }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter sites based on search term
  const filteredSites = cleaner?.siteInfo?.filter(site => {
    if (!searchTerm) return true;
    return (
      (site.site_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (site.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (site.siteStatus?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }) || [];

  const handleSiteClick = (site) => {
    setSelectedSite(site);
  };

  const getSelectedDays = (everydayValuation) => {
    if (!everydayValuation) return [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.filter(day => everydayValuation[day]?.selected);
  };

  return (
    <div className="my-sites-tab">
      <h2 className="section-title">My Sites</h2>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search sites by name, location, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="sites-container">
        {/* Sites List */}
        <div className="sites-list">
          <h3 className="section-subtitle">All Sites ({filteredSites.length})</h3>
          
          {filteredSites.length > 0 ? (
            <div className="sites-grid">
              {filteredSites.map((site, index) => (
                <div 
                  key={site._id || index}
                  className={`site-card ${selectedSite?._id === site._id ? 'selected' : ''}`}
                  onClick={() => handleSiteClick(site)}
                >
                  <div className="site-card-header">
                    <h4 className="site-name">{site.site_name || 'Unnamed Site'}</h4>
                    <span className={`status-badge status-${site.siteStatus}`}>
                      {site.siteStatus.charAt(0).toUpperCase() + site.siteStatus.slice(1)}
                    </span>
                  </div>
                  
                  <div className="site-card-body">
                    <div className="site-detail">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{site.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="site-detail">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{site.cleaning_frequency || 'Frequency not set'}</span>
                    </div>
                    
                    <div className="site-detail">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Contractor: {site.contractor_name || cleaner?.name}</span>
                    </div>
                    
                    {site.cost_to_invoice && (
                      <div className="site-detail">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Monthly: ${site.cost_to_invoice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="site-card-footer">
                    <span className="assigned-date">
                      Assigned: {new Date(site.assignedDate).toLocaleDateString()}
                    </span>
                    <button className="view-details-btn">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>No sites found matching your search.</p>
            </div>
          )}
        </div>

        {/* Site Details Panel */}
        {selectedSite && (
          <div className="site-details-panel">
            <div className="panel-header">
              <h3 className="panel-title">Site Details</h3>
              <button 
                className="close-panel-btn"
                onClick={() => setSelectedSite(null)}
              >
                ×
              </button>
            </div>
            
            <div className="panel-content">
              <div className="detail-section">
                <h4 className="detail-title">Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Site Name</label>
                    <p>{selectedSite.site_name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p>{selectedSite.location}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-badge status-${selectedSite.siteStatus}`}>
                      {selectedSite.siteStatus.charAt(0).toUpperCase() + selectedSite.siteStatus.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Cleaning Frequency</label>
                    <p>{selectedSite.cleaning_frequency}</p>
                  </div>
                  <div className="detail-item">
                    <label>Cleaning Times</label>
                    <p>{selectedSite.cleaning_times}</p>
                  </div>
                  <div className="detail-item">
                    <label>Assigned Date</label>
                    <p>{new Date(selectedSite.assignedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Cleaning Schedule */}
              {selectedSite.everydayValuation && (
                <div className="detail-section">
                  <h4 className="detail-title">Cleaning Schedule</h4>
                  <div className="schedule-grid">
                    {Object.entries(selectedSite.everydayValuation)
                      .filter(([day, data]) => day !== '_id')
                      .map(([day, data]) => (
                        <div 
                          key={day} 
                          className={`schedule-day ${data.selected ? 'selected' : ''}`}
                        >
                          <span className="day-name">{day}</span>

                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="detail-section">
                <h4 className="detail-title">Additional Information</h4>
                {selectedSite.scope_of_work && (
                  <div className="detail-item">
                    <label>Scope of Work</label>
                    <a 
                      href={selectedSite.scope_of_work} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      View Document
                    </a>
                  </div>
                )}
                
                {selectedSite.additional_notes && (
                  <div className="detail-item">
                    <label>Additional Notes</label>
                    <p className="notes">{selectedSite.additional_notes}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="detail-section">
                <h4 className="detail-title">Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Contractor Name</label>
                    <p>{selectedSite.contractor_name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Contractor Email</label>
                    <p>{selectedSite.contractor_email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Invoice Recipient</label>
                    <p>{selectedSite.invoice_recipient_name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Invoice Email</label>
                    <p>{selectedSite.invoice_recipient_email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySitesTab;