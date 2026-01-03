import Store from "../models/store.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import handleUploadOnCloudinary from "../utils/cloudinaryUpload.js";

async function handleCreateStore(req, res) {

    try {
        const {
            storeName,
            description,
            storeProducts,
            address
        } = req.body;

        const owner = req.user._id;

        if (!storeName) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Store name is required")
            );
        }

        if (!Array.isArray(storeProducts) || storeProducts.length === 0) {
            return res.status(400).json(
                new ApiResponse(400, {}, "At least one store product is required")
            );
        }

        const existingStore = await Store.findOne({ storeName });
        if (existingStore) {
            return res.status(409).json(
                new ApiResponse(409, {}, "Store name already exists")
            );
        }

        let logoUrl = "";
        let bannerUrl = "";

        if (req.files?.logo?.[0]) {
            const uploadedLogoUrl = await handleUploadOnCloudinary(
                req.files.logo[0].buffer
            );
            logoUrl = uploadedLogoUrl;
        }

        if (req.files?.banner?.[0]) {
            const uploadedBannerUrl = await handleUploadOnCloudinary(
                req.files.banner[0].buffer
            );
            bannerUrl = uploadedBannerUrl;
        }


        const store = await Store.create({
            owner,
            storeName,
            description,
            storeProducts,
            address,
            logo: logoUrl,
            banner: bannerUrl,


            isApproved: false,
            isActive: true,
            subscriptionPlan: "trial",
            trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
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
