"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewlyOpenedStores() {
  const [stores, setStores] = useState([]);
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/newly-opened`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setStores(data.data);
        } else if (Array.isArray(data?.data?.stores)) {
          setStores(data.data.stores);
        } else {
          setStores([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      {/* Header */}
      <div className="mb-12 px-4 sm:px-6">
        <span className="inline-block text-xs tracking-widest uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full mb-4">
          Discover
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Newly Opened Stores on{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bazzarghar
          </span>
        </h2>

        <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
          Explore fresh and emerging stores that have recently joined
          <span className="font-semibold text-gray-800"> Bazzarghar</span>.
        </p>
      </div>

      <div className="relative">
        {/* Arrows */}
        <button
          onClick={scrollLeft}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-white/80 backdrop-blur border shadow-lg hover:scale-110 transition cursor-pointer"
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-white/80 backdrop-blur border shadow-lg hover:scale-110 transition cursor-pointer"
        >
          →
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-4 sm:px-6"
        >
          {stores.map((store) => (
            <div
              key={store._id}
              onClick={() => router.push(`/store/${store._id}`)}
              className="min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer group relative"
            >
              {/* Banner */}
              {store.banner?.trim() ? (
                <img
                  src={store.banner}
                  alt={store.storeName}
                  className="w-full h-44 object-cover rounded-t-3xl"
                />
              ) : (
                <div className="w-full h-44 bg-gray-100 rounded-t-3xl" />
              )}

              {/* Logo Overlay */}
              {store.logo && (
                <div className="absolute top-32 left-5">
                  <img
                    src={store.logo}
                    alt="logo"
                    className="w-14 h-14 rounded-xl border-4 border-white shadow-md object-cover bg-white"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 pt-10">
                <span className="inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full mb-3">
                  {store.category || "General"}
                </span>

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {store.storeName}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  ⭐ {store.rating } Rating
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Joined{" "}
                  {new Date(store.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {/* Explore More Card */}
          <div
            onClick={() =>
              router.push("/store/stores?newlyopened=true")
            }
            className="min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] flex items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center p-6">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-blue-700 group-hover:scale-105 transition">
                Explore More
              </h3>
              <p className="text-sm text-blue-500 mt-2">
                View all newly opened stores
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}