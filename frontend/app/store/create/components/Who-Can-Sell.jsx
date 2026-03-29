function WhoCanSell() {
    const sellers = [
        {
            title: "Kirana & Grocery s",
            desc: "Sell daily essentials to nearby customers and receive local orders easily.",
            icon: "🛒",
        },
        {
            title: "Clothing & Fashion Shops",
            desc: "Showcase clothes, footwear, and accessories to a wider local audience.",
            icon: "👗",
        },
        {
            title: "Mobile & Electronics",
            desc: "Sell mobile accessories, gadgets, and electronics with trusted verification.",
            icon: "📱",
        },
        {
            title: "Home Bakers & Food Sellers",
            desc: "Accept local orders for cakes, snacks, and homemade food products.",
            icon: "🍰",
        },
        {
            title: "Beauty, Cosmetics & Salons",
            desc: "Sell beauty products and accept bookings for local services.",
            icon: "💄",
        },
        {
            title: "Local Artisans & Handicrafts",
            desc: "Reach customers who value handmade and locally crafted products.",
            icon: "🎨",
        },
    ];

    return (
        <section className="bg-white py-16 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Who Can Sell on <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent font-semibold">BazzarGhar</span>?
                    </h2>
                    <p className="mt-4 text-gray-600 text-base">
                        We support all kinds of sellers. Your business journey starts here.
                    </p>
                </div>

                {/* Seller Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sellers.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8 hover:shadow-lg hover:border-blue-300 hover:scale-105 transition-all duration-300"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ What Happens Next?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                            <div>
                                <p className="font-semibold text-gray-900">Fill Your Profile</p>
                                <p className="text-sm text-gray-600 mt-1">Add store details, products, and rates</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                            <div>
                                <p className="font-semibold text-gray-900">Get Verified</p>
                                <p className="text-sm text-gray-600 mt-1">Complete simple verification process</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                            <div>
                                <p className="font-semibold text-gray-900">Start Selling</p>
                                <p className="text-sm text-gray-600 mt-1">Accept orders and grow your business</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-10 text-sm text-gray-600 max-w-3xl bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p><strong>💡 Tip:</strong> Don't see your category listed? No worries — if you sell genuine products or services, you can still open a store on BazzarGhar.</p>
                </div>

            </div>
        </section>
    );
}

export default WhoCanSell;
