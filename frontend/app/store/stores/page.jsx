"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StoreCard from "../components/StoreCard";
import { Search } from "lucide-react";

export default function StoresPage() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");
  const trending = searchParams.get("trending");
  const featured = searchParams.get("featured");
  const newly = searchParams.get("newly");
  const nearby = searchParams.get("nearby");

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const buildQuery = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (trending) params.append("trending", trending);
    if (featured) params.append("featured", featured);
    if (newly) params.append("newly", newly);
    if (nearby) params.append("nearby", nearby);

    return params.toString();
  };

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/store?${buildQuery()}`);
        const data = await res.json();
        setStores(data.data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [search, trending, featured, newly, nearby]);

  // 🔥 Detailed Heading Content
  const getHeadingData = () => {
    if (search) {
      return {
        tag: "Search Results",
        title: <>Showing results for <span className="text-blue-600">"{search}"</span></>,
        desc: "Explore stores that match your search. Discover products, ratings, and more from relevant sellers on BazzarGhar."
      };
    }

    if (trending) {
      return {
        tag: "Trending",
        title: <> Top Seller Stores on <span className="text-blue-600">BazzarGhar</span></>,
        desc: "These stores are currently popular based on sales, ratings, and customer engagement. Stay updated with what's trending."
      };
    }

    if (featured) {
      return {
        tag: "Featured",
        title: <> Featured Stores on <span className="text-blue-600">BazzarGhar</span></>,
        desc: "Handpicked premium stores offering top-quality products and services. Recommended for a better shopping experience."
      };
    }

    if (newly) {
      return {
        tag: "New",
        title: <> Newly Opened Stores on <span className="text-blue-600">BazzarGhar</span></>,
        desc: "Check out the latest stores that have joined our platform. Fresh arrivals with exciting products waiting to be explored."
      };
    }

    if (nearby) {
      return {
        tag: "Nearby",
        title: <> Stores Near You on <span className="text-blue-600">BazzarGhar</span></>,
        desc: "Find stores located in your city for faster delivery and better local shopping experience."
      };
    }

    return {
      tag: "All Stores",
      title: <>Browse All Stores on <span className="text-blue-600">BazzarGhar</span></>,
      desc: "Explore all available stores across categories. Discover products, compare options, and find what suits you best."
    };
  };

  const heading = getHeadingData();

  return (
    <div className="min-h-screen bg-white w-full">

      {/*  Heading Section */}
      <div className="px-2 sm:px-4 md:px-6 py-6 w-full">

        <span className="text-[10px] sm:text-xs tracking-widest uppercase text-gray-500">
          {heading.tag}
        </span>

        <h2 className="mt-1 text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {heading.title}
        </h2>

        <p className="mt-2 text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl">
          {heading.desc}
        </p>

        {!loading && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {stores.length} stores found
          </p>
        )}
      </div>

      {/* Content */}
      <div className="w-full px-2 sm:px-4 md:px-6 pb-10 w-full">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && stores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={50} className="text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">No stores found</h2>
            <p className="text-sm text-gray-500 mt-1">Try searching something else</p>
          </div>
        )}

        {/* Grid */}
        {!loading && stores.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
