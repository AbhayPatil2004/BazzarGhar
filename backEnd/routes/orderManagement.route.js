import express from 'express';
import {
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  verifyDeliveryOTP,
  downloadInvoice,
  getSellerOrders,
  acceptOrderRequest,
  rejectOrderRequest,
  updateOrderStatus,
  getSellerOrderStats,
  sendDeliveryOTPToCustomer
} from '../controllers/orderManagement.controller.js';
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js';
import handelSellerAuthorization from '../middleware/seller.authorized.middleware.js';

const router = express.Router();

// ============ USER ROUTES ============

// Get all orders for user
router.get('/my-orders', handelUserAuthentication, getUserOrders);

// Get single order details
router.get('/:orderId', handelUserAuthentication, getOrderDetails);

// Cancel order
router.post('/:orderId/cancel', handelUserAuthentication, cancelOrder);

// Verify delivery OTP
router.post('/verify-otp', handelUserAuthentication, verifyDeliveryOTP);

// Download invoice
router.get('/:orderId/invoice', handelUserAuthentication, downloadInvoice);

// ============ SELLER ROUTES ============

// Get all orders for seller
router.get('/seller/orders', handelUserAuthentication, handelSellerAuthorization, getSellerOrders);

// Get seller order statistics
router.get('/seller/stats', handelUserAuthentication, handelSellerAuthorization, getSellerOrderStats);

// Accept order request
router.post('/seller/accept', handelUserAuthentication, handelSellerAuthorization, acceptOrderRequest);

// Reject order request
router.post('/seller/reject', handelUserAuthentication, handelSellerAuthorization, rejectOrderRequest);

// Update order status
router.post('/seller/update-status', handelUserAuthentication, handelSellerAuthorization, updateOrderStatus);

// Send OTP to customer
router.post('/seller/send-otp', handelUserAuthentication, handelSellerAuthorization, sendDeliveryOTPToCustomer);

export default router;
