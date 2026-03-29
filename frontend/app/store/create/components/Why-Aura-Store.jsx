function WhyAura() {
    const reasons = [
        {
            title: "Built for Local s",
            desc: "BazzarGhar helps local shops go online and get discovered by nearby customers first.",
            icon: "🏪",
        },
        {
            title: "Admin Verified Sellers",
            desc: "Every  is verified by our admin team, building trust with customers.",
            icon: "✅",
        },
        {
            title: "Zero Upfront Cost",
            desc: "No joining fees or hidden charges. Start selling without any initial investment.",
            icon: "💸",
        },
        {
            title: "Easy  Setup",
            desc: "Create your , add products, and go live in just a few minutes.",
            icon: "⚡",
        },
        {
            title: "Fast & Secure Payments",
            desc: "Get paid directly to your bank account with secure and reliable payouts.",
            icon: "🔐",
        },
        {
            title: "Local + Online Reach",
            desc: "Sell to nearby customers or expand your reach across cities and states.",
            icon: "📦",
        },
    ];

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Why sell on <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-semibold">BazzarGhar ?</span>
                    </h2>
                    <p className="mt-3 text-gray-600 text-base">
                        Everything you need to run and grow your local business online — without complexity.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 
                            hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:scale-105"
                        >
                            <div className="text-4xl bg-blue-100 rounded-lg p-3 inline-block">{item.icon}</div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default WhyAura;
