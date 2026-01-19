import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";

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

async function handelGetStoreByOwner(req, res) {
  try {
    const { ownerId } = req.params;

    console.log("📥 Request received for ownerId:", ownerId);

    const owner = await User.findById(ownerId);
    console.log("👤 Owner fetched:", owner ? owner._id : "NOT FOUND");

    if (!owner) {
      console.log("❌ Owner not found");
      return res.status(404).json(
        new ApiResponse(404, null, "Owner not found with this id")
      );
    }

    const stores = await Store.find({ owner: ownerId })
      .select("storeName storeProducts logo banner");

    console.log("🏬 Stores fetched count:", stores.length);
    console.log("🏬 Stores data:", stores);

    if (stores.length === 0) {
      console.log("⚠️ No stores found for this owner");
      return res.status(404).json(
        new ApiResponse(404, [], "No stores found for this owner")
      );
    }

    console.log("✅ Sending stores response");

    return res.status(200).json(
      new ApiResponse(200, stores, "Stores sent successfully")
    );

  } catch (error) {
    console.error("🔥 Get Store Error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error")
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

export { handelGetStoreByOwner , handleCreateStore, handelGetAllStores, handelGetSearchedStore, handelClearStore };


