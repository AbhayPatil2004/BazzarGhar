function HowItWorks() {
  return (
    <section className="mb-12 rounded-3xl border border-gray-200 bg-white p-8">

      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          How opening a store works
        </h2>
        <p className="mt-2 text-gray-600">
          Launch your store on  in a few simple steps. We make sure every
          store is safe and verified.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Step 1 */}
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <span className="absolute -top-4 left-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            Step 1
          </span>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/10 text-2xl">
            📝
          </div>

          <h3 className="font-semibold text-gray-900">
            Fill Store Details
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Enter your store name, description, products you sell, and store
            address. Upload your logo and banner to create your brand identity.
          </p>

          <ul className="mt-3 space-y-1 text-sm text-gray-500">
            <li>• Store name & description</li>
            <li>• Products you sell</li>
            <li>• Store address</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <span className="absolute -top-4 left-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            Step 2
          </span>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/10 text-2xl">
            📤
          </div>

          <h3 className="font-semibold text-gray-900">
            Request Sent for Verification
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Once you submit the form, your store request is sent to the 
            admin team for review.
          </p>

          <ul className="mt-3 space-y-1 text-sm text-gray-500">
            <li>• Store details are checked</li>
            <li>• Product category review</li>
            <li>• Policy & safety validation</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <span className="absolute -top-4 left-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            Step 3
          </span>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/10 text-2xl">
            🚀
          </div>

          <h3 className="font-semibold text-gray-900">
            Store Goes Live
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            After successful verification, your store is approved and goes live
            on BazzarGhar. You can start adding products and receiving orders.
          </p>

          <ul className="mt-3 space-y-1 text-sm text-gray-500">
            <li>• Store becomes publicly visible</li>
            <li>• Add & manage products</li>
            <li>• Start selling online</li>
          </ul>
        </div>

      </div>

      {/* Footer Note */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
        ⏱️ <span className="font-medium text-gray-900">Verification time:</span>{" "}
        Usually completed within 24–48 hours. You’ll be notified once your store
        is approved.
      </div>

    </section>
  );
}

export default HowItWorks;
