"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import CTASection from "../../welcome/component/CTASection";
import ProductHeroWithSearchOnly from "../components/Header";
import AllProductsSection from "../components/AllProductsSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, { credentials: "include", ...options });
  const text = await res.text();
  console.log(text)
  try { return JSON.parse(text); }
  catch { return null; }
};

function ProductsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialEarly = searchParams.get("isEarlyDelivery") === "true";
  const initialSearch = searchParams.get("search") || "";
  
  const [allProducts, setAllProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  
  const [sortOption, setSortOption] = useState(initialSort);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGender, setSelectedGender] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [returnable, setReturnable] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSortOption(searchParams.get("sort") || "newest");
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    safeFetch(`${API_BASE}/wishlist/ids`)
      .then((d) => setWishlistIds(d?.data?.ids || []));
  }, [user]);

  useEffect(() => {
    setLoadingAll(true);
    const params = new URLSearchParams();
    params.set("limit", "40");
    params.set("sort", sortOption);
    if (selectedGender && selectedGender !== "all") params.set("gender", selectedGender.toLowerCase());
    if (selectedCategory) params.set("category", selectedCategory);
    if (initialEarly) params.set("isEarlyDelivery", "true");
    if (initialSearch) params.set("search", initialSearch);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("rating", minRating);
    if (inStock) params.set("inStock", "true");
    if (returnable) params.set("isReturnable", "true");
    
    safeFetch(`${API_BASE}/product/products?${params.toString()}`)
      .then((d) => setAllProducts(d?.data?.products || []))
      .finally(() => setLoadingAll(false));
  }, [selectedGender, selectedCategory, sortOption, minPrice, maxPrice, minRating, inStock, returnable, initialEarly, initialSearch]);

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] text-slate-900 font-sans overflow-x-hidden">
      
      {/* ── SEARCH HEADER — FULL WIDTH ── */}
      <ProductHeroWithSearchOnly />

      <main className="w-full flex flex-col py-4 sm:py-6">
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/30">
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
        </div>
      </main>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-semibold mt-10">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
