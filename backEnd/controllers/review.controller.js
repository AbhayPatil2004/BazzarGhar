import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import ApiResponse from "../utils/ApiResponse.js";

async function handelAddProdcutReview(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { rating, comment, images } = req.body;
    
    const order = await Order.findOne({
      buyer: userId,
      "items.product": productId
    }).select("items");

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased"
      });
    }
    
    const orderItem = order.items.find(
      item => item.product.toString() === productId
    );
    
    const review = await Review.create({
      user: userId,
      product: productId,
      store: orderItem.store,
      rating,
      comment,
      images,
      isVerifiedPurchase: true
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });

  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}


async function handelGetProductReviews(req, res) {
  try {
    const { productId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar")
      .populate("store", "storeName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const ratingStats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      reviews,
      averageRating: ratingStats[0]?.averageRating || 0,
      totalReviews: ratingStats[0]?.totalReviews || 0,
      page,
      limit
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews"
    });
  }
}


export { handelAddProdcutReview , handelGetProductReviews };
