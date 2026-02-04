"use client";

export default function AddProductHeading() {
  return (
    <div className="mx-4 md:mx-10 lg:mx-20 mt-6 mb-8">
      <div className="rounded-2xl border bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6">
        {/* Label */}
        <span className="inline-block text-xs font-medium tracking-wide text-gray-500 uppercase">
          Add Product
        </span>

        {/* Main Heading */}
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
          Add a new product
        </h1>

        {/* Sub text */}
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
          Add product details, pricing, and images. You can edit everything later.
        </p>
      </div>
    </div>
  );
}
