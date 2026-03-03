import React, { useState } from 'react';
import { FiX, FiDownload, FiExternalLink, FiGlobe } from 'react-icons/fi';
import './PDFViewerModal.css';

const PDFViewerModal = ({ fileUrl, fileName, onClose }) => {
  // Toggle between Native viewer and Google Docs Viewer
  const [useGoogleViewer, setUseGoogleViewer] = useState(true);

  if (!fileUrl) return null;

  // If using Google Viewer, wrap the URL
    const viewerUrl = useGoogleViewer 
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
        : fileUrl;

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="pdf-modal-header">
          <div className="pdf-modal-title-group">
            <h3>{fileName || 'View Audit'}</h3>
            
            {/* Toggle Button Logic */}
            <button 
              className={`pdf-mode-btn ${!useGoogleViewer ? 'active' : ''}`}
              onClick={() => setUseGoogleViewer(!useGoogleViewer)}
            >
              <FiGlobe /> {useGoogleViewer ? 'Switch to Native View' : 'Switch to Google View'}
            </button>
          </div>

          <div className="pdf-modal-actions">
            {/* The actual download button stays here */}
            {/* This is the ONLY thing that should download the file now */}
            <a href={fileUrl} download className="pdf-action-btn" title="Download">
              <FiDownload />
            </a>
            
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="pdf-action-btn" title="Open in new tab">
              <FiExternalLink />
            </a>
            <button className="pdf-close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="pdf-modal-body">
          <iframe 
            src={viewerUrl} 
            title="PDF Preview"
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
          />
        </div>

      </div>
    </div>
  );
};

export default PDFViewerModal;