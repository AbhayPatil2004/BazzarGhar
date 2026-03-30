import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/Authcontext'

function HeroSection() {

    const { user, setUser } = useAuth()

    if (user) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 min-h-screen flex items-center">
                {/* Decorative gradient blobs */}
                <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full bg-blue-200 blur-3xl opacity-40" />
                <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-300 blur-3xl opacity-30" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16">

                        {/* LEFT */}
                        <div className="text-center lg:text-left">
                            <span className="inline-block mb-4 rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-xs md:text-sm font-semibold tracking-wide">
                                🚀 BUILT FOR LOCAL BUSINESSES
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mt-4">
                                Empower Local <br className="hidden sm:block" />
                                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Vendors.</span>
                            </h1>

                            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                BazzarGhar helps local vendors launch their own online store and sell
                                directly to customers in their city — fast, simple, and secure.
                            </p>

                            {/* CTA */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <a
                                    href="/store/create"
                                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Open Your Store
                                </a>

                                <a
                                    href="/home"
                                    className="px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    Start Shopping
                                </a>
                            </div>

                            {/* FEATURE POINTS */}
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <p className="text-2xl mb-2">🏪</p>
                                    <p className="font-semibold text-gray-900">Your Own Store</p>
                                    <p className="text-gray-600 text-sm">No marketplace limits</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <p className="text-2xl mb-2">📍</p>
                                    <p className="font-semibold text-gray-900">Local First</p>
                                    <p className="text-gray-600 text-sm">Sell in your city</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <p className="text-2xl mb-2">🔒</p>
                                    <p className="font-semibold text-gray-900">Secure Payments</p>
                                    <p className="text-gray-600 text-sm">Fast & trusted checkout</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="flex justify-center">
                            <div className="relative rounded-2xl bg-white p-3 shadow-2xl">
                                <img
                                    src="/herologo.jpg"
                                    alt="Ecommerce Platform"
                                    className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* STATS BAR */}
                    <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">10K+</p>
                            <p className="text-gray-600 text-sm mt-2">Active Vendors</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">50+</p>
                            <p className="text-gray-600 text-sm mt-2">Cities Covered</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">1M+</p>
                            <p className="text-gray-600 text-sm mt-2">Products Listed</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">24×7</p>
                            <p className="text-gray-600 text-sm mt-2">Customer Support</p>
                        </div>
                    </div>

                </div>
            </section>
        )
    }


    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 min-h-screen flex items-center">
            {/* Decorative gradient blobs */}
            <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full bg-blue-200 blur-3xl opacity-40" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-300 blur-3xl opacity-30" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16">

                    {/* LEFT */}
                    <div className="text-center lg:text-left">
                        <span className="inline-block mb-4 rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-xs md:text-sm font-semibold tracking-wide">
                            🚀 BUILT FOR LOCAL BUSINESSES
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mt-4">
                            Empower Local <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Vendors.</span>
                        </h1>

                        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            BazzarGhar helps local vendors launch their own online store and sell
                            directly to customers in their city — fast, simple, and secure.
                        </p>

                        {/* CTA */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a
                                href="/auth/signup"
                                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Get Started
                            </a>

                            <a
                                href="/auth/login"
                                className="px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                            >
                                Login
                            </a>
                        </div>

                        {/* FEATURE POINTS */}
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                <p className="text-2xl mb-2">🏪</p>
                                <p className="font-semibold text-gray-900">Your Own Store</p>
                                <p className="text-gray-600 text-sm">No marketplace limits</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                <p className="text-2xl mb-2">📍</p>
                                <p className="font-semibold text-gray-900">Local First</p>
                                <p className="text-gray-600 text-sm">Sell in your city</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                <p className="text-2xl mb-2">🔒</p>
                                <p className="font-semibold text-gray-900">Secure Payments</p>
                                <p className="text-gray-600 text-sm">Fast & trusted checkout</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="flex justify-center">
                        <div className="relative rounded-2xl bg-white p-3 shadow-2xl">
                            <img
                                src="/herologo.jpg"
                                alt="Ecommerce Platform"
                                className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* STATS BAR */}
                <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">10K+</p>
                        <p className="text-gray-600 text-sm mt-2">Active Vendors</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">50+</p>
                        <p className="text-gray-600 text-sm mt-2">Cities Covered</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">1M+</p>
                        <p className="text-gray-600 text-sm mt-2">Products Listed</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">24×7</p>
                        <p className="text-gray-600 text-sm mt-2">Customer Support</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HeroSection