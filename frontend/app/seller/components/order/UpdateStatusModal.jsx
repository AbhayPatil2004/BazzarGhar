'use client';

import React, { useState } from 'react';
import './UpdateStatusModal.css';

const UpdateStatusModal = ({ order, onClose, onStatusUpdate, onSendOTP }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [notes, setNotes] = useState(order.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Order is pending' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed by seller' },
    { value: 'packed', label: 'Packed', description: 'Order has been packed' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Order is out for delivery' },
  ];

  const getAvailableStatuses = () => {
    const currentStatusIndex = statusOptions.findIndex(s => s.value === order.status);
    if (currentStatusIndex === -1) return statusOptions;
    return statusOptions.slice(currentStatusIndex);
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status && trackingNumber === order.trackingNumber && notes === order.notes) {
      setError('Please make changes before updating');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Prepare update data
      const updateData = {
        status: selectedStatus,
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { notes })
      };

      await onStatusUpdate(order._id, updateData);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTPClick = () => {
    if (selectedStatus !== 'shipped') {
      setError('You can only send OTP when order is marked as "Shipped"');
      return;
    }
    onSendOTP(order);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content update-status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Order Status</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Info */}
          <div className="order-info-section">
            <h3>Order ID: {order._id?.slice(-8).toUpperCase()}</h3>
            <p>Current Status: <strong className="current-status">{order.status}</strong></p>
          </div>

          {/* Status Selection */}
          <section className="status-selection-section">
            <label>Select New Status:</label>
            <div className="status-options">
              {getAvailableStatuses().map((status) => (
                <div key={status.value} className="status-option">
                  <input
                    type="radio"
                    id={`status-${status.value}`}
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor={`status-${status.value}`} className="status-label">
                    <p className="status-name">{status.label}</p>
                    <p className="status-description">{status.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Tracking Number */}
          <section className="tracking-section">
            <label htmlFor="tracking-number">Tracking Number (Optional):</label>
            <input
              id="tracking-number"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number from courier"
              disabled={loading}
              className="tracking-input"
            />
            <p className="help-text">Provide tracking number when shipping the order</p>
          </section>

          {/* Notes */}
          <section className="notes-section">
            <label htmlFor="notes">Additional Notes (Optional):</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this order..."
              rows={3}
              disabled={loading}
              className="notes-textarea"
            />
          </section>

          {/* Status Flow Info */}
          <section className="status-flow-section">
            <h4>Order Status Flow</h4>
            <div className="status-flow">
              <div className="flow-step pending">
                <span className="flow-label">Pending</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step confirmed">
                <span className="flow-label">Confirmed</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step packed">
                <span className="flow-label">Packed</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step shipped">
                <span className="flow-label">Shipped</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step delivery">
                <span className="flow-label">Out for Delivery</span>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* OTP Info */}
          {selectedStatus === 'shipped' && (
            <div className="otp-info-box">
              <h4>📱 Delivery OTP</h4>
              <p>When order is marked as "Shipped", you can send a 6-digit OTP to the customer's phone. They will use this OTP to verify delivery once it's out for delivery.</p>
              <p className="otp-reminder"><strong>Note:</strong> Send OTP after clicking "Update Status" below.</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button
            className="action-button update"
            onClick={handleStatusUpdate}
            disabled={loading || selectedStatus === order.status}
          >
            {loading ? 'Updating...' : '✓ Update Status'}
          </button>

          {selectedStatus === 'shipped' && (
            <button
              className="action-button send-otp"
              onClick={handleSendOTPClick}
              disabled={loading}
            >
              📱 Send OTP to Customer
            </button>
          )}

          <button
            className="action-button cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
