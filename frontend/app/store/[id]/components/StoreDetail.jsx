// "use client";

// import { useRouter } from "next/navigation";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaStore,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import { MdCategory } from "react-icons/md";
// import { useAuth } from "../../../context/Authcontext";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function StoreDetailsPage({
//   store,
//   owner,
//   subscribed: initialSubscribed,
//   subscriberCount: initialCount,
// }) {
//   const { user } = useAuth();
//   const router = useRouter();

//   const [subscribed, setSubscribed] = useState(initialSubscribed ?? false);
//   const [subscriberCount, setSubscriberCount] = useState(initialCount ?? 0);
//   const [loading, setLoading] = useState(false);

//   const [userRating, setUserRating] = useState(0);
//   const [ratingLoading, setRatingLoading] = useState(false);

//   if (!store) return null;

//   // ✅ Check subscription on load (sync with backend)
//   useEffect(() => {
//     const checkSubscription = async () => {
//       if (!user) return;

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/store/subscription/${store._id}`,
//           { credentials: "include" }
//         );

//         const data = await res.json();

//         if (res.ok) {
//           setSubscribed(data.data.isSubscribed);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     checkSubscription();
//   }, [user, store._id]);

//   // ⭐ Subscribe / Unsubscribe
//   const handleSubscribe = async () => {
//     if (!user) {
//       router.push("/auth/signup");
//       return;
//     }

//     if (loading) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/store/subscribe/${store._id}`,
//         {
//           method: "POST",
//           credentials: "include",
//         }
//       );

//       const data = await res.json();
//       console.log(res.status, data);

//       if (!res.ok) throw new Error(data.message);

//       // ✅ Backend sync (IMPORTANT)
//       setSubscribed(data.data.isSubscribed);
//       setSubscriberCount(data.data.subscriberCount);

//       // 🔥 Toast
//       if (data.data.isSubscribed) {
//         toast.success("Subscribed successfully 🎉");
//       } else {
//         toast("Unsubscribed 👋");
//       }

//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⭐ Rating
//   const handleRating = async (value) => {
//     if (!user) {
//       router.push("/auth/signup");
//       return;
//     }

//     if (ratingLoading) return;

//     try {
//       setRatingLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/store/rate/${store._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ rating: value }),
//         }
//       );

//       if (!res.ok) throw new Error("Rating failed");

//       setUserRating(value);
//       toast.success("Rating submitted ⭐");

//     } catch (err) {
//       console.error(err);
//       toast.error("Rating failed ❌");
//     } finally {
//       setRatingLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-14">

//       {/* HERO */}
//       <div className="relative h-44 sm:h-60 md:h-80 w-full">
//         <img
//           src={store.banner || "/default-banner.jpg"}
//           alt="Store Banner"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>

//       <div className="max-w-6xl mx-auto px-3 sm:px-5">

//         {/* HEADER */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 -mt-20 relative z-10 border border-gray-200">

//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

//             {/* LOGO */}
//             <div className="relative group">
//               <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                 <img
//                   src={store.logo || "/default-logo.png"}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//               </div>
//               <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
//             </div>

//             {/* INFO */}
//             <div className="flex-1 text-center sm:text-left w-full">

//               <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

//                 <div>
//                   <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
//                     <FaStore className="text-indigo-600" />
//                     {store.storeName}
//                   </h1>

//                   <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 justify-center sm:justify-start">
//                     <MdCategory />
//                     {store.category || "General"}
//                   </p>
//                 </div>

//                 {/* BUTTON */}
//                 {!user ? (
//                   <button
//                     onClick={() => router.push("/auth/signup")}
//                     className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:scale-105 transition"
//                   >
//                     Signup to Subscribe
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleSubscribe}
//                     disabled={loading}
//                     className={`cursor-pointer px-4 py-2 rounded-xl text-sm text-white shadow transition transform hover:scale-105 ${subscribed
//                         ? "bg-gray-600 hover:bg-gray-700"
//                         : "bg-gradient-to-r from-indigo-600 to-purple-600"
//                       }`}
//                   >
//                     {loading
//                       ? "Please wait..."
//                       : subscribed
//                         ? "Unsubscribe"
//                         : "Subscribe"}
//                   </button>
//                 )}
//               </div>

//               {/* ⭐ RATING */}
//               <div className="mt-3 flex flex-col sm:flex-row gap-3">
//                 <div className="flex gap-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <span
//                       key={star}
//                       onClick={() => handleRating(star)}
//                       className={`cursor-pointer text-xl ${star <= (userRating || Math.round(store.rating || 0))
//                           ? "text-yellow-400"
//                           : "text-gray-300"
//                         }`}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>

//                 <span className="text-gray-600 text-sm">
//                   ({store.rating?.toFixed(1) || "0.0"})
//                 </span>
//               </div>

//               <div className="flex gap-4 mt-4 text-sm text-gray-600">
//                 <span>👥 {subscriberCount} subscribers</span>
//                 <span>🛒 {store.totalProducts}</span>
//                 <span>📦 {store.totalOrders}</span>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ABOUT */}
//         <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
//           <h2 className="text-xl font-semibold mb-3">About Store</h2>
//           <p className="text-gray-600">
//             {store.description || "No description available."}
//           </p>
//         </div>

//         {/* PRODUCTS */}
//         <div className="mt-6 bg-white p-6 rounded-2xl shadow border">
//           <h2 className="text-xl font-semibold mb-4">Products We Sell</h2>

//           <div className="flex flex-wrap gap-3">
//             {store.storeProducts?.length > 0 ? (
//               store.storeProducts.map((product, i) => (
//                 <span
//                   key={i}
//                   className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm"
//                 >
//                   {product.replace(/"/g, "").trim()}
//                 </span>
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">No products listed</p>
//             )}
//           </div>
//         </div>

//         {/* OWNER + ADDRESS */}
//         <div className="mt-6 grid md:grid-cols-2 gap-6">

//           {/* OWNER */}
//           <div className="bg-white p-6 rounded-2xl shadow border">
//             <h2 className="text-xl font-semibold mb-4">Store Owner</h2>

//             <div className="flex items-center gap-4">
//               <img
//                 src={owner?.avatar || "/default-avatar.png"}
//                 className="w-16 h-16 rounded-full object-cover"
//               />

//               <div>
//                 <p className="font-semibold">{owner?.username || "Unknown"}</p>

//                 <p className="text-sm text-gray-500 flex gap-2 items-center">
//                   <FaEnvelope /> {owner?.email || "N/A"}
//                 </p>

//                 {owner?.phone && (
//                   <p className="text-sm text-gray-500 flex gap-2 items-center">
//                     <FaPhoneAlt /> {owner.phone}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ADDRESS */}
//           <div className="bg-white p-6 rounded-2xl shadow border">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <FaMapMarkerAlt className="text-red-500" />
//               Store Address
//             </h2>

//             <p className="text-gray-600 text-sm mt-3 leading-relaxed">
//               {store.address?.street || "N/A"}, <br />
//               {store.address?.city || ""} {store.address?.state || ""} <br />
//               {store.address?.postalCode || ""} <br />
//               {store.address?.country || ""}
//             </p>
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="mt-8 grid grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-xl shadow text-center">
//             <p className="text-sm text-gray-500">Commission</p>
//             <p className="font-bold text-lg">
//               {store.commissionRate ?? 0}%
//             </p>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow text-center">
//             <p className="text-sm text-gray-500">Active</p>
//             <p className="font-bold text-lg">
//               {store.isActive ? "Yes" : "No"}
//             </p>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow text-center">
//             <p className="text-sm text-gray-500">Approved</p>
//             <p className="font-bold text-lg">
//               {store.isApproved ? "Yes" : "No"}
//             </p>
//           </div>
//         </div>


//       </div>
//     </div>
//   );
// }



"use client";

import { useRouter } from "next/navigation";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useAuth } from "../../../context/Authcontext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function StoreDetailsPage({
  store,
  owner,
  subscribed: initialSubscribed,
  subscriberCount: initialCount,
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [subscribed, setSubscribed] = useState(initialSubscribed ?? false);
  const [subscriberCount, setSubscriberCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(store.rating || 0);
  const [ratingLoading, setRatingLoading] = useState(false);

  if (!store) return null;

  // ✅ Check subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/subscription/${store._id}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          setSubscribed(data.data.isSubscribed);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkSubscription();
  }, [user, store._id]);

  // ✅ ⭐ FETCH RATING (NEW)
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/rating/${store._id}`,
          { credentials: "include" }
        );

        const data = await res.json();

        console.log(data)
        if (res.ok) {
          setUserRating(data.data.userRating);
          setAvgRating(data.data.avgRating);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRating();
  }, [store._id]);

  // ⭐ Subscribe / Unsubscribe
  const handleSubscribe = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/subscribe/${store._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSubscribed(data.data.isSubscribed);
      setSubscriberCount(data.data.subscriberCount);

      if (data.data.isSubscribed) {
        toast.success("Subscribed successfully 🎉");
      } else {
        toast("Unsubscribed 👋");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ RATE STORE (UPDATED)
  const handleRating = async (value) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (ratingLoading) return;

    try {
      setRatingLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/rate/${store._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ rating: value }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ backend sync
      setUserRating(data.data.userRating);
      setAvgRating(data.data.avgRating);

      toast.success("Rating submitted ⭐");
    } catch (err) {
      console.error(err);
      toast.error("Rating failed ❌");
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-14">

      {/* HERO */}
      <div className="relative h-44 sm:h-60 md:h-80 w-full">
        <img
          src={store.banner || "/default-banner.jpg"}
          alt="Store Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-5">

        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 -mt-20 relative z-10 border border-gray-200">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* LOGO */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={store.logo || "/default-logo.png"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* INFO */}
            <div className="flex-1 text-center sm:text-left w-full">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                    <FaStore className="text-indigo-600" />
                    {store.storeName}
                  </h1>

                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 justify-center sm:justify-start">
                    <MdCategory />
                    {store.category || "General"}
                  </p>
                </div>

                {!user ? (
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:scale-105 transition"
                  >
                    Signup to Subscribe
                  </button>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm text-white shadow transition transform hover:scale-105 ${subscribed
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600"
                      }`}
                  >
                    {loading
                      ? "Please wait..."
                      : subscribed
                        ? "Unsubscribe"
                        : "Subscribe"}
                  </button>
                )}
              </div>

              {/* ⭐ RATING */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`cursor-pointer text-xl ${star <= (userRating || Math.round(avgRating))
                          ? "text-yellow-400"
                          : "text-gray-300"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-gray-600 text-sm">
                  ({avgRating?.toFixed(1) || "0.0"})
                </span>
              </div>

              <div className="flex gap-4 mt-4 text-sm text-gray-600">
                <span>👥 {subscriberCount} subscribers</span>
                <span>🛒 {store.totalProducts}</span>
                <span>📦 {store.totalOrders}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-3">About Store</h2>
          <p className="text-gray-600">
            {store.description || "No description available."}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Products We Sell</h2>

          <div className="flex flex-wrap gap-3">
            {store.storeProducts?.length > 0 ? (
              store.storeProducts.map((product, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                >
                  {product.replace(/"/g, "").trim()}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No products listed</p>
            )}
          </div>
        </div>

        {/* OWNER + ADDRESS */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">

          {/* OWNER */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Store Owner</h2>

            <div className="flex items-center gap-4">
              <img
                src={owner?.avatar || "/default-avatar.png"}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">{owner?.username || "Unknown"}</p>

                <p className="text-sm text-gray-500 flex gap-2 items-center">
                  <FaEnvelope /> {owner?.email || "N/A"}
                </p>

                {owner?.phone && (
                  <p className="text-sm text-gray-500 flex gap-2 items-center">
                    <FaPhoneAlt /> {owner.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Store Address
            </h2>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              {store.address?.street || "N/A"}, <br />
              {store.address?.city || ""} {store.address?.state || ""} <br />
              {store.address?.postalCode || ""} <br />
              {store.address?.country || ""}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Commission</p>
            <p className="font-bold text-lg">
              {store.commissionRate ?? 0}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Active</p>
            <p className="font-bold text-lg">
              {store.isActive ? "Yes" : "No"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="font-bold text-lg">
              {store.isApproved ? "Yes" : "No"}
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}