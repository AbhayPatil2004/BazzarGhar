"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, ShoppingCart, RotateCcw, Truck } from "lucide-react";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#FBBF24" : "none"}
          stroke={star <= Math.round(rating) ? "#FBBF24" : "#D1D5DB"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, onWishlistToggle }) {
  const router  = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

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

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    onWishlistToggle?.(_id, !wishlisted);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleClick = () => router.push(`/product/${_id}`);

  const isLowStock  = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;
  const hasDiscount  = discountPercentage > 0;

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl hover:border-blue-100 transition-all duration-250 active:scale-[0.98]"
    >

      {/* ── Image ── */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* wishlist — top left */}
        <button
          onClick={handleWishlist}
          className="cursor-pointer absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-150 z-10"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}
          />
        </button>

        {/* discount badge — top right */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}

        {/* gender pill — bottom left */}
        {gender && gender !== "unisex" && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium px-2 py-0.5 rounded-full capitalize">
            {gender}
          </div>
        )}

        {/* out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5 gap-1.5">

        {/* store name */}
        <p
          onClick={(e) => {
            e.stopPropagation();
            if (store?._id) router.push(`/store/${store._id}`);
          }}
          className="text-[10px] sm:text-xs text-blue-500 font-semibold truncate hover:text-blue-700 hover:underline cursor-pointer w-fit"
        >
          {store?.name || "Local Store"}
        </p>

        {/* title */}
        <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {title}
        </p>

        {/* rating + reviews */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-[10px] text-gray-400 font-medium">
            ({totalReviews?.toLocaleString("en-IN")})
          </span>
        </div>

        {/* price row */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            ₹{finalPrice?.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">
              ₹{price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* delivery + returnable */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {deliveryTime && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
              <Truck size={10} className="text-blue-400 shrink-0" />
              {deliveryTime}
            </span>
          )}
          {isReturnable && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <RotateCcw size={10} className="shrink-0" />
              Free returns
            </span>
          )}
        </div>

        {/* low stock warning */}
        {isLowStock && (
          <p className="text-[10px] font-semibold text-orange-500">
            Only {stock} left!
          </p>
        )}

        {/* add to cart */}
        <button
          onClick={handleCart}
          disabled={isOutOfStock}
          className={`cursor-pointer mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
            ${isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 active:scale-95"
            }`}
        >
          <ShoppingCart size={13} />
          {isOutOfStock ? "Unavailable" : "Add to cart"}
        </button>

      </div>
    </div>
  );
}