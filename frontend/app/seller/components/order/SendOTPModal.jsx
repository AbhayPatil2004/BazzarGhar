'use client';

import React, { useState } from 'react';
import axios from 'axios';
import './SendOTPModal.css';

const SendOTPModal = ({ order, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(order.shippingAddress?.phone || '');
  const [email, setEmail] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!phoneNumber && !email) {
      setError('Please provide either phone number or email to send OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call API to send OTP
      const response = await axios.post(
        `${API_BASE_URL}/order-management/seller/send-otp`,
        {
          orderId: order._id,
          phoneNumber: phoneNumber || null,
          email: email || null
        },
        { withCredentials: true }
      );

      setSuccessMessage('✓ OTP sent successfully! Customer will receive it on their phone/email.');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="send-otp-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send Delivery OTP</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <div className="modal-body">
          {successMessage ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <p className="success-message">{successMessage}</p>
              <p className="success-info">
                The customer can use this OTP to verify delivery when the order arrives.
              </p>
            </div>
          ) : (
            <>
              <div className="otp-info">
                <h3>Order: {order._id?.slice(-8).toUpperCase()}</h3>
                <p className="customer-name">Customer: {order.shippingAddress?.fullName}</p>
                <div className="order-summary">
                  <p>Amount: ₹{(order.totalAmount || 0).toFixed(2)}</p>
                  <p>Items: {order.items?.length}</p>
                </div>
              </div>

              <div className="otp-description">
                <p>
                  A 6-digit OTP will be sent to the customer. They will use this OTP to verify the delivery once the order arrives at their doorstep.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="otp-send-form">
                {error && <div className="error-message">{error}</div>}

                {/* Contact Methods */}
                <section className="contact-section">
                  <h4>Send OTP via:</h4>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label htmlFor="phone-number">
                      <input
                        type="checkbox"
                        id="phone-check"
                        checked={!!phoneNumber}
                        onChange={(e) => {
                          if (!e.target.checked) setPhoneNumber('');
                          else setPhoneNumber(order.shippingAddress?.phone || '');
                        }}
                        disabled={loading}
                      />
                      <span>Phone Number</span>
                    </label>
                    {phoneNumber && (
                      <input
                        id="phone-number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        disabled={loading}
                        className="contact-input"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">
                      <input
                        type="checkbox"
                        id="email-check"
                        checked={!!email}
                        onChange={(e) => {
                          if (!e.target.checked) setEmail('');
                          else setEmail('');
                        }}
                        disabled={loading}
                      />
                      <span>Email Address</span>
                    </label>
                    {email !== null && email !== false && (
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        disabled={loading}
                        className="contact-input"
                      />
                    )}
                  </div>
                </section>

                {/* OTP Details */}
                <div className="otp-details">
                  <h4>OTP Details:</h4>
                  <ul className="details-list">
                    <li>🔐 6-digit OTP code</li>
                    <li>⏱️ Valid for 15 minutes</li>
                    <li>📱 Sent via SMS or Email</li>
                    <li>✓ One-time use only</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="send-button"
                    disabled={loading || (!phoneNumber && !email)}
                  >
                    {loading ? 'Sending...' : '📱 Send OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="cancel-button"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendOTPModal;
