import React from "react";
import { useAuth } from "@/app/context/Authcontext";

const CTASection = () => {

  const { user } = useAuth()

  if (user) {
    return (
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Journey with BazzarGhar Today
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Whether you want to sell your products or discover amazing items, BazzarGhar makes it easy and secure.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="/store/create"
              className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
            >
              Open Your Store
            </a>
            <a
              href="/home"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors duration-300"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-indigo-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Your Journey with BazzarGhar Today
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Whether you want to sell your products or discover amazing items, BazzarGhar makes it easy and secure.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="/auth/signup"
            className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            Get Started
          </a>
          <a
            href="/auth/login"
            className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
