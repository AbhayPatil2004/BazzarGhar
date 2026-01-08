import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import handleUploadOnCloudinary from "../utils/cloudinaryUpload.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";

async function handleCreateStore(req, res) {

  try {
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
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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


export { handleCreateStore };


