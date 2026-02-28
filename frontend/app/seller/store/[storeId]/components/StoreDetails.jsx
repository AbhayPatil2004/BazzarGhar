"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StoreDashboardPage() {
    const { storeId } = useParams();
    const router = useRouter();

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(true)

    useEffect(() => {
        if (!storeId) return;

        const fetchStore = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/seller/store/${storeId}`,
                    { credentials: "include" }
                );

                if (!res.ok) throw new Error("Fetch failed");

                const data = await res.json();
                setStore(data.data);
                if (!data.data.isActive) {
                    setActive(false)
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [storeId]);

    const handelToggleActive = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/seller/store/toggleactive/${storeId}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                toast.error("Please try again later");
                return;
            }

            setActive((prev) => !prev); // UI update

            toast.success(
                `Store ${active ? "Deactivated" : "Activated"} successfully`
            );

        } catch (error) {
            console.log(error);
            toast.error("Please try again later");
        }
    };


    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    }

    if (!store) {
        return <div className="min-h-screen bg-white text-center pt-20">Store not found</div>;
    }

    return (
        <div className="min-h-screen bg-white px-6 py-10 text-black">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* STORE HEADER */}
                <div>
                    {store.banner && (
                        <img src={store.banner} className="w-full h-40 sm:h-56 md:h-100 object-cover rounded-xl mb-6"
                        />
                    )}

                    <div className="flex items-center gap-6">
                        <img
                            src={store.logo || "/vercel.svg"}
                            className="w-24 h-24 rounded-xl border object-cover"
                        />

                        <div>
                            <h1 className="text-3xl font-bold">{store.storeName}</h1>
                            <p className="text-gray-500">{store.description}</p>
                            <p className="text-sm mt-1">⭐ {store.rating} rating</p>
                        </div>
                    </div>
                </div>

                {/* ADDRESS */}
                <Section title="Store Address">
                    <p>
                        {store.address?.street}, {store.address?.city},
                        {store.address?.state} - {store.address?.postalCode}
                    </p>
                    <p>{store.address?.country}</p>
                </Section>

                {/* STORE PRODUCTS */}
                <Section title="Store Products">
                    <div className="flex flex-wrap gap-3">
                        {store.storeProducts?.map((p, i) => (
                            <span key={i} className="px-3 py-1 border rounded-full text-sm">
                                {p}
                            </span>
                        ))}
                    </div>
                </Section>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoCard label="Total Products" value={store.totalProducts} />
                    <InfoCard label="Total Orders" value={store.totalOrders} />
                    <InfoCard label="Commission %" value={store.commissionRate} />
                    <InfoCard label="Reviews" value={store.reviews?.length || 0} />
                </div>

                {/* SUBSCRIPTION */}
                {/* SUBSCRIPTION */}
                <Section title="Subscription Details" className="pb-0 mb-0">
                    <p>
                        Plan: <b>{store.subscriptionPlan}</b>
                    </p>

                    <p>
                        Status:{" "}
                        {store.isSubscriptionActive ? "Active ✅" : "Inactive ❌"}
                    </p>

                    <p>Start: {formatDate(store.subscriptionStartDate)}</p>
                    <p>End: {formatDate(store.subscriptionEndDate)}</p>

                    {store.trialEndsAt && (
                        <p className="text-sm text-gray-500">
                            Trial ends on {formatDate(store.trialEndsAt)}
                        </p>
                    )}

                    <button
                        onClick={() => router.push(`${storeId}/subscription`)}
                        className={`cursor-pointer px-6 py-2 rounded-lg text-white
        ${store.isSubscriptionActive
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-black hover:bg-gray-800"
                            }`}
                    >
                        {store.isSubscriptionActive
                            ? "Upgrade Subscription"
                            : "Activate Subscription"}
                    </button>
                </Section>



                {/* SALES DASHBOARD */}
                {/* <Section title="Sales Dashboard">
                    {store.productSales?.length === 0 ? (
                        <p className="text-gray-500">No sales yet</p>
                    ) : (
                        <table className="w-full border rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Product</th>
                                    <th className="p-3 text-left">Qty</th>
                                    <th className="p-3 text-left">Revenue</th>
                                    <th className="p-3 text-left">Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.productSales.map((p) => (
                                    <tr key={p.productId} className="border-t">
                                        <td className="p-3">{p.productName}</td>
                                        <td className="p-3">{p.totalQuantitySold}</td>
                                        <td className="p-3">₹{p.totalRevenue}</td>
                                        <td className="p-3 text-green-600">₹{p.totalProfit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Section> */}

                {/* ACTIONS */}
                {/* <div className="flex justify-between pt-10">
                    <button
                        onClick={() => router.push(`/seller/store/${storeId}/add-product`)}
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        ➕ Add Product
                    </button>

                    <button
                        onClick={() => alert("Delete logic here")}
                        className="border border-red-600 text-red-600 px-6 py-3 rounded-lg"
                    >
                        🗑 Delete Store
                    </button>
                </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push(`/seller/store/${storeId}/add-product`)}
                        className="w-full bg-black text-white px-6 py-3 rounded-lg  cursor-pointer"
                    >
                        ➕ Add Product
                    </button>

                    <button
                        onClick={() => router.push(`/seller/store/${storeId}/update`)}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer"
                    >
                        ✏️ Update Store Details
                    </button>

                    <button
                        onClick={handelToggleActive}
                        className={`w-full px-6 py-3 rounded-lg cursor-pointer font-medium transition
    ${active
                                ? "border border-red-500 text-red-600 hover:bg-red-50"
                                : "border border-green-500 text-green-600 hover:bg-green-50"
                            }`}
                    >
                        {active ? "Deactivate Store" : "Activate Store"}
                    </button>


                </div>



            </div>
        </div>
    );
}

/* helpers */
function InfoCard({ label, value }) {
    return (
        <div className="border rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            <div className="border rounded-xl p-6 space-y-2">
                {children}
            </div>
        </section>
    );
}

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
}