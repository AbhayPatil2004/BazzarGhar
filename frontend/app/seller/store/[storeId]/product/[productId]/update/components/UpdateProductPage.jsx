"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UpdateProductPage() {
    const { storeId, productId } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [productInfo, setProductInfo] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        deliveryTime: "",
        discountPercentage: 0,
        isReturnable: true,
        sizes: "",
        colors: "",
        tags: "",
    });

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    // upload (image/video both)
    async function uploadImage(file) {
        const data = new FormData();
        data.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            credentials: "include",
            body: data,
        });

        const result = await res.json();
        return result.url;
    }

    useEffect(() => {
        async function fetchProduct() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/seller/store/${storeId}/products/${productId}`,
                { credentials: "include" }
            );

            const data = await res.json();
            const p = data?.data;

            // only for top preview
            setProductInfo({
                title: p.title,
                image: p.images?.[0],
            });

            // ❌ form ko prefill mat karo
        }

        if (storeId && productId) fetchProduct();
    }, [storeId, productId]);
    ;

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const imageUrls = images.length
                ? await Promise.all(images.map(uploadImage))
                : [];

            const videoUrl = video ? await uploadImage(video) : null;

            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                discountPercentage: Number(form.discountPercentage),
                sizes: form.sizes.split(",").map(s => s.trim()),
                colors: form.colors.split(",").map(c => c.trim()),
                tags: form.tags.split(",").map(t => t.trim()),
                images: imageUrls,
                video: videoUrl ? [videoUrl] : [],
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/seller/store/updateproduct/${productId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Update failed");

            toast.success("Product updated successfully");

            router.push(
                `/seller/store/${storeId}/product/${productId}`
            );

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">

            {/* PAGE HEADING */}
            {/* <h1 className="text-3xl font-semibold text-center">
                Update Product Details
            </h1> */}

            {/* TOP PRODUCT INFO */}
            {productInfo && (
                <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow">
                    <img
                        src={productInfo.image}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                    <h2 className="text-lg font-medium">{productInfo.title}</h2>
                </div>
            )}

            {/* FORM */}
            <div className="bg-white p-8 rounded-2xl shadow space-y-5">

                <div>
                    <label className="block text-sm font-medium mb-1">Product Title</label>
                    <input
                        className="input-modern"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="input-modern"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        className="input-modern"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                        type="number"
                        className="input-modern"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                        className="input-modern"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Delivery Time</label>
                    <input
                        className="input-modern"
                        value={form.deliveryTime}
                        onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Discount Percentage</label>
                    <input
                        type="number"
                        className="input-modern"
                        value={form.discountPercentage}
                        onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                    />
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.isReturnable}
                        onChange={(e) => setForm({ ...form, isReturnable: e.target.checked })}
                    />
                    Returnable Product
                </label>

                <div>
                    <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                    <input
                        className="input-modern"
                        value={form.sizes}
                        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                    <input
                        className="input-modern"
                        value={form.colors}
                        onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                        className="input-modern"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                </div>

            </div>

            <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl"
            >
                {loading ? "Updating..." : "Update Product"}
            </button>


        </div>
    );

}
