import React from "react";
import { ShoppingCart, Home, Shield, Users, TrendingUp, Headphones } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Home size={40} className="text-blue-600" />,
      title: "Create Your Store Easily",
      description:
        "Set up your own online store in minutes. Customize your storefront, upload products, and start selling without technical hassle.",
    },
    {
      icon: <ShoppingCart size={40} className="text-blue-600" />,
      title: "Buy and Sell Products",
      description:
        "A seamless platform for buyers and sellers. List products, explore new items, and make secure transactions all in one place.",
    },
    {
      icon: <Shield size={40} className="text-blue-600" />,
      title: "Secure Payments & Transactions",
      description:
        "All payments are processed securely. Sellers receive timely payouts and buyers enjoy safe checkout with multiple payment options.",
    },
    {
      icon: <Users size={40} className="text-blue-600" />,
      title: "Reach a Wider Audience",
      description:
        "Grow your customer base effortlessly. Your store is accessible to thousands of users actively looking for products like yours.",
    },
    {
      icon: <TrendingUp size={40} className="text-blue-600" />,
      title: "Track Sales & Performance",
      description:
        "Get insights on sales, popular products, and customer engagement. Make data-driven decisions to grow your store and business.",
    },
    {
      icon: <Headphones size={40} className="text-blue-600" />,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to help buyers and sellers with any questions or issues.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">BazzarGhar?</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to succeed as a buyer or seller, all in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-50"
            >
              <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
