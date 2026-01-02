"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP + reset
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
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

  // Step 1: send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || "OTP sent successfully!"}`);
        setStep(2); // move to step 2
      } else {
        setMessage(`❌ ${data.error || data.message || "Failed to send OTP."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Check server or network.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP + reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || "Password reset successfully!"}`);
        setFormData({ email: "", otp: "", newPassword: "" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(`❌ ${data.error || data.message || "Reset failed."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Check server or network.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      setMessage("❌ Please enter your email first to resend OTP.");
      return;
    }
    setResendLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/user/forgot-password/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || "OTP resent successfully!"}`);
      } else {
        setMessage(`❌ ${data.error || data.message || "Failed to resend OTP."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Check server or network.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 text-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Forgot Password
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

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
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
                readOnly
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

            <div>
              <label className="block mb-2 font-semibold">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="w-full mt-3 bg-gray-800 text-blue-400 hover:bg-blue-400 hover:text-white border border-blue-400 font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {resendLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Back to{" "}
          <a href="/auth/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
