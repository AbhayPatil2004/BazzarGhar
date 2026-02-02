"use client";

import { useEffect, useState } from "react";

function StatCard({ title, value, icon, accent }) {
    return (
        <div className="relative rounded-xl bg-white border shadow-sm p-4 hover:shadow-md transition">
            {/* accent line */}
            <span
                className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accent}`}
            />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500">{title}</p>
                    <h2 className="text-2xl font-semibold mt-1 text-gray-900">
                        {value}
                    </h2>
                </div>

                <div className="text-xl text-gray-400">{icon}</div>
            </div>
        </div>
    );
}

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const result = await res.json();
                setStats(result.data);
            } catch (error) {
                console.error("Error fetching admin dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-20 rounded-xl bg-gray-100 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!stats) {
        return <p className="text-red-500">Failed to load dashboard stats</p>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">
                AURASTORE stats
            </h1>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Users"
                    value={stats.totalUsers}
                    icon="👥"
                    accent="bg-indigo-500"
                />

                <StatCard
                    title="Sellers"
                    value={stats.totalSellers}
                    icon="🛍️"
                    accent="bg-emerald-500"
                />

                <StatCard
                    title="Stores"
                    value={stats.totalStores}
                    icon="🏪"
                    accent="bg-blue-500"
                />

                <StatCard
                    title="Pending Stores"
                    value={stats.pendingStoreRequests}
                    icon="⏳"
                    accent="bg-amber-500"
                />

                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    icon="📦"
                    accent="bg-purple-500"
                />

                <StatCard
                    title="Orders Today"
                    value={stats.todaysOrders}
                    icon="🧾"
                    accent="bg-pink-500"
                />
            </div>
        </div>
    );

}
