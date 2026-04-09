"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/Authcontext";
import {
  CreditCard,
  Truck,
  CheckCircle,
  Loader,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  
  // Buy now product options
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [buyNowSize, setBuyNowSize] = useState("");
  const [buyNowColor, setBuyNowColor] = useState("");

  // Check for buy now product and fetch data
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check if this is a buy now flow
    if (typeof window !== "undefined") {
      const storedBuyNow = localStorage.getItem("buyNowProduct");
      if (storedBuyNow) {
        const buyNowData = JSON.parse(storedBuyNow);
        setBuyNowProduct(buyNowData);
        setBuyNowQuantity(buyNowData.quantity || 1);
        setBuyNowSize(buyNowData.size || "");
        setBuyNowColor(buyNowData.color || "");
      }
    }

    fetchCartAndUserData();
  }, [user]);

  const fetchCartAndUserData = async () => {
    try {
      // Only fetch cart if not in buy now mode
      if (typeof window !== "undefined" && !localStorage.getItem("buyNowProduct")) {
        const cartRes = await fetch(`${API_BASE}/cart/`, {
          credentials: "include",
        });
        
        if (!cartRes.ok) {
          console.error("Cart fetch failed:", cartRes.status);
          throw new Error(`Cart API error: ${cartRes.status}`);
        }
        
        const cartData = await cartRes.json();
        if (cartData.data) {
          setCart(cartData.data);
        }
      }

      // Fetch user address
      const userRes = await fetch(`${API_BASE}/user/`, {
        credentials: "include",
      });
      
      if (!userRes.ok) {
        console.error("User fetch failed:", userRes.status);
        throw new Error(`User API error: ${userRes.status}`);
      }
      
      const userData = await userRes.json();
      if (userData.data?.address && userData.data.address.length > 0) {
        // Get default address or first address
        const defaultAddr = userData.data.address.find(addr => addr.isDefault);
        const selectedAddr = defaultAddr || userData.data.address[0];
        setUserAddress(selectedAddr);
      } else {
        setUserAddress(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(`Failed to load checkout data: ${err.message}`, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCODPayment = async () => {
    if (!userAddress) {
      toast.error("Please add a shipping address", {
        position: "top-center",
      });
      router.push("/profile/address/edit");
      return;
    }

    setProcessing(true);
    try {
      if (buyNowProduct) {
        // Buy now COD payment
        const res = await fetch(`${API_BASE}/order/singleorder/${buyNowProduct.productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            quantity: buyNowQuantity,
            size: buyNowSize || undefined,
            color: buyNowColor || undefined,
            paymentMethod: "COD",
          }),
        });

        if (!res.ok) {
          console.error("Order API error:", res.status);
          throw new Error(`Order API error: ${res.status}`);
        }

        toast.success("Order placed successfully! 🎉", {
          position: "top-center",
        });
        localStorage.removeItem("buyNowProduct");
      } else {
        // Cart COD payment
        const res = await fetch(`${API_BASE}/order/place-from-cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ paymentMethod: "COD" }),
        });

        if (!res.ok) {
          console.error("Order API error:", res.status);
          throw new Error(`Order API error: ${res.status}`);
        }

        toast.success("Order placed successfully! 🎉", {
          position: "top-center",
        });
      }

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      toast.error(`Error placing order: ${err.message}`, { position: "top-center" });
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!userAddress) {
      toast.error("Please add a shipping address", {
        position: "top-center",
      });
      router.push("/profile/address/edit");
      return;
    }

    setProcessing(true);

    try {
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        toast.error("Failed to load Razorpay", { position: "top-center" });
        setProcessing(false);
        return;
      }

      // Calculate amount based on buy now or cart
      let amount;
      if (buyNowProduct) {
        const price = buyNowProduct.product.finalPrice || buyNowProduct.product.price;
        amount = Math.round((price * buyNowQuantity + calculateTax()) * 100);
      } else {
        amount = Math.round((calculateTotal() + calculateTax()) * 100);
      }

      // Create Razorpay order
      const orderRes = await fetch(
        `${API_BASE}/order/create-razorpay-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        }
      );

      if (!orderRes.ok) {
        console.error("Razorpay order creation failed:", orderRes.status);
        throw new Error(`Razorpay API error: ${orderRes.status}`);
      }

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "AuraShop",
        description: "Order Payment",
        order_id: orderData.data.id,

        handler: async function (response) {
          try {
            // Verify payment and create order
            const verifyRes = await fetch(
              `${API_BASE}/order/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  ...response,
                  paymentMethod: "Razorpay",
                  isBuyNow: !!buyNowProduct,
                  buyNowData: buyNowProduct ? {
                    productId: buyNowProduct.productId,
                    quantity: buyNowQuantity,
                    size: buyNowSize,
                    color: buyNowColor,
                  } : null,
                }),
              }
            );

            if (!verifyRes.ok) {
              console.error("Payment verification failed:", verifyRes.status);
              throw new Error(`Verification API error: ${verifyRes.status}`);
            }

            const verifyData = await verifyRes.json();
            toast.success("Payment successful! Order placed 🎉", {
              position: "top-center",
            });
            localStorage.removeItem("buyNowProduct");
            setTimeout(() => {
              router.push("/profile");
            }, 1500);
          } catch (err) {
            toast.error("Error verifying payment", { position: "top-center" });
            console.error(err);
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled", { position: "top-center" });
            setProcessing(false);
          },
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Error processing payment", { position: "top-center" });
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    if (buyNowProduct) {
      const price = buyNowProduct.product.price || 0;
      return price * buyNowQuantity;
    }
    if (!cart || !cart.products) return 0;
    return cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    if (buyNowProduct) {
      const finalPrice = buyNowProduct.product.finalPrice || buyNowProduct.product.price || 0;
      return finalPrice * buyNowQuantity;
    }
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((sum, item) => sum + item.finalPrice, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Toaster />
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!buyNowProduct && (!cart || cart.products.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Toaster />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <button
              onClick={() => router.push("/product")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {!buyNowProduct && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold cursor-pointer"
          >
            <X size={20} />
            Close
          </button>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shipping Address
              </h2>

              {userAddress ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900">
                    {userAddress.fullName}
                  </p>
                  <p className="text-gray-600">{userAddress.phone}</p>
                  <p className="text-gray-600">
                    {userAddress.street}, {userAddress.city}, {userAddress.state}{" "}
                    {userAddress.postalCode}
                  </p>
                  <button
                    onClick={() => router.push("/profile/address/edit")}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-700 font-semibold mb-2">
                    Please add a shipping address to continue
                  </p>
                  <button
                    onClick={() => router.push("/profile/address/edit")}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Add Address Now
                  </button>
                </div>
              )}
            </div>

            {/* Buy Now Product Options */}
            {buyNowProduct && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Details
                </h2>

                <div className="flex gap-4 mb-6">
                  {buyNowProduct.product?.images?.[0] && (
                    <img
                      src={buyNowProduct.product.images[0]}
                      alt={buyNowProduct.product.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {buyNowProduct.product?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {buyNowProduct.product?.brand}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={buyNowQuantity}
                      onChange={(e) => setBuyNowQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <button
                      onClick={() => setBuyNowQuantity(buyNowQuantity + 1)}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size */}
                {buyNowProduct.product?.colors && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Choose Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {buyNowProduct.product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setBuyNowColor(color)}
                          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition ${
                            buyNowColor === color
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {buyNowProduct.product?.sizes && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Choose Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {buyNowProduct.product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setBuyNowSize(size)}
                          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition ${
                            buyNowSize === size
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Items from Cart */}
            {!buyNowProduct && cart && cart.products.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Order Items ({cart.products.length})
                </h2>

                <div className="space-y-4">
                  {cart.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.finalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* COD Option */}
                <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                  style={{
                    borderColor:
                      paymentMethod === "COD" ? "#2563eb" : "#e5e7eb",
                    backgroundColor:
                      paymentMethod === "COD" ? "#eff6ff" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                  <Truck size={24} className="text-green-600" />
                </label>

                {/* Online Payment Option */}
                <label
                  className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                  style={{
                    borderColor:
                      paymentMethod === "Online" ? "#2563eb" : "#e5e7eb",
                    backgroundColor:
                      paymentMethod === "Online" ? "#eff6ff" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Online Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay securely with Razorpay
                    </p>
                  </div>
                  <CreditCard size={24} className="text-blue-600" />
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold text-gray-900">
                    ₹{tax.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{(total + tax).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() =>
                  paymentMethod === "COD"
                    ? handleCODPayment()
                    : handleOnlinePayment()
                }
                disabled={processing}
                className={`w-full py-3 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {processing && <Loader size={20} className="animate-spin" />}
                {paymentMethod === "COD"
                  ? "Place Order"
                  : "Pay with Razorpay"}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                {paymentMethod === "COD"
                  ? "Your order will be confirmed after placement"
                  : "Secure payment powered by Razorpay"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
