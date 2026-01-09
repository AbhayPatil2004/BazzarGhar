import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        store: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Store",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        size: { type: String },
        color: { type: String },
        price: { type: Number, required: true }, 
        finalPrice: { type: Number, required: true },
      },
    ],

    coupon: {
      code: { type: String },
      discountAmount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
