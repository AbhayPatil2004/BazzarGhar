"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, ChevronRight, Loader } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SimilarProducts({ productId }) {
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

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/product/similar/${productId}?limit=6`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch similar products");
          console.warn("Similar products error:", data);
          return;
        }

        const similarProducts = data.data?.similarProducts || [];
        console.log("✅ Similar products loaded:", similarProducts.length);
        setProducts(similarProducts);
      } catch (err) {
        console.error("❌ Similar products error:", err);
        setError("Error loading similar products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = async (e, productId, product) => {
    e.stopPropagation();
    
    try {
      const res = await fetch(`${API_BASE}/cart/add/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart", { position: "top-center" });
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
    return null; // Don't show section if no products
  }

  return (
    <section className="mb-12 mt-12 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
        <button
          onClick={() => router.push("/product?sort=trending")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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

                {/* Store Name */}
                {product.store?.storeName && (
                  <p className="text-xs text-gray-600 font-semibold truncate">
                    by {sanitizeString(product.store.storeName)}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i <= Math.round(product.rating || 0) ? "#FBBF24" : "none"}
                        className={i <= Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    {(product.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
                </div>

                {/* Price Section */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(product.finalPrice || product.price)?.toLocaleString("en-IN")}
                    </p>
                    {product.discountPercentage > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      product.stock > 20
                        ? "bg-green-500"
                        : product.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-semibold ${
                      product.stock > 20
                        ? "text-green-700"
                        : product.stock > 0
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {product.stock > 20
                      ? "In Stock"
                      : product.stock > 0
                      ? "Limited Stock"
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product._id, product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
