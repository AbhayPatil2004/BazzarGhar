"use client";
import { ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";
import FilterBar, { sortOptions } from "./FilterBar";
import SectionHeader from "./SectionHeader";
import GenderFilter from "./GenderFilter";

export default function AllProductsSection({
  products,
  loading,
  user,
  wishlistIds,
  apiBase,
  sortOption,   setSortOption,
  minPrice,     setMinPrice,
  maxPrice,     setMaxPrice,
  minRating,    setMinRating,
  inStock,      setInStock,
  returnable,   setReturnable,
  selectedGender, setSelectedGender,
}) {
  return (
    <div className="w-full px-4 sm:px-6 py-5 sm:py-7">
      <SectionHeader
        badge="Browse collection"
        badgeIcon={ShoppingBag}
        badgeColor="text-indigo-500"
        title="All Products"
      />

      {/* Gender filter — only applies to this section */}
      <GenderFilter
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />

      {/* Sort + filters row */}
      <div className="flex items-end justify-end mb-4 mt-4 px-1">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-xs font-bold text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-full px-4 py-2 outline-none cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300 shadow-sm focus:ring-4 focus:ring-indigo-100/50"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* filters */}
      <FilterBar
        sortOption={sortOption}   setSortOption={setSortOption}
        minPrice={minPrice}       setMinPrice={setMinPrice}
        maxPrice={maxPrice}       setMaxPrice={setMaxPrice}
        minRating={minRating}     setMinRating={setMinRating}
        inStock={inStock}         setInStock={setInStock}
        returnable={returnable}   setReturnable={setReturnable}
      />

      {/* skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl bg-white/60 border border-gray-100/50 overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100/60 animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-2.5 w-16 bg-gray-100/60 animate-pulse rounded-full" />
                <div className="h-3 w-full bg-gray-100/60 animate-pulse rounded-full" />
                <div className="h-3 w-3/4 bg-gray-100/60 animate-pulse rounded-full" />
                <div className="h-3 w-1/2 bg-gray-100/60 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-700 font-semibold text-base">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* grid */}
      {!loading && products.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-3 mt-4 px-1">
            {products.length} products
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                user={user}
                apiBase={apiBase}
                initialWishlisted={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
