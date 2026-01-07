import React, { useState } from 'react';

const InvoiceTab = ({ cleaner }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2025-12');

  // Generate sample invoice data based on cleaner's sites
  const generateInvoices = () => {
    if (!cleaner?.siteInfo) return [];
    
    return cleaner.siteInfo.map(site => ({
      id: `INV-${site._id}-${selectedMonth}`,
      siteName: site.site_name,
      month: selectedMonth,
      amount: site.cost_to_invoice || 0,
      status: 'pending',
      dueDate: '2025-12-31',
      siteId: site._id
    }));
  };

  const invoices = generateInvoices();
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const months = [
    { value: '2025-12', label: 'December 2025' },
    { value: '2026-01', label: 'January 2026' },
    { value: '2026-02', label: 'February 2026' }
  ];

  const handleDownloadInvoice = (invoice) => {
    // TODO: Implement invoice download
    alert(`Downloading invoice ${invoice.id}`);
  };

  const handlePreviewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const generateInvoiceTemplate = (invoice) => {
    const site = cleaner.siteInfo.find(s => s._id === invoice.siteId);
    const currentDate = new Date().toLocaleDateString();
    
    return {
      invoiceNumber: invoice.id,
      date: currentDate,
      dueDate: invoice.dueDate,
      cleanerDetails: {
        name: cleaner.name,
        abn: cleaner.contractorDetails?.personalInfo?.abn || 'N/A',
        address: cleaner.contractorDetails?.personalInfo?.address || 'N/A'
      },
      siteDetails: {
        name: site?.site_name || 'N/A',
        location: site?.location || 'N/A',
        frequency: site?.cleaning_frequency || 'N/A'
      },
      items: [{
        description: `Cleaning services for ${selectedMonth}`,
        quantity: 1,
        unitPrice: invoice.amount,
        total: invoice.amount
      }],
      subtotal: invoice.amount,
      gst: invoice.amount * 0.1,
      total: invoice.amount * 1.1
    };
  };

  return (
    <div className="invoice-tab">
      <div className="invoice-header">
        <h2 className="section-title">Invoice Template</h2>
        
        <div className="invoice-controls">
          <div className="month-selector">
            <label htmlFor="month">Select Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <button className="generate-all-btn">
            Generate All Invoices
          </button>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="invoice-summary">
        <div className="summary-card">
          <h3>Total Invoices</h3>
          <p className="summary-value">{invoices.length}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Amount</h3>
          <p className="summary-value">${totalAmount.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Pending</h3>
          <p className="summary-value">
            {invoices.filter(i => i.status === 'pending').length}
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Paid</h3>
          <p className="summary-value">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="invoices-list">
        <h3 className="section-subtitle">Invoices for {months.find(m => m.value === selectedMonth)?.label}</h3>
        
        {invoices.length > 0 ? (
          <div className="invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Site</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="invoice-number">{invoice.id}</td>
                    <td className="site-name">{invoice.siteName}</td>
                    <td className="amount">${invoice.amount.toFixed(2)}</td>
                    <td>
                      <span className={`status-${invoice.status}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="due-date">{invoice.dueDate}</td>
                    <td className="actions">
                      <button 
                        className="action-btn preview"
                        onClick={() => handlePreviewInvoice(invoice)}
                      >
                        Preview
                      </button>
                      <button 
                        className="action-btn download"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        Download
                      </button>
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
            <p>No invoices available for the selected month.</p>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="invoice-preview-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Invoice Preview</h3>
              <button 
                className="close-modal"
                onClick={() => setSelectedInvoice(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-template">
                <div className="invoice-header">
                  <div className="company-info">
                    <h2>Wally Cleaning Company</h2>
                    <p>ABN: 12 345 678 901</p>
                    <p>45 Atkinson, Chadstone VIC 3148</p>
                    <p>Phone: 1300 424 066</p>
                  </div>
                  
                  <div className="invoice-info">
                    <h1>INVOICE</h1>
                    <div className="invoice-details">
                      <p><strong>Invoice #:</strong> {selectedInvoice.id}</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="invoice-parties">
                  <div className="bill-to">
                    <h3>Bill To:</h3>
                    <p>Wally Cleaning Company</p>
                    <p>debbie@wallycleaningcompany.com.au</p>
                  </div>
                  
                  <div className="from">
                    <h3>From:</h3>
                    <p>{cleaner.name}</p>
                    <p>ABN: {cleaner.contractorDetails?.personalInfo?.abn || 'N/A'}</p>
                    <p>{cleaner.contractorDetails?.personalInfo?.address || 'N/A'}</p>
                    <p>{cleaner.email}</p>
                    <p>{cleaner.contactNumber}</p>
                  </div>
                </div>
                
                <div className="invoice-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Cleaning services for {selectedMonth}<br/>
                          <small>
                            Site: {selectedInvoice.siteName}<br/>
                            {cleaner.siteInfo.find(s => s._id === selectedInvoice.siteId)?.location}
                          </small>
                        </td>
                        <td>1</td>
                        <td>${selectedInvoice.amount.toFixed(2)}</td>
                        <td>${selectedInvoice.amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="invoice-totals">
                  <div className="totals-table">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>GST (10%)</span>
                      <span>${(selectedInvoice.amount * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total Amount</span>
                      <span>${(selectedInvoice.amount * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="invoice-footer">
                  <div className="payment-instructions">
                    <h4>Payment Instructions:</h4>
                    <p>Bank: {cleaner.contractorDetails?.personalInfo?.bankName || 'N/A'}</p>
                    <p>BSB: {cleaner.contractorDetails?.personalInfo?.bsbNumber || 'N/A'}</p>
                    <p>Account: {cleaner.contractorDetails?.personalInfo?.accountNumber || 'N/A'}</p>
                    <p>Account Name: {cleaner.contractorDetails?.personalInfo?.accountName || 'N/A'}</p>
                  </div>
                  
                  <div className="terms">
                    <h4>Terms & Conditions:</h4>
                    <p>Payment due within 30 days of invoice date.</p>
                    <p>Please include invoice number with payment.</p>
                  </div>
                </div>
                
                <div className="signature-section">
                  <div className="signature">
                    <p>Authorized Signature:</p>
                    <div className="signature-line"></div>
                    <p>{cleaner.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="action-btn download"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
              >
                Download PDF
              </button>
              <button 
                className="action-btn print"
                onClick={() => window.print()}
              >
                Print Invoice
              </button>
              <button 
                className="action-btn close"
                onClick={() => setSelectedInvoice(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTab;