import React, { useState, useEffect } from 'react';

const OrderStocksTab = ({ cleaner }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);

  const handleRedirect = () => {
    window.open('https://stock-management-wally.netlify.app/', '_blank');
  };

  const handleAutoRedirect = () => {
    setIsRedirecting(true);
    
    const timer = setInterval(() => {
      setRedirectTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    // Start countdown when component mounts
    const timerId = setTimeout(() => {
      handleAutoRedirect();
    }, 2000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="order-stocks-tab">
      <h2 className="section-title">Order Cleaning Stocks</h2>
      
      <div className="stocks-container">
        <div className="stocks-card">
          <div className="stocks-icon">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <div className="stocks-content">
            <h3 className="stocks-title">Stock Management Portal</h3>
            <p className="stocks-description">
              You are being redirected to Wally Cleaning Company's Stock Management Portal.
              Here you can:
            </p>
            
            <ul className="stocks-features">
              <li>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Order cleaning supplies and equipment</span>
              </li>
              <li>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Track your order history</span>
              </li>
            </ul>
            
            <div className="redirect-info">
              {isRedirecting ? (
                <div className="countdown-message">
                  <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p>Redirecting in <span className="countdown-number">{redirectTimer}</span> seconds...</p>
                  <p className="text-sm text-gray-600">If not redirected automatically, click the button below</p>
                </div>
              ) : (
                <div className="ready-message">
                  <p>Preparing to redirect you to the Stock Management Portal...</p>
                </div>
              )}
            </div>
            
            <div className="action-buttons">
              <button
                onClick={handleRedirect}
                className="primary-btn"
                disabled={isRedirecting}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Go to Stock Portal Now
              </button>
              
              {isRedirecting && (
                <button
                  onClick={() => {
                    setIsRedirecting(false);
                    setRedirectTimer(5);
                  }}
                  className="secondary-btn"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Auto-Redirect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h3 className="orders-title">Your Recent Stock Orders</h3>
          <div className="orders-list">
            <div className="order-item">
              <div className="order-header">
                <span className="order-id">Order #STK-789456</span>
                <span className="order-status status-completed">Delivered</span>
              </div>
              <div className="order-details">
                <p>Disinfectant, Microfiber Cloths, Gloves</p>
                <span className="order-date">Jan 15, 2024</span>
              </div>
            </div>
            
            <div className="order-item">
              <div className="order-header">
                <span className="order-id">Order #STK-789457</span>
                <span className="order-status status-pending">Processing</span>
              </div>
              <div className="order-details">
                <p>Floor Cleaner, Mop Heads, Trash Bags</p>
                <span className="order-date">Jan 20, 2024</span>
              </div>
            </div>
            
            <div className="order-item">
              <div className="order-header">
                <span className="order-id">Order #STK-789458</span>
                <span className="order-status status-active">Shipped</span>
              </div>
              <div className="order-details">
                <p>Glass Cleaner, Sponges, Paper Towels</p>
                <span className="order-date">Jan 25, 2024</span>
              </div>
            </div>
          </div>
          
          <div className="orders-actions">
            <button onClick={handleRedirect} className="view-all-btn">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStocksTab;