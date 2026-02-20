"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`home/search/?search=${query}`);
  };

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-6">
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full bg-white rounded-full shadow-md border border-gray-200 overflow-hidden"
      >
        {/* Icon */}
        <div className="pl-5 text-gray-400">
          <Search size={20} />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search stores, products, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
        />

        {/* Button */}
        <button
          type="submit"
          className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
}