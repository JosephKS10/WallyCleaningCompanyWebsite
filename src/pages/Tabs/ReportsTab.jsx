import React, { useState, useEffect } from 'react';
import { FiEye, FiFileText } from 'react-icons/fi';
import { FaFilePdf, FaFileExcel, FaFileWord, FaImage } from 'react-icons/fa';
import { siteAPI, auditAPI } from '../../utils/api';

import PDFViewerModal from '../../components/PDFViewerModal/PDFViewerModal'; 
import RectificationModal from '../../components/RectificationModal/RectificationModal';

const ReportsTab = ({ cleaner }) => {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  console.log(sites)
  const [audits, setAudits] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [error, setError] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [viewPdfAuditId, setViewPdfAuditId] = useState(null); 
  const [viewPdfName, setViewPdfName] = useState('');
  const [rectificationAudit, setRectificationAudit] = useState(null);
  const [viewPdfType, setViewPdfType] = useState('audit');


  // 1. Fetch Cleaner's Sites on Mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoadingSites(true);
        setError(null);
        
        // Check if cleaner has site Info
        if (!cleaner?.siteInfo || !Array.isArray(cleaner.siteInfo) || cleaner.siteInfo.length === 0) {
          setSites([]);
          setLoadingSites(false);
          return;
        }

        // Extract site IDs
        const siteIds = cleaner.siteInfo
          .map(site => {
            if (typeof site.siteId === 'string') return site.siteId;
            if (site.siteId && site.siteId.$oid) return site.siteId.$oid;
            return null;
          })
          .filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));

        if (siteIds.length === 0) {
          setSites([]);
          setLoadingSites(false);
          return;
        }

        // Fetch site data
        const response = await siteAPI.getSitesByIds(siteIds);
        
        if (response.sites && Array.isArray(response.sites)) {
          setSites(response.sites);
          // Auto-select the first site by default if available
          if (response.sites.length > 0) {
            setSelectedSiteId(response.sites[0]._id?.$oid || response.sites[0]._id);
          }
        } else {
          setSites([]);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError(err.response?.data?.message || 'Failed to load sites for reports');
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [cleaner]);


  useEffect(() => {
    const fetchAudits = async () => {
      if (!selectedSiteId) return;
      try {
        setLoadingAudits(true);
        const response = await auditAPI.getAuditsBySite(selectedSiteId); 
        setAudits(response.audits || []);
      } catch (err) {
        console.error('Error fetching audits:', err);
        setAudits([]);
      } finally {
        setLoadingAudits(false);
      }
    };

    fetchAudits();
  }, [selectedSiteId, refreshTrigger]);

  // UI Helpers
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf />;
    if (['xls', 'xlsx'].includes(ext)) return <FaFileExcel />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaImage />;
    return <FiFileText />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981'; // green
      case 'pending': return '#f59e0b'; // orange
      case 'rectification_needed': return '#ef4444'; // red
      case 'rectification_submitted': return '#3b82f6'; // blue
      default: return '#6b7280'; // gray
    }
  };

  const handleViewFile = (auditId, fileName, type = 'audit') => {
 if (auditId) {
    setViewPdfAuditId(auditId);
    setViewPdfName(fileName);
    setViewPdfType(type);
  }
};

  if (loadingSites) {
    return (
      <div className="reports-tab">
        <h2 className="section-title">Site Audits</h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-tab">
        <h2 className="section-title">Site Audits</h2>
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h2 className="section-title">Site Audits</h2>
        <p className="section-description">
          Select a site to view its monthly quality audits and upload rectification forms.
        </p>
      </div>

      <div className="reports-container">
        {/* Sidebar - Dynamically rendered with Site Names */}
        <div className="reports-sidebar">
          <h3 className="sidebar-title">Your Sites</h3>
          {sites.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#666' }}>No sites assigned yet.</p>
          ) : (
            <div className="reports-list">
              {sites.map(site => {
                const siteId = site._id?.$oid || site._id;
                return (
                  <button
                    key={siteId}
                    className={`report-item ${selectedSiteId === siteId ? 'active' : ''}`}
                    onClick={() => setSelectedSiteId(siteId)}
                  >
                    <span className="report-icon">🏢</span>
                    <span className="report-label" style={{ fontWeight: '500' }}>
                      {site.site_name || 'Unnamed Site'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content Area - Audits Table */}
        <div className="report-content">
          {selectedSiteId && (
            <div className="performance-report">
              <h3 className="report-title" style={{ marginBottom: '1.5rem', fontWeight: '600' }}>
                {sites.find(s => (s._id?.$oid || s._id) === selectedSiteId)?.site_name} - Audits
              </h3>

              {loadingAudits ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Fetching audits...</p>
                </div>
              ) : audits.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                  <FiFileText size={48} color="#ccc" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
                  <p>No audits have been uploaded for this site yet.</p>
                </div>
              ) : (
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Month/Year</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audits.map((audit) => (
                        <tr key={audit._id}>
                          <td>
                            <strong>{audit.month} {audit.year}</strong>
                          </td>
                          <td>
                            <span 
                              style={{ 
                                color: getStatusColor(audit.status),
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                                textAlign: "justify",
                              }}
                            >
                              {audit.status ? audit.status.replace('_', ' ') : 'Completed'}
                            </span>
                          </td>
                          <td>
                            <strong style={{ 
                              color: audit.score >= 80 ? '#22A82A' : audit.score >= 60 ? '#f59e0b' : '#ef4444' 
                            }}>
                              {audit.score != null ? `${audit.score}%` : 'N/A'}
                            </strong>
                          </td>
                          <td>
                            <div title={audit.notes} style={{ maxWidth: '100px', fontSize: '0.85rem', color: '#666' }}>
                              {audit.notes || 'No notes'}
                            </div>
                          </td>
                         <td>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              
                              {/* View Original Audit Button */}
                              <button
                                className="action-btn"
                                onClick={() => handleViewFile(audit._id, audit.auditFileName || 'Audit_Report.pdf')}
                                style={{ borderColor: 'rgb(200, 25, 30)', color: 'rgb(200, 25, 30)' }}
                              >
                                <FiEye /> View Audit
                              </button>
                              
                              {/* View Rectification File Button (Renders if file exists) */}
                              {audit.rectificationFile && (
                                <button
                                  className="action-btn"
                                  onClick={() => handleViewFile(audit._id, audit.rectificationFileName || 'Rectification_Report.pdf', 'rectification')}
                                  style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
                                >
                                  <FiEye /> View Rectification
                                </button>
                              )}

                              {/* Fill Rectification Form Button (Renders if pending/needed and NO file exists yet) */}
                              {(audit.status === 'pending' || audit.status === 'rectification_needed') && !audit.rectificationFile && (
                                <button 
                                  className="action-btn" 
                                  onClick={() => setRectificationAudit(audit)}
                                  style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                                >
                                  Fill Rectification Form
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

     <PDFViewerModal
        auditId={viewPdfAuditId}
        fileName={viewPdfName}
        fileType={viewPdfType}
        onClose={() => { setViewPdfAuditId(null); setViewPdfName(''); setViewPdfType('audit'); }}
      />

      <RectificationModal 
        isOpen={!!rectificationAudit}
        audit={rectificationAudit}
        site={sites.find(s => (s._id?.$oid || s._id) === selectedSiteId)}
        cleaner={cleaner}
        onClose={() => setRectificationAudit(null)}
        onSuccess={() => {
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
};

export default ReportsTab;