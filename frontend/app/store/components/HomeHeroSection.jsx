"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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

export default function StoresHeroWithFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const defaultFilters = {
        categories: [],
        premium: false,
        sort: "",
        maxPrice: 10000,
        delivery: 120,
    };

    const [filters, setFilters] = useState(defaultFilters);

    // Load params once
    useEffect(() => {
        const cats = searchParams.get("categories");

        setQuery(searchParams.get("search") || "");

        setFilters({
            categories: cats ? cats.split(",") : [],
            premium: searchParams.get("premium") === "true",
            sort: searchParams.get("sort") || "",
            maxPrice: Number(searchParams.get("maxPrice")) || 10000,
            delivery: Number(searchParams.get("delivery")) || 120,
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const toggleCategory = (cat) => {
        setFilters((prev) => {
            const exists = prev.categories.includes(cat);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter((c) => c !== cat)
                    : [...prev.categories, cat],
            };
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (query.trim()) params.set("search", query.trim());
        if (filters.categories.length)
            params.set("categories", filters.categories.join(","));
        if (filters.premium) params.set("premium", "true");
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.maxPrice !== 10000)
            params.set("maxPrice", filters.maxPrice);
        if (filters.delivery !== 120)
            params.set("delivery", filters.delivery);

        router.push(`/stores?${params.toString()}`);
        setOpen(false);
    };

    const clearAll = () => {
        setFilters(defaultFilters);
        setQuery("");
        router.push("/stores");
    };

    return (
        <section className="w-full bg-gradient-to-br from-blue-50 to-white py-6">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Search + Filter Button */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center w-full bg-white rounded-full shadow-md border border-gray-200 px-2 py-1"
                >
                    {/* Icon */}
                    <Search size={18} className="text-gray-400 mx-2 shrink-0" />

                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Search stores, products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 outline-none text-sm"
                    />

                    {/* Add Filters */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer shrink-0 px-3 py-2 bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-900 transition"
                    >
                        {open ? "Close" : "Filters"}
                    </button>

                    {/* Search */}
                    <button
                        type="submit"
                        className="cursor-pointer shrink-0 ml-2 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* Filter Panel */}
                {open && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-lg space-y-6 text-sm">

                        {/* Categories */}
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 mb-2">Select Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {categoriesList.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        className={`cursor-pointer px-4 py-2 rounded-full border transition text-xs font-medium ${filters.categories.includes(cat)
                                            ? "bg-[#0B1E3F] text-white border-[#0B1E3F] shadow"
                                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Premium */}
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 mb-1">Premium Stores</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.premium}
                                    onChange={(e) =>
                                        setFilters({ ...filters, premium: e.target.checked })
                                    }
                                    className="w-4 h-4 accent-blue-600 rounded"
                                />
                                <span className="text-gray-700 text-sm">Show Premium Only</span>
                            </label>
                        </div>

                        {/* Sort */}
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 mb-1">Sort Stores</h2>
                            <select
                                value={filters.sort}
                                onChange={(e) =>
                                    setFilters({ ...filters, sort: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-md text-sm cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="">Sort By</option>
                                <option value="rating">Top Rated</option>
                                <option value="topSeller">Top Seller</option>
                                <option value="new">New Stores</option>
                                <option value="products">Most Products</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 mb-1">Max Price (₹)</h2>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters({ ...filters, maxPrice: e.target.value })
                                }
                                className="w-full cursor-pointer accent-blue-600"
                            />
                            <p className="text-gray-600 text-xs mt-1">Up to ₹{filters.maxPrice}</p>
                        </div>

                        {/* Delivery */}
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 mb-1">Delivery Time</h2>

                            <input
                                type="range"
                                min="1"
                                max="7"
                                value={filters.delivery}
                                onChange={(e) =>
                                    setFilters({ ...filters, delivery: e.target.value })
                                }
                                className="w-full cursor-pointer accent-blue-600"
                            />

                            <p className="text-gray-600 text-xs mt-1">
                                Under {filters.delivery} {filters.delivery === "1" ? "day" : "days"}
                            </p>
                        </div>

                        {/* Buttons */}
                        {/* <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={applyFilters}
                                className="cursor-pointer flex-1 bg-[#0B1E3F] text-white py-2 rounded-md text-sm font-medium hover:bg-[#10294f] transition"
                            >
                                Apply Filters
                            </button>

                            <button
                                type="button"
                                onClick={clearAll}
                                className="cursor-pointer flex-1 bg-red-500 text-white py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
                            >
                                Clear All
                            </button>
                        </div> */}

                    </div>
                )}



                <div className="mt-8 text-center md:text-left space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Discover Amazing{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
                            Stores
                        </span>{" "}
                        &{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
                            Products
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl">
                        Explore trusted local stores and shop high-quality products — all in one place.
                    </p>
                </div>

            </div>
        </section>
    );
} 