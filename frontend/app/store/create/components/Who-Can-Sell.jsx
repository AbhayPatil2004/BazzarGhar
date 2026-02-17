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
        <section className="bg-white py-14 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Who can sell on <span className="text-purple-700">BazzarGhar?</span>
                    </h2>
                    <p className="mt-3 text-gray-600">
                        If you run a local business or sell products, BazzarGhar is built for you.
                    </p>
                </div>

                {/* Seller Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-gray-200 bg-white p-6 
                            hover:shadow-md transition"
                        >
                            <div className="text-3xl">{item.icon}</div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <div className="mt-8 text-sm text-gray-500 max-w-3xl">
                    Don’t see your category listed? No worries — if you sell genuine products or services,
                    you can still open a  on Aura .
                </div>

            </div>
        </section>
    );
}

export default WhoCanSell;
