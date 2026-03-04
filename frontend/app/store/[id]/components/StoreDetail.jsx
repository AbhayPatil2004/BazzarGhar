"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useOwner } from "../../../context/OwnerContext";

export default function StoreDetailsPage({ store, owner }) {
  const { setOwnerId } = useOwner();
  const router = useRouter();
  
  if (!store) return null;

  const renderStars = (rating = 0) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className="text-yellow-400 text-base sm:text-lg">
        {i < Math.round(rating) ? "★" : "☆"}
      </span>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-14">

      {/* HERO */}
      <div className="relative h-44 sm:h-60 md:h-80 w-full">
        <img
          src={store.banner || "/default-banner.jpg"}
          alt="Store Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-5">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 -mt-16 sm:-mt-20 relative z-10 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* LOGO */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={store.logo || "/default-logo.png"}
                alt="Store Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="text-center sm:text-left flex-1">

              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                <FaStore className="text-indigo-600" />
                {store.storeName}
              </h1>

              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 justify-center sm:justify-start">
                <MdCategory />
                {store.category}
              </p>

              <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                {renderStars(store.rating)}
                <span className="text-gray-500 text-sm ml-1">
                  ({store.rating?.toFixed(1)})
                </span>
              </div>

              <div className="flex gap-5 mt-3 text-sm text-gray-600 justify-center sm:justify-start">
                <span>🛒 {store.totalProducts}</span>
                <span>📦 {store.totalOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-3">About Store</h2>
          <p className="text-gray-600 leading-relaxed">
            {store.description || "No description available."}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Products We Sell</h2>

          <div className="flex flex-wrap gap-3">
            {store.storeProducts?.map((product, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
              >
                {product.replace(/"/g, "").trim()}
              </span>
            ))}
          </div>
        </div>

        {/* OWNER + ADDRESS */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">

          {/* OWNER */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Store Owner</h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow">
                <img
                  src={owner?.avatar || "/default-avatar.png"}
                  alt="Owner Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 text-sm">
                <h3 className="font-semibold">{owner?.username}</h3>

                <p className="text-gray-500 flex items-center gap-2">
                  <FaEnvelope className="text-indigo-500 text-xs" />
                  {owner?.email}
                </p>

                {owner?.phone && (
                  <p className="text-gray-500 flex items-center gap-2">
                    <FaPhoneAlt className="text-green-500 text-xs" />
                    {owner.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Store Address
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm">
              {store.address?.street}, <br />
              {store.address?.city}, {store.address?.state} <br />
              {store.address?.postalCode}, {store.address?.country}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <StatCard title="Commission" value={`${store.commissionRate}%`} />
          <StatCard title="Active" value={store.isActive ? "Yes" : "No"} />
          <StatCard title="Approved" value={store.isApproved ? "Yes" : "No"} />
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow text-center border">
      <p className="text-gray-500 text-xs uppercase">{title}</p>
      <p className="font-bold text-lg mt-1 capitalize">{value}</p>
    </div>
  );
}