"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";

export default function StoresOfMyCity() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [updateAddressRequired, setUpdateAddressRequired] = useState(false);
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchStores() {
      if (!user) return; // wait for auth

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/my-city`,
          { credentials: "include" }
        );

        const data = await res.json();

        // Backend sends 400 if user has no city in address
        if (res.status === 400 && data?.message === "Please update City") {
          setUpdateAddressRequired(true);
          return;
        }

        if (!res.ok) throw new Error(data?.message || "Something went wrong");

        setStores(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }

    fetchStores();
  }, [user]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  // --- UI States ---
  if (!user)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-600 mb-6">
          Create an account to see stores near you.
        </p>
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          Create Account
        </button>
      </div>
    );

  if (updateAddressRequired)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-2xl font-bold mb-4">Almost There!</h2>
        <p className="text-gray-600 mb-6">
          Update your address to discover stores in your city.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Update Address
        </button>
      </div>
    );

  if (!stores.length)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-gray-500">No stores found in your city yet.</p>
      </div>
    );

  return (
    <section className="py-16 bg-gray-50">
      <div className="mb-12 px-6 text-center sm:text-left">
        <span className="inline-block text-xs tracking-widest uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">
          Nearby
        </span>

        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Stores <span className="text-green-600">Near You</span>
        </h2>

        <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore active and verified stores available in your city.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-white/90 border shadow hover:scale-110 transition cursor-pointer"
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-white/90 border shadow hover:scale-110 transition cursor-pointer"
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-6"
        >
          {stores.map((store) => (
            <div
              key={store._id}
              onClick={() => router.push(`/store/${store._id}`)}
              className="min-w-[260px] lg:min-w-[280px] bg-white rounded-2xl border border-gray-100 shadow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative"
            >
              {store.banner?.trim() ? (
                <img
                  src={store.banner}
                  alt={store.storeName}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-44 bg-gray-100 rounded-t-2xl" />
              )}

              {store.logo && (
                <div className="absolute top-32 left-5">
                  <img
                    src={store.logo}
                    alt="logo"
                    className="w-14 h-14 rounded-xl border-4 border-white shadow-md object-cover bg-white"
                  />
                </div>
              )}

              <div className="p-5 pt-10">
                <span className="inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full mb-3">
                  {store.category || "General"}
                </span>

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition">
                  {store.storeName}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {store.rating && store.rating > 0
                    ? `⭐ ${store.rating.toFixed(1)} Rating`
                    : "New Store"}
                </p>
              </div>
            </div>
          ))}

          <div
            onClick={() => router.push("/store/stores?city=true")}
            className="min-w-[260px] lg:min-w-[280px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 transition-all duration-300 cursor-pointer group p-6"
          >
            <div className="text-4xl mb-3 animate-bounce">📍</div>
            <h3 className="text-lg font-semibold text-green-700 group-hover:scale-105 transition">
              Explore More
            </h3>
            <p className="text-sm text-green-500 mt-2">View all stores near you</p>
          </div>
        </div>
      </div>
    </section>
  );
}