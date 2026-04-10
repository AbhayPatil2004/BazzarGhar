"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/Authcontext";

// import OwnerStoresPage from "../seller/OwnerStores.jsx"
// import StoreOpeningRequests from "../admin/StoreOprningrequest.jsx";

export default function ProfilePage() {

    const router = useRouter();
    const { user: authUser } = useAuth();

    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [editingPhone, setEditingPhone] = useState(false);
    const [phone, setPhone] = useState("");

    const [uploading, setUploading] = useState(false);

    // 🔹 Check authentication from localStorage or context
    useEffect(() => {
        const checkAuth = () => {
            // Check localStorage first
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setRole(parsed.value?.role || null);
                    setIsAuthenticated(true);
                    return;
                } catch (error) {
                    console.error("Failed to parse stored user:", error);
                    localStorage.removeItem("user");
                }
            }

            // Check auth context
            if (authUser) {
                setRole(authUser.role || null);
                setIsAuthenticated(true);
                return;
            }

            // No auth found, redirect to login
            console.log("No authentication found, redirecting to login");
            router.push("/auth/login");
        };

        checkAuth();
    }, [authUser, router]);

    // 🔹 Fetch profile from API
    async function fetchProfile() {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                console.log("API returned error, redirecting to login");
                router.push("/auth/login");
                return;
            }

            setUser(data.data);
            setPhone(data.data?.phone || "");
        } catch (err) {
            console.error("Profile fetch error:", err);
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [isAuthenticated]);


    async function handleAvatarUpload(e) {

        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,

            });

            const uploadData = await uploadRes.json();

            const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ avatar: uploadData.url }),
            });

            if (updateRes.ok) {
                setUser((prev) => ({ ...prev, avatar: uploadData.url }));
            }
        } catch (err) {
            console.error("Avatar upload failed", err);
        } finally {
            setUploading(false);
        }
    }


    async function handlePhoneUpdate() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ phone }),
            });

            if (res.ok) {
                setUser((prev) => ({ ...prev, phone }));
                setEditingPhone(false);
            }
        } catch (err) {
            console.error("Phone update failed", err);
        }
    }


    // 🔹 Logout
    async function handleLogout() {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("user");
            router.push("/auth/login");
        } catch (err) {
            console.error("Logout error:", err);
            router.push("/auth/login");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Unable to load profile</p>
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="px-6 py-2 bg-black text-white rounded-lg"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>

            <div className="text-black min-h-screen bg-gray-100 flex justify-center px-4 py-10">
                <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="absolute top-6 right-6 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white"
                    >
                        Logout
                    </button>

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-black to-gray-800 px-8 py-10 text-center">
                        <div className="relative inline-block">
                            <img
                                src={user.avatar || "/vercel.svg"}
                                className="w-28 h-28 rounded-full border-4 border-white object-cover"
                                alt="User Avatar"
                            />
                            <label className="absolute bottom-1 right-1 bg-black text-white rounded-full p-1 cursor-pointer">
                                ✏️
                                <input hidden type="file" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-white">{user.username}</h1>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>

                    {/* BODY */}
                    <div className="p-8 space-y-10">

                        {/* ACCOUNT INFO */}
                        <section>
                            <h2 className="text-xl font-semibold mb-6">Account Information</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                {/* Role */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-medium capitalize">{user.role}</p>
                                </div>

                                {/* Phone */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <button onClick={() => setEditingPhone(!editingPhone)}>✏️</button>
                                    </div>

                                    {editingPhone ? (
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                            <button
                                                onClick={handlePhoneUpdate}
                                                className="bg-black text-white px-3 rounded"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="font-medium mt-2">{user.phone || "Not added"}</p>
                                    )}
                                </div>

                                {/* Email Verified */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="text-sm text-gray-500">Email Verified</p>
                                    <p className={`font-medium mt-2 ${user.isEmailVerified ? "text-green-600" : "text-red-600"}`}>
                                        {user.isEmailVerified ? "Verified" : "Not Verified"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ADDRESSES */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                                <button onClick={() => router.push("/profile/address/edit")}>✏️</button>
                            </div>

                            {(!user.address || user.address.length === 0) ? (
                                <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-500">
                                    No addresses added yet
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.address.map((addr, index) => (
                                        <div key={index} className="border rounded-xl p-5 shadow-sm bg-white">
                                            <div className="flex justify-between mb-2 items-center">
                                                <h3 className="font-semibold">{addr.label}</h3>
                                                {addr.isDefault && (
                                                    <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-700">{addr.fullName}</p>
                                            <p className="text-gray-700">{addr.street}, {addr.city}</p>
                                            <p className="text-gray-700">{addr.state} - {addr.postalCode}</p>
                                            <p className="text-gray-700">{addr.country}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </div>

            {/*admin pannel  */}
            {/* ROLE BASED DASHBOARD */}
            {/* <div className="mt-10">

                {role === "admin" && (
                    <StoreOpeningRequests />
                )}

                {role === "seller" && (
                    <OwnerStoresPage />
                )}

                {role === "user" && (
                    <div className="text-center text-gray-500">
                        No dashboard available for this account
                    </div>
                )}

            </div> */}


        </div>
    );
}
