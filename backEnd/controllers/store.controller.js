import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";

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
    }).lean();

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


async function handleCreateStore(req, res) {

  try {

    if (req.user.role == "admin") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Admins are noy Allowed to open store")
      );
    }

    const {
      storeName,
      description,
      storeProducts,
      address,
      logoUrl,
      bannerUrl
    } = req.body;

    const ownerId = req.user._id;
    const ownerName = req.user.username;

    if (!storeName) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Store name is required")
      );
    }

    const existingStore = await Store.findOne({ storeName });
    if (existingStore) {
      return res.status(409).json(
        new ApiResponse(409, {}, "Store name already exists")
      );
    }

    const isValidUrl = (url) =>
      typeof url === "string" && url.startsWith("https://");

    const finalLogoUrl = isValidUrl(logoUrl) ? logoUrl : "";
    const finalBannerUrl = isValidUrl(bannerUrl) ? bannerUrl : "";

    const store = await Store.create({
      owner: ownerId,
      storeName,
      description,
      storeProducts,
      address,
      logo: logoUrl,
      banner: bannerUrl,
      isApproved: "pending",
      isActive: true,
      subscriptionPlan: "trial",
      // trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    const admins = await User.find({ role: "admin" });

    const productsList = storeProducts.join(", ");

    admins.forEach(admin => {
      sendMailToUser(
        admin.email,
        "To Open a Store",
        storeOpeningBody(
          admin.username,
          ownerName,
          storeName,
          description,
          productsList,
          address
        )
      );
    });

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
}

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

export { handleCreateStore, handelGetAllStores, handelGetSearchedStore, handelClearStore, handelGetTopSeller, handelGetNewlyOpened, handelGetStoresOfMycities , handelGetFeaturedStores };


