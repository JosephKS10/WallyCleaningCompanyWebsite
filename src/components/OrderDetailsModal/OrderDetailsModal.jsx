import React from 'react';
import { FiX, FiPackage, FiTruck, FiCalendar, FiUser } from 'react-icons/fi';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

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

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-content" onClick={e => e.stopPropagation()}>
        <div className="order-modal-header">
          <div>
            <h3>Order {order.order_number}</h3>
            <span className={`status-badge ${getStatusClass(order.order_status)}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
              {order.order_status.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="close-btn"><FiX /></button>
        </div>

        <div className="order-modal-body">
          <div className="order-meta-grid">
            {/* NEW: Ordered By Box (Full Width) */}
            <div className="meta-box full-width">
              <FiUser className="meta-icon" />
              <div>
                <label>Ordered By</label>
                <p>{order.cleaner_email || (order.order_source === 'ccsm' ? 'CCSM Automated System' : 'Unknown')}</p>
              </div>
            </div>

            <div className="meta-box">
              <FiCalendar className="meta-icon" />
              <div>
                <label>Order Date</label>
                <p>{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="meta-box">
              <FiTruck className="meta-icon" />
              <div>
                <label>Delivery Date</label>
                <p>{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}</p>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h4><FiPackage style={{marginRight: '8px'}}/> Items Requested</h4>
            <div className="order-items-table-wrapper">
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>On Site?</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.product_name}</strong></td>
                      <td style={{textTransform: 'capitalize'}}>{item.product_type}</td>
                      <td>{item.quantity}</td>
                      <td>{item.item_already_on_site ? `Yes (${item.item_available_on_site})` : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.driver_note && (
            <div className="driver-note-section">
              <h4>Driver Note</h4>
              <p>{order.driver_note}</p>
            </div>
          )}

          {order.driver_delivery_images && order.driver_delivery_images.length > 0 && (
            <div className="delivery-images-section">
              <h4>Delivery Proof</h4>
              <div className="delivery-images-grid">
                {order.driver_delivery_images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Delivery proof ${idx+1}`} className="delivery-img" />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;