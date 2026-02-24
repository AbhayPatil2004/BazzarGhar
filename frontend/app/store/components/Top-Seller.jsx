// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function TopSellersPage() {
//     const [stores, setStores] = useState([]);
//     const router = useRouter();

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/top-seller`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("API RESPONSE:", data );

//                 // Handle different possible structures safely
//                 if (Array.isArray(data?.data)) {
//                     setStores(data.data);
//                 } else if (Array.isArray(data?.data?.stores)) {
//                     setStores(data.data.stores);
//                 } else {
//                     setStores([]);
//                 }
//             })
//             .catch((err) => console.error(err));
//     }, []);

//     return (
//         <div className="w-full px-6 py-10">
//             <h1 className="text-3xl font-bold mb-6">Top Sellers</h1>

//             <div className="flex gap-6 overflow-x-auto scrollbar-hide">
//                 {stores.map((store) => (
//                     <div
//                         key={store._id}
//                         onClick={() => router.push(`/store/${store._id}`)}
//                         className="min-w-[280px] cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
//                     >
//                         {/* Banner */}
//                         {
//                             store.banner != "" ?
//                                 <img
//                                     src={store.banner}
//                                     alt={store.storeName}
//                                     className="w-full h-36 object-cover rounded-t-2xl"
//                                 /> :
//                                 <div className="w-full h-36 object-cover rounded-t-2xl text-center align-middle">
//                                     { store.storeName }
//                                 </div>
//                         }

//                         {/* Content */}
//                         <div className="p-4">
//                             <div className="flex items-center gap-3">
//                                 {store.logo ? (
//                                     <img
//                                         src={store.logo}
//                                         alt="logo"
//                                         className="w-14 h-14 rounded-full border object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-14 h-14 rounded-full border bg-gray-200 flex items-center justify-center text-sm font-semibold">
//                                         {store.storeName?.charAt(0)}
//                                     </div>
//                                 )}
//                                 <h2 className="text-lg font-semibold">
//                                     {store.storeName}
//                                 </h2>
//                             </div>

//                             <div className="mt-4 text-sm text-gray-600 space-y-1">
//                                 <p>⭐ Rating: {store.rating}</p>
//                                 <p>📦 Products: {store.totalProducts}</p>
//                                 <p>🛒 Orders: {store.totalOrders}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopSellersPage() {
  const [stores, setStores] = useState([]);
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/top-seller`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setStores(data.data);
        } else if (Array.isArray(data?.data?.stores)) {
          setStores(data.data.stores);
        } else {
          setStores([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full px-6 py-10 relative">
      <h1 className="text-3xl font-bold mb-6">Top Sellers</h1>

      {/* Left Button (Desktop Only) */}
      <button
        onClick={() => scroll("left")}
        className=" cursor-pointer hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 z-10"
      >
        ◀
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto lg:overflow-hidden scroll-smooth"
      >
        {stores.map((store) => (
          <div
            key={store._id}
            onClick={() => router.push(`/store/${store._id}`)}
            className="min-w-[280px] bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Banner */}
            {store.banner?.trim() ? (
              <img
                src={store.banner}
                alt={store.storeName}
                className="w-full h-36 object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-t-2xl">
                No Image
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center gap-3">
                {store.logo?.trim() ? (
                  <img
                    src={store.logo}
                    alt="logo"
                    className="w-14 h-14 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border bg-gray-200 flex items-center justify-center text-sm font-semibold">
                    {store.storeName?.charAt(0)}
                  </div>
                )}
                <h2 className="text-lg font-semibold">
                  {store.storeName}
                </h2>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>⭐ Rating: {store.rating}</p>
                <p>📦 Products: {store.totalProducts}</p>
                <p>🛒 Orders: {store.totalOrders}</p>
              </div>

              {/* Store Products Preview */}
              {Array.isArray(store.storeProducts) &&
                store.storeProducts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {store.storeProducts.slice(0, 4).map((product, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Button (Desktop Only) */}
      <button
        onClick={() => scroll("right")}
        className="cursor-pointer hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 z-10"
      >
        ▶
      </button>
    </div>
  );
}