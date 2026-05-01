"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Authcontext";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Shield,
  Store,
  ChevronRight,
} from "lucide-react";

export default function ProfileIcon() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem("user");
      setOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  const initials = user?.username
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Normalize role: support both "user" and "buyer" as buyer role
  const role = user?.role?.toLowerCase();
  const normalizedRole = role === "user" ? "buyer" : role; // "buyer" | "seller" | "admin"

  const navigateTo = (path) => {
    setOpen(false);
    router.push(path);
  };

  /* ========================= NOT LOGGED IN ========================= */
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/auth/login")}
          className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-700
                     hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white
                     hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          Sign Up
        </button>
      </div>
    );
  }

  /* ========================= LOGGED IN ========================= */
  // Build menu items based on role
  const commonItems = [
    {
      icon: <ShoppingBag size={16} />,
      label: "My Orders",
      onClick: () => navigateTo("/profile/myorder"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <Heart size={16} />,
      label: "Wishlist",
      onClick: () => navigateTo("/profile/wishlist"),
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      icon: <User size={16} />,
      label: "Profile",
      onClick: () => navigateTo("/profile"),
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  const sellerItems = [
    {
      icon: <LayoutDashboard size={16} />,
      label: "Seller Dashboard",
      onClick: () => navigateTo("/seller/dashboard"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: <ClipboardList size={16} />,
      label: "Order Management",
      onClick: () => navigateTo("/seller/orders"),
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: <Store size={16} />,
      label: "My Stores",
      onClick: () => navigateTo("/seller/store"),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  const adminItems = [
    {
      icon: <Shield size={16} />,
      label: "Admin Dashboard",
      onClick: () => navigateTo("/admin/dashboard"),
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: <ClipboardList size={16} />,
      label: "Order Management",
      onClick: () => navigateTo("/admin/orders"),
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  let roleSpecificItems = [];
  if (normalizedRole === "seller") roleSpecificItems = sellerItems;
  if (normalizedRole === "admin") roleSpecificItems = adminItems;

  // Role badge config
  const roleBadge = {
    buyer: { label: "Buyer", className: "bg-blue-100 text-blue-700" },
    seller: { label: "Seller", className: "bg-emerald-100 text-emerald-700" },
    admin: { label: "Admin", className: "bg-red-100 text-red-700" },
  };

  const badge = roleBadge[normalizedRole] || roleBadge.buyer;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer
                   ring-2 ring-transparent hover:ring-indigo-400
                   transition-all duration-300 ease-out
                   focus:outline-none focus:ring-indigo-500"
        id="profile-avatar-btn"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
        )}
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/80
                     rounded-2xl shadow-2xl z-[100] overflow-hidden
                     animate-scaleIn origin-top-right"
          id="profile-dropdown"
        >
          {/* User Info Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/30 flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-indigo-200 truncate">
                  {user.email}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Role-Specific Items */}
          {roleSpecificItems.length > 0 && (
            <div className="px-2 pt-2 pb-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {normalizedRole === "seller" ? "Seller Tools" : "Admin Tools"}
              </p>
              {roleSpecificItems.map((item, i) => (
                <MenuItemPremium key={`role-${i}`} {...item} />
              ))}
            </div>
          )}

          {/* Divider */}
          {roleSpecificItems.length > 0 && (
            <div className="mx-4 border-t border-gray-100" />
          )}

          {/* Common Items */}
          <div className="px-2 py-1">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Account
            </p>
            {commonItems.map((item, i) => (
              <MenuItemPremium key={`common-${i}`} {...item} />
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 px-2 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-red-600 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
              id="profile-logout-btn"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                <LogOut size={16} />
              </span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- Premium Menu Item -------- */
function MenuItemPremium({ icon, label, onClick, color, bg }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                 hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${bg} ${color} transition-colors`}
      >
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
      <ChevronRight
        size={14}
        className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors"
      />
    </button>
  );
}
