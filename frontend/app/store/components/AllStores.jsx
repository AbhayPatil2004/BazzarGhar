

"use client";

import React, { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
import { useAuth } from "../../context/Authcontext";

const StoresPage = () => {

    const { user } = useAuth();

    const [stores, setStores] = useState([]);
    const [allStores, setAllStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState({
        categories: [],
        premium: false,
        sort: "",
        maxPrice: 10000,
        delivery: 7
    });

    const categoriesList = [
        "electronics",
        "grocery",
        "fashion",
        "hardware",
        "pharmacy",
        "home & kitchen",
        "books",
        "sports",
        "beauty",
        "toys & games",
        "automotive",
        "pet supplies",
        "baby products",
        "jewelry",
        "music & instruments",
        "stationery",
        "health & wellness",
        "garden & outdoors",
        "office supplies",
        "footwear",
        "accessories",
        "travel & luggage",
        "art & craft"
    ];

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`);
                const data = await res.json();

                if (data.status === 200 || data.success) {
                    const fetchedStores = data.data || data.stores;
                    setStores(fetchedStores);
                    setAllStores(fetchedStores);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching stores:", error);
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    // Toggle category
    const toggleCategory = (cat) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter((c) => c !== cat)
                : [...prev.categories, cat]
        }));
    };

    // Apply Filters (frontend filtering)
    const applyFilters = async () => {
        try {
            setLoading(true);

            const queryParams = new URLSearchParams();

            if (filters.categories.length > 0) {
                queryParams.append("categories", filters.categories.join(","));
            }

            if (filters.premium) {
                queryParams.append("premium", true);
            }

            if (filters.sort) {
                queryParams.append("sort", filters.sort);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/store/filter?${queryParams.toString()}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await res.json();

            if (data.success || data.status === 200) {
                setStores(data.data || data.stores);
            }

            setOpen(false);
            setLoading(false);

        } catch (error) {
            console.error("Filter API Error:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Loading stores...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

            {/* HEADER WITH FILTER BUTTON */}
            <div className="flex items-center sm:items-center justify-between mb-6 gap-4">

                {/* Left Content */}
                <div className="flex-1">
                    <span className="text-[9px] sm:text-sm tracking-widest uppercase text-gray-500">
                        All Local
                    </span>

                    <h2 className="mt-1 text-base sm:text-3xl font-bold text-gray-900 leading-snug">
                        Explore More Stores on
                        <span className="text-blue-600 ml-1 sm:ml-2">BazzarGhar</span>
                    </h2>

                    <p className="mt-1 text-gray-600 text-[11px] sm:text-sm">
                        Browse all active and verified stores in your city.
                    </p>
                </div>

                {/* Add Filter Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="
            cursor-pointer
            px-3 sm:px-4
            py-1.5 sm:py-2
            text-xs sm:text-sm
            bg-[#0B1E3F]
            text-white
            rounded-md
            hover:bg-[#10294f]
            transition
            whitespace-nowrap
        "
                >
                    Add Filter
                </button>

            </div>

            {/* FILTER FORM */}
            {open && (
  <div className="mb-8 flex justify-center">
    <div className="
        w-full
        lg:max-w-3xl
        xl:max-w-2xl
        bg-white/90
        backdrop-blur-md
        border border-gray-200
        rounded-2xl
        shadow-xl
        p-6 sm:p-8
        space-y-8
        text-sm
        transition-all
    ">

      {/* Categories */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Select Categories
        </h2>

        <div className="flex flex-wrap gap-3">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                cursor-pointer
                px-4 py-2
                rounded-full
                text-xs
                font-medium
                transition-all duration-200
                border
                ${filters.categories.includes(cat)
                  ? "bg-[#0B1E3F] text-white border-[#0B1E3F] shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Premium */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="flex items-center gap-3 cursor-pointer w-full justify-between">
          <span className="text-sm font-medium text-gray-700">
            Premium Stores Only
          </span>

          <input
            type="checkbox"
            checked={filters.premium}
            onChange={(e) =>
              setFilters({ ...filters, premium: e.target.checked })
            }
            className="w-4 h-4 accent-[#0B1E3F] cursor-pointer"
          />
        </label>
      </div>

      {/* Sort */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Sort Stores
        </h2>

        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value })
          }
          className="
            cursor-pointer
            w-full
            border
            border-gray-200
            px-4
            py-2.5
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-[#0B1E3F]
            bg-white
            transition
          "
        >
          <option value="">Sort By</option>
          <option value="rating">Top Rated</option>
          <option value="products">Most Products</option>
          <option value="new">Newly Opened</option>
          <option value="mostOrders">Most Ordered</option>
          {user && <option value="nearby">Nearby</option>}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="
          cursor-pointer
          w-full
          bg-[#0B1E3F]
          hover:bg-[#10294f]
          text-white
          py-2.5
          rounded-xl
          font-medium
          transition-all
          duration-200
          hover:shadow-lg
          active:scale-95
        "
      >
        Apply Filters
      </button>

    </div>
  </div>
)}

            {/* STORE GRID */}
            {stores.length === 0 ? (
                <p className="text-gray-500 text-center">No stores available.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {stores.map((store) => (
                        <StoreCard key={store._id} store={store} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoresPage;