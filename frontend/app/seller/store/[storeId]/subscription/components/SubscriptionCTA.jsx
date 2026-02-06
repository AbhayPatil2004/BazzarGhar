"use client"

export function SubscriptionCTA() {

  const handleScroll = () => {
    const section = document.getElementById("subscription-plans");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-20 px-6 text-center text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Growing Your Store Today
        </h2>

        <p className="text-lg text-indigo-100 mb-8">
          Upgrade your subscription and unlock powerful tools to scale your
          online business faster than ever.
        </p>

        <button
          onClick={handleScroll}
          className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl shadow hover:scale-105 transition"
        >
          Upgrade Now
        </button>
      </div>
    </section>
  );
}
