"use client";

import { useRouter } from "next/navigation";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopStores() {
    const router = useRouter();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/stores?limit=6`,
                    { cache: "no-store" }
                );
                const data = await response.json();
                setStores(data.data?.slice(0, 6) || []);
            } catch (error) {
                console.error("Failed to fetch stores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const handleStoreClick = (storeId) => {
        router.push(`/store/${storeId}`);
    };

    if (loading) {
        return (
            <section className="w-full bg-gray-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Top <span className="text-blue-600">Local Stores</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg h-80 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-gray-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Top <span className="text-blue-600">Local Stores</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Discover trusted stores in your neighborhood
                    </p>
                </div>

                {stores.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No stores available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <div
                                key={store._id}
                                onClick={() => handleStoreClick(store._id)}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Store Image */}
                                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={store.image || "/placeholder.jpg"}
                                        alt={store.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                                </div>

                                {/* Store Info */}
                                <div className="p-5">
                                    {/* Store Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                        {store.name}
                                    </h3>

                                    {/* Category */}
                                    <p className="text-sm text-blue-600 font-semibold mb-3">
                                        {store.category || "General Store"}
                                    </p>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                        <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                                        <span className="line-clamp-1">{store.address || "Location N/A"}</span>
                                    </div>

                                    {/* Rating & Reviews */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < Math.floor(store.rating || 4) ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {store.rating || "4.5"} ({store.reviews?.length || 0})
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {store.description || "Quality products and excellent service"}
                                    </p>

                                    {/* Visit Button */}
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:gap-3">
                                        Visit Store
                                        <ArrowRight size={18} className="transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => router.push("/store/category")}
                        className="px-8 py-3 text-lg font-bold 
                                 text-blue-600 border-2 border-blue-600 
                                 rounded-xl hover:bg-blue-50 
                                 transition-all duration-200"
                    >
                        Explore All Stores
                    </button>
                </div>
            </div>
        </section>
    );
}
