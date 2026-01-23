import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
            minlength: 3,
            maxlength: 120,
        },

        description: {
            type: String,
            required: true,
            maxlength: 2000,
        },

        category: {
            type: String,
            required: true,
            index: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPercentage: {
            type: Number,
            min: 0,
            max: 90,
            default: 0,
        },

        gender: {
            type: String,
            enum: ["men", "women", "unisex", "kids"],
            index: true,
        },

        isReturnable: {
            type: Boolean,
            default: true,
        },

        deliveryTime: {
            type: String,
        },

        finalPrice: {
            type: Number,
        },

        sizes: {
            type: [String],
            default: [],
        },

        colors: {
            type: [String],
            default: [],
        },

        images: {
            type: [String],
            validate: [arr => arr.length > 0, "At least one image required"],
        },

        tags: {
            type: [String],
            index: true,
            default: [],
        },
        searchKeyword: {
            type: [String],
            index: true,
            default: [],
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


productSchema.pre("save", function (next) {
    this.finalPrice =
        this.price - (this.price * this.discountPercentage) / 100;
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
