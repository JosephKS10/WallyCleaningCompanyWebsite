import React from 'react';

const OverviewTab = ({ cleaner }) => {
  // Calculate stats
  const totalSites = cleaner?.siteInfo?.length || 0;
  const activeSites = cleaner?.siteInfo?.filter(site => site.siteStatus === 'active').length || 0;
  const pendingSites = cleaner?.siteInfo?.filter(site => site.siteStatus === 'pending').length || 0;
  
  // Calculate total monthly earnings (sum of all site costs)
  const totalMonthlyEarnings = cleaner?.siteInfo?.reduce((total, site) => {
    return total + (site.cost_to_invoice || 0);
  }, 0) || 0;

  return (
    <div className="dashboard-overview">
      <h2 className="section-title">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Active Sites</h3>
          <p className="stat-value">{activeSites}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Pending Sites</h3>
          <p className="stat-value">{pendingSites}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Sites</h3>
          <p className="stat-value">{totalSites}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Monthly Earnings</h3>
          <p className="stat-value">${totalMonthlyEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="recent-activity">
        <h3 className="section-subtitle">Recent Site Assignments</h3>
        {cleaner?.siteInfo && cleaner.siteInfo.length > 0 ? (
          <div className="activity-list">
            {cleaner.siteInfo.slice(0, 5).map((site, index) => (
              <div key={site._id || index} className="activity-item">
                <div className="activity-info">
                  <h4>{site.site_name || 'Unnamed Site'}</h4>
                  <p className="activity-meta">
                    {site.location || 'Location not specified'} • {site.cleaning_frequency || 'Frequency not set'}
                  </p>
                  <p className="activity-time">
                    Assigned: {new Date(site.assignedDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`status-badge status-${site.siteStatus}`}>
                  {site.siteStatus.charAt(0).toUpperCase() + site.siteStatus.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p>No sites assigned yet.</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Induction Status</h4>
            <p>{cleaner?.inductionStatusCheck ? 'Completed' : 'In Progress'}</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Quiz Score</h4>
            <p>{cleaner?.quizResults?.score || 0}/{cleaner?.quizResults?.totalQuestions || 0}</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Contractor ID</h4>
            <p>{cleaner?.referenceId || 'Not assigned'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;