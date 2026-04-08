import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiResponse from '../utils/ApiResponse.js'
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import crypto from "crypto";
import Razorpay from "razorpay";
 
async function handelPlaceSingelItemOrder(req, res) {
  
  try {
    const buyerId = req.user._id;
    const { productId } = req.params;
    const { quantity, gender, size, color, paymentMethod = "COD" } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid quantity")
      );
    }

    const user = await User.findById(buyerId).select("address");
    if (!user || !user.address) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Shipping address not found")
      );
    }

    const shippingAddress = {
      fullName: user.address.fullName,
      phone: user.address.phone,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.postalCode,
      country: user.address.country || "India"
    };


    const product = await Product.findById(productId)
      .select("finalPrice seller store stock")
      .populate("seller", "_id")
      .populate("store", "_id");

    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    if (product.stock < quantity) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Insufficient stock")
      );
    }

    const price = product.finalPrice;
    const finalPrice = price * quantity;

    const order = await Order.create({
      buyer: buyerId,
      items: [
        {
          product: product._id,
          seller: product.seller._id,
          store: product.store._id,
          quantity,
          gender,
          size,
          color,
          price,
          finalPrice
        }
      ],
      totalAmount: finalPrice,
      paymentMethod: paymentMethod,
      shippingAddress
    });

    product.stock -= quantity;
    await product.save();

    return res.status(201).json(
      new ApiResponse(201, order, "Order placed successfully")
    );

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Something went wrong")
    );
  }
}
async function handelPlaceCartItemsOrder(req, res) {
  try {
    const userId = req.user._id;
    const { paymentMethod = "COD" } = req.body;
    
    const cart = await Cart.findOne({ user: userId })
      .populate("products.product")
      .populate("products.seller")
      .populate("products.store");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Cart is empty")
      );
    }
    
    const user = await User.findById(userId);

    const shippingAddress = {
      fullName: user.address.fullName,
      phone: user.address.phone,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.postalCode,
      country: user.address.country || "India"
    };

    let totalAmount = 0;
    const orderItems = [];

    
    for (let item of cart.products) {
      const productDoc = item.product;

      
      if (productDoc.stock < item.quantity) {
        return res.status(400).json(
          new ApiResponse(400, {}, `Insufficient stock for ${productDoc.title}`)
        );
      }

      const itemTotal = item.finalPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: productDoc._id,
        seller: item.seller,
        store: item.store,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        finalPrice: item.finalPrice
      });

      
      productDoc.stock -= item.quantity;
      await productDoc.save();
    }

    
    const order = await Order.create({
      buyer: userId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod, 
      shippingAddress
    });

    
    cart.products = [];
    cart.coupon = null;
    await cart.save();

    return res.status(201).json(
      new ApiResponse(201, order, "Order placed successfully")
    );

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Something went wrong")
    );
  }
}

async function handelClearOrder(req, res) {
  try {
    await Order.deleteMany({});

    return res.status(200).json(
      new ApiResponse(200, {}, "All Order deleted successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

async function handelCreateRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid amount")
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return res.status(200).json(
      new ApiResponse(200, order, "Razorpay order created successfully")
    );
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Failed to create order")
    );
  }
}

async function handelVerifyPayment(req, res) {
  try {
    const userId = req.user._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentMethod } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid payment signature")
      );
    }

    // Fetch cart
    const cart = await Cart.findOne({ user: userId })
      .populate("products.product")
      .populate("products.seller")
      .populate("products.store");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Cart is empty")
      );
    }

    // Fetch user
    const user = await User.findById(userId).select("address");

    if (!user || !user.address) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Shipping address not found")
      );
    }

    const shippingAddress = {
      fullName: user.address.fullName,
      phone: user.address.phone,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.postalCode,
      country: user.address.country || "India"
    };

    let totalAmount = 0;
    const orderItems = [];

    // Process items
    for (let item of cart.products) {
      const productDoc = item.product;

      if (productDoc.stock < item.quantity) {
        return res.status(400).json(
          new ApiResponse(400, {}, `Insufficient stock for ${productDoc.title}`)
        );
      }

      const itemTotal = item.finalPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: productDoc._id,
        seller: item.seller,
        store: item.store,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        finalPrice: item.finalPrice
      });

      productDoc.stock -= item.quantity;
      await productDoc.save();
    }

    // Create order
    const order = await Order.create({
      buyer: userId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "Razorpay",
      paymentStatus: "paid",
      shippingAddress
    });

    // Clear cart
    cart.products = [];
    cart.coupon = null;
    await cart.save();

    return res.status(201).json(
      new ApiResponse(201, order, "Order placed successfully")
    );

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Something went wrong")
    );
  }
}

export { handelPlaceSingelItemOrder , handelPlaceCartItemsOrder , handelClearOrder , handelCreateRazorpayOrder , handelVerifyPayment }