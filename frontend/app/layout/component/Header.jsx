"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Store,
  ChevronDown,
  Home,
  Boxes,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import ProfileIcon from '../../profile/components/ProfileIcon.jsx'

export default function Header() {
  const role = "user"; // "user" | "seller" | "admin"
  const cartCount = 3;

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-semibold tracking-wide"
          >
            <Store size={28} className="text-indigo-600" />
            <span className="tracking-[0.2em] uppercase">Aurastore</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-10 font-medium text-lg">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/stores">Stores</Link>
            {role !== "admin" && (
              <Link href="/sell" className="text-indigo-600 font-semibold">
                Sell on Aurastore
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {role === "user" && (
              <Link href="/cart" className="relative">
                <ShoppingCart size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile */}
            {/* <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <User size={28} />
                <ChevronDown size={18} />
              </button>

              {open && (
                <div className="absolute right-0 mt-4 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">
                  {role === "user" && (
                    <Link href="/orders" className="block px-5 py-3 hover:bg-gray-100">
                      My Orders
                    </Link>
                  )}

                  {role !== "user" && (
                    <Link
                      href={`/${role}/dashboard`}
                      className="block px-5 py-3 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link href="/profile" className="block px-5 py-3 hover:bg-gray-100">
                    Profile
                  </Link>

                  <button className="w-full text-left px-5 py-3 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div> */}

            <ProfileIcon/>
          </div>
        </div>
      </header>

      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="h-16 px-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-widest"
          >
            <Store size={22} className="text-indigo-600" />
            <span>Aurastore</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {role === "user" && (
              <Link href="/cart" className="relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-1.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {/* <Link href="/profile">
              <User size={24} />
            </Link> */}

            <ProfileIcon/>
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <div className="flex justify-around items-center h-16 text-xs font-medium">

          <Link href="/" className="flex flex-col items-center gap-1">
            <Home size={20} />
            Home
          </Link>

          <Link href="/products" className="flex flex-col items-center gap-1">
            <Boxes size={20} />
            Products
          </Link>

          <Link href="/stores" className="flex flex-col items-center gap-1">
            <ShoppingBag size={20} />
            Stores
          </Link>

          {role !== "admin" && (
            <Link href="/sell" className="flex flex-col items-center gap-1 text-indigo-600">
              <DollarSign size={20} />
              Sell on AuraStore
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for mobile headers */}
      {/* <div className="md:hidden h-16" />
      <div className="md:hidden h-16" /> */}
    </>
  );
}
