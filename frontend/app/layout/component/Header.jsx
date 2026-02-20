"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Store,
  Home,
  Boxes,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import ProfileIcon from "../../profile/components/ProfileIcon.jsx";

export default function Header() {
  const role = "user"; // user | seller | admin
  const cartCount = 3;

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className=" hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold tracking-wider"
          >
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow">
              <Store size={22} />
            </div>
            <span className="uppercase">BazzarGhar</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-10 text-gray-700">
            <Link className="hover:text-indigo-600 transition" href="/home">Home</Link>
            <Link className="hover:text-indigo-600 transition" href="/product">Products</Link>
            <Link className="hover:text-indigo-600 transition" href="/store">Stores</Link>
            {role !== "admin" && (
              <Link
                href="/store/create"
                className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition"
              >
                Sell on BazzarGhar
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative">
              <ShoppingCart size={24} />
              {/* {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )} */}
            </Link>
            <ProfileIcon />
          </div>
        </div>
      </header>

      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Store size={18} />
            </div>
            BazzarGhar
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart size={22} />
              {/* {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )} */}
            </Link>
            <ProfileIcon />
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <div className="flex justify-around items-center h-16 text-[11px] text-gray-600">
          <Link href="/home" className="flex flex-col items-center gap-1 hover:text-indigo-600">
            <Home size={20} />
            Home
          </Link>
          <Link href="/product" className="flex flex-col items-center gap-1 hover:text-indigo-600">
            <Boxes size={20} />
            Products
          </Link>
          <Link href="/store" className="flex flex-col items-center gap-1 hover:text-indigo-600">
            <ShoppingBag size={20} />
            Stores
          </Link>
          {role !== "admin" && (
            <Link
              href="/sell"
              className="flex flex-col items-center gap-1 text-indigo-600"
            >
              <DollarSign size={20} />
              Sell
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
