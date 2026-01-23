import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";
import mongoose from "mongoose";
import createOrder from "../utils/createOrder.js";

async function handelAddProductToStore( req , res ){

  try{

    const { storeId } = req.params ;
    const { title , description , category , price , discountPercentage , gender , isReturnable , sizes , colors , tags , searchKeyword } = req.body 
    
    const store = await Store.findById(storeId)

    if( !store ){
      return res.status(400).json(
        new ApiResponse( 500 , {} , "Store not found with this id")
      )
    }

    const { ownerId } = store.owner





    


  }
  catch(error){
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
}



async function handelGetStoreByIdForSeller(req, res) {
  try {
    const { storeId } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Store ID")
      );
    }

    // 2️⃣ Fetch store

    const storeDetails = await Store.findById(storeId)
      .select(
        "storeName storeProducts description logo banner address rating reviews totalProducts totalOrders subscriptionPlan subscriptionStartDate subscriptionEndDate isSubscriptionActive trialEndsAt commissionRate productSales"
      )
      .populate("reviews");

    // 3️⃣ Not found check
    if (!storeDetails) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    // 4️⃣ Success response
    return res.status(200).json(
      new ApiResponse(200, storeDetails, "Store details fetched successfully")
    );
  } catch (error) {
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

    const stores = await Store.find({
      owner: ownerId,
      isApproved: "accepted",
    })
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

async function handelCreateStoreSubscriptionOrder(req, res) {

  try {

    const { amount } = req.body;

    const allowedAmounts = [100, 250, 500, 1000];

    if (!allowedAmounts.includes(amount)) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid amount")
      );
    }

    const order = await createOrder(amount);

    return res.status(200).json(
      new ApiResponse(200, order, "Order created successfully")
    );

  } catch (error) {
    console.error("Upgrade Subscription Error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error")
    );
  }
}

async function handelUpgradeStoreSubscription(req, res) {
  try {
    const { storeId } = req.params;
    const { razorpay_payment_id, amount } = req.body;

    if (!razorpay_payment_id) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Payment not successful"));
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Store not found"));
    }


    const subscriptionMap = {
      100: { plan: "basic", months: 1 },
      250: { plan: "pro", months: 3 },
      500: { plan: "pro", months: 6 },
      1000: { plan: "premium", months: 12 },
    };

    const selectedPlan = subscriptionMap[amount];

    if (!selectedPlan) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid subscription amount"));
    }

    let startDate;
    let endDate;

    if (
      store.isSubscriptionActive &&
      store.subscriptionEndDate &&
      store.subscriptionEndDate > new Date()
    ) {
      // Extend existing subscription
      startDate = store.subscriptionStartDate;
      endDate = new Date(store.subscriptionEndDate);
    } else {
      // New subscription
      startDate = new Date();
      endDate = new Date(startDate);
    }

    endDate.setMonth(endDate.getMonth() + selectedPlan.months);

    // 🔹 Update store subscription
    store.subscriptionPlan = selectedPlan.plan;
    store.subscriptionStartDate = startDate;
    store.subscriptionEndDate = endDate;
    store.isSubscriptionActive = true;
    store.trialEndsAt = null;

    await store.save();

    return res.status(200).json(
      new ApiResponse(200, {
        plan: selectedPlan.plan,
        startDate,
        endDate,
      }, "Subscription upgraded successfully")
    );
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error")
    );
  }
}


export { handelGetStoreByIdForSeller, handelGetStoreByOwner, handelCreateStoreSubscriptionOrder, handelUpgradeStoreSubscription }