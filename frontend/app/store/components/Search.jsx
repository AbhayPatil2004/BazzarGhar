"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, Store, Package, MapPin, RotateCcw, Truck, BadgePercent } from "lucide-react";

export default function SearchWithHistory({
  user,
  token,
  apiBase,
  placeholder = "Search...",
  redirectPath = "/store/stores",
  fetchEndpoint = "/store/searchhistory",
  saveEndpoint = "/store/savesearchhistory",
  queryParam = "search",
  historyKey = "storeSearches",
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) setShowHistory(false);
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${apiBase}${fetchEndpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setHistory(
          Array.isArray(data.data?.[historyKey]) ? data.data[historyKey] : []
        );
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [user, token, apiBase, fetchEndpoint, historyKey]);

  const saveSearch = async (searchQuery) => {
    if (!user || !searchQuery.trim()) return;
    try {
      const res = await fetch(`${apiBase}${saveEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${redirectPath}?${queryParam}=${encodeURIComponent(query.trim())}`);
    saveSearch(query.trim());
    setShowHistory(false);
  };

  const handleHistoryClick = (item) => {
    setQuery(item);
    router.push(`${redirectPath}?${queryParam}=${encodeURIComponent(item)}`);
    saveSearch(item);
    setShowHistory(false);
  };

  const stats = [
    { icon: Store,   count: "500+", label: "Local Stores" },
    { icon: Package, count: "10k+", label: "Products"     },
    { icon: MapPin,  count: "50+",  label: "Cities"       },
  ];

  const features = [
    { icon: Store,        text: "Local vendors only" },
    { icon: Truck,        text: "Fast delivery"      },
    { icon: RotateCcw,    text: "Easy returns"       },
    { icon: BadgePercent, text: "Best local prices"  },
  ];

  return (
    <div className="w-full">

      {/* Hero */}
      <div
        className="relative w-full overflow-hidden shadow-[0_10px_40px_-10px_rgba(29,78,216,0.3)]"
        style={{
          background: "linear-gradient(135deg, #020617 0%, #1e3a8a 45%, #3730a3 75%, #2563eb 100%)",
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* LEFT — text + search */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] mb-5 hover:bg-white/15 transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase">
                India's Local Marketplace
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-extrabold leading-tight tracking-tight mb-3"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
                background: "linear-gradient(90deg, #ffffff 0%, #93c5fd 60%, #a5f3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              BazzarGhar
            </h1>

            {/* Description */}
            <p
              className="leading-relaxed mb-6 max-w-md"
              style={{
                fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
                color: "#93c5fd",
              }}
            >
              Discover thousands of local vendors from your city — clothes, food,
              home essentials and more, delivered straight to your doorstep at
              the best local prices.
            </p>

            {/* Search */}
            <div ref={wrapperRef} className="relative w-full max-w-lg group/search">
              <form
                onSubmit={handleSearch}
                className="flex items-center w-full bg-white/95 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30 overflow-hidden outline outline-4 outline-transparent focus-within:outline-blue-400/30 transition-all duration-300"
                style={{ padding: "6px 6px 6px 20px" }}
              >
                <Search size={18} className="text-blue-500 shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onFocus={() => setShowHistory(true)}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                  style={{ fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)", padding: "8px 4px" }}
                />
                <button
                  type="submit"
                  className="cursor-pointer shrink-0 font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    color: "white",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                    padding: "clamp(8px, 2vw, 10px) clamp(14px, 3vw, 22px)",
                  }}
                >
                  Search
                </button>
              </form>

              {/* Dropdown */}
              {user && showHistory && history.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 text-left">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Recent
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleHistoryClick(item)}
                        className="cursor-pointer px-3 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-300 transition-all duration-150"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tip */}
            <p
              className="mt-3 text-blue-400/80"
              style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.78rem)" }}
            >
              Try: "handmade bags" · "organic spices" · "cotton kurta"
            </p>
          </div>

          {/* RIGHT — hidden on mobile, visible on desktop only */}
          <div className="hidden lg:flex flex-1 flex-col gap-4">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ icon: Icon, count, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 py-5 px-3"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <Icon size={18} className="text-blue-300" />
                  <p
                    className="font-bold text-white leading-none"
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
                  >
                    {count}
                  </p>
                  <p className="text-blue-300 text-xs text-center">{label}</p>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-4"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
                    style={{ background: "rgba(99,130,255,0.25)" }}
                  >
                    <Icon size={15} className="text-blue-300" />
                  </div>
                  <span
                    className="text-white/80 font-medium"
                    style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.82rem)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Bottom features strip — mobile only */}
      <div className="lg:hidden w-full bg-white border-b border-gray-100 py-3 px-4">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-gray-500 text-xs font-medium"
            >
              <Icon size={13} className="text-blue-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}