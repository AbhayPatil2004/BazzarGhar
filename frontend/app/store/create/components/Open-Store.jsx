
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const allCategories = [
  { label: "Grocery", value: "grocery" },
  { label: "Fashion & Clothing", value: "fashion" },
  { label: "Electronics", value: "electronics" },
  { label: "Home & Kitchen", value: "home-kitchen" },
  { label: "Medical & Pharmacy", value: "medical" },
  { label: "Books & Stationery", value: "books" },
  { label: "Sports & Fitness", value: "sports" },
  { label: "Beauty & Personal Care", value: "beauty" },
  { label: "Hardware & Tools", value: "hardware" },
  { label: "Bakery & Sweets", value: "bakery" },
  { label: "Toys & Kids Store", value: "toys" },
  { label: "Footwear", value: "footwear" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Bags & Accessories", value: "bags" },
  { label: "Handicrafts", value: "handicrafts" },
  { label: "Kitchenware", value: "kitchenware" },
  { label: "Garden & Plants", value: "garden" },
  { label: "Stationery", value: "stationery" },
  { label: "Pet Supplies", value: "pet-supplies" },
  { label: "Automotive", value: "automotive" },
  { label: "Festive & Gifts", value: "festive" },
  { label: "Dairy & Eggs", value: "dairy" },
  { label: "Organic Products", value: "organic" },
  { label: "Clothing Rental", value: "clothing-rental" },
  { label: "Music & Hobbies", value: "music-hobbies" },
];

export default function CreateStorePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    storeProducts: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  // ✅ SINGLE CATEGORY STATE
  const [selectedCategory, setSelectedCategory] = useState("");

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = "";
      let bannerUrl = "";

      if (logo) logoUrl = await uploadImage(logo);
      if (banner) bannerUrl = await uploadImage(banner);

      const payload = {
        storeName: formData.storeName,
        description: formData.description,
        storeProducts: formData.storeProducts.split(","),
        category: selectedCategory, // ✅ SINGLE CATEGORY
        address: formData.address,
        logoUrl,
        bannerUrl,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Unauthorized: Please login first") {
          toast.error("Please login first!");
          router.push("/auth/signup");
          return;
        }

        toast.error(data.message || "Store creation failed");
        return;
      }

      toast.success(data.message || "Store created successfully 🎉");

      // RESET
      setFormData({
        storeName: "",
        description: "",
        storeProducts: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        },
      });

      setSelectedCategory("");
      setLogo(null);
      setBanner(null);

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-14">

      <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Open Your Store on <span className="text-purple-700">BazzarGhar</span>
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Create your store and start selling your products locally & online.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Store Name */}
          <input
            name="storeName"
            value={formData.storeName}
            placeholder="Store Name"
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            placeholder="Describe your store"
            rows={3}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          {/* Products */}
          <input
            name="storeProducts"
            value={formData.storeProducts}
            placeholder="Products (Shoes, Shirts, Watches)"
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          {/* ✅ SINGLE CATEGORY DROPDOWN */}
          <div>
            <label className="block mb-2 font-semibold">
              Select Category
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select Category</option>

              {allCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* ADDRESS */}
          <div className="space-y-4">
            <h3 className="font-semibold">Store Address</h3>

            <input
              name="address.street"
              value={formData.address.street}
              placeholder="Street Address"
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="address.city"
                value={formData.address.city}
                placeholder="City"
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="address.state"
                value={formData.address.state}
                placeholder="State"
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="address.postalCode"
                value={formData.address.postalCode}
                placeholder="Postal Code"
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              />

              <input
                value="India"
                disabled
                className="rounded-xl border bg-gray-100 px-4 py-3"
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="grid grid-cols-2 gap-6">
            <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
            <input type="file" onChange={(e) => setBanner(e.target.files[0])} />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white py-3 rounded-xl"
          >
            {loading ? "Creating..." : "Create Store"}
          </button>

        </form>
      </div>
    </div>
  );
}

