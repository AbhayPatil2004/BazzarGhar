"use client";

import { Truck, Shield, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CallToActionSection() {
    const router = useRouter();

    const features = [
        {
            icon: Truck,
            title: "Fast Delivery",
            description: "Quick delivery from stores near you",
        },
        {
            icon: Shield,
            title: "Secure Payments",
            description: "Safe and secure payment options",
        },
        {
            icon: Clock,
            title: "24/7 Support",
            description: "Customer support available round the clock",
        },
        {
            icon: MapPin,
            title: "Local Stores",
            description: "Shop from trusted local merchants",
        },
    ];

    return (
        <section className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 py-16 md:py-24 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center text-white group">
                                <div className="inline-block mb-4 p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                    <Icon size={32} className="group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-blue-100">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center text-white border border-white/20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Shop Local?
                    </h2>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of customers discovering amazing products from trusted local stores in your neighborhood.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push("/home/search")}
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Start Shopping
                        </button>
                        <button
                            onClick={() => router.push("/seller/apply")}
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                            Become a Seller
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
