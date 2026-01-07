import React, { useState } from 'react';

const ProfileTab = ({ cleaner }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'contractor', label: 'Contractor Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'induction', label: 'Induction Status' },
    { id: 'contract', label: 'Contract Details' }
  ];

  return (
    <div className="profile-tab">
      <h2 className="section-title">My Profile</h2>
      
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        
        <div className="profile-basic">
          <h3 className="profile-name">{cleaner?.name || 'N/A'}</h3>
          <p className="profile-email">{cleaner?.email || 'N/A'}</p>
          <div className="profile-meta">
            <span className="meta-item">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cleaner?.suburb || 'N/A'}
            </span>
            <span className="meta-item">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {cleaner?.contactNumber || 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="profile-status">
          <div className={`status-badge ${cleaner?.inductionStatusCheck ? 'status-active' : 'status-pending'}`}>
            {cleaner?.inductionStatusCheck ? 'Induction Complete' : 'Induction Pending'}
          </div>
          <p className="reference-id">Reference: {cleaner?.referenceId || 'N/A'}</p>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`profile-nav-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeSection === 'personal' && (
          <div className="profile-section">
            <h3 className="section-subtitle">Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{cleaner?.name || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Email</label>
                <p>{cleaner?.email || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Contact Number</label>
                <p>{cleaner?.contactNumber || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Suburb</label>
                <p>{cleaner?.suburb || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Nationality</label>
                <p>{cleaner?.nationality || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Date Applied</label>
                <p>{cleaner?.dateApplied ? new Date(cleaner.dateApplied).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            {/* Couple Information */}
            {cleaner?.coupleInfo?.isCouple && (
              <div className="info-section">
                <h4 className="info-title">Partner Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Partner Name</label>
                    <p>{cleaner.coupleInfo.partnerName}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>Partner Email</label>
                    <p>{cleaner.coupleInfo.partnerEmail}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>Partner Contact</label>
                    <p>{cleaner.coupleInfo.partnerContactNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'contractor' && cleaner?.contractorDetails && (
          <div className="profile-section">
            <h3 className="section-subtitle">Contractor Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>ABN Name</label>
                <p>{cleaner.contractorDetails.personalInfo?.abnName || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>ABN Number</label>
                <p>{cleaner.contractorDetails.personalInfo?.abn || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Tax File Number</label>
                <p>{cleaner.contractorDetails.personalInfo?.taxFileNumber || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Bank Name</label>
                <p>{cleaner.contractorDetails.personalInfo?.bankName || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Account Name</label>
                <p>{cleaner.contractorDetails.personalInfo?.accountName || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>BSB Number</label>
                <p>{cleaner.contractorDetails.personalInfo?.bsbNumber || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Account Number</label>
                <p>{cleaner.contractorDetails.personalInfo?.accountNumber || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Emergency Contact</label>
                <p>{cleaner.contractorDetails.personalInfo?.emergencyContactName || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <label>Emergency Number</label>
                <p>{cleaner.contractorDetails.personalInfo?.emergencyContactNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'documents' && cleaner?.documents && (
          <div className="profile-section">
            <h3 className="section-subtitle">Documents</h3>
            <div className="documents-grid">
              {cleaner.documents.passport?.uploaded && (
                <div className="document-card">
                  <div className="document-icon">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="document-info">
                    <h4>Passport</h4>
                    <p>Uploaded: {new Date(cleaner.documents.passport.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button className="view-doc-btn">
                    View
                  </button>
                </div>
              )}
              
              {cleaner.documents.visa?.uploaded && (
                <div className="document-card">
                  <div className="document-icon">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="document-info">
                    <h4>Visa Document</h4>
                    <p>Uploaded: {new Date(cleaner.documents.visa.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button className="view-doc-btn">
                    View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'induction' && (
          <div className="profile-section">
            <h3 className="section-subtitle">Induction Status</h3>
            <div className="induction-steps">
              <div className={`induction-step ${cleaner?.siteInfoCheck === 'Accepted' ? 'completed' : ''}`}>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <h4>Site Information</h4>
                  <p>Status: {cleaner?.siteInfoCheck || 'Not started'}</p>
                </div>
              </div>
              
              <div className={`induction-step ${cleaner?.contractorDetailFormFilled === 'Completed' ? 'completed' : ''}`}>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <h4>Contractor Details</h4>
                  <p>Status: {cleaner?.contractorDetailFormFilled || 'Not started'}</p>
                </div>
              </div>
              
              <div className={`induction-step ${cleaner?.videoInductionViewCheck === 'Completed' ? 'completed' : ''}`}>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <h4>Video Induction</h4>
                  <p>Status: {cleaner?.videoInductionViewCheck || 'Not started'}</p>
                </div>
              </div>
              
              <div className={`induction-step ${cleaner?.quizAttemptedCheck === 'Completed' ? 'completed' : ''}`}>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <h4>Quiz</h4>
                  <p>Status: {cleaner?.quizAttemptedCheck || 'Not started'}</p>
                  {cleaner?.quizResults && (
                    <p>Score: {cleaner.quizResults.score}/{cleaner.quizResults.totalQuestions}</p>
                  )}
                </div>
              </div>
              
              <div className={`induction-step ${cleaner?.contractFormFilled === 'Completed' ? 'completed' : ''}`}>
                <div className="step-icon">5</div>
                <div className="step-content">
                  <h4>Contract</h4>
                  <p>Status: {cleaner?.contractFormFilled || 'Not started'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contract' && cleaner?.contractDetails && (
          <div className="profile-section">
            <h3 className="section-subtitle">Contract Details</h3>
            <div className="contract-details">
              <div className="info-grid">
                <div className="info-item">
                  <label>Contractor Name</label>
                  <p>{cleaner.contractDetails.fullName}</p>
                </div>
                
                <div className="info-item">
                  <label>ABN</label>
                  <p>{cleaner.contractDetails.ABN}</p>
                </div>
                
                <div className="info-item">
                  <label>Contract Date</label>
                  <p>{cleaner.contractDetails.date}</p>
                </div>
                
                <div className="info-item">
                  <label>Commencement Date</label>
                  <p>{cleaner.contractDetails.commencementDate}</p>
                </div>
                
                <div className="info-item">
                  <label>Authorised Officer</label>
                  <p>{cleaner.contractDetails.authorisedOfficerName}</p>
                </div>
              </div>
              
              <div className="contract-signature">
                <h4>Digital Signature</h4><br />
                {cleaner.contractDetails.contractorSignature ? (
                  <div className="signature-preview">
                    <img 
                      src={cleaner.contractDetails.contractorSignature} 
                      alt="Contractor Signature" 
                      className="signature-image"
                    />
                  </div>
                ) : (
                  <p>No signature available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;