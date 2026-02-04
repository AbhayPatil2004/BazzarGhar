"use client";

import { Sparkle, PlusCircle, BarChart2 } from "lucide-react";

export default function StoreWelcomeHeader({ onAddProduct, onViewStats }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-10 mb-8 text-center hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto">
      
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <Sparkle className="h-12 w-12 text-yellow-400 animate-pulse" />
      </div>

      {/* Gradient Welcome Text */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        Welcome!
      </h1>

      {/* Subtext */}
      <p className="mt-3 text-gray-600 text-lg">
        Manage your store and view all your products here.
      </p>

      {/* Quick Tip */}
      <p className="mt-2 text-gray-500 italic text-sm">
        Tip: High-quality images and accurate details help you sell faster!
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          <PlusCircle className="h-5 w-5" />
          Add Product
        </button>

        <button
          onClick={onViewStats}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
        >
          <BarChart2 className="h-5 w-5" />
          View Store Stats
        </button>
      </div>
    </div>
  );
}
