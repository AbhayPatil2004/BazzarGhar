"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductHeroWithSearchOnly from "./components/Header";
import CategorySection from "./components/category";
import ProductCard from "./components/ProductCard";
import { useAuth } from "../context/Authcontext";
import { ChevronLeft, ChevronRight, Flame, Sparkles, TrendingUp } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const MIN_SWIPE = 50;

// ── safe fetch helper ──
const safeFetch = async (url, options = {}) => {
  console.log("🌐 Fetching:", url);
  const res  = await fetch(url, { credentials: "include", ...options });
  const text = await res.text();
  console.log(`📦 Response from ${url}:`, text.slice(0, 300));
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(`❌ Non-JSON response from ${url}:`, text);
    return null;
  }
};

// ── reusable horizontal scroll row ──
function HorizontalRow({ products, user, wishlistIds, apiBase, loading }) {
  const scrollRef  = useRef(null);
  const touchStart = useRef(null);
  const touchEnd   = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  const scrollBy = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  if (loading) {
    return (
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[155px] sm:w-[195px] flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden">
            <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
            <div className="p-3 flex flex-col gap-2">
              <div className="h-2.5 w-16 bg-gray-100 animate-pulse rounded-full" />
              <div className="h-3 w-full bg-gray-100 animate-pulse rounded-full" />
              <div className="h-3 w-3/4 bg-gray-100 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="relative">
      <div className="hidden sm:flex absolute -top-10 right-0 items-center gap-2">
        <button
          onClick={() => scrollBy(-1)}
          disabled={!canLeft}
          className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200
            ${canLeft ? "border-blue-200 text-blue-600 hover:bg-blue-50" : "border-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          disabled={!canRight}
          className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200
            ${canRight ? "border-blue-200 text-blue-600 hover:bg-blue-50" : "border-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={(e) => { touchStart.current = e.targetTouches[0].clientX; }}
        onTouchMove={(e)  => { touchEnd.current   = e.targetTouches[0].clientX; }}
        onTouchEnd={() => {
          if (!touchStart.current || !touchEnd.current) return;
          const diff = touchStart.current - touchEnd.current;
          if (Math.abs(diff) >= MIN_SWIPE) scrollBy(diff > 0 ? 1 : -1);
          touchStart.current = null;
          touchEnd.current   = null;
        }}
      >
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-[155px] sm:w-[195px]">
            <ProductCard
              product={product}
              user={user}
              apiBase={apiBase}
              initialWishlisted={wishlistIds.includes(product._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── section header ──
function SectionHeader({ badge, badgeIcon: Icon, badgeColor, title, seeAllHref }) {
  return (
    <div className="flex items-end justify-between mb-5 px-1">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 flex items-center gap-1 ${badgeColor}`}>
          {Icon && <Icon size={11} />} {badge}
        </p>
        <h2
          className="font-bold text-gray-900 leading-tight"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
        >
          {title}
        </h2>
      </div>
      {seeAllHref && (
        <button
          onClick={() => window.location.href = seeAllHref}
          className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full whitespace-nowrap hover:border-blue-400 hover:text-blue-700 transition-all duration-150 cursor-pointer"
        >
          See all →
        </button>
      )}
    </div>
  );
}

export default function Page() {
  const { user } = useAuth();

  const [trending,    setTrending]    = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const [selectedGender,   setSelectedGender]   = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption,       setSortOption]       = useState("newest");
  const [minPrice,         setMinPrice]         = useState("");
  const [maxPrice,         setMaxPrice]         = useState("");
  const [minRating,        setMinRating]        = useState("");
  const [inStock,          setInStock]          = useState(false);
  const [returnable,       setReturnable]       = useState(false);

  const [loadingTrend,    setLoadingTrend]    = useState(true);
  const [loadingArrivals, setLoadingArrivals] = useState(true);
  const [loadingAll,      setLoadingAll]      = useState(true);

  const genders = ["all", "men", "women", "kids", "unisex"];
  const sortOptions = [
    { value: "newest",        label: "Newest"            },
    { value: "trending",      label: "Most popular"      },
    { value: "rating",        label: "Top rated"         },
    { value: "price_asc",     label: "Price: Low → High" },
    { value: "price_desc",    label: "Price: High → Low" },
    { value: "most_reviewed", label: "Most reviewed"     },
  ];

  // ── debug env ──
  useEffect(() => {
    console.log("🔑 API_BASE:", API_BASE);
    if (!API_BASE) console.error("❌ NEXT_PUBLIC_API_URL is undefined — check .env.local");
  }, []);

  // ── wishlist IDs ──
  useEffect(() => {
    if (!user) {
      console.log("👤 No user — skipping wishlist fetch");
      return;
    }
    console.log("👤 User found — fetching wishlist IDs");
    safeFetch(`${API_BASE}/wishlist/ids`)
      .then((d) => {
        console.log("❤️ Wishlist IDs:", d?.data?.ids);
        setWishlistIds(d?.data?.ids || []);
      })
      .catch((err) => console.error("❌ Wishlist IDs error:", err));
  }, [user]);

  // ── trending ──
  useEffect(() => {
    setLoadingTrend(true);
    safeFetch(`${API_BASE}/product/products?sort=trending&limit=10`)
      .then((d) => {
        console.log("🔥 Trending:", d?.data?.products?.length, "items");
        setTrending(d?.data?.products || []);
      })
      .catch((err) => console.error("❌ Trending error:", err))
      .finally(() => setLoadingTrend(false));
  }, []);

  // ── new arrivals ──
  useEffect(() => {
    setLoadingArrivals(true);
    safeFetch(`${API_BASE}/product/products?sort=newest&limit=8`)
      .then((d) => {
        console.log("✨ New arrivals:", d?.data?.products?.length, "items");
        setNewArrivals(d?.data?.products || []);
      })
      .catch((err) => console.error("❌ New arrivals error:", err))
      .finally(() => setLoadingArrivals(false));
  }, []);

  // ── all products with filters ──
  useEffect(() => {
    setLoadingAll(true);
    const params = new URLSearchParams();
    params.set("limit", "20");
    params.set("sort",  sortOption);
    if (selectedGender && selectedGender !== "all") params.set("gender",       selectedGender);
    if (selectedCategory)                           params.set("category",     selectedCategory);
    if (minPrice)                                   params.set("minPrice",     minPrice);
    if (maxPrice)                                   params.set("maxPrice",     maxPrice);
    if (minRating)                                  params.set("rating",       minRating);
    if (inStock)                                    params.set("inStock",      "true");
    if (returnable)                                 params.set("isReturnable", "true");

    const url = `${API_BASE}/product/products?${params.toString()}`;
    console.log("📦 Fetching all products:", url);

    safeFetch(url)
      .then((d) => {
        console.log("📦 All products:", d?.data?.products?.length, "items");
        setAllProducts(d?.data?.products || []);
      })
      .catch((err) => console.error("❌ All products error:", err))
      .finally(() => setLoadingAll(false));
  }, [selectedGender, selectedCategory, sortOption, minPrice, maxPrice, minRating, inStock, returnable]);

  const handleCategoryClick = (cat) => {
    console.log("🏷️ Category clicked:", cat);
    setSelectedCategory((prev) => (prev === cat ? "" : cat));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* header */}
      <ProductHeroWithSearchOnly />

      {/* category strip */}
      <CategorySection onCategoryClick={handleCategoryClick} activeCategory={selectedCategory} />

      {/* gender filter */}
      <div className="w-[95%] mx-auto pt-5 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize
                ${selectedGender === g
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {g === "all" ? "All" : g}
            </button>
          ))}
        </div>
      </div>

      {/* trending */}
      <div className="w-[95%] mx-auto py-6 sm:py-8">
        <SectionHeader
          badge="Trending"
          badgeIcon={Flame}
          badgeColor="text-orange-500"
          title="Best Sellers"
          seeAllHref="/product/products?sort=trending"
        />
        <HorizontalRow
          products={trending}
          user={user}
          wishlistIds={wishlistIds}
          apiBase={API_BASE}
          loading={loadingTrend}
        />
      </div>

      {/* new arrivals */}
      <div className="w-[95%] mx-auto py-4 sm:py-6">
        <SectionHeader
          badge="Just in"
          badgeIcon={Sparkles}
          badgeColor="text-purple-500"
          title="New Arrivals"
          seeAllHref="/product/products?sort=newest"
        />
        <HorizontalRow
          products={newArrivals}
          user={user}
          wishlistIds={wishlistIds}
          apiBase={API_BASE}
          loading={loadingArrivals}
        />
      </div>

      {/* all products */}
      <div className="w-[95%] mx-auto py-4 sm:py-6">

        {/* header + sort */}
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5 flex items-center gap-1">
              <TrendingUp size={11} /> Discover
            </p>
            <h2
              className="font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
            >
              All Products
            </h2>
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 outline-none cursor-pointer hover:border-blue-300 transition-all"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 text-xs px-2.5 py-1.5 border border-gray-200 rounded-full outline-none focus:border-blue-300"
            />
            <span className="text-gray-400 text-xs">—</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 text-xs px-2.5 py-1.5 border border-gray-200 rounded-full outline-none focus:border-blue-300"
            />
          </div>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-2.5 py-1.5 outline-none cursor-pointer hover:border-blue-300"
          >
            <option value="">Any rating</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>

          <button
            onClick={() => setInStock((p) => !p)}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
              ${inStock ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
          >
            In stock
          </button>

          <button
            onClick={() => setReturnable((p) => !p)}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
              ${returnable ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
          >
            Free returns
          </button>

          {(minPrice || maxPrice || minRating || inStock || returnable) && (
            <button
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setMinRating("");
                setInStock(false);
                setReturnable(false);
              }}
              className="cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-all"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* skeleton */}
        {loadingAll && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-2.5 w-16 bg-gray-100 animate-pulse rounded-full" />
                  <div className="h-3 w-full bg-gray-100 animate-pulse rounded-full" />
                  <div className="h-3 w-3/4 bg-gray-100 animate-pulse rounded-full" />
                  <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* empty */}
        {!loadingAll && allProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-gray-700 font-semibold text-base">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* grid */}
        {!loadingAll && allProducts.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium mb-3 px-1">
              {allProducts.length} products
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {allProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  user={user}
                  apiBase={API_BASE}
                  initialWishlisted={wishlistIds.includes(product._id)}
                />
              ))}
            </div>
          </>
        )}

      </div>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}