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

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  if (!stores.length) return null;

  return (
    <section className="py-5 bg-white">

      {/* Header */}
      <div className="mb-6 px-4 sm:px-6 flex items-center justify-between gap-3">

        <div className="flex-1">
          <span className="text-[10px] sm:text-xs tracking-widest uppercase text-gray-500">
            Discover
          </span>

          <h2 className="mt-1 text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
            Newly Opened Stores on{" "}
            <span className="text-blue-600">BazzarGhar</span>
          </h2>

          <p className="mt-1 text-gray-600 text-xs sm:text-sm">
            Explore fresh stores that recently joined our platform.
          </p>
        </div>

        <button
  onClick={() => router.push("/store/stores?featured=true")}
  className="
    cursor-pointer
    w-[40px] sm:w-[50px]
    h-[30px] sm:h-[34px]
    flex items-center justify-center
    bg-blue-800
    text-white
    rounded-full
    shadow
    hover:bg-blue-900
    transition
  "
>
  <span className="text-lg sm:text-xl leading-none">
    →
  </span>
</button>

      </div>

      <div className="relative">

        {/* Arrows */}
        <button
          onClick={scrollLeft}
          className="cursor-pointer hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 rounded-full bg-white border shadow hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={scrollRight}
          className="cursor-pointer hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 rounded-full bg-white border shadow hover:scale-110 transition"
        >
          ›
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-6"
        >
          {stores.map((store) => (
            <div
              key={store._id}
              onClick={() => router.push(`/store/${store._id}`)}
              className="w-[250px] h-[300px] flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-blue-100"
            >
              {/* Banner */}
              {store.banner?.trim() ? (
                <img
                  src={store.banner}
                  alt={store.storeName}
                  className="w-full h-28 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-28 bg-gray-200 rounded-t-xl" />
              )}

              {/* Logo */}
              {store.logo && (
                <div className="absolute top-16 left-4">
                  <img
                    src={store.logo}
                    alt="logo"
                    className="w-10 h-10 rounded-lg border-4 border-white shadow object-cover bg-white"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 pt-8 flex flex-col flex-grow">

                {/* Category */}
                <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full mb-2">
                  {store.category || "General"}
                </span>

                {/* Store Name */}
                <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition">
                  {store.storeName}
                </h3>

                {/* Rating + Joined (Same Row) */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>
                    📅 {new Date(store.createdAt).toLocaleDateString()}
                  </span>

                  <span>
                    ⭐ {store.rating?.toFixed(1) ?? "0.0"}
                  </span>

                  
                </div>

                {/* What Store Sells */}
                {store.storeProducts?.length > 0 && (
                  <p className="text-[11px] text-gray-600 mt-3 line-clamp-2">
                    <span className="font-medium text-blue-400">Sells:</span>{" "}
                    {store.storeProducts.slice(0, 4).join(", ")}
                    {store.storeProducts.length > 4 && " ..."}
                  </p>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}