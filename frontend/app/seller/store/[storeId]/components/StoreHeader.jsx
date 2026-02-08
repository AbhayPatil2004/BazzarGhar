"use client";
import { useRouter } from "next/navigation"

import { Sparkle, PlusCircle, BarChart2 } from "lucide-react";


export default function StoreWelcomeHeader({ onAddProduct, onViewStats }) {

  const router = useRouter()
  return (
    <section className="w-full flex justify-center px-4 mt-20 md:mt-5">
      <div className="w-full max-w-5xl bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 text-center">

        {/* Icon */}
        {/* <div className="flex justify-center mb-5">
          <div className="p-3 rounded-2xl bg-indigo-50">
            <Sparkle className="h-8 w-8 text-indigo-600" />
          </div>
        </div> */}

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Welcome to Your Store Dashboard
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Manage your products, monitor performance, and grow your business
          efficiently using powerful store management tools.
        </p>

        {/* Highlight stats/info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Fast Product Upload</p>
            <p className="text-gray-500 text-xs">Add items in seconds</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Advanced Analytics</p>
            <p className="text-gray-500 text-xs">Track store performance</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="font-semibold text-gray-800">Smart Visibility</p>
            <p className="text-gray-500 text-xs">Reach more customers</p>
          </div>
        </div>

        {/* Buttons */}
        {/* <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push(`/seller/store/${storeId}/add-product`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            <PlusCircle className="h-5 w-5" />
            Add Product
          </button>

          <button
            onClick={onViewStats}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
          >
            <BarChart2 className="h-5 w-5" />
            View Store Stats
          </button>
        </div> */}
      </div>
    </section>
  );
}
