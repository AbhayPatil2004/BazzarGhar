"use client";

import React, { useEffect, useState } from "react";
import StoreCard from "./StoreCard";

const StoresPage = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`);
                const data = await res.json();

                if (data.status === 200 || data.success) {
                    setStores(data.data || data.stores);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stores:", error);
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Loading stores...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* Heading */}
            <div className="flex-1 text-center sm:text-left mb-6">
                {/* Small Subtitle */}
                <span className="text-[10px] sm:text-sm tracking-widest uppercase text-gray-500">
                    All Local
                </span>

                {/* Main Heading */}
                <h2 className="mt-1 text-lg sm:text-3xl font-bold text-gray-900 leading-tight flex justify-center sm:justify-start items-center flex-nowrap overflow-hidden">
                    Explore ALL Stores on<span className="text-blue-600 ml-1 sm:ml-2"> BazzarGhar</span>
                </h2>

                {/* Description */}
                <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                    Browse all active and verified stores in your city.
                </p>
            </div>

            {stores.length === 0 ? (
                <p className="text-gray-500 text-center">No stores available.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {stores.map((store) => (
                        <StoreCard key={store._id} store={store} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoresPage;