import React, { useState, useEffect } from 'react';
import { FiX, FiDownload, FiExternalLink, FiAlertCircle } from 'react-icons/fi';
import { auditAPI } from '../../utils/api';
import './PDFViewerModal.css';

const PDFViewerModal = ({ auditId, fileName, fileType = 'audit', onClose }) => {



    
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!auditId) return;

    let objectUrl = null;
    

    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(false);
        objectUrl = fileType === 'rectification'
        ?  await auditAPI.getRectificationFile(auditId)
        :  await auditAPI.getAuditFile(auditId);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // Cleanup blob URL on unmount to free memory
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [auditId]);

  if (!auditId) return null;

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || 'document.pdf';
    link.click();
  };

  const handleOpenNewTab = () => {
    if (blobUrl) window.open(blobUrl, '_blank');
  };

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>

        <div className="pdf-modal-header">
          <div className="pdf-modal-title-group">
            <h3>{fileName || 'View Document'}</h3>
          </div>
          <div className="pdf-modal-actions">
            <button
              className="pdf-action-btn"
              onClick={handleDownload}
              disabled={!blobUrl}
              title="Download"
            >
              <FiDownload />
            </button>
            <button
              className="pdf-action-btn"
              onClick={handleOpenNewTab}
              disabled={!blobUrl}
              title="Open in new tab"
            >
              <FiExternalLink />
            </button>
            <button className="pdf-close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="pdf-modal-body">
          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: '16px', color: '#fff'
            }}>
              <div className="spinner" />
              <p>Loading document...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: '16px', color: '#fff'
            }}>
              <FiAlertCircle size={40} />
              <p>Failed to load document.</p>
              <button
                onClick={handleDownload}
                style={{
                  padding: '10px 20px', background: '#C8191E',
                  color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer'
                }}
              >
                Try Downloading Instead
              </button>
            </div>
          )}

          {blobUrl && !loading && (
            <iframe
              src={blobUrl}
              title={fileName || 'Document Preview'}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;