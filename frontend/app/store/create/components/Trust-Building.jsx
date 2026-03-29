function TrustBuildingSection() {
  return (
    <section className="mb-10 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 shadow-sm">

      {/* Header */}
      {/* <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Open your store on <span className="text-black">AURAStore</span>
        </h2>
        <p className="mt-2 text-gray-600">
          Start your online store in minutes. We handle the tech, payments, and
          security — so you can focus on selling.
        </p>
      </div> */}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="group rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-8 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-300">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl flex-shrink-0">
              🔒
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-gray-900 text-lg">
                Safe & Verified Marketplace
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                All stores are reviewed to ensure trust, security, and a safe buying experience.
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-8 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-300">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl flex-shrink-0">
              💸
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-gray-900 text-lg">
                Zero Cost to Get Started
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                No setup fees or monthly charges. Pay only when you receive orders.
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-8 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-300">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl flex-shrink-0">
              🏪
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-gray-900 text-lg">
                Your Store, Your Brand
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Create a branded store with your logo, banner, and product listings.
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-8 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-300">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl flex-shrink-0">
              🇮🇳
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-gray-900 text-lg">
                Made for Indian Sellers
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Indian payments, local addresses, and seller-first customer support.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Trust Strip */}
      <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <p className="text-sm text-gray-700">
          <span className="text-lg">🚀</span> <span className="font-bold text-gray-900">Don't Worry:</span> You can edit store details, branding, and products anytime after opening your store.
        </p>

        <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md">
          ✓ Trusted Seller Platform
        </span>
      </div>

    </section>
  );
}

export default TrustBuildingSection;
