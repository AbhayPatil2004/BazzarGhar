"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Authcontext"; // ✅ AuthContext import

export default function VerifyForgotPasswordPage() {
  const router = useRouter();
  const { setUser } = useAuth(); // ✅ global user updater

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    // Validate OTP format
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    const email = localStorage.getItem("forgotEmail");
    if (!email) {
      setError("Email not found. Please start the forgot password process again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verifyforgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        setOtp(""); // Clear OTP on error
        toast.error(data.message || "Invalid OTP");
      } else {
        toast.success(data.message || "OTP verified successfully");
        setMessage(data.message);

        // ✅ Navigate to reset password page
        setTimeout(() => {
          router.refresh();   // refresh UI
          router.push("/auth/resetpassword");   // redirect to reset password
        }, 1500);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Please try again after some time");
      setOtp(""); // Clear OTP on error
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp(e) {
    e.preventDefault();
    setResendLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/resendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent successfully");
        setError("");
        toast.success("New OTP sent to your email!");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setMessage("");
        toast.error("Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Something went wrong. Please try again.");
      setMessage("");
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6-digit OTP sent to your email 📧
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
                setOtp(value);
                setError(""); // Clear error when user types
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              inputMode="numeric"
              className="w-full text-center tracking-widest text-xl rounded-lg border border-gray-300 px-4 py-3
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black placeholder-gray-400"
              disabled={loading}
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-3 py-2">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="cursor-pointer w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Didn't receive OTP?{" "}
          <button
            onClick={resendOtp}
            type="button"
            disabled={resendLoading || loading}
            className="text-blue-600 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {resendLoading ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}
