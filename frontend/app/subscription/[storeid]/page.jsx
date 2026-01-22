"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {useRouter} from "next/navigation"

const plans = [
    { amount: 100, label: "1 Month" },
    { amount: 250, label: "3 Months" },
    { amount: 500, label: "6 Months" },
    { amount: 1000, label: "1 Year" },
];

export default function SubscriptionPage() {

    const router = useRouter()

    const { storeId } = useParams();
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount) => {
        try {
            setLoading(true);
            await loadRazorpay();

            // 1️⃣ Create order
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/seller/store/createsubscriptionorder`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                    credentials: "include"
                }
            );

            const { data: order } = await res.json();

            // 2️⃣ Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Store Subscription",
                description: "Subscription Payment",
                order_id: order.id,

                handler: async function (response) {
                    try {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/seller/store/upgradesubscription/${storeId}`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    ...response,
                                    amount,
                                }),

                                credentials: "include"
                            }
                        );

                        const data = await res.json();

                        if (!res.ok || !data.success) {
                            alert(data.message || "Subscription failed");
                            return;
                        }

                        // ✅ Success
                        alert("Subscription done ✅");

                        // ✅ Redirect to store page
                        router.push(`/seller/store/${storeId}`);
                    } catch (err) {
                        console.error(err);
                        alert("Something went wrong");
                    }
                },

                theme: {
                    color: "#2563eb",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Payment failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Choose Your Subscription
                    </h1>
                    <p className="text-gray-500 mt-3">
                        Upgrade your store and unlock premium features
                    </p>
                </div>

                {/* PLANS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan) => {
                        const isPopular = plan.amount === 500;

                        return (
                            <div
                                key={plan.amount}
                                className={`relative rounded-2xl bg-white p-6 shadow-sm border
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${isPopular ? "border-blue-600 scale-[1.02]" : "border-gray-200"}
              `}
                            >
                                {/* POPULAR BADGE */}
                                {isPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2
                  bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                )}

                                {/* PRICE */}
                                <h2 className="text-3xl font-bold text-center">
                                    ₹{plan.amount}
                                </h2>

                                <p className="text-center text-gray-500 mt-2">
                                    {plan.label}
                                </p>

                                {/* FEATURES */}
                                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                                    <li>✔ Priority listing</li>
                                    <li>✔ Higher visibility</li>
                                    <li>✔ Premium badge</li>
                                    <li>✔ Sales analytics</li>
                                </ul>

                                {/* CTA */}
                                <button
                                    disabled={loading}
                                    onClick={() => handlePayment(plan.amount)}
                                    className={`mt-6 w-full py-3 rounded-xl font-medium transition
                  ${isPopular
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-black text-white hover:bg-gray-800"
                                        }
                  ${loading ? "opacity-60 cursor-not-allowed" : ""}
                `}
                                >
                                    {loading ? "Processing..." : "Activate / Upgrade"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER NOTE */}
                <p className="text-center text-sm text-gray-500 mt-12">
                    Secure payments powered by Razorpay · Cancel anytime
                </p>
            </div>
        </div>
    );

}