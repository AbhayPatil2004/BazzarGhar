"use client";
import { Sparkles } from "lucide-react";
import SectionHeader from "./SectionHeader";
import HorizontalRow from "./HorizontalRow";

export default function NewArrivalsSection({ products, user, wishlistIds, apiBase, loading }) {
  return (
    <div className="w-full px-4 sm:px-6 py-5 sm:py-7">
      <SectionHeader
        badge="Just in"
        badgeIcon={Sparkles}
        badgeColor="text-purple-500"
        title="New Arrivals"
        seeAllHref="/product/products?sort=newest"
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
