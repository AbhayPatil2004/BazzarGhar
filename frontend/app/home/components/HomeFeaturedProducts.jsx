"use client";

import { useRouter } from "next/navigation";
import { Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function FeaturedProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/products?limit=8`,
                    { cache: "no-store" }
                );
                const data = await response.json();
                setProducts(data.data?.slice(0, 8) || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/product/${productId}`);
    };

    if (loading) {
        return (
            <section className="w-full bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Featured <span className="text-blue-600">Products</span>
                        </h2>
                        <p className="text-gray-600 text-lg">Loading amazing products...</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Featured <span className="text-blue-600">Products</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Handpicked products trending in your area
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No products available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => handleProductClick(product._id)}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Image Container */}
                                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={product.image || "/placeholder.jpg"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    {product.discount && (
                                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Brand */}
                                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
                                        {product.brand || "Local Store"}
                                    </p>

                                    {/* Product Name */}
                                    <h3 className="text-gray-900 font-bold text-sm mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">({product.reviews?.length || 0})</span>
                                    </div>

                                    {/* Price & Button */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{product.price?.toLocaleString() || "N/A"}
                                            </p>
                                            {product.originalPrice && (
                                                <p className="text-xs text-gray-500 line-through">
                                                    ₹{product.originalPrice?.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all group-hover:scale-110">
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => router.push("/home/search")}
                        className="px-8 py-3 text-lg font-bold 
                                 text-blue-600 border-2 border-blue-600 
                                 rounded-xl hover:bg-blue-50 
                                 transition-all duration-200"
                    >
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
}
