'use client';

import React from 'react';
import './OrderCard.css';

const OrderCard = ({
  order,
  onViewDetails,
  onCancel,
  onVerifyOTP,
  onDownloadInvoice
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

  const canCancelOrder = ['pending', 'seller-requested'].includes(order.status);
  const canVerifyOTP = order.status === 'out-for-delivery';
  const canDownloadInvoice = ['confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered'].includes(order.status);

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-id">
          <span className="label">Order ID:</span>
          <span className="value">{order._id?.slice(-8).toUpperCase()}</span>
        </div>
        <div className={`status-badge ${getStatusBadgeClass(order.status)}`}>
          {getStatusLabel(order.status)}
        </div>
      </div>

      <div className="order-date">
        {formatDate(order.createdAt)}
      </div>

      {/* Products Preview */}
      <div className="order-items">
        <h4 className="items-title">Items ({order.items?.length || 0})</h4>
        <div className="items-list">
          {order.items?.slice(0, 2).map((item, index) => (
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
                <p className="product-name">{item.product?.title?.substring(0, 30)}...</p>
                <p className="product-qty">Qty: {item.quantity}</p>
              </div>
              <div className="item-price">
                ₹{(item.finalPrice || 0).toFixed(2)}
              </div>
            </div>
          ))}
          {order.items?.length > 2 && (
            <div className="more-items">
              +{order.items.length - 2} more items
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span className="label">Payment:</span>
          <span className="value">{order.paymentMethod}</span>
        </div>
        <div className="summary-row">
          <span className="label">Total Amount:</span>
          <span className="total-amount">₹{(order.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Payment Status:</span>
          <span className={`payment-status ${order.paymentStatus}`}>
            {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button
          onClick={onViewDetails}
          className="action-button view-details"
        >
          View Details
        </button>

        {canDownloadInvoice && (
          <button
            onClick={onDownloadInvoice}
            className="action-button download-invoice"
          >
            Invoice
          </button>
        )}

        {canVerifyOTP && (
          <button
            onClick={onVerifyOTP}
            className="action-button verify-otp"
          >
            Verify OTP
          </button>
        )}

        {canCancelOrder && (
          <button
            onClick={onCancel}
            className="action-button cancel-order"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
