"use client";

import { useEffect, useState } from "react";

export default function AdminHeader() {
  const [user, setUser] = useState({ username: "Admin", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("storedUser raw:", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Check if value exists
        const userValue = parsedUser.value || {};

        setUser({
          username: userValue.username || "Admin",
          email: userValue.email || "",
        });
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  // Greeting based on time
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const hour = today.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  else if (hour >= 17) greeting = "Good Evening";

  return (
    <div className="mt-20 sm:mt-5 mb-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left section */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Admin / Dashboard</p>

            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-gray-500 max-w-lg">
              {`${greeting}, ${user.username}!`} <br />
              Email: <span className="font-medium text-gray-700">{user.email}</span>
            </p>
          </div>

          {/* Right section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400">Today</p>
              <p className="text-sm font-medium text-gray-700">{formattedDate}</p>
            </div>

            <button className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center gap-2">
              ⏳ Store Opening Requests
            </button>
          </div>
        </div>

        <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-gray-900 via-gray-500 to-gray-200" />
      </div>
    </div>
  );
}
