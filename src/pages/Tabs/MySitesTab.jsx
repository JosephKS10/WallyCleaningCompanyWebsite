import React, { useState, useEffect } from 'react';
import { siteAPI } from '../../utils/api';

const MySitesTab = ({ cleaner }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sites data when component mounts
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if cleaner has site Info
        if (!cleaner?.siteInfo || !Array.isArray(cleaner.siteInfo) || cleaner.siteInfo.length === 0) {
          setSites([]);
          setLoading(false);
          return;
        }

        // Extract site IDs from cleaner's siteInfo
        const siteIds = cleaner.siteInfo
          .map(site => {
            // Handle both string and object siteId formats
            if (typeof site.siteId === 'string') return site.siteId;
            if (site.siteId && site.siteId.$oid) return site.siteId.$oid;
            return null;
          })
          .filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));

        if (siteIds.length === 0) {
          setSites([]);
          setLoading(false);
          return;
        }

        // Fetch site data using the API
        const response = await siteAPI.getSitesByIds(siteIds);
        
        if (response.sites && Array.isArray(response.sites)) {
          // Merge site data with cleaner's siteInfo
          const mergedSites = response.sites.map(apiSite => {
            // Find corresponding siteInfo in cleaner's data
            const cleanerSiteInfo = cleaner.siteInfo.find(site => {
              const cleanerSiteId = typeof site.siteId === 'string' 
                ? site.siteId 
                : (site.siteId?.$oid || '');
              const apiSiteId = apiSite._id?.$oid || apiSite._id;
              return cleanerSiteId === apiSiteId;
            });

            if (cleanerSiteInfo) {
              // Merge data: cleaner's siteInfo takes precedence, fall back to API data
              return {
                ...apiSite, // Start with API data
                
                // Override with cleaner's siteInfo where available
                siteStatus: cleanerSiteInfo.siteStatus || apiSite.siteStatus || 'inactive',
                site_name: cleanerSiteInfo.site_name || apiSite.site_name || 'Unnamed Site',
                location: cleanerSiteInfo.location || apiSite.location || 'Location not specified',
                cleaning_frequency: cleanerSiteInfo.cleaning_frequency || getCleaningFrequency(apiSite.everydayValuation),
                cleaning_times: cleanerSiteInfo.cleaning_times || apiSite.cleaning_times || 'Not specified',
                contractor_name: cleanerSiteInfo.contractor_name || cleaner?.name || 'N/A',
                contractor_email: cleanerSiteInfo.contractor_email || '',
                cost_to_invoice: cleanerSiteInfo.cost_to_invoice || calculateMonthlyCost(apiSite.everydayValuation) || 0,
                invoice_recipient_name: cleanerSiteInfo.invoice_recipient_name || '',
                invoice_recipient_email: cleanerSiteInfo.invoice_recipient_email || '',
                scope_of_work: cleanerSiteInfo.scope_of_work || apiSite.scope_of_work || null,
                additional_notes: cleanerSiteInfo.additional_notes || apiSite.additional_notes || null,
                
                // Use cleaner's assignedDate if available, otherwise use current date
                assignedDate: cleanerSiteInfo.assignedDate?.$date || 
                             cleanerSiteInfo.assignedDate || 
                             apiSite.assignedDate || 
                             new Date().toISOString(),
                
                // Keep other important fields from API
                organization_name: apiSite.organization_name || '',
                wcc_site_name: apiSite.wcc_site_name || 'N/A',
                alarm_code: apiSite.alarm_code || 'N/A',
                lock_code: apiSite.lock_code || 'N/A',
                site_password_plaintext: apiSite.site_password_plaintext || '',
                product_list: apiSite.product_list || [],
                everydayValuation: apiSite.everydayValuation || null,
                start_date: apiSite.start_date || null,
                wcc_price: apiSite.wcc_price || 0,
                
                // Cleaner-specific assignment details
                induction_date: cleanerSiteInfo.induction_date || null,
                removedDate: cleanerSiteInfo.removedDate?.$date || cleanerSiteInfo.removedDate || null,
                _id: apiSite._id // Keep the API site ID
              };
            } else {
              // No matching cleaner siteInfo, use API data only
              return {
                ...apiSite,
                site_name: apiSite.site_name || 'Unnamed Site',
                location: apiSite.location || 'Location not specified',
                siteStatus: apiSite.siteStatus || 'inactive',
                cleaning_frequency: getCleaningFrequency(apiSite.everydayValuation),
                cleaning_times: apiSite.cleaning_times || 'Not specified',
                contractor_name: cleaner?.name || 'N/A',
                cost_to_invoice: calculateMonthlyCost(apiSite.everydayValuation) || 0,
                assignedDate: apiSite.assignedDate || new Date().toISOString(),
                contractor_email: '',
                invoice_recipient_name: '',
                invoice_recipient_email: ''
              };
            }
          });
          
          setSites(mergedSites);
        } else {
          setSites([]);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError(err.response?.data?.message || 'Failed to load sites');
        setSites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [cleaner]);

  // Helper function to calculate cleaning frequency from everydayValuation
  const getCleaningFrequency = (everydayValuation) => {
    if (!everydayValuation) return 'Not set';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const selectedDays = days.filter(day => everydayValuation[day]?.selected);
    
    if (selectedDays.length === 7) return 'Daily';
    if (selectedDays.length === 5 && 
        selectedDays.includes('Monday') && 
        selectedDays.includes('Friday')) return 'Weekdays';
    if (selectedDays.length === 2 && 
        selectedDays.includes('Saturday') && 
        selectedDays.includes('Sunday')) return 'Weekends';
    if (selectedDays.length === 1) return `Once a week (${selectedDays[0]})`;
    
    return `${selectedDays.length} days/week`;
  };

  // Helper function to calculate monthly cost
  const calculateMonthlyCost = (everydayValuation) => {
    if (!everydayValuation) return 0;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyCost = days.reduce((total, day) => {
      return total + (everydayValuation[day]?.selected ? (everydayValuation[day]?.price || 0) : 0);
    }, 0);
    
    // Approximate monthly cost (4.33 weeks in a month)
    return Math.round(weeklyCost * 4.33 * 100) / 100;
  };

  // Get status badge class based on site status
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-inactive';
    }
  };

  // Get display text for status
  const getStatusDisplay = (status) => {
    if (!status) return 'Inactive';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter sites based on search term
  const filteredSites = sites.filter(site => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (site.site_name?.toLowerCase().includes(searchLower)) ||
      (site.location?.toLowerCase().includes(searchLower)) ||
      (site.siteStatus?.toLowerCase().includes(searchLower)) ||
      (site.contractor_name?.toLowerCase().includes(searchLower)) ||
      (site.organization_name?.toLowerCase().includes(searchLower))
    );
  });

  const handleSiteClick = (site) => {
    setSelectedSite(site);
  };

  if (loading) {
    return (
      <div className="my-sites-tab">
        <h2 className="section-title">My Sites</h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-sites-tab">
        <h2 className="section-title">My Sites</h2>
        <div className="error-state">
          <div className="error-icon">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="refresh-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-sites-tab">
      <h2 className="section-title">My Sites</h2>
      

      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search sites by name, location, status, or organization..."
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
                  key={site._id?.$oid || site._id || index}
                  className={`site-card ${selectedSite?._id === site._id ? 'selected' : ''}`}
                  onClick={() => handleSiteClick(site)}
                >
                  <div className="site-card-header">
                    <h4 className="site-name">{site.site_name}</h4>
                    <span className={`status-badge ${getStatusClass(site.siteStatus)}`}>
                      {getStatusDisplay(site.siteStatus)}
                    </span>
                  </div>
                  
                  <div className="site-card-body">
                    <div className="site-detail">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{site.location}</span>
                    </div>
                    
                    <div className="site-detail">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{site.cleaning_frequency || getCleaningFrequency(site.everydayValuation)}</span>
                    </div>
                    
                    
                    {site.organization_name && (
                      <div className="site-detail">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Org: {site.organization_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="site-card-footer">
                    <button 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSiteClick(site);
                      }}
                    >
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
              <p>No sites found {searchTerm ? 'matching your search.' : 'assigned to you.'}</p>
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
                    <span className={`status-badge ${getStatusClass(selectedSite.siteStatus)}`}>
                      {getStatusDisplay(selectedSite.siteStatus)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Cleaning Frequency</label>
                    <p>{selectedSite.cleaning_frequency || getCleaningFrequency(selectedSite.everydayValuation)}</p>
                  </div>
                  <div className="detail-item">
                    <label>Cleaning Times</label>
                    <p>{selectedSite.cleaning_times}</p>
                  </div>
                  <div className="detail-item">
                    <label>Assigned Date</label>
                    <p>{new Date(selectedSite.assignedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Organization</label>
                    <p>{selectedSite.organization_name}</p>
                  </div>
                  {selectedSite.removedDate && (
                    <div className="detail-item">
                      <label>Removed Date</label>
                      <p>{new Date(selectedSite.removedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cleaning Schedule */}
              {!selectedSite?.removedDate && selectedSite.everydayValuation && (
                <div className="detail-section">
                  <h4 className="detail-title">Cleaning Schedule & Pricing</h4>
                  <div className="schedule-grid">
                    {Object.entries(selectedSite.everydayValuation)
                      .filter(([day, data]) => day !== '_id' && day !== '__v' && data)
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

              {/* Stock Inventory Credentials */}
              {!selectedSite?.removedDate && (<div className="detail-section" style={{border:"1px solid grey", padding:"1rem", borderRadius:"1rem"}}>
                <h4 className="detail-title">Stock Inventory Credentials</h4>
                <div className="detail-grid">
                   <div className="detail-item">
                    <label>Site Name</label>
                    <p>{selectedSite.site_name || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Site Password</label>
                    <p>{selectedSite.site_password_plaintext || 'N/A'}</p>
                  </div>
                </div>
              </div>)}

              {/* Contractor & Invoice Information */}
                 {!selectedSite?.removedDate && (<div className="detail-section">
                <h4 className="detail-title">Invoice Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Invoice Recipient</label>
                    <p>{selectedSite.invoice_recipient_name || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Invoice Email</label>
                    <p>{selectedSite.invoice_recipient_email || 'N/A'}</p>
                  </div>
                </div>
              </div>)}

              {/* Additional Information */}
               {!selectedSite?.removedDate && (<div className="detail-section">
                <h4 className="detail-title">Additional Information</h4>
                {selectedSite.scope_of_work && (
                  <div className="detail-item" style={{marginBottom: "0.5rem"}}>
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
                {selectedSite.start_date && (
                  <div className="detail-item" style={{marginBottom: "0.5rem"}}>
                    <label>Start Date</label>
                    <p>{new Date(selectedSite.start_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedSite.additional_notes && (
                  <div className="detail-item">
                    <label>Additional Notes</label>
                    <p className="notes">{selectedSite.additional_notes}</p>
                  </div>
                )}
              </div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySitesTab;