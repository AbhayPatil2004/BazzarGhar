"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { Heart, Truck, RotateCcw, ShoppingCart, Zap, MapPin, Mail, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Color to Hex mapping with comprehensive colors
const colorMap = {
  "red": "#EF4444",
  "Red": "#EF4444",
  "blue": "#3B82F6",
  "Blue": "#3B82F6",
  "green": "#22C55E",
  "Green": "#22C55E",
  "black": "#1F2937",
  "Black": "#1F2937",
  "white": "#FFFFFF",
  "White": "#FFFFFF",
  "yellow": "#FBBF24",
  "Yellow": "#FBBF24",
  "pink": "#EC4899",
  "Pink": "#EC4899",
  "purple": "#A855F7",
  "Purple": "#A855F7",
  "orange": "#F97316",
  "Orange": "#F97316",
  "gray": "#9CA3AF",
  "Gray": "#9CA3AF",
  "grey": "#9CA3AF",
  "brown": "#92400E",
  "Brown": "#92400E",
  "navy": "#001F3F",
  "Navy": "#001F3F",
  "maroon": "#800000",
  "Maroon": "#800000",
  "teal": "#14B8A6",
  "Teal": "#14B8A6",
  "cyan": "#06B6D4",
  "Cyan": "#06B6D4",
  "lime": "#84CC16",
  "Lime": "#84CC16",
  "indigo": "#4F46E5",
  "Indigo": "#4F46E5",
  "violet": "#6366F1",
  "Violet": "#6366F1",
  "rose": "#F43F5E",
  "Rose": "#F43F5E",
  "slate": "#64748B",
  "Slate": "#64748B",
  "silver": "#C0C0C0",
  "Silver": "#C0C0C0",
  "gold": "#FFD700",
  "Gold": "#FFD700",
  "beige": "#F5F5DC",
  "Beige": "#F5F5DC",
  "cream": "#FFFDD0",
  "Cream": "#FFFDD0",
  "khaki": "#F0E68C",
  "Khaki": "#F0E68C",
  "turquoise": "#40E0D0",
  "Turquoise": "#40E0D0",
};

function getColorHex(colorName) {
  if (!colorName) return "#D1D5DB";
  return colorMap[colorName] || colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1)] || "#9CA3AF";
}

// Sanitize strings to remove extra quotes
function sanitizeString(str) {
  if (!str) return "";
  return String(str)
    .replace(/^["']|["']$/g, "") // Remove leading/trailing quotes
    .replace(/\\"/g, '"') // Unescape double quotes
    .replace(/\\'/g, "'") // Unescape single quotes
    .trim();
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="16" height="16" viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#FBBF24" : "none"}
          stroke={star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Track current media (image or video)
  const [mediaType, setMediaType] = useState("image"); // Track if current media is image or video
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/product/details/${productId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch product");
          return;
        }

        setProduct(data.data);
        
        // Set default selections
        if (data.data.sizes?.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
        if (data.data.colors?.length > 0) {
          setSelectedColor(data.data.colors[0]);
        }
      } catch (err) {
        setError("Error fetching product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch(
        `${API_BASE}/cart/add/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        toast.success("Added to cart successfully! 🛒", {
          position: "top-center",
          duration: 2500,
        });
      }
    } catch (err) {
      toast.error("Error adding to cart", {
        position: "top-center",
        duration: 3000,
      });
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setBuyingNow(true);
    try {
      // First add to cart
      const res = await fetch(
        `${API_BASE}/cart/add/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
          }),
        }
      );

      if (res.ok) {
        // Redirect to checkout/cart page
        router.push("/profile/cart");
      } else {
        toast.error("Failed to process. Please try again.", {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (err) {
      toast.error("Error processing order", {
        position: "top-center",
        duration: 3000,
      });
      console.error(err);
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/wishlist/toggle/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setWishlisted(!wishlisted);
        toast.success(
          data.data?.wishlisted ? "Added to wishlist ♥" : "Removed from wishlist",
          {
            position: "top-center",
            duration: 2500,
          }
        );
      }
    } catch (err) {
      toast.error("Error updating wishlist", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  // Helper function to get media array with videos first, then images
  const getMediaArray = () => {
    const allMedia = [];
    // Videos first
    if (product.video && product.video.length > 0) {
      product.video.forEach(() => allMedia.push("video"));
    }
    // Images second
    if (product.images && product.images.length > 0) {
      product.images.forEach(() => allMedia.push("image"));
    }
    return allMedia;
  };

  const nextImage = () => {
    const allMedia = getMediaArray();
    if (allMedia.length === 0) return;

    let nextIndex = currentMediaIndex + 1;
    if (nextIndex >= allMedia.length) nextIndex = 0;

    setCurrentMediaIndex(nextIndex);
    setMediaType(allMedia[nextIndex]);
  };

  const prevImage = () => {
    const allMedia = getMediaArray();
    if (allMedia.length === 0) return;

    let prevIndex = currentMediaIndex - 1;
    if (prevIndex < 0) prevIndex = allMedia.length - 1;

    setCurrentMediaIndex(prevIndex);
    setMediaType(allMedia[prevIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push("/product")}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Images & Videos */}
          <div className="flex flex-col gap-4 order-2 lg:order-1">
            <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden aspect-square shadow-lg">
              {(product.images && product.images.length > 0) || (product.video && product.video.length > 0) ? (
                <>
                  {/* Display Video or Image (videos first) */}
                  {mediaType === "video" && product.video && product.video[currentMediaIndex] ? (
                    <video
                      src={product.video[currentMediaIndex]}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  ) : mediaType === "image" && product.images && product.images[currentMediaIndex - (product.video?.length || 0)] ? (
                    <img
                      src={product.images[currentMediaIndex - (product.video?.length || 0)]}
                      alt={sanitizeString(product.title)}
                      className="w-full h-full object-cover"
                    />
                  ) : product.video && product.video.length > 0 ? (
                    <video
                      src={product.video[0]}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  ) : (
                    <img
                      src={product.images?.[0]}
                      alt={sanitizeString(product.title)}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Navigation Buttons */}
                  {((product.images?.length || 0) + (product.video?.length || 0) > 1) && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:bg-white cursor-pointer transition-all"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:bg-white cursor-pointer transition-all"
                      >
                        →
                      </button>
                    </>
                  )}

                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 sm:flex-row sm:gap-2">
                    {hasDiscount && (
                      <span className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        -{product.discountPercentage}%
                      </span>
                    )}
                    {isLowStock && (
                      <span className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        Low Stock
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Media Available
                </div>
              )}
            </div>

            {/* Media Thumbnails (Videos first, then Images) */}
            {((product.images && product.images.length > 0) || (product.video && product.video.length > 0)) && (
              (product.images?.length || 0) + (product.video?.length || 0) > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {/* Video Thumbnails First */}
                  {product.video && product.video.map((vid, idx) => (
                    <button
                      key={`vid-${idx}`}
                      onClick={() => {
                        setCurrentMediaIndex(idx);
                        setMediaType("video");
                      }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative ${
                        idx === currentMediaIndex && mediaType === "video"
                          ? "border-gray-900 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <video
                        src={vid}
                        className="w-full h-full object-cover"
                        muted
                      />
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <span className="text-black ml-0.5">▶</span>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Image Thumbnails Second */}
                  {product.images && product.images.map((img, idx) => {
                    const imageIndex = (product.video?.length || 0) + idx;
                    return (
                      <button
                        key={`img-${idx}`}
                        onClick={() => {
                          setCurrentMediaIndex(imageIndex);
                          setMediaType("image");
                        }}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative ${
                          imageIndex === currentMediaIndex && mediaType === "image"
                            ? "border-gray-900 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${sanitizeString(product.title)} ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-5 sm:gap-6 order-1 lg:order-2">
            {/* Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {sanitizeString(product.title) || "Product Name"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating || 0} />
                  <span className="text-xs sm:text-sm text-gray-600">
                    ({product.totalReviews || 0} reviews)
                  </span>
                </div>
                {product.inStock !== false && (
                  <span
                    className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                      isOutOfStock
                        ? "text-red-600 bg-red-50"
                        : isLowStock
                        ? "text-orange-600 bg-orange-50"
                        : "text-green-600 bg-green-50"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLowStock
                      ? `Only ${product.stock} left`
                      : "In Stock"}
                  </span>
                )}
              </div>
            </div>

            {/* Store Info - IMPROVED */}
            {product.store && (
              <div 
                onClick={() => router.push(`/store/${product.store._id}`)}
                className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 cursor-pointer hover:shadow-lg hover:from-blue-100 hover:to-blue-200 transition-all"
              >
                <p className="text-xs sm:text-sm text-blue-700 font-semibold uppercase tracking-wide mb-2">Sold by</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {sanitizeString(product.store.storeName) || "Store"}
                </p>
              </div>
            )}

            {/* Price Section */}
            <div className="space-y-4 p-5 sm:p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                  ₹{product.finalPrice?.toLocaleString("en-IN") || product.price?.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-gray-500 line-through mb-1">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 font-bold text-sm sm:text-base">
                  You save ₹{(product.price - product.finalPrice).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                About this product
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-5">
                {sanitizeString(product.description) || "No description available"}
              </p>
            </div>

            {/* Color Selection - AS COLOR SWATCHES */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Color: <span className="text-gray-600 font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color) => {
                    const hexColor = getColorHex(color);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex flex-col items-center gap-2 transition-all cursor-pointer group`}
                        title={color}
                      >
                        <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 shadow-md transition-all ${
                          isSelected
                            ? "border-gray-900 ring-4 ring-gray-300 ring-offset-2 scale-110"
                            : "border-gray-300 hover:border-gray-500 hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: hexColor,
                          ...(hexColor === "#FFFFFF" && { border: "4px solid #D1D5DB" })
                        }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 text-center group-hover:text-gray-700">{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Size: <span className="text-gray-600 font-normal">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 sm:px-6 py-2.5 rounded-xl border-2 font-bold transition-all cursor-pointer text-sm sm:text-base ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white ring-2 ring-gray-400 ring-offset-2"
                          : "border-gray-300 text-gray-700 hover:border-gray-500 bg-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-bold text-gray-900">
                Quantity
              </label>
              <div className="flex items-center gap-3 sm:gap-4 w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 font-bold text-lg cursor-pointer transition-all"
                >
                  −
                </button>
                <span className="text-lg sm:text-xl font-bold w-8 sm:w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-sm sm:text-base"
              >
                <ShoppingCart size={20} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || buyingNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-sm sm:text-base"
              >
                <Zap size={20} />
                {buyingNow ? "Processing..." : "Buy Now"}
              </button>
              <button
                onClick={handleWishlist}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                  wishlisted
                    ? "bg-red-50 border-red-300 text-red-600 shadow-md"
                    : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600"
                }`}
              >
                <Heart
                  size={20}
                  fill={wishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-gray-200">
              {product.isReturnable && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <RotateCcw className="text-gray-900 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      Easy Returns
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">7 days return policy</p>
                  </div>
                </div>
              )}
              {product.deliveryTime && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <Truck className="text-gray-900 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      Fast Delivery
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {sanitizeString(product.deliveryTime)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Section */}
        {product.store && (
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t-2 border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Store Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Store Details Card */}
              <div 
                onClick={() => router.push(`/store/${product.store._id}`)}
                className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-lg cursor-pointer hover:shadow-xl hover:from-blue-100 hover:to-blue-200 transition-all"
              >
                <div className="flex items-start gap-6 mb-6">
                  {product.store.logo && (
                    <img
                      src={product.store.logo}
                      alt={sanitizeString(product.store.storeName)}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 hover:text-blue-700 transition-colors">
                      {sanitizeString(product.store.storeName) || "Store"}
                    </h3>
                    <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-2">
                      {sanitizeString(product.store.category) || "General"}
                    </p>
                    {product.store.address && (
                      <div className="flex items-start gap-2 text-gray-700 text-sm mb-2">
                        <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                        <span className="font-semibold">
                          {product.store.address.city && product.store.address.state
                            ? `${sanitizeString(product.store.address.city)}, ${sanitizeString(product.store.address.state)}`
                            : "Location not specified"}
                          {product.store.address.country && `, ${sanitizeString(product.store.address.country)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {product.store.description && (
                  <div className="mt-4 p-4 bg-white rounded-xl">
                    <p className="text-xs font-bold text-gray-700 uppercase mb-2">About Store</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{sanitizeString(product.store.description)}</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Seller/Owner Section */}
        {(product.seller || product.store?.owner) && (
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t-2 border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {product.store?.owner ? "Store Owner Information" : "Seller Information"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Owner/Seller Details Card */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  {(product.store?.owner?.avatar || product.seller?.avatar) && (
                    <img
                      src={product.store?.owner?.avatar || product.seller?.avatar}
                      alt={sanitizeString(`${product.store?.owner?.firstName || product.seller?.firstName} ${product.store?.owner?.lastName || product.seller?.lastName}`)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-bold uppercase tracking-wide mb-2">
                      {product.store?.owner ? "Store Owner" : "Seller"}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {product.store?.owner
                        ? `${sanitizeString(product.store.owner.firstName || "")} ${sanitizeString(product.store.owner.lastName || "")}`.trim() || "Store Owner"
                        : product.seller
                        ? `${sanitizeString(product.seller.firstName || "")} ${sanitizeString(product.seller.lastName || "")}`.trim() || "Seller"
                        : "Not Available"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(product.store?.owner?.email || product.seller?.email) && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                      <Mail size={20} className="flex-shrink-0 text-green-600" />
                      <a
                        href={`mailto:${sanitizeString(product.store?.owner?.email || product.seller?.email)}`}
                        className="text-sm sm:text-base font-medium hover:text-blue-600 transition-colors break-all flex-1"
                      >
                        {sanitizeString(product.store?.owner?.email || product.seller?.email)}
                      </a>
                    </div>
                  )}
                  {(product.store?.owner?.phone || product.seller?.phone) && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                      <Phone size={20} className="flex-shrink-0 text-green-600" />
                      <a
                        href={`tel:${sanitizeString(product.store?.owner?.phone || product.seller?.phone)}`}
                        className="text-sm sm:text-base font-medium hover:text-blue-600 transition-colors flex-1"
                      >
                        {sanitizeString(product.store?.owner?.phone || product.seller?.phone)}
                      </a>
                    </div>
                  )}
                  {!(product.store?.owner?.phone || product.seller?.phone) && (product.store?.owner?.email || product.seller?.email) && (
                    <p className="text-xs text-gray-500 italic">Phone number not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
