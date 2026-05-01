// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";


// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.message || "Please try again after some time");
//       } else {
//         toast.success("Login successfully");

//         const now = new Date();
//         const item = {
//           value: data.data.user,
//           expiry: now.getTime() + 7 * 24 * 60 * 60 * 1000,
//         };
//         localStorage.setItem("user", JSON.stringify(item));

//         router.refresh();        // refresh UI
//         router.push("/");        // redirect
//       }
//     } catch (err) {
//       toast.error("Please try again after some time");
//     } finally {
//       setLoading(false);
//     }
//   }


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

//         {/* Header */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Login
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Welcome back Please login to continue
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2
//                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2
//                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black"
//               required
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
//               {error}
//             </div>
//           )}

//           {/* Success */}
//           {message && (
//             <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-3 py-2">
//               {message}
//             </div>
//           )}

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="cursor-pointer w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-sm text-gray-500 mt-6 flex justify-center gap-2">
//           Don’t have an account?
//           <span
//             className="text-blue-600 hover:underline cursor-pointer"
//             onClick={() => router.push("/auth/signup")}
//           >
//             Sign up
//           </span>
//           <span
//             className="text-gray-400" // optional separator color
//           >
//             |
//           </span>
//           <span
//             className="text-blue-600 hover:underline cursor-pointer"
//             onClick={() => router.push("/auth/forgotpassword")}
//           >
//             Forgot Password
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Authcontext"; // ✅ AuthContext import

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth(); // ✅ global user updater

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Please try again after some time");
      } else {
        toast.success("Login successful");

        // ✅ store in localStorage for persistence
        const now = new Date();
        const item = {
          value: data.data.user,
          expiry: now.getTime() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem("user", JSON.stringify(item));

        // ✅ update global user
        setUser(data.data.user);

        router.refresh(); // refresh UI
        router.push("/"); // redirect
      }
    } catch (err) {
      toast.error("Please try again after some time");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 text-sm mt-2">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black placeholder-gray-400"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black placeholder-gray-400"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-blue-600 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            Sign up
          </button>
          <span className="text-gray-400"> | </span>
          <button
            type="button"
            onClick={() => router.push("/auth/forgotpassword")}
            className="text-blue-600 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            Forgot Password
          </button>
        </p>
      </div>
    </div>
  );
}
