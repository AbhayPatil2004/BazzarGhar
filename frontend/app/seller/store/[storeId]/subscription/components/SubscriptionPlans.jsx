"use client";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
    { amount: 100, label: "1 Month" },
    { amount: 250, label: "3 Months" },
    { amount: 500, label: "6 Months" },
    { amount: 1000, label: "1 Year" },
];

export default function SubscriptionPlansPage() {

    const router = useRouter();
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
                            toast.error(data.message || "Subscription failed");
                            return;
                        }

                        toast.success("Subscription activated successfully ✅");

                        setTimeout(() => {
                            router.push(`/seller/store/${storeId}`);
                        }, 1500);

                    } catch (err) {
                        console.error(err);
                        toast.error("Something went wrong");
                    }
                },

                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            toast.error("Payment failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="subscription-plans" className="bg-gradient-to-b from-white to-gray-50 py-20 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-16">
                    <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-5">
                        Aurastore Subscription
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Choose Your Subscription
                    </h1>

                    <p className="text-gray-500 mt-4 text-lg">
                        Upgrade your store and unlock premium selling features
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {plans.map((plan) => {
                        const isPopular = plan.amount === 500;

                        return (
                            <div
                                key={plan.amount}
                                className={`relative rounded-3xl p-7 border transition-all duration-300
                                hover:-translate-y-2 hover:shadow-2xl
                                ${isPopular
                                        ? "border-blue-600 shadow-xl scale-[1.04] bg-white"
                                        : "border-gray-200 bg-white"
                                    }`}
                            >
                                {isPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full shadow">
                                        Most Popular
                                    </span>
                                )}

                                <h2 className="text-4xl font-bold text-center text-gray-900">
                                    ₹{plan.amount}
                                </h2>

                                <p className="text-center text-gray-500 mt-2 font-medium">
                                    {plan.label}
                                </p>

                                <ul className="mt-7 space-y-3 text-sm text-gray-600">
                                    <li>✔ Priority listing</li>
                                    <li>✔ Higher visibility</li>
                                    <li>✔ Premium store badge</li>
                                    <li>✔ Sales analytics</li>
                                </ul>

                                <button
                                    disabled={loading}
                                    onClick={() => handlePayment(plan.amount)}
                                    className={`mt-8 w-full py-3 rounded-2xl font-semibold text-lg transition
                                    ${isPopular
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                            : "bg-gray-900 text-white hover:bg-black"
                                        }
                                    ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Processing..." : "Activate Plan"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-sm text-gray-500 mt-14">
                    Secure payments powered by Razorpay · Cancel anytime
                </p>
            </div>
        </div>
    );
}
