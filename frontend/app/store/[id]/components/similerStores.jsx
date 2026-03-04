"use client";

import { useEffect, useState } from "react";
import StoreCard from "../../components/StoreCard";

export default function SimilarStores({ category, storeId, storeName }) {

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        const fetchStores = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/store/category`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ category }),
                    }
                );

                const result = await res.json();

                if (result.success) {
                    // ❌ current store remove karo
                    const filteredStores = result.data.filter(
                        (store) => store._id !== storeId
                    );

                    setStores(filteredStores);
                }

            } catch (err) {
                console.log("Similar store fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [category, storeId]);

    if (!category) return null;

    return (
        <section className="mt-16 px-4 sm:px-6 lg:px-10 xl:px-20">

            {/* Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Similar to{" "}
                        <span className="text-blue-600">{storeName}</span>
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Explore more stores in {category}
                    </p>
                </div>

                {!loading && (
                    <div className="hidden sm:block text-sm text-gray-400 mt-2 sm:mt-0">
                        {stores.length} Stores
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading ? (
                <p className="text-gray-500 text-sm">Loading stores...</p>
            ) : stores.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">
                    No similar stores found.
                </p>
            ) : (
                <div
                    className="grid 
                    grid-cols-2 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4 
                    xl:grid-cols-5 
                    gap-4 sm:gap-6"
                >
                    {stores.map((store) => (
                        <StoreCard key={store._id} store={store} />
                    ))}
                </div>
            )}
        </section>
    );
}