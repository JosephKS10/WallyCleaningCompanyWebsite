import React, { useState } from 'react';
import { FiX, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { auditAPI } from '../../utils/api';
import jsPDF from 'jspdf';
import './RectificationModal.css';

const RectificationModal = ({ isOpen, onClose, audit, site, cleaner, onSuccess }) => {
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [areaAttentionImages, setAreaAttentionImages] = useState([]);
  
  const [notes, setNotes] = useState({
    entrance: '',
    reception: '',
    areaRequiredAttention: '',
  });

  const [formState, setFormState] = useState({
    areaRequiredAttention: 'No',
    ifRectified: 'Yes',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !audit || !site) return null;

  const today = new Date().toLocaleDateString();

  // Compress and store images
  const handleImageChange = (e, section) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const selectedImages = files.filter((file) => allowedTypes.includes(file.type));

    const promises = selectedImages.map((image) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Higher resolution for better PDF clarity
            canvas.width = 1200; 
            canvas.height = canvas.width * (img.height / img.width);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
          };
        };
        reader.readAsDataURL(image);
      });
    });

    Promise.all(promises).then((compressedImages) => {
      if (section === 'before') setBeforeImages([...beforeImages, ...compressedImages]);
      if (section === 'after') setAfterImages([...afterImages, ...compressedImages]);
      if (section === 'areaAttention') setAreaAttentionImages([...areaAttentionImages, ...compressedImages]);
    });
  };

  const removeImage = (index, section) => {
    if (section === 'before') setBeforeImages(beforeImages.filter((_, i) => i !== index));
    if (section === 'after') setAfterImages(afterImages.filter((_, i) => i !== index));
    if (section === 'areaAttention') setAreaAttentionImages(areaAttentionImages.filter((_, i) => i !== index));
  };

  // Helper to convert Blob to Base64 for jsPDF
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // NATIVE PROFESSIONAL PDF GENERATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (beforeImages.length === 0 || afterImages.length === 0) {
      alert("Please upload at least one Before and one After photo.");
      return;
    }

    setIsSubmitting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - (margin * 2);
      
      // Colors based on your theme
      const primaryColor = [200, 25, 30]; // #C8191E Red
      const darkText = [51, 51, 51];
      const lightGray = [248, 249, 250];
      const borderColor = [220, 220, 220];

      let yOffset = margin;

      // Try to fetch logo, gracefully continue if missing
      let logoBase64 = null;
      try {
        const response = await fetch('/logo.png'); // Path to public folder
        const blob = await response.blob();
        logoBase64 = await blobToBase64(blob);
      } catch (err) {
        console.warn("Could not load /logo.png, generating without logo.");
      }

      // --- Reusable Header Function for Multi-Page ---
      const drawHeader = () => {
        pdf.setFillColor(...primaryColor);
        pdf.rect(0, 0, pageWidth, 28, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text("FBI Facility Solutions - Rectification Report", margin, 17);

        if (logoBase64) {
          // Adjust these dimensions based on your actual logo ratio
          pdf.addImage(logoBase64, 'PNG', pageWidth - margin - 35, 5, 35, 18, '', 'FAST');
        }

        yOffset = 40; // Reset Y offset after header
      };

      drawHeader();

      // --- Meta Info Box ---
      pdf.setFillColor(...lightGray);
      pdf.setDrawColor(...borderColor);
      pdf.rect(margin, yOffset, usableWidth, 35, 'FD');

      pdf.setTextColor(...darkText);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Site Details", margin + 5, yOffset + 8);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Site Name:`, margin + 5, yOffset + 18);
      pdf.text(`Audit Period:`, margin + 5, yOffset + 26);
      pdf.text(`Prepared By:`, usableWidth / 2 + 10, yOffset + 18);
      pdf.text(`Date:`, usableWidth / 2 + 10, yOffset + 26);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`${site.site_name}`, margin + 30, yOffset + 18);
      pdf.text(`${audit.month} ${audit.year}`, margin + 30, yOffset + 26);
      pdf.text(`${cleaner?.name || 'System User'}`, usableWidth / 2 + 35, yOffset + 18);
      pdf.text(`${today}`, usableWidth / 2 + 35, yOffset + 26);

      yOffset += 45;

      // --- Reusable Section Builder ---
      const addSectionToPDF = async (title, sectionNotes, images) => {
        // Check page break for section title
        if (yOffset > pageHeight - 50) {
          pdf.addPage();
          drawHeader();
        }

        // Section Title
        pdf.setFillColor(...primaryColor);
        pdf.rect(margin, yOffset, 3, 6, 'F'); // Red accent bar
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...primaryColor);
        pdf.text(title.toUpperCase(), margin + 6, yOffset + 5);
        yOffset += 12;

        // Notes Box
        pdf.setTextColor(...darkText);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        const notesText = sectionNotes || 'No specific notes provided for this section.';
        const splitNotes = pdf.splitTextToSize(notesText, usableWidth - 10);
        const notesHeight = (splitNotes.length * 5) + 6;
        
        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(...borderColor);
        pdf.rect(margin, yOffset, usableWidth, notesHeight, 'FD');
        pdf.text(splitNotes, margin + 5, yOffset + 6);
        yOffset += notesHeight + 8;

        // Images Grid (Fixed height boxes, keeps portrait/landscape aligned)
        const boxWidth = (usableWidth - 5) / 2; // 5mm gap between images
        const boxHeight = 70; // Fixed box height

        for (let i = 0; i < images.length; i++) {
          // Check page break for image row
          if (i % 2 === 0 && yOffset + boxHeight > pageHeight - margin) {
            pdf.addPage();
            drawHeader();
          }

          const imgData = await blobToBase64(images[i]);
          const imgProps = pdf.getImageProperties(imgData);
          
          // Calculate scale to contain image inside box
          const scaleX = boxWidth / imgProps.width;
          const scaleY = boxHeight / imgProps.height;
          const scale = Math.min(scaleX, scaleY); 
          
          const finalWidth = imgProps.width * scale;
          const finalHeight = imgProps.height * scale;

          // Determine Column (Left vs Right)
          const isLeftColumn = i % 2 === 0;
          const xOffset = isLeftColumn ? margin : margin + boxWidth + 5;

          // Center image inside its bounding box
          const xPos = xOffset + (boxWidth - finalWidth) / 2;
          const yPos = yOffset + (boxHeight - finalHeight) / 2;

          // Draw Border Box
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(...borderColor);
          pdf.rect(xOffset, yOffset, boxWidth, boxHeight, 'FD');

          // Draw Image
          pdf.addImage(imgData, 'JPEG', xPos, yPos, finalWidth, finalHeight);

          // Advance yOffset ONLY if row is complete or it's the last image
          if (!isLeftColumn || i === images.length - 1) {
            yOffset += boxHeight + 8;
          }
        }
        yOffset += 5; // Space after section
      };

      // --- Build Report Content ---
      await addSectionToPDF("1. Before Condition", notes.entrance, beforeImages);
      await addSectionToPDF("2. After Condition (Rectified)", notes.reception, afterImages);
      
      if (formState.areaRequiredAttention === 'Yes') {
        await addSectionToPDF("3. Extra Attention Areas", notes.areaRequiredAttention, areaAttentionImages);
      }

      // --- Footer Section ---
      if (yOffset > pageHeight - 40) {
        pdf.addPage();
        drawHeader();
      }

      yOffset += 5;
      pdf.setDrawColor(...borderColor);
      pdf.line(margin, yOffset, pageWidth - margin, yOffset); 
      yOffset += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...darkText);
      pdf.text("Final Verification:", margin, yOffset);
      
      const isYes = formState.ifRectified === 'Yes';
      pdf.setFont('helvetica', 'normal');
      pdf.text("Has the issue been fully rectified?", margin, yOffset + 8);
      
      // Verification Badge
      pdf.setFillColor(isYes ? 46 : 231, isYes ? 204 : 76, isYes ? 113 : 60); 
      pdf.rect(margin + 65, yOffset + 3, 15, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formState.ifRectified, margin + 68, yOffset + 7.5);

      // --- Output & Upload ---
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Rectification_${site.site_name}_${audit.month}.pdf`, { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('rectificationFile', file);

      await auditAPI.uploadRectification(audit._id, formData);
      
      alert("Rectification Form generated and uploaded successfully!");
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Error submitting rectification form:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rect-modal-overlay">
      <div className="rect-modal-content">
        <div className="rect-modal-header">
          <h3>Submit Rectification Form</h3>
          <button onClick={onClose} className="close-btn" disabled={isSubmitting}><FiX /></button>
        </div>

        <div className="rect-modal-body">
          <div className="info-panel">
            <div className="info-row"><strong>Site:</strong> <span>{site.site_name}</span></div>
            <div className="info-row"><strong>Audit Period:</strong> <span>{audit.month} {audit.year}</span></div>
            <div className="info-row"><strong>Prepared By:</strong> <span>{cleaner?.name || 'System User'}</span></div>
            <div className="info-row"><strong>Date:</strong> <span>{today}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="rect-form">
            {/* Before Photos */}
            <div className="form-section">
              <h4>Before Photos (Prior to work) *</h4>
              <div className="file-upload-wrapper">
                <input id="before-upload" type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, 'before')} style={{ display: 'none' }}/>
                <label htmlFor="before-upload" className="custom-file-upload-btn">
                  <FiUploadCloud style={{ marginRight: '8px', fontSize: '1.1rem' }} /> Choose Images
                </label>
                <div className="file-status-text">
                  {beforeImages.length > 0 ? <span className="success-text"><FiCheckCircle /> {beforeImages.length} image(s) selected</span> : 'No file chosen'}
                </div>
              </div>
              <div className="image-preview-grid">
                {beforeImages.map((img, i) => (
                  <div key={i} className="image-thumbnail">
                    <img src={URL.createObjectURL(img)} alt="Before" />
                    <button type="button" onClick={() => removeImage(i, 'before')}><FiX /></button>
                  </div>
                ))}
              </div>
              <textarea placeholder="Notes for before condition..." value={notes.entrance} onChange={(e) => setNotes({...notes, entrance: e.target.value})}/>
            </div>

            {/* After Photos */}
            <div className="form-section">
              <h4>After Photos (Work completed) *</h4>
              <div className="file-upload-wrapper">
                <input id="after-upload" type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, 'after')} style={{ display: 'none' }}/>
                <label htmlFor="after-upload" className="custom-file-upload-btn">
                  <FiUploadCloud style={{ marginRight: '8px', fontSize: '1.1rem' }} /> Choose Images
                </label>
                <div className="file-status-text">
                  {afterImages.length > 0 ? <span className="success-text"><FiCheckCircle /> {afterImages.length} image(s) selected</span> : 'No file chosen'}
                </div>
              </div>
              <div className="image-preview-grid">
                {afterImages.map((img, i) => (
                  <div key={i} className="image-thumbnail">
                    <img src={URL.createObjectURL(img)} alt="After" />
                    <button type="button" onClick={() => removeImage(i, 'after')}><FiX /></button>
                  </div>
                ))}
              </div>
              <textarea placeholder="Notes for after condition..." value={notes.reception} onChange={(e) => setNotes({...notes, reception: e.target.value})}/>
            </div>

            {/* Area Attention Toggles */}
            <div className="form-section">
              <h4>Area required extra attention?</h4>
              <div className="toggle-group">
                <button type="button" className={formState.areaRequiredAttention === 'Yes' ? 'active' : ''} onClick={() => setFormState({...formState, areaRequiredAttention: 'Yes'})}>Yes</button>
                <button type="button" className={formState.areaRequiredAttention === 'No' ? 'active' : ''} onClick={() => setFormState({...formState, areaRequiredAttention: 'No'})}>No</button>
              </div>

              {formState.areaRequiredAttention === 'Yes' && (
                <div className="sub-section">
                  <div className="file-upload-wrapper" style={{ marginTop: '1.5rem' }}>
                    <input id="attention-upload" type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, 'areaAttention')} style={{ display: 'none' }}/>
                    <label htmlFor="attention-upload" className="custom-file-upload-btn">
                      <FiUploadCloud style={{ marginRight: '8px', fontSize: '1.1rem' }} /> Choose Images
                    </label>
                    <div className="file-status-text">
                      {areaAttentionImages.length > 0 ? <span className="success-text"><FiCheckCircle /> {areaAttentionImages.length} image(s) selected</span> : 'No file chosen'}
                    </div>
                  </div>
                  <div className="image-preview-grid">
                    {areaAttentionImages.map((img, i) => (
                      <div key={i} className="image-thumbnail">
                        <img src={URL.createObjectURL(img)} alt="Attention Area" />
                        <button type="button" onClick={() => removeImage(i, 'areaAttention')}><FiX /></button>
                      </div>
                    ))}
                  </div>
                  <textarea placeholder="Details about the extra attention required..." value={notes.areaRequiredAttention} onChange={(e) => setNotes({...notes, areaRequiredAttention: e.target.value})}/>
                </div>
              )}
            </div>

            {/* Rectified Toggle */}
            <div className="form-section" style={{ borderBottom: 'none', marginBottom: '0' }}>
              <h4>Has the issue been fully rectified?</h4>
              <div className="toggle-group">
                <button type="button" className={formState.ifRectified === 'Yes' ? 'active' : ''} onClick={() => setFormState({...formState, ifRectified: 'Yes'})}>Yes</button>
                <button type="button" className={formState.ifRectified === 'No' ? 'active' : ''} onClick={() => setFormState({...formState, ifRectified: 'No'})}>No</button>
              </div>
            </div>
          </form>
        </div>

        <div className="rect-modal-footer">
          <button onClick={onClose} className="cancel-btn" disabled={isSubmitting}>Cancel</button>
          <button onClick={handleSubmit} className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="spinner-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Generating & Uploading...
              </>
            ) : (
              <><FiUploadCloud style={{marginRight: '8px'}}/> Submit Rectification</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RectificationModal;