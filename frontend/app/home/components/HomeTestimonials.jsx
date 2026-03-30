"use client";

import { Star } from "lucide-react";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Regular Customer",
            avatar: "👩‍🦰",
            rating: 5,
            text: "Best platform to find local stores! The variety and quality are amazing. Delivery is always on time.",
        },
        {
            name: "Raj Kumar",
            role: "Small Business Owner",
            avatar: "👨‍💼",
            rating: 5,
            text: "AuraShop helped me reach more customers in my locality. The interface is user-friendly and commission rates are fair.",
        },
        {
            name: "Neha Patel",
            role: "Happy Shopper",
            avatar: "👩‍🎓",
            rating: 5,
            text: "I love supporting local businesses through this platform. Great customer service and authentic products.",
        },
        {
            name: "Mohammad Khan",
            role: "Store Owner",
            avatar: "👨‍🍳",
            rating: 5,
            text: "AuraShop has been a game-changer for my business. More visibility, more customers, more sales!",
        },
    ];

    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        What Our <span className="text-blue-600">Community</span> Says
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Trusted by thousands of customers and local store owners
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill="#FBBF24"
                                        className="text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 mb-6 italic line-clamp-3">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-300">
                                <div className="text-3xl">{testimonial.avatar}</div>
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-blue-600">10K+</p>
                            <p className="text-gray-600">Happy Customers</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-blue-600">500+</p>
                            <p className="text-gray-600">Local Stores</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-blue-600">50K+</p>
                            <p className="text-gray-600">Products Listed</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold text-blue-600">4.8★</p>
                            <p className="text-gray-600">Average Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
