"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerStoresPage() {
    const router = useRouter();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?._id) {
            console.error("Owner not found in localStorage");
            setLoading(false);
            return;
        }

        async function fetchStores() {
            try {
                const res = await fetch(
                    `http://localhost:8000/store/my/${user._id}`,
                    {
                        credentials: "include"
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setStores(data.data);
                }
            } catch (error) {
                console.error("Fetch stores error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStores();
    }, []);

    if (loading) return <p>Loading stores...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
                My Stores
            </h1>

            {stores.length === 0 ? (
                <p className="text-gray-500">No stores found</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {stores.map((store) => (
                        <div
                            key={store._id}
                            className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Logo */}
                            <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                                <img
                                    src={store.logo}
                                    alt={store.storeName}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Store Name */}
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                {store.storeName}
                            </h3>

                            {/* Action */}
                            <button
                                onClick={() => router.push(`/store/${store._id}`)}
                                className="mt-auto w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium transition hover:bg-blue-700"
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>



    );
}
