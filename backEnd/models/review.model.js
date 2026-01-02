import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // 👤 Reviewer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👕 Product being reviewed
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // 🏪 Optional Store reference (for store rating aggregation)
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    // ⭐ Rating & comment
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      maxlength: 500,
    },

    // 📸 Optional images uploaded by user
    images: {
      type: [String], // Cloudinary URLs
      default: [],
    },

    // ✔ Verified purchase flag
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
