import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 👤 Buyer info
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📦 Products in the order (multi-seller)
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        store: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Store",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, // price per unit
        },
        finalPrice: {
          type: Number,
          required: true, // after discount
        },
      },
    ],

    // 💰 Payment details
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Wallet", "Other"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // 🏠 Shipping address (snapshot at order time)
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    // 🚦 Order status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "out-for-delivery",
        "delivered",
        "cancelled",
        "returned"
      ],
      default: "pending",
    },

    // ⚡ Extra info
    trackingNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
