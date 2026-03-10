import React, { useState, useEffect } from 'react';
import { orderAPI, siteAPI } from '../../utils/api';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';

const OrderStocksTab = ({ cleaner }) => {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null); // For the modal

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const handleRedirect = () => {
    window.open('https://stock-management-wally.netlify.app/', '_blank');
  };

  // 1. Fetch Cleaner's Sites on Mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoadingSites(true);
        setError(null);
        
        if (!cleaner?.siteInfo || !Array.isArray(cleaner.siteInfo) || cleaner.siteInfo.length === 0) {
          setSites([]);
          setLoadingSites(false);
          return;
        }

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

        const response = await siteAPI.getSitesByIds(siteIds);
        
        if (response.sites && Array.isArray(response.sites)) {
          setSites(response.sites);
          if (response.sites.length > 0) {
            setSelectedSiteId(response.sites[0]._id?.$oid || response.sites[0]._id);
          }
        } else {
          setSites([]);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Failed to load sites for orders');
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [cleaner]);

  // Reset pagination when the selected site changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSiteId]);

  // 2. Fetch Orders whenever the selected site changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedSiteId) return;
      
      try {
        setLoadingOrders(true);
        const fetchedOrders = await orderAPI.getOrdersBySite(selectedSiteId); 
        setOrders(fetchedOrders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [selectedSiteId]);

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered': return 'status-completed';
      case 'accepted': return 'status-active';
      case 'rejected': return 'status-rejected';
      case 'new order':
      case 'pending order': return 'status-pending';
      default: return 'status-pending';
    }
  };

  // --- Pagination Logic ---
  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  if (loadingSites) {
    return (
      <div className="order-stocks-tab">
        <h2 className="section-title">Order & Track Stocks</h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your assigned sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-stocks-tab">
      
      <div className="schedule-header" style={{ marginBottom: '0.5rem' }}>
        <div>
          <h2 className="section-title">Stock Management</h2>
          <p className="section-description">Order new stock or track your previous requests.</p>
        </div>
        
        {/* NEW STOCK ORDER BUTTON (Prominent) */}
        <button onClick={handleRedirect} className="primary-btn" style={{ height: 'fit-content' }}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Place New Order
        </button>
      </div>

      <div className="reports-container" style={{ marginTop: '2rem' }}>
        
        {/* Left Sidebar - Sites */}
        <div className="reports-sidebar">
          <h3 className="sidebar-title">Track by Site</h3>
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

        {/* Right Content - Orders Table */}
        <div className="report-content">
          {selectedSiteId && (
            <div className="recent-orders" style={{ padding: '1.5rem', margin: 0 }}>
              <h3 className="orders-title" style={{ marginBottom: '1.5rem' }}>
                Order History - {sites.find(s => (s._id?.$oid || s._id) === selectedSiteId)?.site_name}
              </h3>

              {loadingOrders ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Fetching orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p>No orders have been placed for this site yet.</p>
                </div>
              ) : (
                <>
                  <div className="orders-list">
                    {/* Render sliced array for current page */}
                    {currentOrders.map(order => (
                      <div key={order._id} className="order-item">
                        <div className="order-header">
                          <span className="order-id">Order #{order.order_number}</span>
                          <span className={`order-status ${getStatusClass(order.order_status)}`}>
                            {order.order_status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="order-details" style={{ marginTop: '0.5rem' }}>
                          <div>
                            <p style={{ fontWeight: '600', color: '#333' }}>
                              {order.order_items.length} Item(s) Requested
                            </p>
                            <span className="order-date">Placed: {new Date(order.order_date).toLocaleDateString()}</span>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedOrder(order)} 
                            className="view-all-btn"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="secondary-btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="secondary-btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Render Modal */}
      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />

    </div>
  );
};

export default OrderStocksTab;