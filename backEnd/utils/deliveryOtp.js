import crypto from 'crypto';

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate OTP object with expiry
 * @param {number} expiryMinutes - OTP expiry time in minutes (default: 15)
 * @returns {Object} OTP object with code and expiry time
 */
export const createOTP = (expiryMinutes = 15) => {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  return {
    code,
    expiresAt,
    verified: false,
    verifiedAt: null,
  };
};

/**
 * Verify OTP
 * @param {string} providedOTP - OTP provided by user
 * @param {Object} storedOTP - Stored OTP object from database
 * @returns {boolean} True if OTP is valid, false otherwise
 */
export const verifyOTP = (providedOTP, storedOTP) => {
  if (!storedOTP || !storedOTP.code) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > new Date(storedOTP.expiresAt)) {
    return false;
  }

  // Check if already verified
  if (storedOTP.verified) {
    return false;
  }

  // Check if OTP matches
  return providedOTP.toString() === storedOTP.code.toString();
};

/**
 * Mark OTP as verified
 * @param {Object} otpObject - OTP object to mark as verified
 * @returns {Object} Updated OTP object
 */
export const markOTPAsVerified = (otpObject) => {
  return {
    ...otpObject,
    verified: true,
    verifiedAt: new Date(),
  };
};
