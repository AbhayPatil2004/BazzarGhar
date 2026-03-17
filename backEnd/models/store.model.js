

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },

    storeProducts: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: String,
      required: true,
      index: true,
      default: "General",
    },

    description: {
      type: String,
      maxlength: 500,
    },

    logo: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: "India",
      },
    },

    // 🔥 FIXED
    subscriber: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        value: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],

    // 🔥 FIXED (should be array)
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StoreReview",
      },
    ],

    totalProducts: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    subscriptionPlan: {
      type: String,
      enum: ["trial", "basic", "pro", "premium"],
      default: "trial",
    },

    subscriptionStartDate: Date,
    subscriptionEndDate: Date,

    isSubscriptionActive: {
      type: Boolean,
      default: false,
    },

    trialEndsAt: Date,

    commissionRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;