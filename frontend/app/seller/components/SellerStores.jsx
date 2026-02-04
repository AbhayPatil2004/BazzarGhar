"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerStores() {
  const router = useRouter();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.value._id) {
      console.error("Owner not found in localStorage");
      setLoading(false);
      return;
    }

    async function fetchStores() {
      try {
        const res = await fetch(
          `http://localhost:8000/seller/owner/${user.value._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) setStores(data.data);
      } catch (error) {
        console.error("Fetch stores error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading stores...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Stores</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={() => router.push("/store/create")}
            className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
          >
            ➕ Add New Store
          </button>
        </div>
      </div>

      {/* No stores */}
      {filteredStores.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No stores found</p>
      )}

      {/* Store grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredStores.map((store) => (
          <div
            key={store._id}
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Logo */}
            <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              <img
                src={store.logo || "/default-store-logo.png"}
                alt={store.storeName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Store Name */}
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {store.storeName}
            </h3>

            {/* Product categories / names */}
            <div className="mb-4 flex flex-wrap gap-2">
              {store.storeProducts && store.storeProducts.length > 0 ? (
                store.storeProducts.map((product, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {product}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No products added</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-auto flex flex-col gap-2">
              <button
                onClick={() =>
                  router.push(`/seller/store/${store._id}/add-product`)
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
              >
                ➕ Add Product
              </button>
              <button
                onClick={() => router.push(`/seller/store/${store._id}`)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                🔍 View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
