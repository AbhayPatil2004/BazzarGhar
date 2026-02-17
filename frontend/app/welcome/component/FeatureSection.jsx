import React from "react";
import { ShoppingCart, Home, Shield, Users, TrendingUp, Headphones } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Home size={36} className="text-indigo-600" />,
      title: "Create Your Store Easily",
      description:
        "Set up your own online store in minutes. Customize your storefront, upload products, and start selling without technical hassle.",
    },
    {
      icon: <ShoppingCart size={36} className="text-indigo-600" />,
      title: "Buy and Sell Products",
      description:
        "A seamless platform for buyers and sellers. List products, explore new items, and make secure transactions all in one place.",
    },
    {
      icon: <Shield size={36} className="text-indigo-600" />,
      title: "Secure Payments & Transactions",
      description:
        "All payments are processed securely. Sellers receive timely payouts and buyers enjoy safe checkout with multiple payment options.",
    },
    {
      icon: <Users size={36} className="text-indigo-600" />,
      title: "Reach a Wider Audience",
      description:
        "Grow your customer base effortlessly. Your store is accessible to thousands of users actively looking for products like yours.",
    },
    {
      icon: <TrendingUp size={36} className="text-indigo-600" />,
      title: "Track Sales & Performance",
      description:
        "Get insights on sales, popular products, and customer engagement. Make data-driven decisions to grow your store and business.",
    },
    {
      icon: <Headphones size={36} className="text-indigo-600" />,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to help buyers and sellers with any questions or issues.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Why Choose BazzarGhar?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
