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
    <section className="pt-5 w-full overflow-hidden">
      {/* <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 shadow-2xl overflow-hidden"> */}

      {/* <div className="relative w-full rounded-3xl
  bg-gradient-to-br
  from-[#1e293b]
  via-[#0f172a]
  to-[#1e3a8a]
  py-6 sm:py-8 lg:py-10
  px-4 sm:px-6 lg:px-16
  shadow-2xl
  overflow-hidden"
> */}

      <div className="relative w-full 
  bg-gradient-to-br
  from-[#0f172a]
  via-[#111827]
  to-[#0f172a]
  py-6 sm:py-8 lg:py-10
  px-4 sm:px-6 lg:px-16
  shadow-xl
  overflow-hidden"
      >


        {/* Glow Effect */}
        <div className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

        {/* Heading */}
        {/* <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold mb-4 sm:mb-5 lg:mb-7 text-white tracking-tight">
          Top Sellers On{" "}
          <span className="text-blue-400 font-bold">
            Bazzarghar
          </span>
        </h1> */}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-white tracking-tight">
            Top Sellers On{" "}
            <span className="text-blue-400 font-bold">
              Bazzarghar
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-2xl">
            Discover the most trusted and highest-rated stores loved by thousands of customers.
          </p>
        </div>

        <div className="relative">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            className="
              hidden lg:flex
              absolute left-0 top-1/2 -translate-y-1/2
              z-20
              bg-white/10 hover:bg-white/20
              text-white
              p-3 rounded-full
              backdrop-blur-md
              cursor-pointer
              transition
            "
          >
            ◀
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            className="
              hidden lg:flex
              absolute right-0 top-1/2 -translate-y-1/2
              z-20
              bg-white/10 hover:bg-white/20
              text-white
              p-3 rounded-full
              backdrop-blur-md
              cursor-pointer
              transition
            "
          >
            ▶
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="
    flex gap-4 sm:gap-6
    overflow-x-auto
    overflow-y-hidden
    scroll-smooth
    scrollbar-hide
    px-8 lg:px-12
  "
          >
            {stores.map((store) => (
              <div
                key={store._id}
                onClick={() => router.push(`/store/${store._id}`)}
                className="
        min-w-[220px] sm:min-w-[250px] lg:min-w-[280px]
        bg-white/5 backdrop-blur-lg
        border border-white/10
        rounded-2xl
        overflow-hidden
        shadow-lg
        hover:shadow-blue-500/30
        hover:-translate-y-3
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
                    className="w-full h-32 sm:h-36 lg:h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 sm:h-36 lg:h-44 bg-white/10" />
                )}

                {/* Logo Overlay */}
                {store.logo && (
                  <div className="absolute top-24 left-4">
                    <img
                      src={store.logo}
                      alt="logo"
                      className="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover bg-white"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 pt-8">
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                    {store.storeName}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-400 mb-2">
                    ⭐ {store.rating} • {store.totalOrders} Orders
                  </p>

                  <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                    <span>{store.totalProducts} Products</span>
                    <span>{store.totalOrders} Orders</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Explore More Card */}
            <div
              onClick={() => router.push("/store/stores?topseller=true")}
              className="
      min-w-[220px] sm:min-w-[250px] lg:min-w-[280px]
      flex items-center justify-center
      rounded-2xl
      border border-blue-500/40
      bg-blue-500/10
      backdrop-blur-lg
      hover:bg-blue-500/20
      hover:shadow-blue-500/30
      transition-all duration-300
      cursor-pointer
      group
    "
            >
              <div className="text-center p-6">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-lg font-semibold text-blue-400 group-hover:scale-105 transition">
                  Explore All
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  View all top selling stores
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}