"use client";

const genders = ["all", "men", "women", "kids", "unisex"];

export default function GenderFilter({ selectedGender, setSelectedGender }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        {genders.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGender(g)}
            className={`cursor-pointer px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold border transition-all duration-300 capitalize shadow-sm hover:shadow-md
              ${selectedGender === g
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-indigo-500/30 scale-105"
                : "bg-white/90 backdrop-blur-sm text-gray-600 border-gray-200/80 hover:border-indigo-300 hover:text-indigo-700 hover:bg-white"
              }`}
          >
            {g === "all" ? "All" : g}
          </button>
        ))}
      </div>
    </div>
  );
}
