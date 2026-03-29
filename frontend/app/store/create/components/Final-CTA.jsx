function FinalCTA() {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-20 px-6 sm:px-10">
            <div className="max-w-5xl mx-auto text-center">

                <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
                    Ready to grow your business?
                </h2>

                <p className="mt-6 text-blue-100 max-w-2xl mx-auto text-lg">
                    Join thousands of successful sellers on BazzarGhar. Create your store, get verified, and start selling — all for free.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <button className="
                        px-8 py-4 rounded-xl
                        bg-white text-blue-600
                        font-semibold shadow-lg
                        hover:shadow-xl hover:scale-105
                        transition-all duration-300 
                        cursor-pointer
                    ">
                        Open My Store Now
                    </button>

                    <button className="
                        px-8 py-4 rounded-xl
                        border-2 border-white
                        text-white font-semibold
                        hover:bg-white hover:bg-opacity-10
                        transition-all duration-300
                        cursor-pointer
                    ">
                        Chat with Support
                    </button>
                </div>

                {/* Trust line */}
                <p className="mt-8 text-blue-100 text-sm">
                    ✅ 100% free • 📋 Quick verification • 💰 Weekly payouts • 🔒 Secure payments
                </p>

            </div>
        </section>
    );
}

export default FinalCTA;
