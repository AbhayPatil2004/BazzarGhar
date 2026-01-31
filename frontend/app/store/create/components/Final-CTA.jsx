function FinalCTA() {
    return (
        <section className="bg-white py-16 px-6 sm:px-10 border-t border-gray-100">
            <div className="max-w-5xl mx-auto text-center">

                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Bring your local store online with{" "}
                    <span className="text-purple-700">Aura Store</span>
                </h2>

                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    Create your store, get verified, and start selling to customers
                    around you — no setup cost, no technical knowledge required.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button className="
                        px-8 py-3 rounded-xl
                        bg-purple-700 text-white
                        font-semibold
                        hover:bg-purple-800 transition
                    ">
                        Open My Store
                    </button>

                    <button className="
                        px-8 py-3 rounded-xl
                        border border-gray-300
                        text-gray-800 font-semibold
                        hover:bg-gray-100 transition
                    ">
                        Talk to Support
                    </button>
                </div>

                {/* Trust line */}
                <p className="mt-6 text-sm text-gray-500">
                    100% free to start • Admin verified sellers • Weekly payouts
                </p>

            </div>
        </section>
    );
}

export default FinalCTA;
