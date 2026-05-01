"use client";
import { Zap } from "lucide-react";
import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import HorizontalRow from "./HorizontalRow";

export default function EarlyDeliverySection({ products, user, wishlistIds, apiBase, loading }) {
  // Define the correct delivery time order
  const deliveryTimeOrder = {
    "2Hours": 0,
    "4Hours": 1,
    "1day": 2,
    "2Days": 3,
    "3Days": 4,
    "5Days": 5,
    "7Days": 6,
    "10Days": 7,
    "14Days": 8,
  };

  // Sort products by delivery time
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return [...products].sort((a, b) => {
      const timeA = a.deliveryTime || "14Days";
      const timeB = b.deliveryTime || "14Days";
      
      const orderA = deliveryTimeOrder[timeA] ?? 9;
      const orderB = deliveryTimeOrder[timeB] ?? 9;
      
      return orderA - orderB;
    });
  }, [products]);

  return (
    <div className="w-full px-4 sm:px-6 py-5 sm:py-7">
      <SectionHeader
        badge="Lightning fast"
        badgeIcon={Zap}
        badgeColor="text-emerald-500"
        title="Early Delivery"
        seeAllHref="/product/products?isEarlyDelivery=true"
      />
      <HorizontalRow
        products={sortedProducts}
        user={user}
        wishlistIds={wishlistIds}
        apiBase={apiBase}
        loading={loading}
      />
    </div>
  );
}
