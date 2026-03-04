"use client";

import { useEffect, useState } from "react";
import { useOwner } from "../../../context/OwnerContext";
import StoreCard from "../../components/StoreCard";

export default function OwnerStores() {
    const { ownerId } = useOwner();

    const [stores, setStores] = useState([]);
    const [ownerName, setOwnerName] = useState("");

    useEffect(() => {
        if (!ownerId) return;

        const fetchOwnerName = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/seller/name/${ownerId}`
                );
                const result = await res.json();

                if (result.success) {
                    setOwnerName(result.data.sellerName);
                }
            } catch (err) {
                console.log("Owner name fetch error:", err);
            }
        };

        const fetchStores = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/store/owner/${ownerId}`
                );
                const result = await res.json();

                if (result.success) {
                    setStores(result.data);
                }
            } catch (err) {
                console.log("Store fetch error:", err);
            }
        };

        fetchOwnerName();
        fetchStores();
    }, [ownerId]);

    if (!ownerId) return null;

    return (
        <section className="mt-16 px-4 sm:px-6 lg:px-10 xl:px-20">

            {/* 🔥 Left Aligned Heading */}
            {ownerName && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            More from{" "}
                            <span className="text-blue-600">{ownerName}</span>
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Explore other stores by this seller on BazzarGhar
                        </p>
                    </div>

                    <div className="hidden sm:block text-sm text-gray-400 mt-2 sm:mt-0">
                        {stores.length} Stores
                    </div>

                </div>
            )}

            {/* Stores Section */}
            {stores.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">
                    No stores available.
                </p>
            ) : (
                <div className="grid 
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

