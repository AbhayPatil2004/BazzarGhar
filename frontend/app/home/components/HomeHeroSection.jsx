// export default function HeroSection() {
//     return (
//         <section className="w-full bg-gradient-to-br from-blue-50 to-white">
//             <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">

//                 <div className="w-full text-center md:text-left space-y-4">

//                     {/* <h1 className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
//             Discover Amazing <span className="text-blue-600">Stores</span>
//             <br className="hidden sm:block" />
//             & Trending <span className="text-blue-600">Products</span>
//           </h1> */}

//                     <h1 className="w-full text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
//                         Discover Amazing <span className="text-blue-600">Stores</span> &
//                         <span className="text-blue-600"> Products</span>
//                     </h1>

//                     <p className="text-gray-600 text-base md:text-lg max-w-2xl">
//                         Explore trusted local stores and shop high-quality products all in one place.
//                     </p>

//                 </div>

//             </div>
//         </section>
//     );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSection() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        router.push(`/home/search?search=${query}`);
    };

    return (
        <section className="w-full bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16">

                {/* Search Bar – Top & Full Width */}

                <div className="w-full mb-10">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center w-full 
               bg-white rounded-full shadow-md 
               border border-gray-200 overflow-hidden"
                    >
                        {/* Icon */}
                        <div className="pl-3 sm:pl-5 text-gray-400">
                            <Search size={16} className="sm:w-5 sm:h-5" />
                        </div>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search stores, products, categories..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-2 sm:px-4 
                 py-2 sm:py-3 
                 outline-none text-gray-700 
                 placeholder-gray-400 
                 text-sm sm:text-base"
                        />

                        {/* Button */}
                        <button
                            type="submit"
                            className="cursor-pointer px-4 sm:px-8 
                 py-2 sm:py-3 
                 text-sm sm:text-base
                 bg-blue-600 text-white font-medium 
                 hover:bg-blue-700 transition-all duration-200"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Heading Section */}
                <div className="w-full text-center md:text-left space-y-4">
                    <h1 className="w-full text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                        Discover Amazing <span className="text-blue-600">Stores</span> &{" "}
                        <span className="text-blue-600">Products</span>
                    </h1>

                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                        Explore trusted local stores and shop high-quality products all in one place.
                    </p>
                </div>

            </div>
        </section>
    );
}