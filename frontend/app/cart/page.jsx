"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/Authcontext";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Fetch cart products
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.data) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId, size, color) => {
    const itemKey = `${productId}-${size}-${color}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));

    try {
      const res = await fetch(
        `${API_BASE}/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ size, color }),
        }
      );

      if (res.ok) {
        toast.success("Product removed from cart", { position: "top-center" });
        // Re-fetch cart to ensure proper data
        await fetchCart();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to remove product", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error removing product", { position: "top-center" });
      console.error(err);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const handleUpdateQuantity = async (productId, size, color, newQuantity) => {
    const itemKey = `${productId}-${size}-${color}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));

    try {
      const res = await fetch(
        `${API_BASE}/cart/update-quantity/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: newQuantity, size, color }),
        }
      );

      if (res.ok) {
        toast.success("Quantity updated", { position: "top-center" });
        // Re-fetch cart to ensure proper data
        await fetchCart();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update quantity", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error updating quantity", { position: "top-center" });
      console.error(err);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const handleUpdateColor = async (productId, size, oldColor, newColor) => {
    const itemKey = `${productId}-${size}-${oldColor}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));

    try {
      const res = await fetch(
        `${API_BASE}/cart/update-color/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newColor, oldColor, size }),
        }
      );

      if (res.ok) {
        toast.success("Color updated", { position: "top-center" });
        // Re-fetch cart to ensure proper data
        await fetchCart();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update color", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error updating color", { position: "top-center" });
      console.error(err);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const handleBuyNow = async () => {
    if (!cart || cart.products.length === 0) {
      toast.error("Cart is empty", { position: "top-center" });
      return;
    }

    try {
      // Navigate to checkout page
      router.push("/checkout");
    } catch (err) {
      toast.error("Error proceeding to checkout", { position: "top-center" });
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((sum, item) => sum + item.finalPrice, 0);
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Toaster />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Toaster />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <button
              onClick={() => router.push("/product")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const subtotal = calculateSubtotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.products.length} item{cart.products.length !== 1 ? "s" : ""} in
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item, index) => {
              const product = item.product;
              const itemKey = `${product._id}-${item.size}-${item.color}`;
              const isUpdating = updatingItems.has(itemKey);

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product && product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center">
                          <ShoppingBag size={40} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate cursor-pointer hover:text-blue-600"
                            onClick={() => router.push(`/product/${product._id}`)}
                          >
                            {product.title || "Product"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Brand: {product.brand || "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveProduct(product._id, item.size, item.color)
                          }
                          disabled={isUpdating}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Size and Color */}
                      <div className="flex gap-4 mb-4 flex-wrap">
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            Size:
                          </span>
                          <p className="text-sm font-bold text-gray-900">
                            {item.size || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            Color:
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {/* Color Circle */}
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.color}
                            </p>

                            {/* Change Color Dropdown */}
                            {product && product.colors && product.colors.length > 0 && (
                              <select
                                value={item.color}
                                onChange={(e) =>
                                  handleUpdateColor(
                                    product._id,
                                    item.size,
                                    item.color,
                                    e.target.value
                                  )
                                }
                                disabled={isUpdating}
                                className="text-xs px-2 py-1 border border-gray-300 rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
                              >
                                {product.colors.map((color) => (
                                  <option key={color} value={color}>
                                    {color}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controller */}
                        <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product._id,
                                item.size,
                                item.color,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 cursor-pointer active:scale-95"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 font-bold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product._id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            disabled={isUpdating}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 cursor-pointer active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.price !== item.finalPrice && (
                            <p className="text-s text-gray-500 line-through">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          )}
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.finalPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 h-fit">
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
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    ₹{Math.round(subtotal * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{(total + Math.round(subtotal * 0.18)).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mb-3 cursor-pointer active:scale-95"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/product")}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors cursor-pointer active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
