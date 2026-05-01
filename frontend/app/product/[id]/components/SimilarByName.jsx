"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SimilarByName({ title, currentProductId }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  const sanitizeString = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/^["']|["']$/g, "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .trim();
  };

  // Extract main keywords from product title
  const getKeywordFromTitle = (title) => {
    const sanitized = sanitizeString(title);
    // Get the first significant word (usually the product type)
    const words = sanitized.split(" ").filter((w) => w.length > 2);
    return words[0] || sanitized;
  };

  // Fetch products with similar names
  useEffect(() => {
    const fetchSimilarByName = async () => {
      try {
        setLoading(true);
        const keyword = getKeywordFromTitle(title);

        const res = await fetch(
          `${API_BASE}/product/search?q=${encodeURIComponent(keyword)}&limit=8`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch similar products");
          console.warn("Similar by name error:", data);
          return;
        }

        // Filter out current product - handle different response structures
        const productsArray = data.data?.products || (Array.isArray(data.data) ? data.data : []);
        console.log("✅ Similar by name products loaded:", productsArray.length);
        
        const filtered = productsArray
          .filter((p) => p._id !== currentProductId)
          .slice(0, 8);

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Similar by name error:", err);
        setError("Error loading similar products");
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchSimilarByName();
    }
  }, [title, currentProductId]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE}/cart/add/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart", {
          position: "top-center",
        });
      } else {
        toast.success("Added to cart! 🛒", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error adding to cart", { position: "top-center" });
      console.error(err);
    }
  };

  const handleWishlist = async (e, id) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE}/wishlist/toggle/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setWishlistedIds((prev) => {
          const updated = new Set(prev);
          if (data.data?.wishlisted) {
            updated.add(id);
          } else {
            updated.delete(id);
          }
          return updated;
        });
        toast.success(
          data.data?.wishlisted ? "Added to wishlist ♥" : "Removed from wishlist",
          { position: "top-center" }
        );
      }
    } catch (err) {
      toast.error("Error updating wishlist", { position: "top-center" });
    }
  };

  if (!loading && (error || products.length === 0)) {
    return null;
  }

  return (
    <section className="mb-12 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Similar <span className="text-purple-600">{sanitizeString(title).split(" ")[0]}</span> Products
        </h2>
        <button
          onClick={() => router.push(`/product?search=${encodeURIComponent(sanitizeString(title))}`)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
        >
          View All
          <ChevronRight size={18} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Loading similar products...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer active:scale-95 duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={sanitizeString(product.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlist(e, product._id)}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                    wishlistedIds.has(product._id)
                      ? "bg-red-50 border-red-300 text-red-600"
                      : "bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Heart size={16} fill={wishlistedIds.has(product._id) ? "currentColor" : "none"} />
                </button>

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discountPercentage}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {sanitizeString(product.title)}
                </h3>

                {/* Store Info */}
                {product.store?.storeName && (
                  <p className="text-xs text-gray-600 font-semibold truncate">
                    by {sanitizeString(product.store.storeName)}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.finalPrice || product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-semibold text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < Math.round(product.rating || 4)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {product.reviewCount || 0}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
