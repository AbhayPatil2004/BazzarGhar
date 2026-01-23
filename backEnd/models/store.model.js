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
        required: true
      }
    ],
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

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "StoreReview"
    },

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
      default: false,
    },

    subscriptionPlan: {
      type: String,
      enum: ["trial", "basic", "pro", "premium"],
      default: "trial",
    },

    subscriptionStartDate: {
      type: Date,
    },

    subscriptionEndDate: {
      type: Date,
    },

    isSubscriptionActive: {
      type: Boolean,
      default: false,
    },

    trialEndsAt: {
      type: Date,
    },

    commissionRate: {
      type: Number,
      default: 0,
    },

    productSales: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        productName: {
          type: String,
          required: true,
        },

        totalQuantitySold: {
          type: Number,
          default: 0,
        },

        totalRevenue: {
          type: Number,
          default: 0,
        },

        totalProfit: {
          type: Number,
          default: 0,
        },

        lastSoldAt: {
          type: Date,
        },
      }
    ],


  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
