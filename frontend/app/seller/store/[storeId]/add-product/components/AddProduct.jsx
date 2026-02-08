// "use client";

// import { useParams } from "next/navigation";
// import { useState } from "react";

// export default function AddProductPage() {
//     const { storeId } = useParams();
//     const [loading, setLoading] = useState(false);

//     const [form, setForm] = useState({
//         title: "",
//         description: "",
//         category: "",
//         price: "",
//         discountPercentage: 0,
//         gender: "unisex",
//         isReturnable: true,
//         stock: "",
//         deliveryTime: "",
//         sizes: "",
//         colors: "",
//         tags: "",
//         searchKeyword: "",
//     });

//     const [images, setImages] = useState([]);
//     const [video, setVideo] = useState(null);

//     // Upload to Cloudinary (via API)
//     const uploadFile = async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);

//         const res = await fetch("/api/upload", {
//             method: "POST",
//             body: formData,
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Upload failed");
//         return data.url;
//     };

//     // Submit Handler
//     const handleSubmit = async () => {
//         try {
//             setLoading(true);

//             if (!images.length) {
//                 alert("At least one image is required");
//                 return;
//             }

//             const imageUrls = await Promise.all(
//                 images.map((img) => uploadFile(img))
//             );

//             const videoUrls = video ? [await uploadFile(video)] : [];

//             const payload = {
//                 title: form.title,
//                 description: form.description,
//                 category: form.category,
//                 price: Number(form.price),
//                 discountPercentage: Number(form.discountPercentage),
//                 gender: form.gender,
//                 isReturnable: form.isReturnable,
//                 stock: Number(form.stock),
//                 deliveryTime: form.deliveryTime,

//                 sizes: form.sizes.split(",").map((s) => s.trim()),
//                 colors: form.colors.split(",").map((c) => c.trim()),
//                 tags: form.tags.split(",").map((t) => t.trim()),
//                 searchKeyword: form.searchKeyword,

//                 images: imageUrls,
//                 video: videoUrls,
//             };

//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_API_URL}/seller/store/addproduct/${storeId}`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     credentials: "include",
//                     body: JSON.stringify(payload),
//                 }
//             );

//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message);

//             alert("✅ Product added successfully");
//         } catch (err) {
//             alert(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
//             <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

//                 {/* LEFT FORM */}
//                 <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm space-y-6">

//                     <div>
//                         <h1 className="text-3xl font-semibold">Add New Product</h1>
//                         <p className="text-gray-500 mt-1">
//                             Enter complete product details carefully
//                         </p>
//                     </div>

//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">
//                             Product Title
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Premium Cotton T-Shirt"
//                             className="input-modern text-gray-900 placeholder-gray-500"
//                             onChange={(e) => setForm({ ...form, title: e.target.value })}
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">
//                             Description
//                         </label>
//                         <textarea
//                             placeholder="Describe material, fit, quality, usage etc."
//                             className="input-modern h-32 text-gray-900 placeholder-gray-500"
//                             onChange={(e) =>
//                                 setForm({ ...form, description: e.target.value })
//                             }
//                         />
//                     </div>

//                     {/* Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Category</label>
//                             <input
//                                 type="text"
//                                 placeholder="Clothing / Shoes / Accessories"
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, category: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Delivery Time</label>
//                             <input
//                                 type="text"
//                                 placeholder="3–5 Days"
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, deliveryTime: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Price (₹)</label>
//                             <input
//                                 type="text"
//                                 placeholder="999"
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, price: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">
//                                 Discount Percentage
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="10"
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, discountPercentage: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Stock</label>
//                             <input
//                                 type="text"
//                                 placeholder="150"
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, stock: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Gender</label>
//                             <select
//                                 className="input-modern text-gray-900"
//                                 onChange={(e) =>
//                                     setForm({ ...form, gender: e.target.value })
//                                 }
//                             >
//                                 <option value="unisex">Unisex</option>
//                                 <option value="men">Men</option>
//                                 <option value="women">Women</option>
//                                 <option value="kids">Kids</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Meta */}
//                     <div className="space-y-4">
//                         <input
//                             type="text"
//                             placeholder="Sizes (S, M, L, XL)"
//                             className="input-modern text-gray-900"
//                             onChange={(e) => setForm({ ...form, sizes: e.target.value })}
//                         />

//                         <input
//                             type="text"
//                             placeholder="Colors (Red, Blue, Black)"
//                             className="input-modern text-gray-900"
//                             onChange={(e) => setForm({ ...form, colors: e.target.value })}
//                         />

//                         <input
//                             type="text"
//                             placeholder="Tags (summer, cotton, trending)"
//                             className="input-modern text-gray-900"
//                             onChange={(e) => setForm({ ...form, tags: e.target.value })}
//                         />

//                         <input
//                             type="text"
//                             placeholder="Search Keywords"
//                             className="input-modern text-gray-900"
//                             onChange={(e) =>
//                                 setForm({ ...form, searchKeyword: e.target.value })
//                             }
//                         />
//                     </div>

//                     {/* Checkbox */}
//                     <label className="flex items-center gap-3 text-sm font-medium">
//                         <input
//                             type="checkbox"
//                             checked={form.isReturnable}
//                             onChange={(e) =>
//                                 setForm({ ...form, isReturnable: e.target.checked })
//                             }
//                         />
//                         This product is returnable
//                     </label>
//                 </div>

//                 {/* RIGHT SIDE */}
//                 <div className="space-y-6">

//                     <div className="bg-white p-6 rounded-2xl shadow-sm">
//                         <h3 className="font-semibold mb-2">Product Images</h3>
//                         <p className="text-sm text-gray-500 mb-3">
//                             Upload at least one image
//                         </p>
//                         <input
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={(e) => setImages([...e.target.files])}
//                         />
//                     </div>

//                     <div className="bg-white p-6 rounded-2xl shadow-sm">
//                         <h3 className="font-semibold mb-2">Product Video</h3>
//                         <p className="text-sm text-gray-500 mb-3">
//                             Optional (max 1 video)
//                         </p>
//                         <input
//                             type="file"
//                             accept="video/*"
//                             onChange={(e) => setVideo(e.target.files[0])}
//                         />
//                     </div>

//                     <button
//                         disabled={loading}
//                         onClick={handleSubmit}
//                         className="w-full bg-black text-white py-4 rounded-xl font-medium tracking-wide hover:opacity-90"
//                     >
//                         {loading ? "Uploading Product..." : "Publish Product"}
//                     </button>
//                 </div>
//             </div>
//         </div>

//     );
// }


"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProductPage() {
    const { storeId } = useParams();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        discountPercentage: 0,
        gender: "unisex",
        isReturnable: true,
        stock: "",
        deliveryTime: "",
        sizes: "",
        colors: "",
        tags: "",
        searchKeyword: "",
    });

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return data.url;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!images.length) {
                toast.error("At least one image is required");
                return;
            }

            const imageUrls = await Promise.all(
                images.map((img) => uploadFile(img))
            );

            const videoUrls = video ? [await uploadFile(video)] : [];

            const payload = {
                ...form,
                price: Number(form.price),
                discountPercentage: Number(form.discountPercentage),
                stock: Number(form.stock),
                sizes: form.sizes.split(",").map((s) => s.trim()),
                colors: form.colors.split(",").map((c) => c.trim()),
                tags: form.tags.split(",").map((t) => t.trim()),
                images: imageUrls,
                video: videoUrls,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/seller/store/addproduct/${storeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Product added to store successfully");
            window.location.reload();   // refresh & clear form
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const imagePreview = images.map((file) => URL.createObjectURL(file));
    const videoPreview = video ? URL.createObjectURL(video) : null;

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT FORM (UNCHANGED) */}
                <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm space-y-6">

                    <div>
                        <h1 className="text-3xl font-semibold">Add New Product</h1>
                        <p className="text-gray-500 mt-1">
                            Enter complete product details carefully
                        </p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Product Title
                        </label>
                        <input
                            type="text"
                            placeholder="Premium Cotton T-Shirt"
                            className="input-modern text-gray-900 placeholder-gray-500"
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe material, fit, quality, usage etc."
                            className="input-modern h-32 text-gray-900 placeholder-gray-500"
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input
                                type="text"
                                placeholder="Clothing / Shoes / Accessories"
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, category: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Delivery Time</label>
                            <input
                                type="text"
                                placeholder="3–5 Days"
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, deliveryTime: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₹)</label>
                            <input
                                type="text"
                                placeholder="999"
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Discount Percentage
                            </label>
                            <input
                                type="text"
                                placeholder="10"
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, discountPercentage: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Stock</label>
                            <input
                                type="text"
                                placeholder="150"
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, stock: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select
                                className="input-modern text-gray-900"
                                onChange={(e) =>
                                    setForm({ ...form, gender: e.target.value })
                                }
                            >
                                <option value="unisex">Unisex</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Sizes (S, M, L, XL)"
                            className="input-modern text-gray-900"
                            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Colors (Red, Blue, Black)"
                            className="input-modern text-gray-900"
                            onChange={(e) => setForm({ ...form, colors: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Tags (summer, cotton, trending)"
                            className="input-modern text-gray-900"
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Search Keywords"
                            className="input-modern text-gray-900"
                            onChange={(e) =>
                                setForm({ ...form, searchKeyword: e.target.value })
                            }
                        />
                    </div>

                    {/* Checkbox */}
                    <label className="flex items-center gap-3 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={form.isReturnable}
                            onChange={(e) =>
                                setForm({ ...form, isReturnable: e.target.checked })
                            }
                        />
                        This product is returnable
                    </label>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-semibold mb-2">Product Images</h3>
                        <p className="text-sm text-gray-500 mb-3">
                            Upload at least one image
                        </p>
                        {/* <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImages([...e.target.files])}
                        /> */}

                        <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) =>
        setImages((prev) => [
            ...prev,
            ...Array.from(e.target.files)
        ])
    }
/>


                        {images.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {imagePreview.map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        className="w-24 h-24 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-semibold mb-2">Product Video</h3>
                        <p className="text-sm text-gray-500 mb-3">
                            Optional (max 1 video)
                        </p>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files[0])}
                        />

                        {videoPreview && (
                            <video
                                src={videoPreview}
                                controls
                                className="mt-3 rounded-lg w-full"
                            />
                        )}
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-4 rounded-xl font-medium tracking-wide hover:opacity-90"
                    >
                        {loading ? "Uploading Product..." : "Publish Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
