import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/Authcontext'

function HeroSection() {

    const { user, setUser } = useAuth()

    if (user) {
        return (
            <section className="relative overflow-hidden bg-white">
                {/* Decorative blur (very subtle now) */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-100 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 py-24 text-gray-900">

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-20">

                        {/* LEFT */}
                        <div className="text-center md:text-left">
                            <span className="inline-block mb-4 rounded-full bg-indigo-100 text-indigo-700 px-4 py-1 text-sm font-medium">
                                🚀 Built for Local Businesses
                            </span>

                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                Empower Local Vendors. <br />
                                <span className="text-indigo-600">Shop Smarter.</span>
                            </h1>

                            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
                                BazzarGhar helps local vendors launch their own online store and sell
                                directly to customers in their city — fast, simple, and secure.
                            </p>

                            {/* CTA */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a
                                    href="/store/create"
                                    className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                                >
                                    Open Your Store
                                </a>

                                <a
                                    href="/home"
                                    className="px-8 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition"
                                >
                                    Start Shopping
                                </a>
                            </div>

                            {/* FEATURE POINTS */}
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                    🏪 <p className="mt-2 font-semibold">Your Own Store</p>
                                    <p className="text-gray-500">No marketplace limits</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                    📍 <p className="mt-2 font-semibold">Local First</p>
                                    <p className="text-gray-500">Sell in your city</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                    🔒 <p className="mt-2 font-semibold">Secure Payments</p>
                                    <p className="text-gray-500">Fast & trusted checkout</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT IMAGE (BIG) */}
                        <div className="relative flex justify-center md:justify-end">
                            <div className="relative rounded-3xl bg-white p-4 shadow-2xl">
                                <img
                                    src="/herologo.jpg"
                                    alt=" Ecommerce"
                                    className="w-full max-w-xl md:max-w-2xl object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* STATS BAR */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-indigo-600">10K+</p>
                            <p className="text-gray-500">Vendors</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-indigo-600">50+</p>
                            <p className="text-gray-500">Cities</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-indigo-600">1M+</p>
                            <p className="text-gray-500">Products</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-indigo-600">24×7</p>
                            <p className="text-gray-500">Support</p>
                        </div>
                    </div>

                </div>
            </section>
        )
    }


    return (
        <section className="relative overflow-hidden bg-white">
            {/* Decorative blur (very subtle now) */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-100 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 py-24 text-gray-900">

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-20">

                    {/* LEFT */}
                    <div className="text-center md:text-left">
                        <span className="inline-block mb-4 rounded-full bg-indigo-100 text-indigo-700 px-4 py-1 text-sm font-medium">
                            🚀 Built for Local Businesses
                        </span>

                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Empower Local Vendors. <br />
                            <span className="text-indigo-600">Shop Smarter.</span>
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
                            BazzarGhar helps local vendors launch their own online store and sell
                            directly to customers in their city — fast, simple, and secure.
                        </p>

                        {/* CTA */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a
                                href="/auth/signup"
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                            >
                                Get Started
                            </a>

                            <a
                                href="/auth/login"
                                className="px-8 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition"
                            >
                                Login
                            </a>
                        </div>

                        {/* FEATURE POINTS */}
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                🏪 <p className="mt-2 font-semibold">Your Own Store</p>
                                <p className="text-gray-500">No marketplace limits</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                📍 <p className="mt-2 font-semibold">Local First</p>
                                <p className="text-gray-500">Sell in your city</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                🔒 <p className="mt-2 font-semibold">Secure Payments</p>
                                <p className="text-gray-500">Fast & trusted checkout</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE (BIG) */}
                    <div className="relative flex justify-center md:justify-end">
                        <div className="relative rounded-3xl bg-white p-4 shadow-2xl">
                            <img
                                src="/herologo.jpg"
                                alt=" Ecommerce"
                                className="w-full max-w-xl md:max-w-2xl object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* STATS BAR */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <p className="text-3xl font-bold text-indigo-600">10K+</p>
                        <p className="text-gray-500">Vendors</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <p className="text-3xl font-bold text-indigo-600">50+</p>
                        <p className="text-gray-500">Cities</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <p className="text-3xl font-bold text-indigo-600">1M+</p>
                        <p className="text-gray-500">Products</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <p className="text-3xl font-bold text-indigo-600">24×7</p>
                        <p className="text-gray-500">Support</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HeroSection