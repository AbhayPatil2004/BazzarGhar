'use client';

import React, { useState } from 'react';
import './AcceptRejectModal.css';

const AcceptRejectModal = ({ order, onClose, onAccept, onReject }) => {
  const [selectedItems, setSelectedItems] = useState(
    order.items.map((_, index) => index)
  );
  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState(''); // 'accept' or 'reject'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleItemToggle = (index) => {
    setSelectedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === order.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(order.items.map((_, index) => index));
    }
  };

  const handleAccept = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to accept');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAccept(order._id, selectedItems);
    } catch (err) {
      setError(err.message || 'Failed to accept order');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to reject');
      return;
    }

    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onReject(order._id, selectedItems, rejectReason);
    } catch (err) {
      setError(err.message || 'Failed to reject order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content accept-reject-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Accept or Reject Order</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Info */}
          <div className="order-info-section">
            <h3>Order ID: {order._id?.slice(-8).toUpperCase()}</h3>
            <p>Total Amount: <strong>₹{(order.totalAmount || 0).toFixed(2)}</strong></p>
          </div>

          {/* Items Selection */}
          <section className="items-section">
            <div className="section-header">
              <h4>Select Items to Accept/Reject</h4>
              <button 
                type="button"
                className="select-all-button"
                onClick={handleSelectAll}
                disabled={loading}
              >
                {selectedItems.length === order.items.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="items-list">
              {order.items?.map((item, index) => (
                <div key={index} className="item-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={`item-${index}`}
                    checked={selectedItems.includes(index)}
                    onChange={() => handleItemToggle(index)}
                    disabled={loading}
                    className="item-checkbox"
                  />
                  <label htmlFor={`item-${index}`} className="item-label">
                    <div className="item-image">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.title}
                        />
                      )}
                    </div>
                    <div className="item-details">
                      <p className="product-name">{item.product?.title}</p>
                      <p className="product-qty">Quantity: {item.quantity}</p>
                      {item.size && <p className="product-detail">Size: {item.size}</p>}
                      {item.color && <p className="product-detail">Color: {item.color}</p>}
                      <p className="product-price">₹{(item.finalPrice || 0).toFixed(2)}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Action Tabs */}
          <div className="action-tabs">
            <button
              className={`tab-button ${action === 'accept' ? 'active' : ''}`}
              onClick={() => {
                setAction('accept');
                setRejectReason('');
                setError('');
              }}
              disabled={loading}
            >
              Accept Order
            </button>
            <button
              className={`tab-button ${action === 'reject' ? 'active' : ''}`}
              onClick={() => {
                setAction('reject');
                setError('');
              }}
              disabled={loading}
            >
              Reject Order
            </button>
          </div>

          {/* Reject Reason */}
          {action === 'reject' && (
            <section className="reject-section">
              <label htmlFor="reject-reason">Reason for Rejection:</label>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a detailed reason for rejection..."
                rows={4}
                disabled={loading}
                className="reject-textarea"
              />
            </section>
          )}

          {/* Summary */}
          <div className="selection-summary">
            <p>Selected Items: <strong>{selectedItems.length} of {order.items.length}</strong></p>
            <p>Total Selected Amount: <strong>
              ₹{order.items
                .filter((_, index) => selectedItems.includes(index))
                .reduce((sum, item) => sum + (item.finalPrice || 0), 0)
                .toFixed(2)}
            </strong></p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          {action === 'accept' ? (
            <>
              <button
                className="action-button accept"
                onClick={handleAccept}
                disabled={loading || selectedItems.length === 0}
              >
                {loading ? 'Accepting...' : '✓ Accept Selected Items'}
              </button>
              <button
                className="action-button cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          ) : action === 'reject' ? (
            <>
              <button
                className="action-button reject"
                onClick={handleReject}
                disabled={loading || selectedItems.length === 0 || !rejectReason.trim()}
              >
                {loading ? 'Rejecting...' : '✕ Reject Selected Items'}
              </button>
              <button
                className="action-button cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="action-button cancel"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptRejectModal;
