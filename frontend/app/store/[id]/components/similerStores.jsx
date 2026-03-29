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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category }),
          }
        );

        const result = await res.json();

        if (result.success) {
          setStores(result.data.filter((s) => s._id !== storeId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [category, storeId]);

  if (!category) return null;

  return (
    <div className="w-full bg-gray-50 px-4 sm:px-8 py-12 border-t">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-full px-3 py-1 text-xs font-semibold mb-2">
            ● {category}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Similar to <span className="text-orange-500">{storeName}</span>
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            More stores you might like
          </p>
        </div>

        {!loading && stores.length > 0 && (
          <span className="text-xs font-semibold bg-white border rounded-full px-4 py-1 text-gray-600 shadow-sm">
            {stores.length} Store{stores.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">
          Discovering stores…
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No similar stores found in {category}.
        </div>
      ) : (
       <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,max-content))] justify-center gap-x-8 gap-y-8">
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}