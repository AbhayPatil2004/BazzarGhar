function HowItWorks() {
  return (
    <section className="mb-12 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          How Opening a Store <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Works</span>
        </h2>
        <p className="mt-3 text-gray-600 text-base">
          Launch your store on BazzarGhar in a few simple steps. We make sure every store is safe and verified.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Step 1 */}
        <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <span className="absolute -top-4 left-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md">
            Step 1
          </span>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
            📝
          </div>

          <h3 className="font-bold text-gray-900 text-lg">
            Fill Store Details
          </h3>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Enter your store name, description, products you sell, and store address. Upload your logo and banner to create your brand identity.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Store name & description</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Products you sell</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Store address</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <span className="absolute -top-4 left-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md">
            Step 2
          </span>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
            📤
          </div>

          <h3 className="font-bold text-gray-900 text-lg">
            Request Sent for Verification
          </h3>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Once you submit the form, your store request is sent to the admin team for review.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Store details are checked</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Product category review</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Policy & safety validation</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <span className="absolute -top-4 left-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md">
            Step 3
          </span>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
            🚀
          </div>

          <h3 className="font-bold text-gray-900 text-lg">
            Store Goes Live
          </h3>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            After successful verification, your store is approved and goes live on BazzarGhar. You can start adding products and receiving orders.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Store becomes publicly visible</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Add & manage products</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span>Start selling online</li>
          </ul>
        </div>

      </div>

      {/* Footer Note */}
      <div className="mt-10 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6 text-sm text-gray-800">
        <span className="text-lg">⏱️</span> <span className="font-bold text-gray-900">Verification Time:</span> Usually completed within 24–48 hours. You'll be notified once your store is approved.
      </div>

    </section>
  );
}


export default HowItWorks;
