'use client';

import React from 'react';
import './SellerOrderDetailsModal.css';

const SellerOrderDetailsModal = ({ order, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'seller-requested': 'Seller Requested',
      'confirmed': 'Confirmed',
      'packed': 'Packed',
      'shipped': 'Shipped',
      'out-for-delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'rejected-by-seller': 'Rejected'
    };
    return labels[status] || status;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details (Seller View)</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Info */}
          <section className="detail-section">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Order ID</label>
                <p>{order._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="info-item">
                <label>Order Date</label>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div className="info-item">
                <label>Status</label>
                <p className="status-text">{getStatusLabel(order.status)}</p>
              </div>
              <div className="info-item">
                <label>Tracking Number</label>
                <p>{order.trackingNumber || 'Not assigned yet'}</p>
              </div>
            </div>
          </section>

          {/* Customer Info */}
          <section className="detail-section">
            <h3>Customer Information</h3>
            <div className="address-box">
              <p><strong>{order.shippingAddress?.fullName}</strong></p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
            </div>
          </section>

          {/* Payment Info */}
          <section className="detail-section">
            <h3>Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Payment Method</label>
                <p>{order.paymentMethod}</p>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <p className={`payment-status ${order.paymentStatus}`}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </p>
              </div>
              <div className="info-item">
                <label>Total Amount</label>
                <p className="amount">₹{(order.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="detail-section">
            <h3>Order Items ({order.items?.length})</h3>
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-cell">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.title}
                              className="product-thumbnail"
                            />
                          )}
                          <div>
                            <p className="product-name">{item.product?.title}</p>
                            {item.size && <p className="product-detail">Size: {item.size}</p>}
                            {item.color && <p className="product-detail">Color: {item.color}</p>}
                            {item.gender && <p className="product-detail">Gender: {item.gender}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td>₹{(item.price || 0).toFixed(2)}</td>
                      <td className="text-right">₹{(item.finalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <section className="detail-section">
              <h3>Order Timeline</h3>
              <div className="timeline">
                {order.timeline.map((event, index) => (
                  <div key={index} className="timeline-event">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-status">{getStatusLabel(event.status)}</p>
                      <p className="timeline-time">{formatDate(event.timestamp)}</p>
                      {event.note && <p className="timeline-note">{event.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Seller Request Status */}
          {order.items?.some(item => item.sellerRequestStatus) && (
            <section className="detail-section">
              <h3>Seller Request Status</h3>
              <div className="status-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Request Status</th>
                      <th>Decision Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product?.title?.substring(0, 40)}</td>
                        <td>
                          <span className={`status-badge ${item.sellerRequestStatus}`}>
                            {item.sellerRequestStatus}
                          </span>
                        </td>
                        <td>{item.sellerDecisionDate ? formatDate(item.sellerDecisionDate) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Delivery OTP Status */}
          {order.deliveryOTP?.verified && (
            <section className="detail-section">
              <h3>Delivery Status</h3>
              <div className="info-box">
                <p><strong>✓ OTP Verified</strong></p>
                <p>Verified at: {formatDate(order.deliveryOTP.verifiedAt)}</p>
              </div>
            </section>
          )}

          {/* Notes */}
          {order.notes && (
            <section className="detail-section">
              <h3>Notes</h3>
              <div className="notes-box">
                <p>{order.notes}</p>
              </div>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsModal;
