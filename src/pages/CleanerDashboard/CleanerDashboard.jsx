import React, { useState, useEffect } from 'react';
import { useCleanerAuth } from '../../contexts/CleanerAuthContext';
import './CleanerDashboard.css';

// Import tab components
import OverviewTab from '../Tabs/OverviewTab';
import MySitesTab from '../Tabs/MySitesTab';
import ScheduleTab from '../Tabs/ScheduleTab';
import ProfileTab from '../Tabs/ProfileTab';
import ReportsTab from '../Tabs/ReportsTab';
import LeaveRequestTab from '../Tabs/LeaveRequestTab';
import EmergencyRequestTab from '../Tabs/EmergencyRequestTab';
import RectificationTab from '../Tabs/RectificationTab';
import InvoiceTab from '../Tabs/InvoiceTab';
import InductionVideosTab from '../Tabs/InductionVideosTab';
import OrderStocksTab from '../Tabs/OrderStocksTab';

const CleanerDashboard = () => {
  const { cleaner, logout, getProfile, isAuthenticated } = useCleanerAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile only once when component mounts or when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const result = await getProfile();
          if (!result.success) {
            setError(result.error || 'Failed to load profile');
          }
        } catch (err) {
          setError('Error loading dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isAuthenticated, getProfile]);

  // Reset error when component unmounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-loading">
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
    );
  }

  return (
    <div className="cleaner-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">My Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, {cleaner?.name || 'Cleaner'}!
            </p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-user-info">
            <div className="user-avatar">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="user-details">
              <p className="user-name">{cleaner?.name || 'Cleaner'}</p>
              <p className="user-email">{cleaner?.email || 'N/A'}</p>
              <p className="user-id">ID: {cleaner?.referenceId || 'N/A'}</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <button
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'sites' ? 'active' : ''}`}
              onClick={() => setActiveTab('sites')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              My Sites
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </button>
            
             <div className="sidebar-divider">
              <span>Training & Resources</span>
            </div>
            
            <button
              className={`sidebar-link ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Induction Videos
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'stocks' ? 'active' : ''}`}
              onClick={() => setActiveTab('stocks')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Order Stocks
            </button>

            <div className="sidebar-divider">
              <span>Forms</span>
            </div>
            
            <button
              className={`sidebar-link ${activeTab === 'leave' ? 'active' : ''}`}
              onClick={() => setActiveTab('leave')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Leave Request
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Emergency Request
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'rectification' ? 'active' : ''}`}
              onClick={() => setActiveTab('rectification')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Rectification Form
            </button>
            
            <button
              className={`sidebar-link ${activeTab === 'invoice' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoice')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Invoice Template
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {activeTab === 'overview' && <OverviewTab cleaner={cleaner} />}
          {activeTab === 'sites' && <MySitesTab cleaner={cleaner} />}
          {activeTab === 'schedule' && <ScheduleTab cleaner={cleaner} />}
          {activeTab === 'profile' && <ProfileTab cleaner={cleaner} />}
          {activeTab === 'reports' && <ReportsTab cleaner={cleaner} />}
          {activeTab === 'videos' && <InductionVideosTab cleaner={cleaner} />}
          {activeTab === 'stocks' && <OrderStocksTab cleaner={cleaner} />}
          {activeTab === 'leave' && <LeaveRequestTab cleaner={cleaner} />}
          {activeTab === 'emergency' && <EmergencyRequestTab cleaner={cleaner} />}
          {activeTab === 'rectification' && <RectificationTab cleaner={cleaner} />}
          {activeTab === 'invoice' && <InvoiceTab cleaner={cleaner} />}
        </main>
      </div>
    </div>
  );
};

export default CleanerDashboard;