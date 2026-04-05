"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import CTASection from "../welcome/component/CTASection";

import ProductHeroWithSearchOnly from "./components/Header";
import CategorySection from "./components/category";
import TrendingSection from "./components/TrendingSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import MostDiscountedSection from "./components/MostDiscountedSection";
import EarlyDeliverySection from "./components/EarlyDeliverySection";
import AllProductsSection from "./components/AllProductsSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, { credentials: "include", ...options });
  const text = await res.text();
  console.log(text)
  try { return JSON.parse(text); }
  catch { return null; }
};

export default function Page() {
  const { user } = useAuth();

  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [mostDiscounted, setMostDiscounted] = useState([]);
  const [earlyDelivery, setEarlyDelivery] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Gender filter — only for All Products section
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [returnable, setReturnable] = useState(false);

  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingArrivals, setLoadingArrivals] = useState(true);
  const [loadingDiscounted, setLoadingDiscounted] = useState(true);
  const [loadingEarly, setLoadingEarly] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    if (!user) return;
    safeFetch(`${API_BASE}/wishlist/ids`)
      .then((d) => setWishlistIds(d?.data?.ids || []));
  }, [user]);

  // These sections do NOT use gender filter
  useEffect(() => {
    setLoadingTrend(true);
    safeFetch(`${API_BASE}/product/products?sort=trending&limit=10`)
      .then((d) => setTrending(d?.data?.products || []))
      .finally(() => setLoadingTrend(false));
  }, []);

  useEffect(() => {
    setLoadingArrivals(true);
    safeFetch(`${API_BASE}/product/products?sort=newest&limit=8`)
      .then((d) => setNewArrivals(d?.data?.products || []))
      .finally(() => setLoadingArrivals(false));
  }, []);

  useEffect(() => {
    setLoadingEarly(true);
    safeFetch(`${API_BASE}/product/products?isEarlyDelivery=true&limit=10`)
      .then((d) => setEarlyDelivery(d?.data?.products || []))
      .finally(() => setLoadingEarly(false));
  }, []);

  useEffect(() => {
    setLoadingDiscounted(true);
    const earlyUrl = `${API_BASE}/product/products?sort=discount&limit=12&isEarlyDelivery=true`;
    const allDiscUrl = `${API_BASE}/product/products?sort=discount&limit=12`;
    safeFetch(earlyUrl).then(async (earlyData) => {
      const earlyProducts = earlyData?.data?.products || [];
      const allDiscData = await safeFetch(allDiscUrl);
      const allDisc = allDiscData?.data?.products || [];
      const seen = new Set(earlyProducts.map((p) => p._id));
      const merged = [...earlyProducts, ...allDisc.filter((p) => !seen.has(p._id))].slice(0, 14);
      setMostDiscounted(merged);
    }).finally(() => setLoadingDiscounted(false));
  }, []);

  // Only All Products uses gender + filters
  useEffect(() => {
    setLoadingAll(true);
    const params = new URLSearchParams();
    params.set("limit", "20");
    params.set("sort", sortOption);
    if (selectedGender && selectedGender !== "all") params.set("gender", selectedGender.toLowerCase());
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("rating", minRating);
    if (inStock) params.set("inStock", "true");
    if (returnable) params.set("isReturnable", "true");
    safeFetch(`${API_BASE}/product/products?${params.toString()}`)
      .then((d) => setAllProducts(d?.data?.products || []))
      .finally(() => setLoadingAll(false));
  }, [selectedGender, selectedCategory, sortOption, minPrice, maxPrice, minRating, inStock, returnable]);

  const handleCategoryClick = (cat) =>
    setSelectedCategory((prev) => (prev === cat ? "" : cat));

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] text-slate-900 font-sans overflow-x-hidden">

      {/* ── SEARCH HEADER — FULL WIDTH ── */}
      <ProductHeroWithSearchOnly />

      {/* ── CATEGORY STRIP ── */}
      <div className="w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <CategorySection
          onCategoryClick={handleCategoryClick}
          activeCategory={selectedCategory}
        />
      </div>

      {/* ── SECTIONS ── */}
      <main className="w-full flex flex-col py-4 sm:py-6">

        {/* TRENDING — warm rose/orange */}
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-white via-rose-50/50 to-orange-50/30">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
          <TrendingSection
            products={trending}
            user={user}
            wishlistIds={wishlistIds}
            apiBase={API_BASE}
            loading={loadingTrend}
          />
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

        {/* NEW ARRIVALS — purple/violet */}
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-violet-50/30">
          <div className="absolute -bottom-24 -right-12 w-56 h-56 bg-violet-200/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 left-1/3 w-40 h-40 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />
          <NewArrivalsSection
            products={newArrivals}
            user={user}
            wishlistIds={wishlistIds}
            apiBase={API_BASE}
            loading={loadingArrivals}
          />
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

        {/* EARLY DELIVERY — emerald/teal */}
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30">
          <div className="absolute -top-20 right-1/4 w-52 h-52 bg-emerald-200/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-8 w-44 h-44 bg-teal-200/10 rounded-full blur-3xl pointer-events-none" />
          <EarlyDeliverySection
            products={earlyDelivery}
            user={user}
            wishlistIds={wishlistIds}
            apiBase={API_BASE}
            loading={loadingEarly}
          />
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

        {/* MOST DISCOUNTED — red/pink */}
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-white via-red-50/50 to-pink-50/30">
          <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-pink-200/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-200/10 rounded-full blur-3xl pointer-events-none" />
          <MostDiscountedSection
            products={mostDiscounted}
            user={user}
            wishlistIds={wishlistIds}
            apiBase={API_BASE}
            loading={loadingDiscounted}
          />
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

        {/* STATIC FEATURES SECTION */}
        {/* <section className="w-full px-4 sm:px-6 py-10 sm:py-14 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">🚚</div>
              <h3 className="font-bold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-sm text-gray-500 leading-relaxed">On all orders above $50. Fast & reliable shipping to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-500 leading-relaxed">100% secure payment methods. Shop with complete confidence.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">✨</div>
              <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Curated products from top brands to ensure highest standards.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">🎧</div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Our dedicated team is always here to help you anytime you need.</p>
            </div>
          </div>
        </section> */}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

        {/* ALL PRODUCTS — indigo/blue (with gender filter inside) */}
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/30 pb-12">
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-indigo-200/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -left-12 w-56 h-56 bg-blue-200/10 rounded-full blur-3xl pointer-events-none" />
          <AllProductsSection
            products={allProducts}
            loading={loadingAll}
            user={user}
            wishlistIds={wishlistIds}
            apiBase={API_BASE}
            sortOption={sortOption} setSortOption={setSortOption}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            minRating={minRating} setMinRating={setMinRating}
            inStock={inStock} setInStock={setInStock}
            returnable={returnable} setReturnable={setReturnable}
            selectedGender={selectedGender} setSelectedGender={setSelectedGender}
          />
        </section>

      </main>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}