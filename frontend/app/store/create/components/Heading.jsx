function OpenStoreHeading() {
    return (
        <section
            className="
                mt-8 sm:mt-0
                relative mb-16 rounded-3xl 
                bg-gradient-to-br from-white to-blue-50 text-gray-900
                px-6 sm:px-12 pt-12 pb-16
                shadow-lg border border-blue-100
            "
        >

            <div className="
            max-w-7xl mx-auto 
            grid grid-cols-1 md:grid-cols-2 
            items-center gap-12
            ">

                {/* LEFT */}
                <div className="space-y-5">
                    <span className="
                    inline-flex items-center gap-2
                    rounded-full bg-blue-50 
                    text-blue-600
                    px-4 py-2 text-sm font-semibold mt-8 sm:mt-0 border border-blue-100">
                        🚀 New on BazzarGhar
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                        Launch your store on <br />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">BazzarGhar</span>
                    </h1>

                    <p className="text-gray-600 text-base max-w-lg">
                        Create your branded online store, get admin verified
                        and start selling across India — no tech setup required.
                    </p>

                    {/* HORIZONTAL STATS */}
                    <div className="flex gap-8 pt-2">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-2xl font-bold text-blue-600">2K+</p>
                            <p className="text-sm text-gray-600">Active Sellers</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-2xl font-bold text-blue-600">50K+</p>
                            <p className="text-sm text-gray-600">Live Products</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-2xl font-bold text-blue-600">0%</p>
                            <p className="text-sm text-gray-600">Setup Cost</p>
                        </div>
                    </div>

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-gray-100 px-3 py-1.5 rounded-full">⚡ 2-min setup</span>
                        <span className="bg-gray-100 px-3 py-1.5 rounded-full">🔒 Verified stores</span>
                        <span className="bg-gray-100 px-3 py-1.5 rounded-full">📦 Pan-India</span>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="relative flex justify-center md:justify-end">

                    <div className="
                    max-w-[380px] w-full
                    bg-white rounded-2xl 
                    border border-gray-200
                    shadow-xl p-3
                    ">

                        {/* Browser bar */}
                        <div className="flex gap-2 px-2 py-1">
                            <span className="w-3 h-3 bg-red-400 rounded-full" />
                            <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                            <span className="w-3 h-3 bg-green-400 rounded-full" />
                        </div>

                        <img
                            src="/torapril28.jpg"
                            alt="Store Preview"
                            className="rounded-xl"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default OpenStoreHeading;
