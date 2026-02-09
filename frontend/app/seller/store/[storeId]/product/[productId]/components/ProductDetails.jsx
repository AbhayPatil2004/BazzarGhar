// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// // import { Button } from "@/components/ui/button";

// export default function ProductDetailsPage() {
//     const { productId, storeId } = useParams();
//     const router = useRouter();

//     const [product, setProduct] = useState(null);

//     useEffect(() => {
//         async function fetchProduct() {
//             console.log("Fetching:", storeId, productId);

//             const res = await fetch(
//                 `http://localhost:8000/seller/store/${storeId}/products/${productId}`,
//                 { credentials: "include" }
//             );

//             const data = await res.json();
//             console.log("DATA:", data);

//             setProduct(data?.data || null);
//         }


//         if (productId) fetchProduct();
//     }, [productId]);

//     if (!product) {
//         return (
//             <div className="flex justify-center items-center h-[60vh]">
//                 <p className="text-gray-500">Loading product...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-10">
//             <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Images */}
//                 <div>
//                     <img
//                         src={product.images?.[0]}
//                         alt={product.title}
//                         className="w-full h-[350px] object-cover rounded-xl"
//                     />

//                     <div className="flex gap-3 mt-4 overflow-x-auto">
//                         {product.images?.map((img, i) => (
//                             <img
//                                 key={i}
//                                 src={img}
//                                 className="h-20 w-20 object-cover rounded-lg border"
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Details */}
//                 <div className="flex flex-col">
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                         {product.title}
//                     </h1>

//                     <p className="text-gray-500 mt-2">{product.category}</p>

//                     <p className="text-green-600 text-2xl font-semibold mt-3">
//                         ₹ {product.finalPrice}
//                     </p>

//                     <p className="mt-4 text-gray-600 leading-relaxed">
//                         {product.description}
//                     </p>

//                     <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
//                         <div className="bg-gray-50 p-3 rounded-lg">
//                             <p className="text-gray-500">Stock</p>
//                             <p className="font-semibold">{product.stock}</p>
//                         </div>

//                         <div className="bg-gray-50 p-3 rounded-lg">
//                             <p className="text-gray-500">Rating</p>
//                             <p className="font-semibold">{product.rating}</p>
//                         </div>

//                         <div className="bg-gray-50 p-3 rounded-lg">
//                             <p className="text-gray-500">Returnable</p>
//                             <p className="font-semibold">
//                                 {product.isReturnable ? "Yes" : "No"}
//                             </p>
//                         </div>

//                         <div className="bg-gray-50 p-3 rounded-lg">
//                             <p className="text-gray-500">Delivery</p>
//                             <p className="font-semibold">{product.deliveryTime}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             {/* <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
//         <Button className="px-6 py-3">
//           Sponsor Product
//         </Button>

//         <Button
//           variant="outline"
//           className="px-6 py-3"
//           onClick={() =>
//             router.push(`/seller/store/${storeId}/product/${productId}/edit`)
//           }
//         >
//           Update Product Details
//         </Button>

//         <Button
//           variant="destructive"
//           className="px-6 py-3"
//         >
//           {product.isActive ? "Deactivate" : "Activate"}
//         </Button>
//       </div> */}

//             <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

//                 <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
//                     Sponsor Product
//                 </button>

//                 <button
//                     className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//                     onClick={() =>
//                         router.push(`/seller/store/${storeId}/product/${productId}/edit`)
//                     }
//                 >
//                     Update Product Details
//                 </button>

//                 <button className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition">
//                     {product.isActive ? "Deactivate" : "Activate"}
//                 </button>

//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
    const { productId, storeId } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        async function fetchProduct() {
            const res = await fetch(
                `http://localhost:8000/seller/store/${storeId}/products/${productId}`,
                { credentials: "include" }
            );

            const data = await res.json();
            const productData = data?.data || null;

            setProduct(productData);

            // yaha product nahi, productData use karo
            setIsActive(productData?.isActive);
        }


        if (productId && storeId) {
            fetchProduct();
        }
    }, [productId, storeId]);   // ALWAYS BOTH

    async function handelToggleActive() {
        try {
            const res = await fetch(
                `http://localhost:8000/seller/store/product/toggleactive/${productId}`,

                {
                    credentials: "include",
                    method: "PUT"
                }
            );

            if (!res.ok) {
                throw new Error("Please Try after some Time")
            }

            setIsActive(prev => !prev);
            if (isActive) {
                toast.success("product DeActivated Succesfullt")
            }
            else {
                toast.success("product Activated Succesfullt")
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Please Try after some Time")
        }
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    return (
        <div>
            {/* <h1>Product Details </h1> */}
            <div className="max-w-6xl mx-auto px-4 py-10">


                {/* Store Info */}
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={product.store?.logo}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <h2 className="font-semibold text-lg">
                        {product.store?.storeName}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Images + Video */}
                    <div>
                        {product.video?.length > 0 && (
                            <video
                                src={product.video[0]}
                                autoPlay
                                muted
                                loop
                                className="w-full h-[350px] object-cover rounded-xl mb-4"
                            />
                        )}

                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="w-full h-[350px] object-cover rounded-xl"
                        />

                        <div className="flex gap-3 mt-4 overflow-x-auto">
                            {product.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="h-20 w-20 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold">{product.title}</h1>

                        <p className="text-gray-500 mt-2">{product.category}</p>

                        <div className="flex items-center gap-3 mt-3">
                            <p className="text-green-600 text-2xl font-semibold">
                                ₹ {product.finalPrice}
                            </p>
                            {product.discountPercentage > 0 && (
                                <p className="text-sm text-red-500">
                                    {product.discountPercentage}% OFF
                                </p>
                            )}
                        </div>

                        <p className="mt-4 text-gray-600">{product.description}</p>

                        {/* Sizes */}
                        {product.sizes?.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Sizes</p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.map((s, i) => (
                                        <span key={i} className="px-3 py-1 border rounded-lg">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Colors</p>
                                <div className="flex gap-2">
                                    {product.colors.map((c, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full border"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Info cards */}
                        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                Stock: <b>{product.stock}</b>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                Rating: <b>{product.rating}</b>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                Returnable:{" "}
                                <b>{product.isReturnable ? "Yes" : "No"}</b>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                Delivery: <b>{product.deliveryTime}</b>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button className=" cursor-pointer w-[30%] py-3 rounded-xl bg-indigo-600 text-white">
                        Sponsor Product
                    </button>

                    <button
                        className=" cursor-pointer w-[30%] py-3 rounded-xl border"
                        onClick={() =>
                            router.push(
                                `/seller/store/${storeId}/product/${productId}/update`
                            )
                        }
                    >
                        Update Product Details
                    </button>

                    <button onClick={handelToggleActive}
                        className={` cursor-pointer w-[30%] py-3 rounded-xl border 
        ${isActive
                                ? "border-red-600 text-red-600"
                                : "border-green-600 text-green-600"}`}
                    >
                        {isActive ? "Deactivate" : "Activate"}
                    </button>
                </div>


            </div>
        </div>
    );
}
