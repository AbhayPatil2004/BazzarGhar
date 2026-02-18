"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StoreRequests = () => {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false); // ✅ added

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/openingreq", {
          credentials: "include"
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const json = await res.json();
        const validStores = Array.isArray(json.data)
          ? json.data.filter(store => store.id || store._id)
          : [];
        setStores(validStores);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load store requests");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleAction = async (storeId, type) => {
    if (!storeId) return alert("Store ID missing");
    try {
      setActionLoading(true);
      const url =cursor-pointer 
        type === "approve"
          ? `http://localhost:8000/admin/accept/${storeId}`
          : `http://localhost:8000/admin/reject/${storeId}`;
      const res = await fetch(url, { method: "PATCH", credentials: "include" });
      const data = await res.json();
      if (data.statusCode !== 200) throw new Error(data.message);
      alert(`Store ${type}d successfully`);
      // Remove the store from the list after action
      setStores(prev => prev.filter(s => (s.id || s._id) !== storeId));
    } catch (err) {
      console.error(err);
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading store requests...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!stores.length)
    return (
      <div className="w-full flex justify-center py-16 px-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
            <span className="text-3xl">🏪</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No Store Requests
          </h2>

          <p className="text-gray-500 max-w-sm text-sm">
            There are currently no pending store opening requests. New requests will appear here once submitted.
          </p>
        </div>
      </div>

    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">
        Pending Store Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {stores.map((store, storeIndex) => {
          const storeId = store.id || store._id;
          return (
            <div
              key={storeId ?? `store-${storeIndex}`}
              className="group bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-5 border-b bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 group-hover:ring-indigo-300 transition">
                  <img
                    src={store.logo || "/default-store.png"}
                    alt={store.storeName || "Store"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{store.storeName || "Unnamed Store"}</h2>
                  <p className="text-sm text-gray-500">
                    Owned by <span className="font-medium text-gray-700">{store.ownerName || "Unknown"}</span>
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Products</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(store.products) && store.products.length > 0 ? (
                    store.products.map((product, idx) => (
                      <span
                        key={`${storeId}-${idx}`}
                        className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {product}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No products yet</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => storeId ? router.push(`/admin/store/${storeId}`) : alert("Store ID missing")}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAction(storeId, "approve")}
                  disabled={actionLoading}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(storeId, "reject")}
                  disabled={actionLoading}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreRequests;
