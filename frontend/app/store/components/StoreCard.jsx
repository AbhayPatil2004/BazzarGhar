"use client";

import React from "react";
import { useRouter } from "next/navigation";

const StoreCard = ({ store }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/store/${store._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full sm:w-[260px] p-3"
    >
      {/* Top: Logo and Store Name (mobile compact) */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={store.logo || "/default-logo.png"}
            alt={store.storeName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
          {store.storeName}
        </h3>
      </div>

      {/* Banner (hidden on mobile, shown on larger screens) */}
      <div className="hidden sm:block w-full h-24 relative mt-2">
        <img
          src={store.banner || "/default-banner.jpg"}
          alt={`${store.storeName} Banner`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Category + Rating + City (compact row for mobile) */}
      <div className="flex items-center justify-between text-gray-500 text-[10px] sm:text-sm mt-2 gap-1 flex-nowrap overflow-hidden">
  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full truncate max-w-[40%]">
    {store.category || "General"}
  </span>
  <span className="flex items-center gap-1 truncate">
    ⭐ {store.rating.toFixed(1)}
  </span>
  {store.address?.city && (
    <span className="flex items-center gap-1 truncate max-w-[35%]">
      📍 {store.address.city}
    </span>
  )}
</div>
      {/* Products */}
      <div className="mt-2">
        <p className="text-gray-600 text-xs sm:text-sm font-medium">Sells:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {store.storeProducts && store.storeProducts.length > 0 ? (
            store.storeProducts.map((product, idx) => (
              <span
                key={idx}
                className="bg-gray-100 px-2 py-0.5 rounded-full text-xs truncate max-w-[70px]"
                title={product}
              >
                {product}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No products</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;