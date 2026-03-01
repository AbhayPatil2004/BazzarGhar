"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopSellersPage() {
  const [stores, setStores] = useState([]);
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/top-seller`)
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
    scrollRef.current?.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-3 w-full overflow-hidden">
      <div
        className="
        relative w-full
        bg-gradient-to-br
        from-[#0f172a]
        via-[#111827]
        to-[#0f172a]
        py-4 sm:py-6
        px-3 sm:px-4 lg:px-8
        shadow-lg
        overflow-hidden
      "
      >
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full"></div>

        {/* Heading + Explore Button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-3xl font-semibold text-white tracking-tight">
              Top Sellers On{" "}
              <span className="text-blue-400 font-bold">Bazzarghar</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-xl">
              Discover the most trusted and highest-rated stores.
            </p>
          </div>

          {/* Explore More Button */}
          <div className=" sm:flex justify-center">
            <button
              onClick={() => router.push("/store/stores?topseller=true")}
              className="
    cursor-pointer
    bg-blue-600 hover:bg-blue-700
    text-white text-xs sm:text-sm
    px-3 sm:px-4 py-2
    rounded-full
    transition
    relative z-20
    w-[130px] sm:w-[150px]
  "
            >
              Top Seller →
            </button>
          </div>
        </div>

        <div className="relative">
          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            className="
          cursor-pointer
            hidden lg:flex
            absolute -left-3 top-1/2 -translate-y-1/2
            z-20
            bg-blue-600/80 hover:bg-blue-600
            text-white
            w-10 h-10
            items-center justify-center
            rounded-full
            shadow-md
            transition
          "
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            className="
          cursor-pointer
            hidden lg:flex
            absolute -right-3 top-1/2 -translate-y-1/2
            z-20
            bg-blue-600/80 hover:bg-blue-600
            text-white
            w-10 h-10
            items-center justify-center
            rounded-full
            shadow-md
            transition
          "
          >
            ›
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="
            flex gap-3 sm:gap-4
            overflow-x-auto
            scroll-smooth
            scrollbar-hide
            px-1
          "
          >
            {stores.map((store) => (
              <div
                key={store._id}
                onClick={() => router.push(`/store/${store._id}`)}
                className="
                min-w-[200px] sm:min-w-[230px] lg:min-w-[260px]
                bg-white/5 backdrop-blur-lg
                border border-white/10
                rounded-xl
                overflow-hidden
                hover:-translate-y-2
                transition-all duration-300
                cursor-pointer
                relative
                group
              "
              >
                {/* Banner */}
                {store.banner?.trim() ? (
                  <img
                    src={store.banner}
                    alt={store.storeName}
                    className="w-full h-28 sm:h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 sm:h-32 bg-white/10" />
                )}

                {/* Logo */}
                {store.logo && (
                  <div className="absolute top-20 left-3">
                    <img
                      src={store.logo}
                      alt="logo"
                      className="w-10 h-10 rounded-lg border-2 border-white shadow-md object-cover bg-white"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-3 pt-6">
                  <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition">
                    {store.storeName}
                  </h2>

                  {/* Rating + Orders */}
                  <div className="flex items-center gap-2 text-xs text-gray-200 mt-1">
                    <span>⭐ {store.rating?.toFixed(1) ?? "0.0"}</span>
                    <span className="text-gray-400">•</span>
                    {/* <span>{store.totalOrders} Orders</span> */}
                  </div>

                  {/* Products + Orders */}
                  <div className="flex justify-between text-xs text-gray-300 mt-2">
                    <span>{store.totalProducts} Products</span>
                    <span>{store.totalOrders} Orders</span>
                  </div>

                  {/* Store Products */}
                  {store.storeProducts?.length > 0 && (
                    <p className="text-xs text-gray-200 mt-3 line-clamp-2">
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
      </div>
    </section>
  );


}