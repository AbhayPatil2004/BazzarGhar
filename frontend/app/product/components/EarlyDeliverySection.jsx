"use client";
import { Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import HorizontalRow from "./HorizontalRow";

export default function EarlyDeliverySection({ products, user, wishlistIds, apiBase, loading }) {
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
        products={products}
        user={user}
        wishlistIds={wishlistIds}
        apiBase={apiBase}
        loading={loading}
      />
    </div>
  );
}
