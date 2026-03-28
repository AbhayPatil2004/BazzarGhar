"use client";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "most_reviewed", label: "Most reviewed" },
];

export default function FilterBar({
  sortOption, setSortOption,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  minRating, setMinRating,
  inStock, setInStock,
  returnable, setReturnable,
}) {
  const hasFilters = minPrice || maxPrice || minRating || inStock || returnable;

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setInStock(false);
    setReturnable(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5 p-3 sm:p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100/60 shadow-sm">
      {/* price range */}
      <div className="flex items-center gap-1.5 bg-gray-50/80 rounded-full px-1 py-0.5 border border-gray-100/60">
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-16 sm:w-20 text-[11px] sm:text-xs px-2.5 py-1.5 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
        <span className="text-gray-300 text-[10px]">—</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-16 sm:w-20 text-[11px] sm:text-xs px-2.5 py-1.5 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* rating */}
      <select
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
        className="text-[11px] sm:text-xs text-gray-600 bg-gray-50/80 border border-gray-100/60 rounded-full px-3 py-2 outline-none cursor-pointer hover:border-indigo-300 hover:bg-white transition-all duration-200"
      >
        <option value="">Any rating</option>
        <option value="4">4★ & above</option>
        <option value="3">3★ & above</option>
        <option value="2">2★ & above</option>
      </select>

      {/* in stock */}
      <button
        onClick={() => setInStock((p) => !p)}
        className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200
          ${inStock
            ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-md shadow-indigo-500/20"
            : "bg-gray-50/80 text-gray-600 border-gray-100/60 hover:border-indigo-300 hover:bg-white"}`}
      >
        In stock
      </button>

      {/* returnable */}
      <button
        onClick={() => setReturnable((p) => !p)}
        className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200
          ${returnable
            ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-md shadow-indigo-500/20"
            : "bg-gray-50/80 text-gray-600 border-gray-100/60 hover:border-indigo-300 hover:bg-white"}`}
      >
        Free returns
      </button>

      {/* clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold text-red-500 border border-red-200/60 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

export { sortOptions };
