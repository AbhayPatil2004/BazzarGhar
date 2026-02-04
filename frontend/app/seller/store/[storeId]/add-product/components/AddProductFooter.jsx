"use client";

export default function AddProductFooter() {
  return (
    <div className="mt-12 bg-white border-t p-6 rounded-xl shadow-sm text-gray-700 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">

        {/* Left info */}
        <p className="text-sm text-gray-600">
          Need help? Check our <a href="/seller-guide" className="text-blue-600 hover:underline">Seller Guide</a>
        </p>

        {/* Center info */}
        <p className="text-sm text-gray-600">
          Tip: High-quality images and accurate details increase sales.
        </p>

        {/* Right info */}
        <p className="text-sm text-gray-500 hidden md:block">
          Powered by AuraStore
        </p>

      </div>
    </div>
  );
}
