import { notFound } from "next/navigation";

export default async function StoreDetailsPage({ id }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const result = await res.json();
  if (!result.success) return notFound();

  const { store, owner } = result.data;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i}>
        {i < Math.round(rating) ? "⭐" : "☆"}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      {/* HERO BANNER */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={store?.banner || "/default-banner.jpg"}
          alt="Store Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* STORE HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* LOGO */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={store?.logo || "/default-logo.png"}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* BASIC INFO */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {store.storeName}
                </h1>

                <p className="text-gray-500 mt-1">
                  {store.category}
                </p>

                <div className="flex justify-center sm:justify-start items-center gap-2 mt-2 text-sm">
                  {renderStars(store.rating)}
                  <span className="text-gray-500">
                    ({store.rating.toFixed(1)})
                  </span>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-600">
                  <span>{store.totalProducts} Products</span>
                  <span>{store.totalOrders} Orders</span>
                </div>
              </div>
            </div>

            {/* SUBSCRIPTION BADGE */}
            <div className="text-center">
              <span className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md">
                {store.subscriptionPlan.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">About Store</h2>
          <p className="text-gray-600 leading-relaxed">
            {store.description || "No description available."}
          </p>
        </div>

        {/* STORE PRODUCTS TAGS */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="flex flex-wrap gap-3">
            {store.storeProducts.map((product, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-indigo-100 transition"
              >
                {product.replace(/"/g, "").trim()}
              </span>
            ))}
          </div>
        </div>

        {/* ADDRESS + OWNER GRID */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Store Address</h2>
            <p className="text-gray-600 leading-relaxed">
              {store.address?.street}, <br />
              {store.address?.city}, {store.address?.state} <br />
              {store.address?.postalCode}, {store.address?.country}
            </p>
          </div>

          {/* OWNER */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Store Owner</h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow">
                <img
                  src={owner.avatar || "/default-avatar.png"}
                  alt="Owner Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-semibold">{owner.username}</h3>
                <p className="text-gray-500 text-sm">{owner.email}</p>
                {owner.phone && (
                  <p className="text-gray-500 text-sm">{owner.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Commission" value={`${store.commissionRate}%`} />
          <StatCard title="Active" value={store.isActive ? "Yes" : "No"} />
          <StatCard title="Approved" value={store.isApproved} />
          <StatCard
            title="Subscription"
            value={store.isSubscriptionActive ? "Active" : "Inactive"}
          />
        </div>

        {/* SUBSCRIPTION INFO */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
          <div className="text-gray-600 space-y-2 text-sm">
            <p>
              Start Date:{" "}
              {new Date(store.subscriptionStartDate).toLocaleDateString()}
            </p>
            <p>
              End Date:{" "}
              {new Date(store.subscriptionEndDate).toLocaleDateString()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow text-center hover:shadow-lg transition">
      <p className="text-gray-500 text-xs uppercase">{title}</p>
      <p className="font-bold text-lg mt-1 capitalize">{value}</p>
    </div>
  );
}