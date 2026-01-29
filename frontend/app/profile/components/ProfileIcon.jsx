"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileIcon() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  // If user clicks avatar but not logged in
  const handleAvatarClick = () => {
    if (!user) {
      router.push("/auth/signin");
    } else {
      setOpen(!open);
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:8000/user/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    // Always clear client state
    localStorage.removeItem("user");
    // router.replace("/auth/signin"); // or "/"
  }
};


  const initials = user?.username
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        onClick={handleAvatarClick}
        className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden
                   flex items-center justify-center cursor-pointer
                   font-semibold hover:ring-2 hover:ring-gray-400 transition"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-700">
            {user ? initials : "?"}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && user && (
        <div
          className="absolute right-0 mt-3 w-60 bg-white border
                     border-gray-200 rounded-xl shadow-lg z-50"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Role Based Links */}
          <div className="py-2">
            {user.role === "user" && (
              <>
                <MenuItem label="My Orders" />
                <MenuItem label="My Wishlist" />
              </>
            )}

            {user.role === "seller" && (
              <>
                <MenuItem label="Seller Dashboard" />
                <MenuItem label="My Stores" />
              </>
            )}

            {user.role === "admin" && (
              <MenuItem label="Admin Dashboard" />
            )}

            <MenuItem
              label="Profile"
              onClick={() => router.push("/profile")}
            />
          </div>

          {/* Logout */}
          <div className="border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm
                         text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- Menu Item -------- */

function MenuItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm
                 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
