"use client";
import { useEffect, useRef, useState } from "react";
import { Tag, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";

const MIN_SWIPE = 50;

// ── Discount badge overlay card wrapper ──
function DiscountCardWrapper({ product, user, apiBase, wishlistIds }) {
  const discountPct =
    product.discountPercentage ??
    (product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  return (
    <div className="relative">
      {/* Early delivery ribbon */}
      {product.isEarlyDelivery && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-0.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm pointer-events-none">
          <Zap size={8} />
          Fast delivery
        </div>
      )}

      {/* Discount badge */}
      {discountPct && discountPct > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow pointer-events-none">
          -{discountPct}%
        </div>
      )}

      <ProductCard
        product={product}
        user={user}
        apiBase={apiBase}
        initialWishlisted={wishlistIds.includes(product._id)}
      />
    </div>
  );
}

export default function MostDiscountedSection({ products, user, wishlistIds, apiBase, loading }) {
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

  return (
    <div className="w-full px-4 sm:px-6 py-5 sm:py-7">
      <SectionHeader
        badge="Best deals"
        badgeIcon={Tag}
        badgeColor="text-red-500"
        title="Most Discounted"
        seeAllHref="/product/products?sort=discount"
      />

      {/* ── Discount tier legend ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { label: "Up to 20% off", color: "bg-orange-50 text-orange-600 border-orange-200" },
          { label: "20–40% off",    color: "bg-red-50 text-red-600 border-red-200" },
          { label: "40%+ off",      color: "bg-rose-50 text-rose-700 border-rose-200" },
          { label: "⚡ Fast delivery", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        ].map((t) => (
          <span
            key={t.label}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${t.color}`}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* ── Skeleton ── */}
      {loading && (
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] flex flex-col rounded-2xl bg-white/60 border border-gray-100/50 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-100/60 animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-2.5 w-10 bg-red-100/60 animate-pulse rounded-full" />
                <div className="h-3 w-full bg-gray-100/60 animate-pulse rounded-full" />
                <div className="h-3 w-3/4 bg-gray-100/60 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Scroll row ── */}
      {!loading && products.length > 0 && (
        <div className="relative group/row">
          {/* Left arrow overlay */}
          {canLeft && (
            <button
              onClick={() => scrollBy(-1)}
              className="cursor-pointer hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/80 shadow-lg text-gray-700 hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-200 opacity-0 group-hover/row:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Right arrow overlay */}
          {canRight && (
            <button
              onClick={() => scrollBy(1)}
              className="cursor-pointer hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/80 shadow-lg text-gray-700 hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-200 opacity-0 group-hover/row:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Fade edges */}
          {canLeft && <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />}
          {canRight && <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />}

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scroll-smooth"
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
              <div key={product._id} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px]">
                <DiscountCardWrapper
                  product={product}
                  user={user}
                  apiBase={apiBase}
                  wishlistIds={wishlistIds}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && products.length === 0 && (
        <p className="text-sm text-gray-400 px-1">No discounted products right now.</p>
      )}
    </div>
  );
}
