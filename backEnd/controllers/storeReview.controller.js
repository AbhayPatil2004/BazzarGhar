import StoreReview from "../models/storeReview.model.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import Store from "../models/store.model.js";

async function handelGetStoreReviews(req, res) {
  try {
    const { storeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid storeId"));
    }

    const reviews = await StoreReview.find({ store: storeId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      userName: review.user?.username || "User",
      avatar: review.user?.avatar || "",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        { reviews: formattedReviews },
        "Reviews fetched successfully"
      )
    );
  } catch (error) {
    console.error("Get store reviews error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

async function handleAddStoreReview(req, res) {
  try {
    const { storeId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid storeId"));
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized"));
    }

    if (!comment || comment.trim().length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Comment is required"));
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Store not found"));
    }

    if (store.owner.toString() === userId.toString()) {
      return res.status(403).json(
        new ApiResponse(
          403,
          {},
          "Store owner cannot review their own store"
        )
      );
    }

    const newReview = await StoreReview.create({
      store: storeId,
      user: userId,
      comment: comment.trim(),
      rating: rating || 5,
    });

    await newReview.populate("user", "username avatar");

    const formattedReview = {
      userName: newReview.user?.username || "User",
      avatar: newReview.user?.avatar || "",
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
    };

    return res.status(201).json(
      new ApiResponse(
        201,
        { review: formattedReview },
        "Review added successfully"
      )
    );
  } catch (error) {
    console.error("Add store review error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

export { handelGetStoreReviews, handleAddStoreReview };