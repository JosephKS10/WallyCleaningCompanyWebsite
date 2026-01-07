import React, { useState } from 'react';

const ReportsTab = ({ cleaner }) => {
  const [selectedReport, setSelectedReport] = useState('performance');

  const reports = [
    { id: 'performance', label: 'Performance Report', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '✓' },
    { id: 'quality', label: 'Quality Reports', icon: '⭐' },
    { id: 'payments', label: 'Payment History', icon: '💰' }
  ];

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h2 className="section-title">Reports</h2>
        <p className="section-description">
          View and download your work reports and performance metrics.
        </p>
      </div>

      <div className="reports-container">
        {/* Reports Sidebar */}
        <div className="reports-sidebar">
          <h3 className="sidebar-title">Report Types</h3>
          <div className="reports-list">
            {reports.map(report => (
              <button
                key={report.id}
                className={`report-item ${selectedReport === report.id ? 'active' : ''}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <span className="report-icon">{report.icon}</span>
                <span className="report-label">{report.label}</span>
              </button>
            ))}
          </div>

          {/* Report Actions */}
          <div className="report-actions">
            <button className="action-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All
            </button>
            <button className="action-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="report-content">
          {selectedReport === 'performance' && (
            <div className="performance-report">
              <h3 className="report-title">Performance Report</h3>
              
              <div className="performance-stats">
                <div className="performance-card">
                  <h4>Overall Rating</h4>
                  <div className="rating">
                    <span className="rating-value">4.8</span>
                    <span className="rating-max">/5.0</span>
                  </div>
                  <div className="rating-stars">
                    {'★★★★★'.slice(0, 5) + '☆☆☆☆☆'.slice(0, 0)}
                  </div>
                </div>
                
                <div className="performance-card">
                  <h4>Total Sites</h4>
                  <p className="stat-value">{cleaner?.siteInfo?.length || 0}</p>
                </div>
                
                <div className="performance-card">
                  <h4>Completion Rate</h4>
                  <p className="stat-value">98%</p>
                </div>
                
                <div className="performance-card">
                  <h4>Avg. Rating</h4>
                  <p className="stat-value">4.7</p>
                </div>
              </div>

              {/* Monthly Performance Chart */}
              <div className="performance-chart">
                <h4>Monthly Performance</h4>
                <div className="chart-placeholder">
                  <p>Performance chart visualization coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'attendance' && (
            <div className="attendance-report">
              <h3 className="report-title">Attendance Report</h3>
              <div className="coming-soon">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4>Attendance Tracking Coming Soon</h4>
                <p>Track your attendance and working hours here.</p>
              </div>
            </div>
          )}

          {selectedReport === 'quality' && (
            <div className="quality-report">
              <h3 className="report-title">Quality Reports</h3>
              <div className="coming-soon">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h4>Quality Reports Coming Soon</h4>
                <p>View quality inspection reports and feedback.</p>
              </div>
            </div>
          )}

          {selectedReport === 'payments' && (
            <div className="payments-report">
              <h3 className="report-title">Payment History</h3>
              
              <div className="payment-summary">
                <div className="summary-card">
                  <h4>Total Earnings</h4>
                  <p className="amount">
                    ${cleaner?.siteInfo?.reduce((total, site) => 
                      total + (site.cost_to_invoice || 0), 0).toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <div className="summary-card">
                  <h4>Last Payment</h4>
                  <p className="amount">$1,625.00</p>
                  <p className="date">Dec 28, 2025</p>
                </div>
                
                <div className="summary-card">
                  <h4>Next Payment</h4>
                  <p className="amount">$1,625.00</p>
                  <p className="date">Jan 28, 2026</p>
                </div>
              </div>

              {/* Payment History Table */}
              <div className="payment-history">
                <h4>Recent Payments</h4>
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Dec 28, 2025</td>
                        <td>Monthly Payment - Test 2 Site</td>
                        <td>$1,625.00</td>
                        <td><span className="status-paid">Paid</span></td>
                      </tr>
                      <tr>
                        <td>Dec 28, 2025</td>
                        <td>Monthly Payment - Sunshine</td>
                        <td>$541.67</td>
                        <td><span className="status-paid">Paid</span></td>
                      </tr>
                      <tr>
                        <td>Nov 28, 2025</td>
                        <td>Monthly Payment - Test 2 Site</td>
                        <td>$1,625.00</td>
                        <td><span className="status-paid">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;