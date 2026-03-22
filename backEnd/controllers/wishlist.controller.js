import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";

// POST /user/wishlist/toggle
async function handelToggleWishlist(req, res) {
  try {
    const userId    = req.user._id;
    const { productId } = req.params;

    // check product exists
    const product = await Product.findOne({ _id: productId, isDeleted: false, isActive: true });
    if (!product) {
      return res.status(404).json(new ApiResponse(404, {}, "Product not found"));
    }

    const existing = await Wishlist.findOne({ user: userId, product: productId });

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      return res.status(200).json(
        new ApiResponse(200, { wishlisted: false }, "Removed from wishlist")
      );
    }

    await Wishlist.create({ user: userId, product: productId });
    return res.status(200).json(
      new ApiResponse(200, { wishlisted: true }, "Added to wishlist")
    );

  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

// GET /user/wishlist/ids — lightweight, just IDs for pre-filling hearts
async function handelGetWishlistIds(req, res) {
  try {
    const userId = req.user._id;

    const items = await Wishlist.find({ user: userId }).select("product");
    const ids   = items.map((item) => item.product.toString());

    return res.status(200).json(
      new ApiResponse(200, { ids }, "Wishlist IDs fetched")
    );

  } catch (error) {
    console.error("Error fetching wishlist IDs:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

// GET /user/wishlist — full paginated wishlist for wishlist page
async function handelGetWishlist(req, res) {
  try {
    const userId = req.user._id;
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const skip   = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Wishlist.find({ user: userId })
        .populate({
          path: "product",
          match: { isDeleted: false, isActive: true },
          populate: { path: "store", select: "name" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Wishlist.countDocuments({ user: userId }),
    ]);

    // filter out null products (deleted/inactive since wishlisting)
    const products = items.map((i) => i.product).filter(Boolean);

    return res.status(200).json(
      new ApiResponse(200, {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }, "Wishlist fetched")
    );

  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

// GET /user/wishlist/check/:productId — check single product
async function handelCheckWishlist(req, res) {
  try {
    const userId        = req.user._id;
    const { productId } = req.params;

    const existing  = await Wishlist.findOne({ user: userId, product: productId });

    return res.status(200).json(
      new ApiResponse(200, { wishlisted: !!existing }, "Wishlist status fetched")
    );

  } catch (error) {
    console.error("Error checking wishlist:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}

export {
  handelToggleWishlist,
  handelGetWishlistIds,
  handelGetWishlist,
  handelCheckWishlist,
};