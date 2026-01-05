import User from "../models/user.model.js";
import Store from "../models/store.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeApprovedEmailBody from "../emailBody/storeApproves.emailBody.js";
import storeRejectedEmailBody from "../emailBody/storeReject.emailBody.js";

async function handelStoreOpeningReq(req, res) {

    try {

        console.log(req)
        const stores = await Store.find({ isApproved: "pending" });

        if (!stores.length) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    [],
                    "No pending store approval requests"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                stores,
                "Pending stores fetched successfully"
            )
        );

    } catch (error) {
        console.error("Store approval fetch error:", error);

        return res.status(500).json(
            new ApiResponse(
                500,
                {},
                "Internal server error"
            )
        );
    }
}


async function handelApproveStore(req, res) {
    try {
        // const { storeId } = req.params;
        const storeId = "695a9d7d800fbcb71de03c57"

        const store = await Store.findById(storeId)
            .populate("owner", "username email");

        if (!store) {
            return res.status(404).json(
                new ApiResponse(404, {}, "Store not found")
            );
        }
        
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);
       
        store.isApproved = true;
        store.trialEndsAt = trialEndsAt;
        await store.save();

        const ownerId = store.owner._id;
        const ownerName = store.owner.username;
        const ownerEmail = store.owner.email;
        
        await User.findByIdAndUpdate(ownerId, {
            role: "seller"
        });
        
        const subject = "Your Store is Approved";
        const body = storeApprovedEmailBody(ownerName, store.storeName);
        
        sendMailToUser(ownerEmail, subject, body);

        return res.status(200).json(
            new ApiResponse(200, store, "Store approved successfully")
        );

    } catch (error) {
        console.error("Approve store error:", error);

        return res.status(500).json(
            new ApiResponse(500, {}, "Something went wrong")
        );
    }
}

async function handelRejectStore(req, res) {
    try {
        
        const storeId = "695a9d7d800fbcb71de03c57"; // temp for testing

        const store = await Store.findById(storeId)
            .populate("owner", "username email");

        if (!store) {
            return res.status(404).json(
                new ApiResponse(404, {}, "Store not found")
            );
        }
        
        if (store.isApproved === "rejected") {
            return res.status(400).json(
                new ApiResponse(400, {}, "Store already approved")
            );
        }

        store.isApproved = "rejected";
        await store.save();

        const ownerName = store.owner.username;
        const ownerEmail = store.owner.email;

        const subject = "Your Store Application was Rejected";
        const body = storeRejectedEmailBody(ownerName, store.storeName);

        await sendMailToUser(ownerEmail, subject, body);

        return res.status(200).json(
            new ApiResponse(200, store, "Store rejected successfully")
        );

    } catch (error) {
        console.error("Reject store error:", error);

        return res.status(500).json(
            new ApiResponse(500, {}, "Something went wrong")
        );
    }
}



export { handelStoreOpeningReq, handelApproveStore , handelRejectStore }