'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OTPVerificationModal.css';

const OTPVerificationModal = ({ order, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${API_BASE_URL}/order-management/verify-otp`,
        {
          orderId: order._id,
          otp: otpCode
        },
        { withCredentials: true }
      );

      setSuccessMessage('Order delivered successfully! ✓');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.response?.data?.message || 'Failed to verify OTP');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="otp-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="otp-modal-header">
          <h2>Verify Delivery</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="otp-modal-body">
          {successMessage ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <p className="success-message">{successMessage}</p>
            </div>
          ) : (
            <>
              <div className="otp-info">
                <p className="info-text">
                  Enter the 6-digit OTP sent to your registered phone number or email to verify the delivery.
                </p>
                <div className="order-summary">
                  <span>Order: {order._id?.slice(-8).toUpperCase()}</span>
                  <span className={`time-remaining ${timeLeft < 60 ? 'urgent' : ''}`}>
                    ⏱️ {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="otp-form">
                {error && <div className="error-message">{error}</div>}

                <div className="otp-input-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input"
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="otp-help-text">
                  <p>Didn't receive the OTP?</p>
                  <button type="button" className="resend-link" disabled>
                    Resend OTP (Not implemented)
                  </button>
                </div>

                <div className="otp-modal-actions">
                  <button
                    type="submit"
                    className="verify-button"
                    disabled={loading || otp.some(d => !d) || timeLeft === 0}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
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

export default OTPVerificationModal;
