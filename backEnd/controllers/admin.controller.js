import User from "../models/user.model.js";
import Store from "../models/store.model.js";
import Products from '../models/product.model.js'
import Order from '../models/order.model.js'
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeApprovedEmailBody from "../emailBody/storeApproves.emailBody.js";
import storeRejectedEmailBody from "../emailBody/storeReject.emailBody.js";

async function handelGetUsers(req, res) {
  try {
    const users = await User.find()
      .select("username email avatar phone role isBlocked createdAt")
      .sort({ createdAt: -1 }); // newest first

    if (users.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, { users: [] }, "No users found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { users }, "Users sent successfully")
    );
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}


async function handelStoreOpeningReq(req, res) {
  try {
    const stores = await Store.find({ isApproved: "pending" })
      .select("storeName logo storeProducts owner")
      .populate("owner", "username");

    if (!stores.length) {
      console.log("No pending store approval requests")
      return res.status(200).json(
        new ApiResponse(
          200,
          [],
          "No pending store approval requests"
        )
      );
    }

    const response = stores.map(store => ({
      id: store._id,
      storeName: store.storeName,
      logo: store.logo,
      products: store.storeProducts,
      ownerName: store.owner.username,
    }));

    console.log("Stores send Succesfully")
    return res.status(200).json(
      new ApiResponse(
        200,
        response,
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

async function handelGetStoreDetails(req, res) {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json(
        new ApiResponse(
          400,
          {},
          "Store ID is required"
        )
      );
    }

    const storeDetails = await Store.findById(storeId)
      .select(
        "storeName storeProducts description logo banner address owner"
      )
      .populate({
        path: "owner",
        select: "username email phone avatar"
      });

    if (!storeDetails) {
      return res.status(404).json(
        new ApiResponse(
          404,
          {},
          "Store not found"
        )
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        storeDetails,
        "Store details fetched successfully"
      )
    );

  } catch (error) {
    console.error("Store details fetch error:", error);

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
    const { storeId } = req.params;

    const store = await Store.findById(storeId)
      .populate("owner", "username email");

    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    store.isApproved = "accepted";
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

    // const storeId = "695a9d7d800fbcb71de03c57"; // temp for testing
    const { storeId } = req.params;

    const store = await Store.findById(storeId)
      .populate("owner", "username email");

    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    if (store.isApproved === "rejected") {
      return res.status(400).json(
        new ApiResponse(400, {}, "Store already Rejected")
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

async function handelGetAllUserSellerProductsCount(req, res) {

  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalStores,
      pendingStoreRequests,
      todaysOrders
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "seller" }),
      Products.countDocuments(),
      Store.countDocuments(),
      Store.countDocuments({ isApproved: "pending" }),
      Order.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    const data = {
      totalUsers,
      totalSellers,
      totalProducts,
      totalStores,
      pendingStoreRequests,
      todaysOrders
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        data,
        "Dashboard stats fetched successfully"
      )
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}


export { handelGetStoreDetails, handelStoreOpeningReq, handelApproveStore, handelRejectStore, handelGetAllUserSellerProductsCount , handelGetUsers }