import React from "react";
import { UserPlus, Box, CreditCard, ShoppingBag, TrendingUp, Headphones } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <UserPlus size={36} className="text-indigo-600" />,
      title: "1. Sign Up",
      description:
        "Create your free  account as a seller or buyer using your email, Google, or social login. Getting started is fast and secure.",
    },
    {
      icon: <Box size={36} className="text-indigo-600" />,
      title: "2. Set Up Your Store (For Sellers)",
      description:
        "Sellers can create their store in minutes. Add a store name, logo, banner, description, and policies. Customize it to reflect your brand.",
    },
    {
      icon: <ShoppingBag size={36} className="text-indigo-600" />,
      title: "3. Add Products",
      description:
        "Upload your products with images, descriptions, prices, stock info, and categories. Tag them for better visibility in search results.",
    },
    {
      icon: <CreditCard size={36} className="text-indigo-600" />,
      title: "4. Start Selling & Buying",
      description:
        "Buyers can explore products, add them to their cart, and checkout securely. Sellers can manage orders, shipments, and track payments easily.",
    },
    {
      icon: <TrendingUp size={36} className="text-indigo-600" />,
      title: "5. Grow & Analyze",
      description:
        "Monitor store performance, track sales trends, and optimize your offerings.  provides insights to help your business grow.",
    },
    {
      icon: <Headphones size={36} className="text-indigo-600" />,
      title: "6. 24/7 Support & Help",
      description:
        "Our dedicated support team is available around the clock to help buyers and sellers with any questions or issues, ensuring a smooth experience.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        How BazzarGhar Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-start bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
