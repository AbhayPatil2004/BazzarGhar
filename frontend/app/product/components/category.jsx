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
    <section className="w-full py-8 sm:py-12 space-y-10 sm:space-y-14">

      {/* ── Featured Slider ── */}
      <div className="w-full px-4 sm:px-6">

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
          <div className="flex items-center gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  isFeaturedPaused.current = true;
                  changeSlide(i);
                  setTimeout(() => { isFeaturedPaused.current = false; }, 3000);
                }}
                className={`cursor-pointer rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-8 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-blue-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* slide */}
        <div
          className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] cursor-pointer select-none group"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

          {/* text */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 md:p-12 text-white pointer-events-none z-10">
            <div>
              <p className="inline-block text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-2">
                BazzarGhar
              </p>
            </div>
            <div className="max-w-xl group-hover:translate-x-2 transition-transform duration-500 ease-out">
              <h2
                className="font-extrabold leading-tight mb-2 sm:mb-3 drop-shadow-md"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              >
                {category.name}
              </h2>
              <p
                className="text-white/90 max-w-sm line-clamp-3 mb-4 sm:mb-6 leading-relaxed"
                style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)" }}
              >
                {category.description}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleFeaturedClick(); }}
                className="pointer-events-auto cursor-pointer inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-gray-900 hover:bg-blue-50/90 active:scale-95 transition-all duration-300 rounded-full font-bold shadow-[0_8px_25px_rgba(0,0,0,0.15)] group/btn"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
              >
                Explore Now <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
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
      <div className="w-full px-4 sm:px-6">

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
              className="cursor-pointer group flex-shrink-0 flex flex-col items-center text-center gap-3 rounded-[1.5rem] border border-gray-100/60 bg-white/70 backdrop-blur-md hover:border-blue-200 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/50 hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.12)] transition-all duration-300 active:scale-95 px-4 py-5"
              style={{ minWidth: "100px" }}
            >
              <div
                className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50/80 group-hover:bg-white group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:-translate-y-1 transition-all duration-300"
                style={{ fontSize: "1.7rem" }}
              >
                {icon}
              </div>
              <p
                className="font-bold text-gray-600 group-hover:text-blue-700 leading-tight transition-colors duration-300 whitespace-nowrap"
                style={{ fontSize: "0.75rem" }}
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