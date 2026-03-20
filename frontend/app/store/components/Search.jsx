"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchWithHistory({
  user,
  token,
  apiBase,
  placeholder = "Search...",
  redirectPath = "/store/stores",
  fetchEndpoint = "/store/searchhistory",
  saveEndpoint = "/store/savesearchhistory",
  queryParam = "search",
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // Fetch history
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${apiBase}${fetchEndpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        const historyData = Array.isArray(data.data?.storeSearches)
          ? data.data.storeSearches
          : [];

        setHistory(historyData);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [user, token, apiBase, fetchEndpoint]);

  // Save search
  const saveSearch = async (searchQuery) => {
    if (!user || !searchQuery.trim()) return;

    try {
      const res = await fetch(`${apiBase}${saveEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save search");

      setHistory((prev) =>
        [searchQuery, ...prev.filter((q) => q !== searchQuery)].slice(0, 10)
      );
    } catch (err) {
      console.error("Error saving search:", err);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(
      `${redirectPath}?${queryParam}=${encodeURIComponent(query.trim())}`
    );

    saveSearch(query.trim());
    setShowHistory(false);
  };

  // Click history
  const handleHistoryClick = (item) => {
    setQuery(item);

    router.push(
      `${redirectPath}?${queryParam}=${encodeURIComponent(item)}`
    );

    saveSearch(item);
    setShowHistory(false);
  };

  return (
    <div ref={wrapperRef} className="w-full">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full bg-white rounded-full shadow-md border border-gray-200 px-2 py-1"
      >
        <Search size={18} className="text-gray-400 mx-2 shrink-0" />

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onFocus={() => setShowHistory(true)}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-2 py-2 outline-none text-sm"
        />

        <button
          type="submit"
          className="cursor-pointer ml-2 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* History Dropdown */}
      {user && showHistory && history.length > 0 && (
        <div className="mt-2 bg-white p-4 rounded-lg shadow-md text-sm border border-gray-200">
          <h3 className="text-gray-500 text-xs font-semibold mb-2">
            Recent Searches
          </h3>

          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={item}
                onClick={() => handleHistoryClick(item)}
                className="cursor-pointer px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 text-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ✅ Example Usage

/*
import SearchWithHistory from "../components/SearchWithHistory";
import { useAuth } from "../context/Authcontext";

export default function StoresPage() {
  const { user, token } = useAuth();

  return (
    <SearchWithHistory
      user={user}
      token={token}
      apiBase={process.env.NEXT_PUBLIC_API_URL}
      placeholder="Search stores..."
      redirectPath="/store/stores"
      fetchEndpoint="/store/searchhistory"
      saveEndpoint="/store/savesearchhistory"
      queryParam="search"
    />
  );
}
*/
