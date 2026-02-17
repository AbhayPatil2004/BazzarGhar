"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { toast } from "react-dom-toast";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";



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
        address: formData.address,
        logoUrl,
        bannerUrl,
      };

      const res = await fetch("http://localhost:8000/store/create", {
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
      })

      setLogo(null)
      setBanner(null)
      // router.refresh()


    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 1000); // 1000ms = 1 second

      return () => clearTimeout(timer); // cleanup if component unmounts early
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-14" id="open-store-form" >

      {/* FORM CONTAINER */}
      <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Open Your Store on <span className="text-purple-700">BazzarGhar</span>
        </h1>
        <p className="text-gray-600 mt-2 mb-8">
          Create your store and start selling your products locally & online.
        </p>

        {/* <form onSubmit={handleSubmit} className="space-y-6">

          {/* Store Name */}
        

        {/* </form> } */}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Store Name */}
          <input
            name="storeName"
            value={formData.storeName}
            placeholder="Store Name"
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-purple-600"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            placeholder="Describe your store"
            rows={3}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-purple-600"
          />

          {/* Products */}
          <input
            name="storeProducts"
            value={formData.storeProducts}
            placeholder="Products (Shoes, Shirts, Watches)"
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-purple-600"
          />

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Store Address</h3>

            <input
              name="address.street"
              value={formData.address.street}
              placeholder="Street Address"
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* File Uploads (No value needed here) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Store Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:bg-gray-100 file:text-gray-700
        file:cursor-pointer hover:file:bg-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Store Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBanner(e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:bg-gray-100 file:text-gray-700
        file:cursor-pointer hover:file:bg-gray-200"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition"
          >
            {loading ? "Creating Store..." : "Create Store"}
          </button>

        </form>

      </div>

      {/* SUCCESS POPUP */}
      {/* {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-green-600">
              🎉 Store Request Sent!
            </h2>
            <p className="text-gray-600 mt-3">
              Your store request has been successfully sent to the admin for verification.
            </p>
          </div>
        </div>
      )} */}


    </div>
  );
}
