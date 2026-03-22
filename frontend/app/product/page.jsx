"use client";
import React, { useEffect, useState } from "react";
import ProductHeroWithSearchOnly from "./components/Header";
import CategorySection from "./components/category";
import ProductCard from "./components/ProductCard";
import { useAuth } from "../context/Authcontext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function Page() {
  const { user } = useAuth();

  const [products, setProducts]       = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading]         = useState(true);

  // fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/product/products?limit=20`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setProducts(data.data?.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // fetch wishlist IDs only if logged in
  useEffect(() => {
    if (!user) return;
    const fetchWishlistIds = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/wishlist/ids`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setWishlistIds(data.data?.ids || []);
      } catch (err) {
        console.error("Error fetching wishlist IDs:", err);
      }
    };
    fetchWishlistIds();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">

      <ProductHeroWithSearchOnly />
      <CategorySection />

      {/* All Products */}
      <div className="w-[95%] mx-auto py-6 sm:py-8">

        {/* section header */}
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5">
              Discover
            </p>
            <h2
              className="font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
            >
              All Products
            </h2>
          </div>
          {!loading && products.length > 0 && (
            <p className="text-xs text-gray-400 font-medium">
              {products.length} products
            </p>
          )}
        </div>

        {/* skeleton */}
        {loading && (
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

        {/* empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-gray-700 font-semibold text-base">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new arrivals</p>
          </div>
        )}

        {/* product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                user={user}
                apiBase={API_BASE}
                initialWishlisted={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Page;