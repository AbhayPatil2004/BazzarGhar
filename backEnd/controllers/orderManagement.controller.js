import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ApiResponse from '../utils/ApiResponse.js';
import { createOTP, verifyOTP, markOTPAsVerified } from '../utils/deliveryOtp.js';
import { generateInvoice } from '../utils/invoiceGenerator.js';
import sendMailToUser from '../utils/sendMail.js';

// ============ USER ORDER MANAGEMENT ============

/**
 * Get all orders for a user
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { buyer: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'title images finalPrice')
      .populate('items.seller', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(200, {
        orders,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        }
      }, "Orders fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to fetch orders")
    );
  }
};

/**
 * Get single order details
 */
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, buyer: userId })
      .populate('items.product')
      .populate('items.seller', 'username avatar email phone')
      .populate('items.store', 'storeName logo');

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order details fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to fetch order details")
    );
  }
};

/**
 * Cancel order (only if pending)
 */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: orderId, buyer: userId });

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    // Only allow cancellation for pending orders
    if (!["pending", "seller-requested"].includes(order.status)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Order cannot be cancelled in current status")
      );
    }

    // Update order status
    order.status = "cancelled";
    order.notes = reason || "Cancelled by buyer";
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      updatedBy: userId,
      note: reason || "Cancelled by buyer"
    });

    await order.save();

    // Restore product stock
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order cancelled successfully")
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to cancel order")
    );
  }
};

/**
 * Verify delivery OTP
 */
export const verifyDeliveryOTP = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, otp } = req.body;

    if (!otp) {
      return res.status(400).json(
        new ApiResponse(400, {}, "OTP is required")
      );
    }

    const order = await Order.findOne({ _id: orderId, buyer: userId });

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    if (order.status !== "out-for-delivery") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Order is not out for delivery")
      );
    }

    // Verify OTP
    if (!verifyOTP(otp, order.deliveryOTP)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid or expired OTP")
      );
    }

    // Mark OTP as verified
    order.deliveryOTP = markOTPAsVerified(order.deliveryOTP);
    order.status = "delivered";
    order.timeline.push({
      status: "delivered",
      timestamp: new Date(),
      updatedBy: userId,
      note: "OTP verified and order delivered"
    });

    await order.save();

    return res.status(200).json(
      new ApiResponse(200, order, "Order delivered successfully")
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to verify OTP")
    );
  }
};

/**
 * Download invoice
 */
export const downloadInvoice = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, buyer: userId })
      .populate('items.product');

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    // Generate invoice if not already generated
    if (!order.invoicePath) {
      const buyer = await User.findById(userId);
      order.invoicePath = generateInvoice(order, buyer);
      await order.save();
    }

    // Return invoice path
    return res.status(200).json(
      new ApiResponse(200, { invoicePath: order.invoicePath }, "Invoice generated successfully")
    );
  } catch (error) {
    console.error("Error generating invoice:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to generate invoice")
    );
  }
};

// ============ SELLER ORDER MANAGEMENT ============

/**
 * Get all orders for seller
 */
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { "items.seller": sellerId };
    if (status) {
      query["items.sellerRequestStatus"] = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'username email avatar phone')
      .populate('items.product', 'title images finalPrice')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(200, {
        orders,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        }
      }, "Seller orders fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to fetch seller orders")
    );
  }
};

/**
 * Accept order request (seller accepts order)
 */
export const acceptOrderRequest = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId, itemIndex } = req.body;

    if (typeof itemIndex !== 'number') {
      return res.status(400).json(
        new ApiResponse(400, {}, "Item index is required")
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    // Check if seller owns this item
    if (order.items[itemIndex].seller.toString() !== sellerId.toString()) {
      return res.status(403).json(
        new ApiResponse(403, {}, "Unauthorized")
      );
    }

    // Update item status
    order.items[itemIndex].sellerRequestStatus = "accepted";
    order.items[itemIndex].sellerDecisionDate = new Date();

    // Check if all items are accepted
    const allAccepted = order.items.every(item => item.sellerRequestStatus === "accepted");
    if (allAccepted) {
      order.status = "confirmed";
    }

    order.timeline.push({
      status: "accepted",
      timestamp: new Date(),
      updatedBy: sellerId,
      note: `Seller accepted item ${itemIndex + 1}`
    });

    await order.save();

    // Send email to buyer
    const buyer = await User.findById(order.buyer);
    if (buyer) {
      await sendMailToUser(
        buyer.email,
        "Order Confirmed - AuraShop",
        `Your order ${orderId} has been confirmed by the seller. Expected delivery: 5-7 business days.`
      );
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order accepted successfully")
    );
  } catch (error) {
    console.error("Error accepting order:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to accept order")
    );
  }
};

/**
 * Reject order request (seller rejects order)
 */
export const rejectOrderRequest = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId, itemIndex, reason } = req.body;

    if (typeof itemIndex !== 'number') {
      return res.status(400).json(
        new ApiResponse(400, {}, "Item index is required")
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    // Check if seller owns this item
    if (order.items[itemIndex].seller.toString() !== sellerId.toString()) {
      return res.status(403).json(
        new ApiResponse(403, {}, "Unauthorized")
      );
    }

    // Update item status
    order.items[itemIndex].sellerRequestStatus = "rejected";
    order.items[itemIndex].rejectionReason = reason || "No reason provided";
    order.items[itemIndex].sellerDecisionDate = new Date();

    // Check if all items are rejected
    const allRejected = order.items.every(item => item.sellerRequestStatus === "rejected");
    if (allRejected) {
      order.status = "rejected-by-seller";
      order.rejectionReason = reason || "Order rejected by seller";
      order.rejectedBysellerId = sellerId;
      order.rejectionDate = new Date();

      // Restore product stock
      for (let item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.timeline.push({
      status: "rejected",
      timestamp: new Date(),
      updatedBy: sellerId,
      note: `Seller rejected item ${itemIndex + 1}: ${reason || 'No reason provided'}`
    });

    await order.save();

    // Send email to buyer
    const buyer = await User.findById(order.buyer);
    if (buyer) {
      await sendMailToUser(
        buyer.email,
        "Order Rejected - AuraShop",
        `Your order ${orderId} has been rejected by the seller. Reason: ${reason || 'No reason provided'}`
      );
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order rejected successfully")
    );
  } catch (error) {
    console.error("Error rejecting order:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to reject order")
    );
  }
};

/**
 * Update order status (seller updates status)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId, newStatus, note } = req.body;

    const allowedStatuses = ["packed", "shipped", "out-for-delivery"];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json(
        new ApiResponse(400, {}, `Invalid status. Allowed: ${allowedStatuses.join(", ")}`)
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found")
      );
    }

    // Check if all items belong to this seller
    const sellerItems = order.items.filter(item => item.seller.toString() === sellerId.toString());
    if (sellerItems.length === 0) {
      return res.status(403).json(
        new ApiResponse(403, {}, "Unauthorized")
      );
    }

    // Update order status
    order.status = newStatus;
    order.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      updatedBy: sellerId,
      note: note || `Order status updated to ${newStatus}`
    });

    // Generate OTP for out-for-delivery
    if (newStatus === "out-for-delivery") {
      const otp = createOTP(15); // 15 minutes expiry
      order.deliveryOTP = otp;
      
      // Send OTP to buyer
      const buyer = await User.findById(order.buyer);
      if (buyer) {
        await sendMailToUser(
          buyer.email,
          "Your Order is Out for Delivery - OTP Required",
          `Your order is out for delivery. Your OTP for delivery verification is: <strong>${otp.code}</strong>. This OTP will expire in 15 minutes.`
        );
      }
    }

    await order.save();

    // Send email to buyer with status update
    const buyer = await User.findById(order.buyer);
    if (buyer) {
      await sendMailToUser(
        buyer.email,
        `Order Status Updated - ${newStatus}`,
        `Your order status has been updated to: ${newStatus}${note ? `. Note: ${note}` : ''}`
      );
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order status updated successfully")
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to update order status")
    );
  }
};

/**
 * Get seller order statistics
 */
export const getSellerOrderStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const stats = await Order.aggregate([
      {
        $match: { "items.seller": sellerId }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ["$items.sellerRequestStatus", "pending"] }, 1, 0]
            }
          },
          acceptedOrders: {
            $sum: {
              $cond: [{ $eq: ["$items.sellerRequestStatus", "accepted"] }, 1, 0]
            }
          },
          rejectedOrders: {
            $sum: {
              $cond: [{ $eq: ["$items.sellerRequestStatus", "rejected"] }, 1, 0]
            }
          },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    return res.status(200).json(
      new ApiResponse(200, stats[0] || {}, "Seller stats fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to fetch stats")
    );
  }
};

/**
 * Send delivery OTP to customer (from seller)
 */
export const sendDeliveryOTPToCustomer = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId, phoneNumber, email } = req.body;

    if (!orderId) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Order ID is required")
      );
    }

    if (!phoneNumber && !email) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Please provide phone number or email")
      );
    }

    // Verify order belongs to this seller and is in correct status
    const order = await Order.findOne({
      _id: orderId,
      "items.seller": sellerId,
      status: "shipped"
    }).populate('buyer', 'email phone');

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Order not found or not yet shipped")
      );
    }

    // Generate OTP
    const otp = createOTP(15); // 15 minute validity

    // Update order with OTP
    order.deliveryOTP = {
      code: otp.code,
      expiresAt: otp.expiresAt,
      verified: false,
      verifiedAt: null
    };

    // Add timeline entry
    order.timeline.push({
      status: "shipped",
      timestamp: new Date(),
      updatedBy: sellerId,
      note: `OTP sent to customer ${email ? `(${email})` : `(${phoneNumber})`}`
    });

    await order.save();

    // Send OTP via email or SMS
    if (email) {
      const emailSubject = "Your Delivery OTP - AuraShop";
      const emailBody = `
        <h2>Delivery OTP</h2>
        <p>Your order is on the way! Use the following OTP to verify delivery:</p>
        <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px;">${otp.code}</h1>
        <p>This OTP is valid for 15 minutes.</p>
        <p>Order ID: <strong>${order._id.toString().slice(-8).toUpperCase()}</strong></p>
        <p>Amount: <strong>₹${order.totalAmount.toFixed(2)}</strong></p>
        <hr>
        <p>Do not share this OTP with anyone.</p>
      `;

      await sendMailToUser(email, emailSubject, emailBody);
    }

    // Note: SMS sending would require Twilio or similar service
    // For now, we're only sending email
    if (phoneNumber && !email) {
      console.log(`SMS OTP would be sent to ${phoneNumber}: ${otp.code}`);
      // Integrate with SMS service here (Twilio, AWS SNS, etc.)
    }

    return res.status(200).json(
      new ApiResponse(200, { 
        orderId, 
        otpSentVia: email ? 'email' : 'phone',
        expiresIn: '15 minutes'
      }, "OTP sent successfully to customer")
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to send OTP")
    );
  }
};
