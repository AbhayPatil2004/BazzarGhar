import React from "react";

export default function SubscriptionHero() {
  return (
    <section className="relative bg-white pt-16 md:pt-24 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center lg:text-left">

        <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
          Aurastore Pricing
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Choose the Perfect Plan for{" "}
          <span className="text-indigo-600">Your Store Growth</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
          Unlock powerful selling tools, advanced analytics, premium themes,
          and marketing features designed to help your online business grow
          faster and smarter with Aurastore.
        </p>

        {/* Added Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 max-w-2xl">
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 text-xl">✔</span>
            <p>Unlimited product listings</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-indigo-600 text-xl">✔</span>
            <p>Advanced store analytics</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-indigo-600 text-xl">✔</span>
            <p>Premium store themes</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-indigo-600 text-xl">✔</span>
            <p>Priority customer support</p>
          </div>
        </div>

      </div>
    </section>
  );
}
