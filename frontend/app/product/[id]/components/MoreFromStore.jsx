"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, ChevronRight, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function MoreFromStore({ storeId, currentProductId }) {
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

  // Fetch products from the same store
  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/store/${storeId}/products?limit=8`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch store products");
          console.warn("Store products error:", data);
          return;
        }

        // Backend returns array directly or wrapped in data
        const productsArray = Array.isArray(data.data) ? data.data : data.data?.products || [];
        console.log("✅ Store products loaded:", productsArray.length);
        
        // Filter out current product
        const filtered = productsArray.filter(
          (p) => p._id !== currentProductId
        );

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Store products error:", err);
        setError("Error loading store products");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreProducts();
    }
  }, [storeId, currentProductId]);

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
    <section className="w-full mb-16 scroll-mt-20 bg-gradient-to-b from-white via-blue-50/30 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">More From This Store</h2>
            <p className="text-gray-600 text-sm">Explore other products from this seller</p>
          </div>
          <button
            onClick={() => router.push(`/store/${storeId}`)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Visit Store
            <ChevronRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer active:scale-95 duration-300 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center backdrop-blur-sm ${
                      wishlistedIds.has(product._id)
                        ? "bg-red-50/90 border-red-400 text-red-600"
                        : "bg-white/80 border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Heart size={16} fill={wishlistedIds.has(product._id) ? "currentColor" : "none"} />
                  </button>

                  {/* Discount Badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                    {sanitizeString(product.title)}
                  </h3>

                  {/* Store Info */}
                  {product.store?.storeName && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={13} />
                      <span className="line-clamp-1">{sanitizeString(product.store.storeName)}</span>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{Math.round(product.finalPrice || product.price)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-xs text-gray-500 line-through">₹{Math.round(product.price)}</span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
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
                      <span className="text-xs text-gray-600">({product.reviewCount || 0})</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="w-full mt-3 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-medium">No more products from this store</p>
          </div>
        )}
      </div>
    </section>
  );
}
