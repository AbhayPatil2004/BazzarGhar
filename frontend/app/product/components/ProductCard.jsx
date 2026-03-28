"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, RotateCcw, Truck } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="12" height="12" viewBox="0 0 24 24"
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

export default function ProductCard({ product, user, apiBase, initialWishlisted = false }) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading]       = useState(false);

  if (!product) return null;

  const {
    _id,
    images,
    title,
    store,
    finalPrice,
    price,
    discountPercentage,
    rating,
    totalReviews,
    gender,
    deliveryTime,
    isReturnable,
    stock,
  } = product;

  const isLowStock   = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;
  const hasDiscount  = discountPercentage > 0;

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (loading) return;
    setLoading(true);

    const wasWishlisted = wishlisted;
    setWishlisted((prev) => !prev);

    try {
      const res  = await fetch(`${apiBase}/wishlist/toggle/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setWishlisted(wasWishlisted);
        toast.error("Something went wrong. Please try again.", {
          position: "top-center",
          duration: 3000,
          style: {
            fontSize: "13px",
            fontWeight: "500",
            borderRadius: "999px",
            padding: "10px 18px",
          },
        });
      } else {
        const isNowWishlisted = data.data?.wishlisted;
        setWishlisted(isNowWishlisted);
        toast.success(
          isNowWishlisted ? "Added to wishlist ♥" : "Removed from wishlist",
          {
            position: "top-center",
            duration: 2500,
            style: {
              fontSize: "13px",
              fontWeight: "500",
              borderRadius: "999px",
              padding: "10px 18px",
              background: isNowWishlisted ? "#fff1f2" : "#f9fafb",
              color:      isNowWishlisted ? "#be123c"  : "#374151",
              border:     isNowWishlisted ? "1px solid #fecdd3" : "1px solid #e5e7eb",
            },
            iconTheme: {
              primary: isNowWishlisted ? "#be123c" : "#6b7280",
              secondary: "#fff",
            },
          }
        );
      }
    } catch {
      setWishlisted(wasWishlisted);
      toast.error("Network error. Please try again.", {
        position: "top-center",
        duration: 3000,
        style: {
          fontSize: "13px",
          fontWeight: "500",
          borderRadius: "999px",
          padding: "10px 18px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      <div
        onClick={() => router.push(`/product/${_id}`)}
        className="relative flex flex-col bg-white/80 backdrop-blur-sm border border-gray-100/60 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.1)] hover:border-gray-200/80 hover:-translate-y-1 transition-all duration-300 ease-out active:scale-[0.97]"
      >
        {/* image */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={images?.[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Hover overlay shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* wishlist — top left */}
          <button
            onClick={handleWishlist}
            disabled={loading}
            className={`cursor-pointer absolute top-2.5 left-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-white/50 transition-all duration-200 z-10
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-110 hover:shadow-md"}`}
          >
            <Heart
              size={14}
              className={`transition-colors duration-200 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-gray-600"}`}
            />
          </button>

          {/* discount badge — top right */}
          {hasDiscount && (
            <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-red-500/20">
              {discountPercentage}% OFF
            </div>
          )}

          {/* gender pill — bottom left */}
          {gender && gender !== "unisex" && (
            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded-full capitalize tracking-wide">
              {gender}
            </div>
          )}

          {/* out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white/95 text-gray-800 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* body */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5 sm:gap-2">

          {/* store name */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              if (store?._id) router.push(`/store/${store._id}`);
            }}
            className="text-[9px] sm:text-[11px] text-blue-500 font-semibold truncate hover:text-blue-700 cursor-pointer w-fit tracking-wide uppercase"
          >
            {store?.storeName || "Local Store"}
          </p>

          {/* title */}
          <p className="text-[11px] sm:text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 tracking-tight">
            {title}
          </p>

          {/* rating + reviews */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} />
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
              ({totalReviews?.toLocaleString("en-IN")})
            </span>
          </div>

          {/* price */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
              ₹{finalPrice?.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[10px] text-gray-400 line-through font-medium">
                ₹{price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* delivery + returnable */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5">
            {deliveryTime && (
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-500 font-medium">
                <Truck size={9} className="text-blue-400 shrink-0" />
                {deliveryTime}
              </span>
            )}
            {isReturnable && (
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-600 font-medium">
                <RotateCcw size={9} className="shrink-0" />
                Free returns
              </span>
            )}
          </div>

          {/* low stock */}
          {isLowStock && (
            <p className="text-[9px] sm:text-[10px] font-bold text-orange-500 animate-pulse">
              🔥 Only {stock} left!
            </p>
          )}

        </div>
      </div>
    </>
  );
}