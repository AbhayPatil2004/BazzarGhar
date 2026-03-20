
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "../../context/Authcontext";

export default function StoresHeroWithSearchOnly() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, token } = useAuth();

    const [query, setQuery] = useState("");
    const [storeHistory, setStoreHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const wrapperRef = useRef(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // Load search param from URL
    useEffect(() => {
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    // Detect outside click
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (!wrapperRef.current) return;

        if (!wrapperRef.current.contains(event.target)) {
            setShowHistory(false);
        }
    };

    document.addEventListener("click", handleClickOutside, true); // 👈 capture phase

    return () => {
        document.removeEventListener("click", handleClickOutside, true);
    };
}, []);

    // Fetch store search history
    useEffect(() => {
        if (!user) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE}/store/searchhistory`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    console.error("Failed to fetch history:", res.status);
                    return;
                }

                const data = await res.json();

                const history = Array.isArray(data.data?.storeSearches)
                    ? data.data.storeSearches
                    : [];

                setStoreHistory(history);
            } catch (err) {
                console.error("Failed to fetch store search history:", err);
            }
        };

        fetchHistory();
    }, [user, token, API_BASE]);

    // Save search
    const saveStoreSearch = async (searchQuery) => {
        if (!user || !searchQuery.trim()) return;

        try {
            const res = await fetch(`${API_BASE}/store/savesearchhistory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: searchQuery }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to save store search");

            setStoreHistory((prev) =>
                [searchQuery, ...prev.filter((q) => q !== searchQuery)].slice(0, 10)
            );
        } catch (err) {
            console.error("Error saving store search:", err);
        }
    };

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        router.push(`/store/stores?search=${encodeURIComponent(query.trim())}`);
        saveStoreSearch(query.trim());
        setShowHistory(false);
    };

    // Click history
    const handleHistoryClick = (search) => {
        setQuery(search);
        router.push(`/store/stores?search=${encodeURIComponent(search)}`);
        saveStoreSearch(search);
        setShowHistory(false);
    };

    return (
        <section
            ref={wrapperRef}
            className="w-full bg-gradient-to-br from-blue-50 to-white py-6"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8"
            onClick={(e) => e.stopPropagation()}>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center w-full bg-white rounded-full shadow-md border border-gray-200 px-2 py-1"
                >
                    <Search size={18} className="text-gray-400 mx-2 shrink-0" />

                    <input
                        type="text"
                        placeholder="Search stores..."
                        value={query}
                        onFocus={() => setShowHistory(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 outline-none text-sm"
                    />

                    <button
                        type="submit"
                        className="cursor-pointer shrink-0 ml-2 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* History Dropdown */}
                {user && showHistory && storeHistory.length > 0 && (
                    <div className="mt-2 bg-white p-4 rounded-lg shadow-md text-sm border border-gray-200">
                        <h3 className="text-gray-500 text-xs font-semibold mb-2">
                            Recent Store Searches
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {storeHistory.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleHistoryClick(s)}
                                    className="cursor-pointer px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 text-xs"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

