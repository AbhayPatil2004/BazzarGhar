import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";
import SearchHistory from "../models/search.model.js";
import mongoose from 'mongoose'

async function handelGetStores(req, res) {
  try {
    console.log("---- API CALLED ----");
    console.log("QUERY:", req.query);
    console.log("USER FROM MIDDLEWARE:", req.user);

    const { search, featured, trending, newly, nearby } = req.query;

    const now = new Date();

    let filter = {
      isActive: true,
      isApproved: "accepted",
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $exists: true, $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $exists: true, $gt: now }
        }
      ]
    };

    let sortOption = {};
    let limit = 10;

    // 🔍 Search
    if (search && search.trim()) {
      console.log("SEARCH PARAM:", search);

      filter.storeName = {
        $regex: search.trim(),
        $options: "i"
      };
    }

    // ⭐ Featured
    if (featured === "true") {
      console.log("FEATURED FILTER APPLIED");

      filter.subscriptionPlan = "premium";
      filter.isSubscriptionActive = true;
      sortOption = { subscriptionEndDate: -1 };
      limit = 10;
    }

    // 🔥 Trending
    if (trending === "true") {
      console.log("TRENDING FILTER APPLIED");

      sortOption = {
        totalOrders: -1,
        rating: -1,
        totalProducts: -1,
        createdAt: -1
      };
      limit = 8;
    }

    // 🆕 Newly
    if (newly === "true") {
      console.log("NEWLY FILTER APPLIED");

      sortOption = { createdAt: -1 };
      limit = 8;
    }

    // 📍 Nearby
    if (nearby === "true") {
      console.log("NEARBY FILTER TRIGGERED");

      if (!req.user?._id) {
        console.log("❌ USER NOT FOUND");
        return res.status(401).json({
          message: "Login required for nearby stores"
        });
      }

      const user = await User.findById(req.user._id).lean();

      console.log("USER FROM DB:", user);

      const userCity = user?.address?.[0]?.city?.trim();

      console.log("USER CITY:", userCity);

      if (userCity) {
        filter["address.city"] = {
          $regex: `^${userCity}$`,
          $options: "i"
        };

        console.log("NEARBY FILTER APPLIED:", filter.address);
      } else {
        console.log("❌ USER CITY NOT FOUND");
      }
    }

    console.log("FINAL FILTER:", JSON.stringify(filter, null, 2));
    console.log("SORT:", sortOption);
    console.log("LIMIT:", limit);

    const stores = await Store.find(filter)
      .sort(sortOption)
      .limit(limit)
      .select("storeName logo banner rating category storeProducts address totalOrders createdAt")
      .lean();

    console.log("RESULT COUNT:", stores.length);
    console.log("SAMPLE STORE:", stores[0]);

    return res.status(200).json(
      new ApiResponse(200, stores, "Stores fetched successfully")
    );

  } catch (error) {
    console.error("GET STORES ERROR:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelSaveStoreSearch(req, res) {
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


    userHistory.storeSearches = userHistory.storeSearches.filter(
      (item) => item !== query
    );

    userHistory.storeSearches.unshift(query);


    if (userHistory.storeSearches.length > 10) {
      userHistory.storeSearches.pop();
    }

    await userHistory.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { storeSearches: userHistory.storeSearches },
          "Store search saved successfully"
        )
      );
  } catch (error) {
    console.error("Error saving store search:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handelGetSearchHistory(req, res) {
  try {
    const userId = req.user._id;

    const userHistory = await SearchHistory.findOne({ user: userId });

    const storeSearches = userHistory?.storeSearches || [];

    return res
      .status(200)
      .json(new ApiResponse(200, { storeSearches }, "Store searches fetched successfully"));
  } catch (error) {
    console.error("Error fetching store search history:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handleCheckStoreRating(req, res) {
  try {
    const { storeId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized"));
    }

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid store ID"));
    }

    const store = await Store.findById(storeId).select("ratings");

    if (!store) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Store not found"));
    }

    // 🔥 find user's rating
    const userRatingObj = store.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    const userRating = userRatingObj ? userRatingObj.value : 0;

    // 🔥 calculate average
    const totalRatings = store.ratings.length;

    const avgRating =
      totalRatings === 0
        ? 0
        : store.ratings.reduce((acc, r) => acc + r.value, 0) /
        totalRatings;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userRating,
          avgRating: Number(avgRating.toFixed(1)),
          totalRatings,
        },
        "Rating fetched successfully"
      )
    );
  } catch (error) {
    console.error("Check Rating Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handleRateStore(req, res) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized"));
    }

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid store ID"));
    }

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid rating"));
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Store not found"));
    }

    if (!store.ratings) store.ratings = [];

    const existingRating = store.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.value = rating; // update
    } else {
      store.ratings.push({ user: userId, value: rating }); // add
    }

    await store.save();

    // 🔥 recalc avg
    const totalRatings = store.ratings.length;

    const avgRating =
      totalRatings === 0
        ? 0
        : store.ratings.reduce((acc, r) => acc + r.value, 0) /
        totalRatings;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userRating: rating,
          avgRating: Number(avgRating.toFixed(1)),
          totalRatings,
        },
        "Rating submitted successfully"
      )
    );
  } catch (error) {
    console.error("Rate Store Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handleCheckStoreSubscription(req, res) {
  try {
    const { storeId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized"));
    }


    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid store ID"));
    }


    const store = await Store.findOne({
      _id: storeId,
      subscriber: userId,
    }).select("_id subscriber");

    const isSubscribed = !!store;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isSubscribed,
        },
        "Subscription status fetched successfully"
      )
    );
  } catch (error) {
    console.error("Check Subscription Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}

async function handleToggleStoreSubscription(req, res) {
  try {
    const { storeId } = req.params;
    const userId = req.user?._id;


    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized"));
    }


    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid store ID"));
    }


    const store = await Store.findById(storeId);

    if (!store) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Store not found"));
    }


    const isAlreadySubscribed = store.subscriber.some(
      (id) => id.toString() === userId.toString()
    );

    let message = "";
    let isSubscribed;

    if (isAlreadySubscribed) {

      store.subscriber = store.subscriber.filter(
        (id) => id.toString() !== userId.toString()
      );

      message = "Unsubscribed successfully";
      isSubscribed = false;
    } else {

      store.subscriber.push(userId);

      message = "Subscribed successfully";
      isSubscribed = true;
    }

    await store.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isSubscribed,
          subscriberCount: store.subscriber.length,
        },
        message
      )
    );
  } catch (error) {
    console.error("Toggle Subscription Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
}


async function handleGetStoresByCategory(req, res) {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Category is required")
      );
    }

    const now = new Date();


    let filter = {
      isActive: true,
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $gt: now }
        }
      ]
    };


    if (category.toLowerCase() !== "general") {
      filter.category = category;
    }

    const stores = await Store.find(filter)
      .lean()
      .select(
        "storeName logo banner address rating category storeProducts subscriptionPlan"
      );

    return res.status(200).json(
      new ApiResponse(200, stores, "Stores fetched successfully")
    );

  } catch (error) {
    console.error("Get Stores by Category Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelGetStoresByOwner(req, res) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json(
        new ApiResponse(400, {}, "ownerId is required")
      );
    }

    const now = new Date();

    const stores = await Store.find({
      owner: ownerId,
      isActive: true,
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $gt: now }
        }
      ]
    })
      .lean()
      .select("storeName logo banner address rating category storeProducts subscriptionPlan");

    return res.status(200).json(
      new ApiResponse(200, stores, "Stores fetched successfully")
    );
  } catch (error) {
    console.error("Get Stores by Owner Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

// async function handleGetStoreDetails(req, res) {

//   try {
//     const { storeId } = req.params;

//     // 1️⃣ Store find karo
//     const store = await Store.findById(storeId)
//       .select("-__v")
//       .lean();

//     if (!store) {
//       return res.status(404).json(
//         new ApiResponse(404, {}, "Store not found")
//       );
//     }

//     // 2️⃣ Owner find karo (Address exclude)
//     const owner = await User.findById(store.owner)
//       .select("username email avatar role phone createdAt") // 👈 address excluded
//       .lean();

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         {
//           store,
//           owner
//         },
//         "Store details fetched successfully"
//       )
//     );

//   } catch (error) {
//     console.error("Store Details Error:", error);

//     return res.status(500).json(
//       new ApiResponse(500, {}, "Internal Server Error")
//     );
//   }
// }

async function handleGetStoreDetails(req, res) {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId)
      .select("-__v")
      .lean();

    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    // Owner fetch
    const owner = await User.findById(store.owner)
      .select("username email avatar role phone createdAt")
      .lean();

    // Subscriber count
    const subscriberCount = store.subscriber?.length || 0;

    let subscribed = false;

    // Check if user logged in
    if (req.user && req.user._id) {
      subscribed = store.subscriber.some(
        (id) => id.toString() === req.user._id.toString()
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          store,
          owner,
          subscribed,
          subscriberCount
        },
        "Store details fetched successfully"
      )
    );

  } catch (error) {
    console.error("Store Details Error:", error);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handleGetFilteredStores(req, res) {
  try {
    const { categories, premium, sort } = req.query;

    let query = {
      isActive: true,
      isApproved: "accepted"
    };

    const now = new Date();

    // Category filter
    if (categories) {
      query.category = { $in: categories.split(",") };
    }

    // Premium filter
    if (premium === "true") {
      query.subscriptionPlan = "premium";
      query.isSubscriptionActive = true;
      query.subscriptionEndDate = { $gt: now };
    }

    // 🔥 Nearby Logic (Updated Properly)
    if (sort === "nearby" && req.user?._id) {

      const user = await User.findById(req.user._id).lean();

      if (user?.address?.[0]?.city) {

        query["address.city"] = {
          $regex: `^${user.address[0].city}$`,
          $options: "i"
        };

        // Optional: Only active subscription stores (like your my-city API)
        query.$or = [
          {
            subscriptionPlan: "trial",
            trialEndsAt: { $exists: true, $gt: now }
          },
          {
            isSubscriptionActive: true,
            subscriptionEndDate: { $exists: true, $gt: now }
          }
        ];
      }
    }

    let storeQuery = Store.find(query)
      .select("storeName logo banner rating category totalOrders totalProducts createdAt address storeProducts")
      .lean();

    // Sorting
    switch (sort) {
      case "rating":
        storeQuery = storeQuery.sort({ rating: -1 });
        break;

      case "products":
        storeQuery = storeQuery.sort({ totalProducts: -1 });
        break;

      case "mostOrders":
        storeQuery = storeQuery.sort({ totalOrders: -1 });
        break;

      case "new":
        storeQuery = storeQuery.sort({ createdAt: -1 });
        break;

      case "nearby":
        storeQuery = storeQuery.sort({ rating: -1 });
        break;

      default:
        storeQuery = storeQuery.sort({ createdAt: -1 });
    }

    const stores = await storeQuery;

    return res.status(200).json(
      new ApiResponse(
        200,
        stores,
        "Filtered Active Stores Sent Successfully"
      )
    );

  } catch (error) {
    console.error("Filter Error:", error);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelGetFeaturedStores(req, res) {
  try {
    const now = new Date();

    const stores = await Store.find({
      isActive: true,
      isApproved: "accepted",
      subscriptionPlan: "premium",
      isSubscriptionActive: true,
      subscriptionEndDate: { $exists: true, $gt: now }
    })
      .select("storeName logo banner rating category storeProducts")
      .sort({ subscriptionEndDate: -1 })
      .limit(10);

    return res.status(200).json(
      new ApiResponse(200, stores, "Featured Stores Sent Successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelGetStoresOfMycities(req, res) {
  try {
    console.log("---- API HIT: /store/my-city ----");

    console.log("req.user:", req.user);

    const user = await User.findById(req.user?._id);
    console.log("Fetched user:", user);

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json(
        new ApiResponse(404, {}, "User not found")
      );
    }

    console.log("User address:", user.address);

    const now = new Date();

    if (!user?.address?.[0]?.city) {
      console.log("City not found in user document");
      return res.status(400).json(
        new ApiResponse(400, {}, "Please update City")
      );
    }

    console.log("User city:", user.address[0].city);

    const stores = await Store.find({
      isActive: true,
      isApproved: "accepted",
      "address.city": {
        $regex: `^${user.address[0].city}$`,
        $options: "i"
      },
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $exists: true, $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $exists: true, $gt: now }
        }
      ]
    })
      .limit(10)
      .select("storeName logo banner rating category address storeProducts");

    console.log("Stores found:", stores.length);

    return res.status(200).json(
      new ApiResponse(
        200,
        stores,
        stores.length === 0
          ? "Store not found in your City"
          : "Stores of user city fetched successfully"
      )
    );

  } catch (error) {
    console.error("🔥 ERROR in /store/my-city:", error);
    console.error("Error message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelGetTopSeller(req, res) {
  try {
    const limit = 8;
    const now = new Date();


    let stores = await Store.find({
      isActive: true,
      isApproved: "accepted",
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $exists: true, $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $exists: true, $gt: now }
        }
      ]
    })
      .sort({
        totalOrders: -1,
        rating: -1,
        totalProducts: -1,
        createdAt: -1,
      })
      .limit(limit)
      .select("storeName logo banner rating totalProducts totalOrders category storeProducts")
      .lean();


    if (stores.length < limit) {
      const remaining = limit - stores.length;

      const excludedIds = stores.map(store => store._id);

      const fallbackStores = await Store.find({
        isActive: true,
        isApproved: "accepted",
        _id: { $nin: excludedIds }
      })
        .sort({
          totalOrders: -1,
          rating: -1,
          totalProducts: -1,
          createdAt: -1,
        })
        .limit(remaining)
        .select("storeName logo banner rating totalProducts totalOrders category")
        .lean();

      stores = [...stores, ...fallbackStores];
    }

    return res.status(200).json(
      new ApiResponse(200, stores, "Top sellers fetched successfully")
    );

  } catch (error) {
    console.error("TOP SELLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function handelGetNewlyOpened(req, res) {
  try {

    const now = new Date();
    const stores = await Store.find({
      isActive: true,
      isApproved: "accepted",
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $exists: true, $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $exists: true, $gt: now }
        }
      ]
    })
      .sort({ createdAt: -1 })
      .select("storeName logo banner rating createdAt category storeProducts")
      .limit(8);

    return res.status(200).json(
      new ApiResponse(
        200,
        stores,
        "Newly opened stores fetched successfully"
      )
    );

  } catch (error) {
    console.error("Error fetching newly opened stores:", error);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelGetAllStores(req, res) {

  try {

    const now = new Date();

    const stores = await Store.find({
      isActive: true,
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $gt: now }
        },

        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $gt: now }
        }
      ]
    }).lean().select("storeName logo banner address rating category storeProducts ");

    return res.status(200).json(
      new ApiResponse(200, stores, "Stores are sent successfully")
    );

  }
  catch (error) {
    console.error("Get Store Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

async function handelGetSearchedStore(req, res) {
  try {
    let { searchString } = req.body;

    if (!searchString || !searchString.trim()) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Please enter a valid store name")
      );
    }

    searchString = searchString.trim();
    const now = new Date();

    const stores = await Store.find({
      storeName: { $regex: searchString, $options: "i" },
      isActive: true,
      $or: [
        {
          subscriptionPlan: "trial",
          trialEndsAt: { $exists: true, $gt: now }
        },
        {
          isSubscriptionActive: true,
          subscriptionEndDate: { $exists: true, $gt: now }
        }
      ]
    }).lean();


    return res.status(200).json(
      new ApiResponse(200, stores, "Stores are sent successfully")
    );

  } catch (error) {
    console.error("Get Store Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}

const handleCreateStore = async (req, res) => {
  try {
    // ❌ Restrict admin
    if (req.user.role === "admin") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Admins are not allowed to open store")
      );
    }

    const {
      storeName,
      description,
      storeProducts,
      category, // ✅ directly from frontend
      address,
      logoUrl,
      bannerUrl,
    } = req.body;

    const ownerId = req.user._id;
    const ownerName = req.user.username;

    // ✅ VALIDATIONS
    if (!storeName || storeName.trim() === "") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Store name is required")
      );
    }

    if (!category || category.trim() === "") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Category is required")
      );
    }

    // ✅ Clean products array
    const cleanedProducts = Array.isArray(storeProducts)
      ? storeProducts.map((p) => p.trim()).filter(Boolean)
      : [];

    if (cleanedProducts.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "At least one product is required")
      );
    }

    // ✅ Check duplicate store
    const existingStore = await Store.findOne({ storeName });
    if (existingStore) {
      return res.status(409).json(
        new ApiResponse(409, {}, "Store name already exists")
      );
    }

    // ✅ URL validation
    const isValidUrl = (url) =>
      typeof url === "string" && url.startsWith("https://");

    const finalLogoUrl = isValidUrl(logoUrl) ? logoUrl : "";
    const finalBannerUrl = isValidUrl(bannerUrl) ? bannerUrl : "";

    // ✅ CREATE STORE
    const store = await Store.create({
      owner: ownerId,
      storeName: storeName.trim(),
      description: description || "",
      storeProducts: cleanedProducts,
      category, // ✅ stored directly
      address: address || {},
      logo: finalLogoUrl,
      banner: finalBannerUrl,
      isApproved: "pending",
      isActive: true,
      subscriptionPlan: "trial",
    });

    // ✅ Notify admins
    const admins = await User.find({ role: "admin" });

    const productsList = cleanedProducts.join(", ");

    await Promise.all(
      admins.map((admin) =>
        sendMailToUser(
          admin.email,
          "New Store Approval Request",
          storeOpeningBody(
            admin.username,
            ownerName,
            storeName,
            description,
            productsList,
            address,
            category
          )
        )
      )
    );

    // ✅ SUCCESS RESPONSE
    return res.status(201).json(
      new ApiResponse(
        201,
        { store },
        "Store created successfully and sent for admin approval"
      )
    );

  } catch (error) {
    console.error("Create Store Error:", error);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
};

async function handelClearStore(req, res) {
  try {
    await Store.deleteMany({});

    return res.status(200).json(
      new ApiResponse(200, {}, "All Stores deleted successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

export { handleCreateStore, handelGetAllStores, handelGetSearchedStore, handelClearStore, handelGetTopSeller, handelGetNewlyOpened, handelGetStoresOfMycities, handelGetFeaturedStores, handleGetFilteredStores, handleGetStoreDetails, handelGetStoresByOwner, handleGetStoresByCategory, handleCheckStoreSubscription, handleToggleStoreSubscription, handleRateStore, handleCheckStoreRating, handelGetSearchHistory, handelSaveStoreSearch, handelGetStores };


