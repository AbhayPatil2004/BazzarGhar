"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddProduct from "./AddProduct";

export default function StoreDetailsWithAddProduct() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!storeId) return;

    const fetchStore = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/seller/store/${storeId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setStore(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  if (loading) {
    return <div className="p-6">Loading store details...</div>;
  }

  if (!store) {
    return <div className="p-6 text-red-500">Store not found</div>;
  }

  const productInfo =
    store.storeProducts?.length > 0
      ? `${store.storeProducts.length} products added`
      : "No products added yet";

  return (
    <div className="mx-4 md:mx-10 lg:mx-20 rounded-xl border overflow-hidden">
      {/* 🔥 Banner */}
      {store.banner && (
        <div className="h-56 sm:h-64 md:h-72 w-full relative">
          <img
            src={store.banner}
            alt="Store banner"
            className="h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              {store.logo && (
                <img
                  src={store.logo}
                  alt={store.storeName}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover border bg-white"
                />
              )}

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {store.storeName}
                </h1>
                <span className="inline-block mt-1 text-xs sm:text-sm text-white bg-black/60 px-3 py-1 rounded-full">
                  {productInfo}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA / Form */}
      <div className="p-4 sm:p-6">
        {showForm ? (
          <AddProduct storeId={storeId} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-lg bg-black text-white py-3 sm:py-4 text-base sm:text-lg font-semibold hover:opacity-90"
          >
            Add Product to {store.storeName}
          </button>
        )}
      </div>
    </div>
  );
}
