function EarningsAndBenefits() {
    const benefits = [
        {
            title: "Earn From Day One",
            desc: "Start receiving orders as soon as your store is verified and products are live.",
            value: "₹0",
            sub: "Joining Fee",
        },
        {
            title: "Higher Profit Margins",
            desc: "Sell directly to customers without middlemen or high platform commissions.",
            value: "Low",
            sub: "Commission",
        },
        {
            title: "Weekly Payouts",
            desc: "Your earnings are settled directly to your bank account every week.",
            value: "7 Days",
            sub: "Payout Cycle",
        },
        {
            title: "Local Visibility Boost",
            desc: "Get discovered by nearby customers searching for products in your area.",
            value: "Local",
            sub: "Customer Reach",
        },
    ];

    return (
        <section className="bg-gray-50 py-14 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Earnings & Benefits on <span className="text-purple-700">Aura Store</span>
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Simple, transparent, and designed to help local sellers grow steadily.
                    </p>
                </div>

                {/* Benefit Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl bg-white border border-gray-200 p-6"
                        >
                            <p className="text-3xl font-extrabold text-purple-700">
                                {item.value}
                            </p>
                            <p className="text-sm text-gray-500">{item.sub}</p>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Example Earnings (Optional but powerful) */}
                <div className="mt-12 rounded-2xl bg-white border border-gray-200 p-6 max-w-3xl">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Example Monthly Earnings
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        A local store selling 5–10 products per day at an average margin can earn:
                    </p>

                    <div className="mt-4 flex gap-6">
                        <div>
                            <p className="text-2xl font-bold text-purple-700">₹20,000+</p>
                            <p className="text-sm text-gray-500">Part-time sellers</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-700">₹50,000+</p>
                            <p className="text-sm text-gray-500">Active local stores</p>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        *Earnings depend on product pricing, demand, and location.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default EarningsAndBenefits;
