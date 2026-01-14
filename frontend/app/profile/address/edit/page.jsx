"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateAddressPage() {
    const router = useRouter();

    const [address, setAddress] = useState({
        label: "Home",
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
    });

    const [loading, setLoading] = useState(false);

    // 🔹 Fetch existing address
    useEffect(() => {
        async function fetchAddress() {
            try {
                const res = await fetch("http://localhost:8000/user", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();

                if (data?.address) {
                    setAddress(data.address[0]);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchAddress();
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);

            await fetch("http://localhost:8000/user/address", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(address),
            });


            router.push("/profile");
        } catch (err) {
            console.error("Address update failed", err);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Reusable styles
    const input =
        "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition";

    const label =
        "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">

                {/* HEADER */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Update Address
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* LABEL */}
                    <div>
                        <label className={label}>Label</label>
                        <select
                            name="label"
                            value={address.label}
                            onChange={handleChange}
                            className={input}
                        >
                            <option>Home</option>
                            <option>Office</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* FULL NAME */}
                    <div>
                        <label className={label}>Full Name</label>
                        <input
                            name="fullName"
                            value={address.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                            className={input}
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className={label}>Phone</label>
                        <input
                            name="phone"
                            value={address.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                            className={input}
                        />
                    </div>

                    {/* STREET */}
                    <div>
                        <label className={label}>Street</label>
                        <input
                            name="street"
                            value={address.street}
                            onChange={handleChange}
                            placeholder="House no, street, area"
                            required
                            className={input}
                        />
                    </div>

                    {/* CITY & STATE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={label}>City</label>
                            <input
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                required
                                className={input}
                            />
                        </div>

                        <div>
                            <label className={label}>State</label>
                            <input
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                required
                                className={input}
                            />
                        </div>
                    </div>

                    {/* POSTAL & COUNTRY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={label}>Postal Code</label>
                            <input
                                name="postalCode"
                                value={address.postalCode}
                                onChange={handleChange}
                                required
                                className={input}
                            />
                        </div>

                        <div>
                            <label className={label}>Country</label>
                            <input
                                name="country"
                                value={address.country}
                                onChange={handleChange}
                                className={`${input} bg-gray-50`}
                            />
                        </div>
                    </div>

                    {/* DEFAULT */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={address.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-gray-700">
                            Set as default address
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-7 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
