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
    if (!user || !user.address || user.address.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Shipping address not found")
      );
    }

    // Get default address or first address
    const defaultAddress = user.address.find(addr => addr.isDefault) || user.address[0];
    const shippingAddress = {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      street: defaultAddress.street,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: defaultAddress.country || "India"
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
    
    const user = await User.findById(userId).select("address");
    if (!user || !user.address || user.address.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Shipping address not found")
      );
    }

    // Get default address or first address
    const defaultAddress = user.address.find(addr => addr.isDefault) || user.address[0];
    const shippingAddress = {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      street: defaultAddress.street,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: defaultAddress.country || "India"
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

    // Verify Razorpay credentials exist
    if (!process.env.RAZORPAY_APIKEY || !process.env.RAZORPAY_APIKEY_SECRET) {
      console.error("Missing Razorpay credentials in environment variables");
      return res.status(500).json(
        new ApiResponse(500, {}, "Razorpay credentials not configured")
      );
    }

    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_APIKEY,
        key_secret: process.env.RAZORPAY_APIKEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });

      return res.status(200).json(
        new ApiResponse(200, order, "Razorpay order created successfully")
      );
    } catch (razorpayError) {
      console.error("Razorpay API error:", {
        message: razorpayError.message,
        code: razorpayError.code,
        statusCode: razorpayError.statusCode,
        error: razorpayError.error
      });

      const errorMessage = razorpayError.message || razorpayError.error?.description || "Failed to create Razorpay order";
      return res.status(500).json(
        new ApiResponse(500, {}, errorMessage)
      );
    }
  } catch (error) {
    console.error("Order creation error:", {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Failed to create order")
    );
  }
}

async function handelVerifyPayment(req, res) {
  try {
    const userId = req.user._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentMethod, isBuyNow, buyNowData } = req.body;

    console.log("Payment verification request:", {
      userId,
      isBuyNow,
      buyNowData,
      paymentMethod
    });

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APIKEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid payment signature")
      );
    }

    // Fetch user
    const user = await User.findById(userId).select("address");

    if (!user || !user.address || user.address.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Shipping address not found")
      );
    }

    // Get default address or first address
    const defaultAddress = user.address.find(addr => addr.isDefault) || user.address[0];
    const shippingAddress = {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      street: defaultAddress.street,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: defaultAddress.country || "India"
    };

    let order;

    // Handle Buy Now Flow
    if (isBuyNow && buyNowData) {
      console.log("Processing Buy Now order");
      
      const { productId, quantity, size, color } = buyNowData;

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

      order = await Order.create({
        buyer: userId,
        items: [
          {
            product: product._id,
            seller: product.seller._id,
            store: product.store._id,
            quantity,
            size: size || undefined,
            color: color || undefined,
            price,
            finalPrice
          }
        ],
        totalAmount: finalPrice,
        paymentMethod: paymentMethod || "Razorpay",
        paymentStatus: "paid",
        shippingAddress
      });

      product.stock -= quantity;
      await product.save();

      console.log("Buy Now order created:", order._id);
    } 
    // Handle Cart Checkout Flow
    else {
      console.log("Processing Cart order");
      
      // Fetch cart
      const cart = await Cart.findOne({ user: userId })
        .populate("products.product");

      if (!cart || cart.products.length === 0) {
        return res.status(400).json(
          new ApiResponse(400, {}, "Cart is empty")
        );
      }

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
          seller: productDoc.seller,
          store: productDoc.store,
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
      order = await Order.create({
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

      console.log("Cart order created:", order._id);
    }

    return res.status(201).json(
      new ApiResponse(201, order, "Order placed successfully")
    );

  } catch (error) {
    console.error("Payment verification error:", {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Payment verification failed")
    );
  }
}

export { handelPlaceSingelItemOrder , handelPlaceCartItemsOrder , handelClearOrder , handelCreateRazorpayOrder , handelVerifyPayment }