"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const featured = [
  { name: "Grocery",                slug: "grocery",        image: "/glocery.jpg",     description: "Fresh vegetables, fruits & daily essentials from local vendors."  },
  { name: "Fashion & Clothing",     slug: "fashion",        image: "/fashion.jpg",     description: "Trendy outfits and traditional wear from nearby stores."          },
  { name: "Electronics",            slug: "electronics",    image: "/electronics.jpg", description: "Mobiles, accessories & gadgets at best local prices."             },
  { name: "Home & Kitchen",         slug: "home-kitchen",   image: "/appliance.avif",  description: "Furniture, decor & kitchen essentials from trusted sellers."      },
  { name: "Medical & Pharmacy",     slug: "medical",        image: "/medical.jpg",     description: "Medicines and healthcare products from verified pharmacies."      },
  { name: "Books & Stationery",     slug: "books",          image: "/books.jpg",       description: "Educational books and office supplies from local shops."          },
  { name: "Sports & Fitness",       slug: "sports",         image: "/sports.jpg",      description: "Gym equipment and sports gear from nearby sellers."               },
  { name: "Beauty & Personal Care", slug: "beauty",         image: "/beauty.jpg",      description: "Cosmetics and grooming essentials from trusted brands."          },
  { name: "Hardware & Tools",       slug: "hardware",       image: "/harware.jpg",     description: "Construction materials and home improvement supplies."            },
  { name: "Bakery & Sweets",        slug: "bakery",         image: "/bakery.jpg",      description: "Fresh cakes and sweets from local shops."                        },
  { name: "Toys & Kids Store",      slug: "toys",           image: "/toys.jpg",        description: "Toys, baby products and kids essentials."                        },
];

const allCategories = [
  { label: "Grocery",          value: "grocery",         icon: "🛒" },
  { label: "Fashion",          value: "fashion",         icon: "👗" },
  { label: "Electronics",      value: "electronics",     icon: "📱" },
  { label: "Home & Kitchen",   value: "home-kitchen",    icon: "🏠" },
  { label: "Medical",          value: "medical",         icon: "💊" },
  { label: "Books",            value: "books",           icon: "📚" },
  { label: "Sports",           value: "sports",          icon: "⚽" },
  { label: "Beauty",           value: "beauty",          icon: "💄" },
  { label: "Hardware",         value: "hardware",        icon: "🔧" },
  { label: "Bakery",           value: "bakery",          icon: "🎂" },
  { label: "Toys & Kids",      value: "toys",            icon: "🧸" },
  { label: "Footwear",         value: "footwear",        icon: "👟" },
  { label: "Jewellery",        value: "jewellery",       icon: "💍" },
  { label: "Bags",             value: "bags",            icon: "👜" },
  { label: "Handicrafts",      value: "handicrafts",     icon: "🎨" },
  { label: "Kitchenware",      value: "kitchenware",     icon: "🍳" },
  { label: "Garden & Plants",  value: "garden",          icon: "🪴" },
  { label: "Stationery",       value: "stationery",      icon: "✏️" },
  { label: "Pet Supplies",     value: "pet-supplies",    icon: "🐾" },
  { label: "Automotive",       value: "automotive",      icon: "🚗" },
  { label: "Festive & Gifts",  value: "festive",         icon: "🪔" },
  { label: "Dairy & Eggs",     value: "dairy",           icon: "🥛" },
  { label: "Organic",          value: "organic",         icon: "🌿" },
  { label: "Clothing Rental",  value: "clothing-rental", icon: "👔" },
  { label: "Music & Hobbies",  value: "music-hobbies",   icon: "🎸" },
];

const MIN_SWIPE = 50;

export default function CategoriesSection() {
  const router = useRouter();

  // ── featured state ──
  const [index, setIndex]         = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const featuredTimer             = useRef(null);
  const isFeaturedPaused          = useRef(false);
  const featuredTouchStart        = useRef(null);
  const featuredTouchEnd          = useRef(null);

  // ── categories scroll state ──
  const scrollRef     = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const catTouchStart = useRef(null);
  const catTouchEnd   = useRef(null);

  // ── featured auto slide ──
  const startFeaturedAuto = useCallback(() => {
    if (featuredTimer.current) clearInterval(featuredTimer.current);
    featuredTimer.current = setInterval(() => {
      if (!isFeaturedPaused.current) {
        setIndex((prev) => {
          const next = (prev + 1) % featured.length;
          setPrevIndex(prev);
          setTimeout(() => setPrevIndex(null), 700);
          return next;
        });
      }
    }, 2500);
  }, []);

  useEffect(() => {
    startFeaturedAuto();
    return () => clearInterval(featuredTimer.current);
  }, [startFeaturedAuto]);

  // ── featured helpers ──
  const changeSlide = (newIndex) => {
    if (newIndex === index) return;
    setPrevIndex(index);
    setIndex(newIndex);
    setTimeout(() => setPrevIndex(null), 700);
  };

  const handleNext = () => {
    isFeaturedPaused.current = true;
    changeSlide((index + 1) % featured.length);
    setTimeout(() => { isFeaturedPaused.current = false; }, 3000);
  };

  const handlePrev = () => {
    isFeaturedPaused.current = true;
    changeSlide(index === 0 ? featured.length - 1 : index - 1);
    setTimeout(() => { isFeaturedPaused.current = false; }, 3000);
  };

  const handleFeaturedClick = () =>
    router.push(`/product/products?category=${featured[index].slug}`);

  const handleCategoryClick = (value) =>
    router.push(`/product/products?category=${value}`);

  // ── categories scroll arrows ──
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
  }, []);

  const scrollCats = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const category = featured[index];

  return (
    <section className="w-full bg-gray-50 py-6 sm:py-8 space-y-8 sm:space-y-10">

      {/* ── Featured Slider ── */}
      <div className="w-[95%] mx-auto">

        {/* header */}
        <div className="flex items-end justify-between mb-3 sm:mb-4 px-1">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5">
              Explore
            </p>
            <h2
              className="font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
            >
              Featured Categories
            </h2>
          </div>
          {/* dot indicators */}
          <div className="flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  isFeaturedPaused.current = true;
                  changeSlide(i);
                  setTimeout(() => { isFeaturedPaused.current = false; }, 3000);
                }}
                className={`cursor-pointer rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 h-2 bg-blue-600"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* slide */}
        <div
          className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-xl cursor-pointer select-none"
          onClick={handleFeaturedClick}
          onMouseEnter={() => { isFeaturedPaused.current = true;  }}
          onMouseLeave={() => { isFeaturedPaused.current = false; }}
          onTouchStart={(e) => {
            isFeaturedPaused.current   = true;
            featuredTouchStart.current = e.targetTouches[0].clientX;
          }}
          onTouchMove={(e) => {
            featuredTouchEnd.current = e.targetTouches[0].clientX;
          }}
          onTouchEnd={() => {
            if (!featuredTouchStart.current || !featuredTouchEnd.current) return;
            const diff = featuredTouchStart.current - featuredTouchEnd.current;
            if (Math.abs(diff) >= MIN_SWIPE) diff > 0 ? handleNext() : handlePrev();
            featuredTouchStart.current = null;
            featuredTouchEnd.current   = null;
            setTimeout(() => { isFeaturedPaused.current = false; }, 2000);
          }}
        >
          {/* current image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          />
          {/* prev image fade out */}
          {prevIndex !== null && (
            <img
              src={featured[prevIndex].image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
            />
          )}
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          {/* text */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-7 md:p-10 text-white pointer-events-none">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-widest">
                BazzarGhar
              </p>
              <div className="w-8 h-0.5 bg-blue-500 mt-1.5 rounded-full" />
            </div>
            <div>
              <h2
                className="font-bold leading-tight mb-1.5 sm:mb-2"
                style={{ fontSize: "clamp(1.5rem, 5vw, 3.2rem)" }}
              >
                {category.name}
              </h2>
              <p
                className="text-white/80 max-w-sm line-clamp-2 mb-3 sm:mb-5"
                style={{ fontSize: "clamp(0.75rem, 1.8vw, 1rem)" }}
              >
                {category.description}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleFeaturedClick(); }}
                className="pointer-events-auto cursor-pointer inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150 rounded-full font-semibold shadow-lg"
                style={{ fontSize: "clamp(0.72rem, 1.5vw, 0.875rem)" }}
              >
                Explore Now <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* prev / next — hidden on mobile */}
          {[
            { fn: handlePrev, Icon: ChevronLeft,  pos: "left-3 sm:left-5"   },
            { fn: handleNext, Icon: ChevronRight, pos: "right-3 sm:right-5" },
          ].map(({ fn, Icon, pos }) => (
            <button
              key={pos}
              onClick={(e) => { e.stopPropagation(); fn(); }}
              className={`cursor-pointer absolute top-1/2 -translate-y-1/2 ${pos}
                hidden sm:flex items-center justify-center
                bg-black/40 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-full
                hover:bg-blue-600 hover:scale-110 transition-all duration-200`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* ── All Categories ── */}
      <div className="w-[95%] mx-auto">

        {/* header */}
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5">
              Browse by
            </p>
            <h2
              className="font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
            >
              All Categories
            </h2>
          </div>
          {/* desktop arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCats(-1)}
              disabled={!canLeft}
              className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200
                ${canLeft
                  ? "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollCats(1)}
              disabled={!canRight}
              className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200
                ${canRight
                  ? "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onTouchStart={(e) => { catTouchStart.current = e.targetTouches[0].clientX; }}
          onTouchMove={(e)  => { catTouchEnd.current   = e.targetTouches[0].clientX; }}
          onTouchEnd={() => {
            if (!catTouchStart.current || !catTouchEnd.current) return;
            const diff = catTouchStart.current - catTouchEnd.current;
            if (Math.abs(diff) >= MIN_SWIPE) scrollCats(diff > 0 ? 1 : -1);
            catTouchStart.current = null;
            catTouchEnd.current   = null;
          }}
        >
          {allCategories.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryClick(value)}
              className="cursor-pointer group flex-shrink-0 flex flex-col items-center text-center gap-2 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md transition-all duration-200 active:scale-95 px-4 py-4"
              style={{ minWidth: "90px" }}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200"
                style={{ fontSize: "1.6rem" }}
              >
                {icon}
              </div>
              <p
                className="font-semibold text-gray-700 group-hover:text-blue-700 leading-tight transition-colors duration-150 whitespace-nowrap"
                style={{ fontSize: "0.72rem" }}
              >
                {label}
              </p>
            </button>
          ))}
        </div>

        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>

    </section>
  );
}