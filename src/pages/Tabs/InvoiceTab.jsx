import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { invoiceAPI } from '../../utils/api'; // Make sure the path matches your project structure!

// Turn a statement's shifts into display rows. When `consolidated` is true we
// group the same way the admin/Xero side does: every regular `job` shift for a
// site collapses into ONE line ("Regular Jobs (N shifts)") with the summed
// amount, while task/event shifts stay as individual dated lines. When false we
// return every shift as its own dated row (the full day-by-day breakdown).
// Both modes return the same row shape so the table and PDFs can share it.
const buildShiftRows = (shifts = [], consolidated) => {
  const toDetailedRow = (s) => ({
    dateLabel: format(new Date(s.date), 'dd MMM yyyy'),
    siteName: s.siteName || '',
    typeLabel: (s.shiftType || '').replace(/^\w/, (c) => c.toUpperCase()),
    amount: s.price || 0,
  });

  if (!consolidated) {
    return [...shifts]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(toDetailedRow);
  }

  const siteJobSummaries = {};
  const individual = [];
  shifts.forEach((s) => {
    if (s.shiftType === 'job') {
      if (!siteJobSummaries[s.siteName]) siteJobSummaries[s.siteName] = { count: 0, total: 0 };
      siteJobSummaries[s.siteName].count += 1;
      siteJobSummaries[s.siteName].total += (s.price || 0);
    } else {
      individual.push(s);
    }
  });

  const rows = Object.entries(siteJobSummaries).map(([siteName, d]) => ({
    dateLabel: 'Consolidated',
    siteName,
    typeLabel: 'Regular Jobs',
    amount: d.total,
  }));

  individual
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((s) => rows.push(toDetailedRow(s)));

  return rows;
};

const InvoiceTab = ({ cleaner }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  // Dispute flow: a cleaner can flag an error on a pending statement instead of
  // approving it. `disputeOpen` toggles the reason box inside the modal.
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputingId, setDisputingId] = useState(null);

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  const fetchMyInvoices = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // Using your clean Axios API instance
      const result = await invoiceAPI.getMyInvoices();
      if (result.success) {
        setInvoices(result.data);
      } else {
        setFetchError(result.message || "Failed to load your statements.");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setFetchError(error.response?.data?.message || "We couldn't load your statements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the dispute box whenever a different statement is opened/closed.
  const openInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setDisputeOpen(false);
    setDisputeReason('');
  };

  const closeInvoice = () => {
    setSelectedInvoice(null);
    setDisputeOpen(false);
    setDisputeReason('');
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

  const handleDisputeInvoice = async (poId) => {
    const reason = disputeReason.trim();
    if (!reason) {
      alert("Please describe what's wrong so our team can fix it.");
      return;
    }

    setDisputingId(poId);
    try {
      const result = await invoiceAPI.disputeInvoice(poId, reason);

      if (result.success) {
        alert("Thanks — your statement has been flagged and our team has been notified. We'll review it and get back to you.");
        fetchMyInvoices(); // Refresh the list
        // Update the open modal so it reflects the new disputed state.
        setSelectedInvoice(result.data);
        setDisputeOpen(false);
        setDisputeReason('');
      } else {
        alert(result.message || "Failed to submit your dispute.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      alert("Error submitting dispute: " + errorMsg);
    } finally {
      setDisputingId(null);
    }
  };

  const getMonthName = (monthNum, year) => {
    return format(new Date(year, monthNum - 1, 1), 'MMMM yyyy');
  };

  // Build and download a PDF for a statement using jsPDF. We draw everything
  // manually (no autotable dependency) so it mirrors the on-screen modal layout.
  //  - Tax Invoice  -> `consolidated: true`  (grouped shifts, one line per site)
  //  - Purchase Order -> `consolidated: false` (full day-by-day shift breakdown)
  const buildStatementPdf = (invoice, { consolidated, docTitle, numberLabel, filePrefix }) => {
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
    doc.text(docTitle, marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...grey);
    const headerLines = [
      `${numberLabel}: ${invoice.poNumber}`,
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

    const shiftRows = buildShiftRows(invoice.shifts, consolidated);

    shiftRows.forEach((row) => {
      ensureSpace(20);
      const rowY = y + 2;
      doc.setTextColor(...dark);
      doc.text(row.dateLabel, colX.date + 4, rowY);

      const siteName = doc.splitTextToSize(row.siteName, colX.type - colX.site - 8);
      doc.text(siteName, colX.site, rowY);

      const typeLines = doc.splitTextToSize(row.typeLabel, colX.amount - colX.type - 8);
      doc.text(typeLines, colX.type, rowY);

      doc.text(`$${row.amount.toFixed(2)}`, colX.amount - 4, rowY, { align: 'right' });

      // Extra breathing room between line items (+10pt padding per row).
      const rowHeight = Math.max(16, siteName.length * 12, typeLines.length * 12) + 10;
      y += rowHeight;
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(marginX, y - 8, contentRight, y - 8);
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

    const fileName = `${filePrefix}_${invoice.poNumber}_${getMonthName(invoice.month, invoice.year).replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  // Tax Invoice: consolidated shifts (one line per site for regular jobs).
  const handleDownloadInvoice = (invoice) => buildStatementPdf(invoice, {
    consolidated: true,
    docTitle: 'Tax Invoice',
    numberLabel: 'Invoice No',
    filePrefix: 'Invoice',
  });

  // Purchase Order: the full day-by-day breakdown of every shift.
  const handleDownloadPO = (invoice) => buildStatementPdf(invoice, {
    consolidated: false,
    docTitle: 'Purchase Order',
    numberLabel: 'PO No',
    filePrefix: 'PO',
  });

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
      case 'disputed':
        return <span className="status-badge status-disputed" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>Under Review</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>Cancelled</span>;
      default:
        return <span className="status-badge">{status.replace(/_/g, ' ')}</span>;
    }
  };

  if (loading) {
    return <div className="loading-state"><div className="spinner"></div><p>Loading your statements...</p></div>;
  }

  if (fetchError) {
    return (
      <div className="empty-state" style={{ textAlign: 'center' }}>
        <p style={{ color: '#b91c1c', marginBottom: '1rem' }}>{fetchError}</p>
        <button className="action-btn preview" onClick={fetchMyInvoices}>Try Again</button>
      </div>
    );
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
                      <button className="action-btn preview" onClick={() => openInvoice(invoice)}>
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
                      <button className="action-btn preview" onClick={() => openInvoice(invoice)}>
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
              <button className="close-modal" onClick={closeInvoice}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-template">
                <div className="invoice-header-preview">
                  {/* Push the title/details block to the right of the header. */}
                  <div className="invoice-info" style={{ marginLeft: 'auto' }}>
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
                      {/*
                        While a statement is awaiting approval we show every shift
                        day-by-day so the cleaner can verify each one. Once it's
                        approved (View Breakdown), we show the consolidated view —
                        regular jobs grouped per site — like the admin/Tax Invoice.
                      */}
                      {buildShiftRows(
                        selectedInvoice.shifts,
                        selectedInvoice.status !== 'pending_cleaner_approval'
                      ).map((row, index) => (
                        <tr key={index}>
                          <td>{row.dateLabel}</td>
                          <td>{row.siteName}</td>
                          <td>{row.typeLabel}</td>
                          <td style={{ textAlign: 'right' }}>${row.amount.toFixed(2)}</td>
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
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>Please verify that all shifts and adjustments are correct. If you find an error, use the <strong>Report an Issue</strong> button below to flag it for our team before approving.</p>
                    <br />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>Please note that this RCTI would be approved automatically within 3 days if not approved by you.</p>
                  </div>
                )}

                {selectedInvoice.status === 'disputed' && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                    <h4 style={{ color: '#991b1b', margin: '0 0 0.5rem 0' }}>Under Review</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c' }}>You reported an issue with this statement and our team has been notified. We'll review it and get back to you.</p>
                    {selectedInvoice.disputeReason && (
                      <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#7f1d1d' }}>
                        <strong>Your note:</strong> {selectedInvoice.disputeReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Report-an-issue form: only for statements still awaiting approval. */}
                {selectedInvoice.status === 'pending_cleaner_approval' && disputeOpen && (
                  <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#fff7ed', border: '1px solid #fdba74', borderRadius: '4px' }}>
                    <h4 style={{ color: '#9a3412', margin: '0 0 0.5rem 0' }}>What's wrong with this statement?</h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#9a3412' }}>Tell us which shift or amount looks incorrect. Our team will review and correct it.</p>
                    <textarea
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="e.g. The shift on 12 July at Melbourne Central is missing, or the amount for..."
                      rows="4"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="action-btn close" onClick={closeInvoice}>
                Close Window
              </button>

              <button
                className="action-btn preview"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                title="Tax Invoice with shifts consolidated per site"
              >
                Download Invoice
              </button>

              <button
                className="action-btn preview"
                onClick={() => handleDownloadPO(selectedInvoice)}
                title="Purchase Order with the full day-by-day shift breakdown"
              >
                Download PO
              </button>

              {selectedInvoice.status === 'pending_cleaner_approval' && (
                disputeOpen ? (
                  <>
                    <button
                      className="action-btn close"
                      onClick={() => { setDisputeOpen(false); setDisputeReason(''); }}
                      disabled={disputingId === selectedInvoice._id}
                    >
                      Cancel
                    </button>
                    <button
                      className="action-btn preview"
                      style={{ backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }}
                      onClick={() => handleDisputeInvoice(selectedInvoice._id)}
                      disabled={disputingId === selectedInvoice._id || !disputeReason.trim()}
                    >
                      {disputingId === selectedInvoice._id ? 'Submitting...' : 'Submit Issue'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="action-btn preview"
                      style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                      onClick={() => setDisputeOpen(true)}
                    >
                      Report an Issue
                    </button>
                    <button
                      className="action-btn preview"
                      style={{ backgroundColor: '#22A82A', color: 'white', borderColor: '#22A82A' }}
                      onClick={() => handleApproveInvoice(selectedInvoice._id)}
                      disabled={approvingId === selectedInvoice._id}
                    >
                      {approvingId === selectedInvoice._id ? 'Approving...' : 'I Confirm & Approve this Statement'}
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTab;