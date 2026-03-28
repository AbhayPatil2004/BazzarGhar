"use client";
import { TrendingUp } from "lucide-react";
import SectionHeader from "./SectionHeader";
import HorizontalRow from "./HorizontalRow";

export default function TrendingSection({ products, user, wishlistIds, apiBase, loading }) {
  return (
    <div className="w-full px-4 sm:px-6 py-5 sm:py-7">
      <SectionHeader
        badge="Hot right now"
        badgeIcon={TrendingUp}
        badgeColor="text-rose-500"
        title="Trending"
        seeAllHref="/product/products?sort=trending"
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
