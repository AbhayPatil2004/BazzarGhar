import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import storeOpeningBody from "../emailBody/storeOpening.emailBody.js";
import mongoose from "mongoose";
import createOrder from "../utils/createOrder.js";
import Product from "../models/product.model.js";
// import Store from '../models/store.model.js'


async function handleGetSellerNameById(req, res) {
  try {
    const { id } = req.params;

    const seller = await User.findById(id).select("username");

    if (!seller) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Seller not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { sellerName: seller.username || seller.name },
        "Seller name fetched successfully"
      )
    );

  } catch (error) {
    console.error("Get Seller Name By Id Error:", error);

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelSellerStats(req, res) {
  try {

    console.log("Seller Stats ")
    const sellerId = req.user._id;

    // 1️⃣ Total stores
    const totalStores = await Store.countDocuments({
      owner: sellerId,
    });

    // 2️⃣ Active stores
    const activeStores = await Store.countDocuments({
      owner: sellerId,
      isActive: true,
      isApproved: "accepted",
    });

    // 3️⃣ Aggregate store-level stats
    const aggregateStats = await Store.aggregate([
      {
        $match: { owner: sellerId },
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: "$totalProducts" },
          totalOrders: { $sum: "$totalOrders" },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const totalProducts =
      aggregateStats.length > 0 ? aggregateStats[0].totalProducts : 0;

    const totalOrders =
      aggregateStats.length > 0 ? aggregateStats[0].totalOrders : 0;

    const avgRating =
      aggregateStats.length > 0 && aggregateStats[0].avgRating
        ? Number(aggregateStats[0].avgRating.toFixed(1))
        : 0;

    // 4️⃣ Total reviews (optional but good)
    const reviewCountAgg = await Store.aggregate([
      { $match: { owner: sellerId } },
      {
        $lookup: {
          from: "storereviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewsData",
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: { $size: "$reviewsData" } },
        },
      },
    ]);

    const totalReviews =
      reviewCountAgg.length > 0 ? reviewCountAgg[0].totalReviews : 0;

    // ✅ Final response
    return res.status(200).json(
      new ApiResponse(200, {
        totalStores,
        activeStores,
        totalProducts,
        completedOrders: totalOrders,
        avgRating,
        totalReviews,
      }, "Seller stats fetched successfully")
    );
  } catch (error) {
    console.error("Seller stats error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handleAddProductToStore(req, res) {
  try {
    const { storeId } = req.params;
    const {
      title, description, category, price, discountPercentage,
      gender, isReturnable, sizes, colors, tags,
      searchKeyword, images, video, stock, deliveryTime
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      price === undefined ||
      stock === undefined ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Some fields are missing or invalid")
      );
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    const product = await Product.create({
      store: storeId,
      seller: store.owner,
      title,
      description,
      category,
      price,
      discountPercentage,
      gender,
      isReturnable,
      sizes,
      colors,
      tags,
      searchKeyword,
      images,
      video,
      stock,
      deliveryTime
    });

    // 🔥 increment totalProducts
    await Store.findByIdAndUpdate(storeId, {
      $inc: { totalProducts: 1 }
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          productId: product._id,
          finalPrice: product.finalPrice
        },
        "Product added successfully"
      )
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message)
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
        "storeName storeProducts description logo banner address rating reviews totalProducts totalOrders subscriptionPlan subscriptionStartDate subscriptionEndDate isSubscriptionActive trialEndsAt commissionRate productSales isActive"
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

async function handleUpdateStoreDetails(req, res) {
  try {
    const { storeId } = req.params;
    const {
      storeName,
      storeProducts,
      description,
      logo,
      banner,
      address
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Store Id")
      );
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    // update only provided fields
    if (storeName && storeName.trim() !== "") {
      store.storeName = storeName;
    }

    if (storeProducts) store.storeProducts = storeProducts;
    if (description) store.description = description;

    // logo & banner URLs
    if (logo) store.logo = logo;
    if (banner) store.banner = banner;

    if (address) {
      store.address = {
        ...store.address,
        ...address
      };
    }

    await store.save();

    return res.status(200).json(
      new ApiResponse(200, store, "Store details updated successfully")
    );

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}


async function handelActiveOrInActiveStore(req, res) {
  try {
    const { storeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Store Id")
      );
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    // toggle
    store.isActive = !store.isActive;

    await store.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        store,
        `Store ${store.isActive ? "Activated" : "Deactivated"} Successfully`
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelActiveOrInActiveProduct(req, res) {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Product Id")
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    // toggle
    product.isActive = !product.isActive;

    await product.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        product,
        `Product ${product.isActive ? "Activated" : "Deactivated"} Successfully`
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}


async function handelGetStoreProducts(req, res) {
  try {
    const { storeId } = req.params;

    console.log("handelGetStoreProducts called");
    console.log("StoreId:", storeId);

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      console.log("Invalid StoreId");
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Store Id")
      );
    }

    const store = await Store.findById(storeId);
    console.log("Store found:", store ? store._id : "NOT FOUND");

    if (!store) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store not found")
      );
    }

    const products = await Product.find({ store: storeId })
      .select("title description category price images");

    console.log("Products count:", products.length);
    console.log("Products:", products);

    if (products.length === 0) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Store has no products")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, products, "Store Products sent successfully")
    );

  } catch (error) {
    console.log("Error in handelGetStoreProducts:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}

async function handelGetProductDetails(req, res) {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid Product Id")
      );
    }

    // FIX
    const product = await Product.findById(productId)
      .populate({
        path: "store",
        select: "storeName logo"
      });


    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product Details sent successfully")
    );
  }
  catch (error) {
    console.log("Error in handelGetProductDetails:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal Server Error")
    );
  }
}


// async function handelUpdateProductDetails(req, res) {
//   try {
//     const { productId } = req.params;
//     const updateData = req.body;

//     // 1️⃣ Check if product exists
//     const product = await Product.findById(productId);

//     if (!product || product.isDeleted) {
//       return res
//         .status(404)
//         .json(new ApiResponse(404, {}, "Product not found"));
//     }

//     // 2️⃣ If no data sent
//     if (!updateData || Object.keys(updateData).length === 0) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, {}, "No data provided to update"));
//     }

//     // 3️⃣ Allowed fields
//     const allowedFields = [
//       "title",
//       "description",
//       "price",
//       "stock",
//       "category",
//       "deliveryTime",
//       "discountPercentage",
//       "isReturnable",
//       "sizes",
//       "colors",
//       "tags",
//       "gender",
//       "images",
//       "video",
//       "isActive",
//     ];

//     const updateFields = {};

//     // 4️⃣ Add only fields that are sent from frontend
//     allowedFields.forEach((field) => {
//       if (field in updateData) {
//         updateFields[field] = updateData[field];
//       }
//     });

//     // 5️⃣ Recalculate finalPrice ONLY if price or discount updated
//     if ("price" in updateFields || "discountPercentage" in updateFields) {
//       const newPrice =
//         updateFields.price !== undefined
//           ? updateFields.price
//           : product.price;

//       const newDiscount =
//         updateFields.discountPercentage !== undefined
//           ? updateFields.discountPercentage
//           : product.discountPercentage;

//       updateFields.finalPrice =
//         newPrice - (newPrice * newDiscount) / 100;
//     }

//     // 6️⃣ Update product
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { $set: updateFields },
//       { new: true, runValidators: true }
//     );

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, updatedProduct, "Product updated successfully")
//       );

//   } catch (error) {
//     console.log("Error in handelUpdateProductDetails:", error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, "Internal Server Error"));
//   }
// }


// const handelUpdateProductDetails = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // 1️⃣ Find the existing product
//     const existingProduct = await Product.findById(productId);
//     if (!existingProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // 2️⃣ Prepare update data
//     const updateData = {};

//     // Only copy fields that exist in the request body
//     const fields = [
//       "title",
//       "description",
//       "price",
//       "stock",
//       "category",
//       "deliveryTime",
//       "discountPercentage",
//       "isReturnable",
//       "sizes",
//       "colors",
//       "tags",
//       "images",
//       "video"
//     ];

//     fields.forEach((field) => {
//       const value = req.body[field];

//       if (value !== undefined && value !== null && value !== "") {
//         let finalValue = value;

//         // Only convert numbers if user sent a value
//         if (field === "price") finalValue = Number(value);
//         if (field === "discountPercentage") finalValue = Number(value);

//         // Clamp to schema limits
//         if (field === "price") finalValue = Math.max(0, finalValue);
//         if (field === "discountPercentage") finalValue = Math.min(90, Math.max(0, finalValue));

//         updateData[field] = finalValue;
//       }
//     });

//     // 3️⃣ Update the product
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "Product updated successfully",
//       updatedProduct
//     });

//   } catch (error) {
//     console.error("Error in handelUpdateProductDetails:", error);
//     res.status(500).json({ message: "Something went wrong", error: error.message });
//   }
// };

const handelUpdateProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {};

    const fields = [
      "title",
      "description",
      "price",
      "stock",
      "category",
      "deliveryTime",
      "discountPercentage",
      "isReturnable",
      "sizes",
      "colors",
      "tags",
      "images",
      "video"
    ];

    fields.forEach((field) => {
      const value = req.body[field];

      if (value !== undefined && value !== null) { // allow 0
        let finalValue = value;

        if (field === "price" || field === "discountPercentage") {
          finalValue = Number(value);
          if (field === "price") finalValue = Math.max(0, finalValue);
          if (field === "discountPercentage") finalValue = Math.min(90, Math.max(0, finalValue));
        }

        updateData[field] = finalValue;
      }
    });

    // ✅ compute finalPrice if price or discountPercentage updated
    if (updateData.price !== undefined || updateData.discountPercentage !== undefined) {
      const price = updateData.price !== undefined ? updateData.price : existingProduct.price;
      const discount = updateData.discountPercentage !== undefined ? updateData.discountPercentage : existingProduct.discountPercentage;
      updateData.finalPrice = price - (price * discount / 100);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    });

  } catch (error) {
    console.error("Error in handelUpdateProductDetails:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};






export { handelGetStoreByIdForSeller, handelGetStoreByOwner, handelCreateStoreSubscriptionOrder, handelUpgradeStoreSubscription, handleAddProductToStore, handelSellerStats, handleUpdateStoreDetails, handelActiveOrInActiveStore, handelGetStoreProducts, handelGetProductDetails, handelActiveOrInActiveProduct, handelUpdateProductDetails , handleGetSellerNameById }