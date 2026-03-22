import Product from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";;
import ReccomendProduct from "../models/recommend.model.js";
import SponserProduct from "../models/sponser.model.js";
import Store from "../models/store.model.js";
import SearchHistory from "../models/search.model.js";

async function handelGetAllProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      sort,
      category,
      gender,
      minPrice,
      maxPrice,
      rating,
      search,
      tags,
      inStock,
      isReturnable,
    } = req.query;

    const filter = {
      isDeleted: false,
      isActive: true,
    };

    // category
    if (category) filter.category = category;

    // gender
    if (gender) filter.gender = gender;

    // price range
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // minimum rating
    if (rating) filter.rating = { $gte: Number(rating) };

    // in stock only
    if (inStock === "true") filter.stock = { $gt: 0 };

    // returnable only
    if (isReturnable === "true") filter.isReturnable = true;

    // search — matches title, tags, searchKeyword
    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title:         regex },
        { tags:          regex },
        { searchKeyword: regex },
        { category:      regex },
      ];
    }

    // tags filter
    if (tags) {
      const tagsArray = tags.split(",").map((t) => t.trim());
      filter.tags = { $in: tagsArray };
    }

    // sort
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "trending")        sortOption = { totalReviews: -1, rating: -1 };
    if (sort === "rating")          sortOption = { rating: -1 };
    if (sort === "price_asc")       sortOption = { finalPrice: 1 };
    if (sort === "price_desc")      sortOption = { finalPrice: -1 };
    if (sort === "newest")          sortOption = { createdAt: -1 };
    if (sort === "most_reviewed")   sortOption = { totalReviews: -1 };

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("store", "name")
        .populate("seller", "username avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        products,
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      }, "Products fetched successfully")
    );

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
}



async function handelAddToCart( req , res ){

  try{

  }
  catch(error){
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handelAddToWishList( req , res ){

  try{

  }
  catch(error){
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}



async function handelSaveProductSearch(req, res) {
  try {
    const userId = req.user._id;
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Query is required"));
    }

    let userHistory = await SearchHistory.findOne({ user: userId });
    if (!userHistory) {
      userHistory = new SearchHistory({
        user: userId,
        storeSearches: [],
        productSearches: [],
      });
    }

    userHistory.productSearches = userHistory.productSearches.filter(
      (item) => item !== query
    );

    userHistory.productSearches.unshift(query);

    if (userHistory.productSearches.length > 10) {
      userHistory.productSearches.pop();
    }

    await userHistory.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { productSearches: userHistory.productSearches },
          "Product search saved successfully"
        )
      );
  } catch (error) {
    console.error("Error saving product search:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handelGetProductSearchHistory(req, res) {
  try {
    const userId = req.user._id;

    const userHistory = await SearchHistory.findOne({ user: userId });

    const productSearches = userHistory?.productSearches || [];

    return res
      .status(200)
      .json(new ApiResponse(200, { productSearches }, "Product searches fetched successfully"));
  } catch (error) {
    console.error("Error fetching product search history:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handelGetallProducts(req, res) {
  try {
    const products = await Product.find()
      .populate("store", "_id")
      .populate("seller", "_id");

    return res.status(200).json(
      new ApiResponse(200, { products }, "Products sent successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

async function handelGetSearchProducts(req, res) {
  try {
    const { searchValue } = req.body;

    if (!searchValue || searchValue.trim() === "") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Please enter product name")
      );
    }

    const regex = new RegExp(searchValue, "i");

    const products = await Product.find({
      $or: [
        { tags: regex },
        { searchKeyword: regex }
      ]
    })
      .populate("store", "_id")
      .populate("seller", "_id")
      .lean();

    return res.status(200).json(
      new ApiResponse(200, { products }, "Search products fetched successfully")
    );

  } catch (error) {
    console.error("Search product error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error")
    );
  }
}

async function handelGetRecommendedProducts(req, res) {
  try {
    const userId = req.user._id;

    const recommendation = await ReccomendProduct
      .findOne({ userId })
      .populate({
        path: "wishlistProducts",
        select: "_id",
        populate: [
          { path: "seller", select: "_id" },
          { path: "store", select: "_id" }
        ]
      })
      .populate({
        path: "viewedProducts",
        select: "_id",
        populate: [
          { path: "seller", select: "_id" },
          { path: "store", select: "_id" }
        ]
      })
      .lean();


    if (!recommendation) {
      return res.status(200).json({
        wishlistProducts: [],
        viewedProducts: [],
        recommendedProducts: [],
        message: "No recommendation data found"
      });
    }

    const wishlistProducts = recommendation.wishlistProducts || [];
    const viewedProducts = recommendation.viewedProducts || [];

    const wishlistIds = new Set(wishlistProducts.map(p => p._id.toString()));
    const filteredViewed = viewedProducts.filter(
      p => !wishlistIds.has(p._id.toString())
    );

    const recommendedProducts = [...wishlistProducts, ...filteredViewed];

    return res.status(200).json({
      wishlistProducts,
      viewedProducts: filteredViewed,
      recommendedProducts
    });

  } catch (error) {
    console.error("Get Recommended Products Error:", error);
    return res.status(500).json({ message: error.message });
  }
}

async function handelGetSponseredProducts(req, res) {
  try {

    const today = new Date();

    const sponsoredProducts = await SponserProduct.find({
      endDate: { $lt: today }
    })
      .populate("product", "_id")
      .populate("store", "_id")
      .populate("seller", "_id")
      .sort({ priority: -1, createdAt: -1 })
      .lean();


    if (!sponsoredProducts || sponsoredProducts.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "No sponsored products found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { sponsoredProducts }, "All sponsored products fetched successfully")
    );

  } catch (error) {
    console.error("Get Sponsored Products Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelGetSponseredStoreProducts(req, res) {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Store ID is required")
      );
    }

    const today = new Date();

    const sponsoredProducts = await SponserProduct.find({
      store: storeId,
      endDate: { $lt: today }
    })
      .populate("product")
      .populate("store")
      .populate("seller")
      .sort({ priority: -1, createdAt: -1 })
      .lean();


    if (!sponsoredProducts || sponsoredProducts.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "No sponsored products found for this store")
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { sponsoredProducts },
        "Sponsored products fetched successfully"
      )
    );

  } catch (error) {
    console.error("Get Sponsored Products Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelAddProduct(req, res) {
  try {
    const sellerId = req.user._id;

    
    const {
      title,
      description,
      category,
      brand,
      price,
      discountPercentage,
      gender,
      isReturnable,
      deliveryTime,
      sizes,
      colors,
      images,
      tags,
      searchKeyword,
      stock,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !stock ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Required fields are missing")
      );
    }

    const store = await Store.findOne({ owner: sellerId });

    if (!store) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Store not found for this seller")
      );
    }

    const product = await Product.create({
      store: store._id,
      seller: sellerId,
      title,
      description,
      category,
      brand,
      price,
      discountPercentage,
      gender,
      isReturnable,
      deliveryTime,
      sizes: sizes || [],
      colors: colors || [],
      images,
      tags: tags || [],
      searchKeyword: searchKeyword || [],
      stock,
    });

    return res.status(201).json(
      new ApiResponse(201, { product }, "Product added successfully")
    );

  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelClearProduct(req, res) {
  try {
    await Product.deleteMany({});

    return res.status(200).json(
      new ApiResponse(200, {}, "All Products deleted successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

export { handelAddProduct, handelGetAllProducts , handelGetRecommendedProducts, handelGetSearchProducts, handelGetSponseredProducts, handelGetSponseredStoreProducts , handelClearProduct , handelSaveProductSearch , handelGetProductSearchHistory }