'use client';

import React from 'react';
import './SellerOrderCard.css';

const SellerOrderCard = ({
  order,
  onViewDetails,
  onAcceptReject,
  onUpdateStatus,
  onSendOTP
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'seller-requested': 'status-requested',
      'confirmed': 'status-confirmed',
      'packed': 'status-packed',
      'shipped': 'status-shipped',
      'out-for-delivery': 'status-delivery',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'rejected-by-seller': 'status-rejected'
    };
    return statusMap[status] || 'status-default';
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

  // Determine which actions are available based on order status
  const canAcceptReject = ['pending', 'seller-requested'].includes(order.status);
  const canUpdateStatus = !['pending', 'seller-requested', 'cancelled', 'rejected-by-seller'].includes(order.status);
  const canSendOTP = order.status === 'shipped';

  // Get seller's items in this order
  const sellerItems = order.items?.filter(item => 
    item.seller?.toString() === order.items[0]?.seller?.toString()
  ) || [];

  return (
    <div className="seller-order-card">
      <div className="card-header">
        <div className="order-id-section">
          <span className="label">Order ID:</span>
          <span className="value">{order._id?.slice(-8).toUpperCase()}</span>
        </div>
        <div className={`status-badge ${getStatusBadgeClass(order.status)}`}>
          {getStatusLabel(order.status)}
        </div>
      </div>

      <div className="card-date">
        📅 {formatDate(order.createdAt)}
      </div>

      {/* Customer Info */}
      <div className="customer-info">
        <h4>Customer Information</h4>
        <p className="customer-name">
          <strong>{order.shippingAddress?.fullName}</strong>
        </p>
        <p className="customer-contact">
          📞 {order.shippingAddress?.phone}
        </p>
        <p className="customer-location">
          📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
        </p>
      </div>

      {/* Items Preview */}
      <div className="card-items">
        <h4>Items ({sellerItems.length})</h4>
        <div className="items-list">
          {sellerItems?.slice(0, 2).map((item, index) => (
            <div key={index} className="item-preview">
              <div className="item-image">
                {item.product?.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product?.title}
                  />
                )}
              </div>
              <div className="item-info">
                <p className="product-name">
                  {item.product?.title?.substring(0, 30)}...
                </p>
                <p className="product-qty">Qty: {item.quantity}</p>
                {item.size && <p className="product-detail">Size: {item.size}</p>}
                {item.color && <p className="product-detail">Color: {item.color}</p>}
              </div>
              <div className="item-price">
                ₹{(item.finalPrice || 0).toFixed(2)}
              </div>
            </div>
          ))}
          {sellerItems?.length > 2 && (
            <div className="more-items">
              +{sellerItems.length - 2} more items
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card-summary">
        <div className="summary-row">
          <span className="label">Total Amount:</span>
          <span className="total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Payment:</span>
          <span className="value">{order.paymentMethod}</span>
        </div>
        <div className="summary-row">
          <span className="label">Payment Status:</span>
          <span className={`payment-status ${order.paymentStatus}`}>
            {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        <button
          onClick={onViewDetails}
          className="action-button view-details"
        >
          View Details
        </button>

        {canAcceptReject && (
          <button
            onClick={onAcceptReject}
            className="action-button accept-reject"
          >
            Accept/Reject
          </button>
        )}

        {canUpdateStatus && (
          <button
            onClick={onUpdateStatus}
            className="action-button update-status"
          >
            Update Status
          </button>
        )}

        {canSendOTP && (
          <button
            onClick={onSendOTP}
            className="action-button send-otp"
          >
            Send OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerOrderCard;
