import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { invoiceAPI } from '../../utils/api'; // Make sure the path matches your project structure!

const InvoiceTab = ({ cleaner }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  const fetchMyInvoices = async () => {
    setLoading(true);
    try {
      // Using your clean Axios API instance
      const result = await invoiceAPI.getMyInvoices();
      if (result.success) {
        setInvoices(result.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveInvoice = async (poId) => {
    if (!window.confirm("Are you sure you want to approve this statement? This confirms all shifts and amounts are correct.")) return;
    
    setApprovingId(poId);
    try {
      // Using your clean Axios API instance
      const result = await invoiceAPI.approveInvoice(poId);
      
      if (result.success) {
        alert("Statement approved successfully! It has been sent to admin for processing.");
        fetchMyInvoices(); // Refresh the list
        if (selectedInvoice && selectedInvoice._id === poId) {
          setSelectedInvoice(result.data); // Update modal if open
        }
      } else {
        alert(result.message || "Failed to approve statement.");
      }
    } catch (error) {
      // Safely handle Axios errors
      const errorMsg = error.response?.data?.message || error.message;
      alert("Error approving statement: " + errorMsg);
    } finally {
      setApprovingId(null);
    }
  };

  const getMonthName = (monthNum, year) => {
    return format(new Date(year, monthNum - 1, 1), 'MMMM yyyy');
  };

  // Build and download a PDF version of the invoice preview using jsPDF.
  // We draw everything manually (no autotable dependency) so it mirrors the
  // on-screen "Statement Details" modal layout.
  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const contentRight = pageWidth - marginX;
    let y = 50;

    const green = [34, 168, 42]; // #22A82A brand green
    const grey = [102, 102, 102];
    const dark = [17, 24, 39];

    // Guard against a page overflow while drawing rows.
    const ensureSpace = (needed) => {
      if (y + needed > pageHeight - 50) {
        doc.addPage();
        y = 50;
      }
    };

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...dark);
    doc.text('Tax Invoice', marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...grey);
    const headerLines = [
      `Invoice No: ${invoice.poNumber}`,
      `Date Issued: ${format(new Date(invoice.createdAt), 'dd MMM yyyy')}`,
      `Status: ${invoice.status.replace(/_/g, ' ').toUpperCase()}`,
    ];
    headerLines.forEach((line, i) => {
      doc.text(line, contentRight, y - 24 + i * 14, { align: 'right' });
    });

    y += 20;
    doc.setDrawColor(...green);
    doc.setLineWidth(1.5);
    doc.line(marginX, y, contentRight, y);
    y += 30;

    // --- Parties (From / Bill To) ---
    const colWidth = (contentRight - marginX) / 2;
    const fromX = marginX;
    const toX = marginX + colWidth;
    const partyTop = y;

    const drawParty = (x, title, lines) => {
      let py = partyTop;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...dark);
      doc.text(title, x, py);
      py += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...grey);
      lines.forEach((line) => {
        doc.text(String(line), x, py);
        py += 14;
      });
      return py;
    };

    const fromEnd = drawParty(fromX, 'Contractor (From):', [
      cleaner.name || '',
      `ABN: ${cleaner.contractorDetails?.personalInfo?.abn || 'N/A'}`,
      cleaner.email || '',
      cleaner.contactNumber || '',
    ]);
    const toEnd = drawParty(toX, 'Recipient (Bill To):', [
      'Super Pro Services',
      'Melbourne, VIC',
      'Phone: 1300 424 066',
      'Email: info@superproservices.com.au',
    ]);

    y = Math.max(fromEnd, toEnd) + 20;

    // --- Shifts table ---
    const colX = {
      date: marginX,
      site: marginX + 100,
      type: marginX + 300,
      amount: contentRight,
    };

    const drawTableHeader = () => {
      doc.setFillColor(243, 244, 246);
      doc.rect(marginX, y - 12, contentRight - marginX, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...dark);
      doc.text('Date', colX.date + 4, y + 3);
      doc.text('Site Location', colX.site, y + 3);
      doc.text('Work Type', colX.type, y + 3);
      doc.text('Amount', colX.amount - 4, y + 3, { align: 'right' });
      y += 22;
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...dark);
    doc.text('Shifts Details', marginX, y);
    y += 20;
    drawTableHeader();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...dark);

    const sortedShifts = [...(invoice.shifts || [])].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedShifts.forEach((shift) => {
      ensureSpace(20);
      const rowY = y + 2;
      doc.setTextColor(...dark);
      doc.text(format(new Date(shift.date), 'dd MMM yyyy'), colX.date + 4, rowY);

      const siteName = doc.splitTextToSize(shift.siteName || '', colX.type - colX.site - 8);
      doc.text(siteName, colX.site, rowY);

      const shiftType = (shift.shiftType || '')
        .replace(/^\w/, (c) => c.toUpperCase());
      doc.text(shiftType, colX.type, rowY);

      doc.text(`$${(shift.price || 0).toFixed(2)}`, colX.amount - 4, rowY, { align: 'right' });

      const rowHeight = Math.max(16, siteName.length * 12);
      y += rowHeight;
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(marginX, y - 6, contentRight, y - 6);
    });

    // --- Adjustments ---
    if (invoice.adjustments && invoice.adjustments.length > 0) {
      y += 20;
      ensureSpace(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...dark);
      doc.text('Adjustments & Bonuses', marginX, y);
      y += 18;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      invoice.adjustments.forEach((adj) => {
        ensureSpace(20);
        const rowY = y + 2;
        doc.setTextColor(...dark);
        const desc = doc.splitTextToSize(adj.description || '', colX.type - marginX);
        doc.text(desc, marginX + 4, rowY);

        const isNegative = adj.amount < 0;
        const amountText = isNegative
          ? `-$${Math.abs(adj.amount).toFixed(2)}`
          : `+$${adj.amount.toFixed(2)}`;
        doc.setTextColor(...(isNegative ? [239, 68, 68] : green));
        doc.text(amountText, colX.amount - 4, rowY, { align: 'right' });

        y += Math.max(16, desc.length * 12);
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(marginX, y - 6, contentRight, y - 6);
      });
    }

    // --- Total ---
    y += 24;
    ensureSpace(40);
    doc.setDrawColor(...dark);
    doc.setLineWidth(1);
    doc.line(marginX, y, contentRight, y);
    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...dark);
    doc.text('Total Payable', marginX, y);
    doc.setTextColor(...green);
    doc.text(`$${invoice.summary.grandTotal.toFixed(2)}`, colX.amount, y, { align: 'right' });

    const fileName = `Invoice_${invoice.poNumber}_${getMonthName(invoice.month, invoice.year).replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending_cleaner_approval':
        return <span className="status-badge status-pending">Action Required</span>;
      case 'approved':
        return <span className="status-badge status-approved">Approved</span>;
      case 'pushed_to_xero':
      case 'processing':
        return <span className="status-badge status-completed">Processing Payment</span>;
      case 'paid':
        return <span className="status-badge status-paid">Paid</span>;
      default:
        return <span className="status-badge">{status.replace(/_/g, ' ')}</span>;
    }
  };

  if (loading) {
    return <div className="loading-state"><div className="spinner"></div><p>Loading your statements...</p></div>;
  }

  // Split invoices into Action Required and History
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending_cleaner_approval');
  const pastInvoices = invoices.filter(inv => inv.status !== 'pending_cleaner_approval');

  const totalEarned = pastInvoices.reduce((sum, inv) => sum + (inv.summary?.grandTotal || 0), 0);

  return (
    <div className="invoice-tab">
      <div className="invoice-header">
        <div>
          <h2 className="section-title">My Payment Statements</h2>
          <p className="section-description">Review and approve your monthly work summaries.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="invoice-summary">
        <div className="summary-card">
          <h3>Action Required</h3>
          <p className="summary-value" style={{ color: pendingInvoices.length > 0 ? '#ea580c' : '#22A82A' }}>
            {pendingInvoices.length}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Statements</h3>
          <p className="summary-value" style={{ color: '#000' }}>{invoices.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Lifetime Earnings</h3>
          <p className="summary-value">${totalEarned.toFixed(2)}</p>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pendingInvoices.length > 0 && (
        <div className="invoices-list" style={{ borderLeft: '4px solid #f59e0b', marginBottom: '2rem' }}>
          <h3 className="section-subtitle" style={{ color: '#92400e' }}>Action Required</h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Please review and approve these statements so your payment can be processed.</p>
          
          <div className="invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Statement #</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map(invoice => (
                  <tr key={invoice._id}>
                    <td><strong>{getMonthName(invoice.month, invoice.year)}</strong></td>
                    <td className="invoice-number">{invoice.poNumber}</td>
                    <td className="amount">${invoice.summary.grandTotal.toFixed(2)}</td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td className="actions">
                      <button className="action-btn preview" onClick={() => setSelectedInvoice(invoice)}>
                        Review & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="invoices-list">
        <h3 className="section-subtitle">Statement History</h3>
        {pastInvoices.length > 0 ? (
          <div className="invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Statement #</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastInvoices.map(invoice => (
                  <tr key={invoice._id}>
                    <td><strong>{getMonthName(invoice.month, invoice.year)}</strong></td>
                    <td className="invoice-number" style={{ color: '#666' }}>{invoice.poNumber}</td>
                    <td className="amount">${invoice.summary.grandTotal.toFixed(2)}</td>
                    <td style={{textAlign:"center"}}>{getStatusBadge(invoice.status)}</td>
                    <td className="actions" style={{border: "none", marginTop: "0.5rem"}}>
                      <button className="action-btn preview" onClick={() => setSelectedInvoice(invoice)}>
                        View Breakdown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No historical statements found.</p>
          </div>
        )}
      </div>

      {/* Detailed Preview Modal */}
      {selectedInvoice && (
        <div className="invoice-preview-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Statement Details: {getMonthName(selectedInvoice.month, selectedInvoice.year)}</h3>
              <button className="close-modal" onClick={() => setSelectedInvoice(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-template">
                <div className="invoice-header-preview">
                  <div className="company-info">
                    
                  </div>
                  
                  <div className="invoice-info">
                    <h1>Tax Invoice</h1>
                    <div className="invoice-details">
                      <p><strong>Invoice No:</strong> {selectedInvoice.poNumber}</p>
                      <p><strong>Date Issued:</strong> {format(new Date(selectedInvoice.createdAt), 'dd MMM yyyy')}</p>
                      <p><strong>Status:</strong> {selectedInvoice.status.replace(/_/g, ' ').toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="invoice-parties">
                  <div className="from">
                    <h3>Contractor (From):</h3>
                    <p><strong>{cleaner.name}</strong></p>
                    <p>ABN: {cleaner.contractorDetails?.personalInfo?.abn || 'N/A'}</p>
                    <p>{cleaner.email}</p>
                    <p>{cleaner.contactNumber}</p>
                  </div>
                  <div className="bill-to">
                    <h3>Recipient (Bill To):</h3>
                    <p><strong>Super Pro Services</strong></p>
                    <p>Melbourne, VIC</p>
                    <p>Phone: 1300 424 066</p>
                    <p>Email: info@superproservices.com.au</p>
                  </div>
                </div>
                
                <div className="invoice-items">
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Shifts Details</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Site Location</th>
                        <th>Work Type</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sort shifts chronologically so the cleaner can trace their whole month */}
                      {[...selectedInvoice.shifts]
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((shift, index) => (
                        <tr key={index}>
                          <td>{format(new Date(shift.date), 'dd MMM yyyy')}</td>
                          <td>{shift.siteName}</td>
                          <td style={{ textTransform: 'capitalize' }}>{shift.shiftType}</td>
                          <td style={{ textAlign: 'right' }}>${(shift.price || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedInvoice.adjustments && selectedInvoice.adjustments.length > 0 && (
                  <div className="invoice-items" style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Adjustments & Bonuses</h3>
                    <table>
                      <tbody>
                        {selectedInvoice.adjustments.map((adj, index) => (
                          <tr key={index} style={{ backgroundColor: '#f9fafb' }}>
                            <td colSpan="3">{adj.description}</td>
                            <td style={{ textAlign: 'right', fontWeight: '600', color: adj.amount < 0 ? '#ef4444' : '#10b981' }}>
                              {adj.amount < 0 ? `-$${Math.abs(adj.amount).toFixed(2)}` : `+$${adj.amount.toFixed(2)}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="invoice-totals">
                  <div className="totals-table">
                    <div className="total-row grand-total">
                      <span>Total Payable</span>
                      <span style={{ color: '#22A82A' }}>${selectedInvoice.summary.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedInvoice.status === 'pending_cleaner_approval' && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
                    <h4 style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>Approval Required</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>Please verify that all shifts and adjustments are correct. If you find an error, please contact accounts@superproservices.com.au before approving.</p>
                    <br />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>Please note that this RCTI would be approved automatically within 3 days if not approved by you.</p>

                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="action-btn close" onClick={() => setSelectedInvoice(null)}>
                Close Window
              </button>

              <button
                className="action-btn preview"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
              >
                Download PDF
              </button>

              {selectedInvoice.status === 'pending_cleaner_approval' && (
                <button 
                  className="action-btn preview" 
                  style={{ backgroundColor: '#22A82A', color: 'white', borderColor: '#22A82A' }}
                  onClick={() => handleApproveInvoice(selectedInvoice._id)}
                  disabled={approvingId === selectedInvoice._id}
                >
                  {approvingId === selectedInvoice._id ? 'Approving...' : 'I Confirm & Approve this Statement'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTab;