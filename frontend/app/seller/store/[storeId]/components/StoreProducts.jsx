"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StoreProductsPage() {
    const { storeId } = useParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`http://localhost:8000/seller/store/${storeId}/products`, {
                    method: "GET",
                    credentials: "include",   // agar cookies use kar rahe ho
                });

                const data = await res.json();

                if (Array.isArray(data?.data)) {
                    setProducts(data.data);
                } else {
                    setProducts([]); // safe fallback
                }
            } catch (err) {
                console.log(err);
                setProducts([]);
            }
        }

        if (storeId) fetchProducts();
    }, [storeId]);


    return (
        <div className="mt-6 px-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 mb-10">
                Store Products
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 justify-items-center">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col w-full max-w-[220px]"
                    >
                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="h-40 w-full object-cover"
                        />

                        <div className="p-3 flex flex-col flex-grow">
                            <h2 className="text-sm font-semibold line-clamp-2">
                                {product.title}
                            </h2>

                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                {product.description}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                {product.category}
                            </p>

                            <p className="text-base font-bold mt-2 text-green-600">
                                ₹ {product.price}
                            </p>

                            <button
                                onClick={() =>
                                    router.push(`/seller/store/${storeId}/${product._id}`)
                                }
                                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>



    );
}
