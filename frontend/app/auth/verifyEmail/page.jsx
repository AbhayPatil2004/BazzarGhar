"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText };
      }

      if (response.ok) {
        setMessage(`✅ ${data.message || "Email verified successfully!"}`);
        setFormData({ email: "", otp: "" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(`❌ ${data.error || data.message || "Verification failed."}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("❌ Something went wrong. Check server or network.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      setMessage("❌ Please enter your email first to resend OTP.");
      return;
    }
    setResendLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include",
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText };
      }

      if (response.ok) {
        setMessage(`✅ ${data.message || "OTP resent successfully!"}`);
      } else {
        setMessage(`❌ ${data.error || data.message || "Failed to resend OTP."}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("❌ Something went wrong. Check server or network.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 text-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Verify Email
        </h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-4 w-full bg-gray-800 text-blue-400 hover:bg-blue-400 hover:text-white border border-blue-400 font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {resendLoading ? "Resending OTP..." : "Resend OTP"}
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Go back to{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
