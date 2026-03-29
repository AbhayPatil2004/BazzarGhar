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
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Earnings & Benefits on <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-semibold">BazzarGhar</span>
                    </h2>
                    <p className="mt-4 text-gray-600 text-base">
                        Simple, transparent, and designed to help local sellers grow their business.
                    </p>
                </div>

                {/* Benefit Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <div className="inline-block bg-blue-100 rounded-lg px-3 py-1 mb-4">
                                <p className="text-2xl font-extrabold text-blue-600">
                                    {item.value}
                                </p>
                                <p className="text-xs text-blue-700 font-semibold">{item.sub}</p>
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Example Earnings */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 max-w-3xl text-white">
                    <h3 className="text-2xl font-semibold">
                        💰 Average Monthly Earnings
                    </h3>
                    <p className="mt-2 text-blue-100 text-sm">
                        Typical earnings for local stores selling 5–10 products per day:
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur">
                            <p className="text-3xl font-bold text-white">₹20,000+</p>
                            <p className="text-sm text-blue-100 mt-1">Part-time Sellers</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur">
                            <p className="text-3xl font-bold text-white">₹50,000+</p>
                            <p className="text-sm text-blue-100 mt-1">Active Local Stores</p>
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-blue-100">
                        *Results vary based on product pricing, demand, location, and sales volume.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default EarningsAndBenefits;
