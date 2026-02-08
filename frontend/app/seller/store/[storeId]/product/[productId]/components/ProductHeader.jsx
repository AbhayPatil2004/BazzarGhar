"use client";
import { useRouter } from "next/navigation";
import { Package, PlusCircle, Layers } from "lucide-react";

export default function ProductDashboardHeader({ storeId }) {
  const router = useRouter();

  return (
    <section className="w-full flex justify-center px-4 mt-20 md:mt-6">
      <div className="w-full max-w-5xl bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 text-center">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Product Management Dashboard
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Easily manage your store products, update pricing, monitor stock
          availability, and keep your catalog optimized for better sales.
        </p>

        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Quick Product Updates</p>
            <p className="text-gray-500 text-xs">Edit details instantly</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Stock Management</p>
            <p className="text-gray-500 text-xs">Track inventory levels</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Catalog Optimization</p>
            <p className="text-gray-500 text-xs">Improve product visibility</p>
          </div>
        </div>

        {/* Buttons */}
        {/* <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() =>
              router.push(`/seller/store/${storeId}/add-product`)
            }
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            <PlusCircle className="h-5 w-5" />
            Add Product
          </button>

          <button
            onClick={() =>
              router.push(`/seller/store/${storeId}/products`)
            }
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
          >
            <Layers className="h-5 w-5" />
            View All Products
          </button>
        </div> */}
      </div>
    </section>
  );
}
