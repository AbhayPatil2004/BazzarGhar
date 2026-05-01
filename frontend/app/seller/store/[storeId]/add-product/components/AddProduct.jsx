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
import { Upload, X } from "lucide-react";

// Categories data
const categories = [
  { label: "Grocery", value: "grocery", icon: "🛒" },
  { label: "Fashion", value: "fashion", icon: "👗" },
  { label: "Electronics", value: "electronics", icon: "📱" },
  { label: "Home & Kitchen", value: "home-kitchen", icon: "🏠" },
  { label: "Medical", value: "medical", icon: "💊" },
  { label: "Books", value: "books", icon: "📚" },
  { label: "Sports", value: "sports", icon: "⚽" },
  { label: "Beauty", value: "beauty", icon: "💄" },
  { label: "Hardware", value: "hardware", icon: "🔧" },
  { label: "Bakery", value: "bakery", icon: "🎂" },
  { label: "Toys & Kids", value: "toys", icon: "🧸" },
  { label: "Footwear", value: "footwear", icon: "👟" },
  { label: "Jewellery", value: "jewellery", icon: "💍" },
  { label: "Bags", value: "bags", icon: "👜" },
  { label: "Handicrafts", value: "handicrafts", icon: "🎨" },
  { label: "Kitchenware", value: "kitchenware", icon: "🍳" },
  { label: "Garden & Plants", value: "garden", icon: "🪴" },
  { label: "Stationery", value: "stationery", icon: "✏️" },
  { label: "Pet Supplies", value: "pet-supplies", icon: "🐾" },
  { label: "Automotive", value: "automotive", icon: "🚗" },
  { label: "Festive & Gifts", value: "festive", icon: "🪔" },
  { label: "Dairy & Eggs", value: "dairy", icon: "🥛" },
  { label: "Organic", value: "organic", icon: "🌿" },
  { label: "Clothing Rental", value: "clothing-rental", icon: "👔" },
  { label: "Music & Hobbies", value: "music-hobbies", icon: "🎸" },
];

// Size options by category
const sizesByCategory = {
  fashion: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  footwear: ["6", "7", "8", "9", "10", "11", "12", "13"],
  electronics: ["N/A"],
  grocery: ["100g", "250g", "500g", "1kg", "2kg", "5kg", "10kg"],
  beauty: ["30ml", "50ml", "100ml", "200ml", "500ml"],
  kitchenware: ["S", "M", "L", "XL"],
  bakery: ["250g", "500g", "1kg", "2kg"],
  dairy: ["250ml", "500ml", "1L", "2L"],
  medical: ["N/A"],
  default: ["S", "M", "L", "XL"],
};

// Delivery time options
const deliveryTimeOptions = [
  { value: "2h", label: "2 Hours" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "2d", label: "2 Days" },
  { value: "3d", label: "3 Days" },
  { value: "5d", label: "5 Days" },
  { value: "7d", label: "7 Days" },
  { value: "10d", label: "10 Days" },
  { value: "14d", label: "14 Days" },
];

// Colors
const colorOptions = [
  "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Beige", "Navy", "Maroon", "Gold", "Silver"
];

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
    deliveryTime: "3d",
    isEarlyDelivery: false,
    sizes: [],
    colors: [],
    tags: "",
    searchKeyword: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  // Get available sizes based on selected category
  const getAvailableSizes = () => {
    return sizesByCategory[form.category] || sizesByCategory.default;
  };

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

      if (!form.title || !form.category || !form.price || !form.stock) {
        toast.error("Please fill all required fields");
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
        sizes: Array.isArray(form.sizes) ? form.sizes : [form.sizes],
        colors: Array.isArray(form.colors) ? form.colors : [form.colors],
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
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

      toast.success("✅ Product added successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = images.map((file) => URL.createObjectURL(file));
  const videoPreview = video ? URL.createObjectURL(video) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in all details to list your product on BazzarGhar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Product Title */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Premium Cotton T-Shirt"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe material, fit, quality, usage, features..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-gray-900 placeholder-gray-500 resize-none"
              />
            </div>

            {/* Category & Delivery Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Dropdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, sizes: [] })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white cursor-pointer"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Time */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Delivery Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.deliveryTime}
                  onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white cursor-pointer"
                >
                  {deliveryTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Early Delivery Checkbox */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isEarlyDelivery}
                  onChange={(e) => setForm({ ...form, isEarlyDelivery: e.target.checked })}
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900">Mark as Early Delivery</span>
                  <p className="text-xs text-gray-500 mt-1">Check this if delivery is within 24 hours or sooner</p>
                </div>
              </label>
            </div>

            {/* Price, Discount, Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="999"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="150"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Gender
              </label>
              <div className="flex gap-4">
                {["unisex", "men", "women", "kids"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={form.gender === option}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-gray-700 capitalize font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes - Dynamic based on category */}
            {form.category && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Available Sizes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getAvailableSizes().map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                      <input
                        type="checkbox"
                        checked={Array.isArray(form.sizes) ? form.sizes.includes(size) : false}
                        onChange={(e) => {
                          const newSizes = Array.isArray(form.sizes) ? [...form.sizes] : [];
                          if (e.target.checked) {
                            newSizes.push(size);
                          } else {
                            newSizes.splice(newSizes.indexOf(size), 1);
                          }
                          setForm({ ...form, sizes: newSizes });
                        }}
                        className="w-4 h-4 cursor-pointer accent-blue-600"
                      />
                      <span className="text-gray-700 font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Available Colors
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                    <input
                      type="checkbox"
                      checked={Array.isArray(form.colors) ? form.colors.includes(color) : false}
                      onChange={(e) => {
                        const newColors = Array.isArray(form.colors) ? [...form.colors] : [];
                        if (e.target.checked) {
                          newColors.push(color);
                        } else {
                          newColors.splice(newColors.indexOf(color), 1);
                        }
                        setForm({ ...form, colors: newColors });
                      }}
                      className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-gray-700 font-medium text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., summer, cotton, trending"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Search Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g., shirt, apparel, clothing"
                  value={form.searchKeyword}
                  onChange={(e) => setForm({ ...form, searchKeyword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Returnable Checkbox */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isReturnable}
                  onChange={(e) => setForm({ ...form, isReturnable: e.target.checked })}
                  className="w-5 h-5 cursor-pointer accent-blue-600 rounded"
                />
                <span className="text-gray-900 font-medium">This product is returnable</span>
              </label>
            </div>
          </div>

          {/* RIGHT - Images & Video */}
          <div className="space-y-6">
            
            {/* Product Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Upload size={18} className="text-blue-600" />
                Product Images <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">Upload at least one image (PNG, JPG, WebP)</p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages((prev) => [...prev, ...Array.from(e.target.files)])
                }
                className="w-full px-3 py-2 border-2 border-dashed border-blue-300 rounded-xl text-sm text-gray-600 cursor-pointer hover:border-blue-500 transition"
              />

              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">({images.length} images selected)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {imagePreview.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                        />
                        <button
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Video */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Upload size={18} className="text-green-600" />
                Product Video
              </h3>
              <p className="text-xs text-gray-500 mb-4">Optional - Max 1 video (MP4, WebM)</p>
              
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="w-full px-3 py-2 border-2 border-dashed border-green-300 rounded-xl text-sm text-gray-600 cursor-pointer hover:border-green-500 transition"
              />

              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-4 rounded-lg w-full border-2 border-green-200"
                />
              )}
            </div>

            {/* Publish Button */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
            >
              {loading ? "Publishing Product..." : "Publish Product"}
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <p className="text-xs text-gray-700 font-medium">
                ✨ <strong>Tip:</strong> Add clear, high-quality images and detailed descriptions to increase sales!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
