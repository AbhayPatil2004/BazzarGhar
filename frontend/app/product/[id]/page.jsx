// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/Authcontext";
// import { Heart, Truck, RotateCcw, ShoppingCart, Zap, MapPin, Mail, Phone, Star, Shield, TrendingUp, Award, Share2, Check } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// // Color to Hex mapping with comprehensive colors
// const colorMap = {
//   "red": "#EF4444",
//   "Red": "#EF4444",
//   "blue": "#3B82F6",
//   "Blue": "#3B82F6",
//   "green": "#22C55E",
//   "Green": "#22C55E",
//   "black": "#1F2937",
//   "Black": "#1F2937",
//   "white": "#FFFFFF",
//   "White": "#FFFFFF",
//   "yellow": "#FBBF24",
//   "Yellow": "#FBBF24",
//   "pink": "#EC4899",
//   "Pink": "#EC4899",
//   "purple": "#A855F7",
//   "Purple": "#A855F7",
//   "orange": "#F97316",
//   "Orange": "#F97316",
//   "gray": "#9CA3AF",
//   "Gray": "#9CA3AF",
//   "grey": "#9CA3AF",
//   "brown": "#92400E",
//   "Brown": "#92400E",
//   "navy": "#001F3F",
//   "Navy": "#001F3F",
//   "maroon": "#800000",
//   "Maroon": "#800000",
//   "teal": "#14B8A6",
//   "Teal": "#14B8A6",
//   "cyan": "#06B6D4",
//   "Cyan": "#06B6D4",
//   "lime": "#84CC16",
//   "Lime": "#84CC16",
//   "indigo": "#4F46E5",
//   "Indigo": "#4F46E5",
//   "violet": "#6366F1",
//   "Violet": "#6366F1",
//   "rose": "#F43F5E",
//   "Rose": "#F43F5E",
//   "slate": "#64748B",
//   "Slate": "#64748B",
//   "silver": "#C0C0C0",
//   "Silver": "#C0C0C0",
//   "gold": "#FFD700",
//   "Gold": "#FFD700",
//   "beige": "#F5F5DC",
//   "Beige": "#F5F5DC",
//   "cream": "#FFFDD0",
//   "Cream": "#FFFDD0",
//   "khaki": "#F0E68C",
//   "Khaki": "#F0E68C",
//   "turquoise": "#40E0D0",
//   "Turquoise": "#40E0D0",
// };

// function getColorHex(colorName) {
//   if (!colorName) return "#D1D5DB";
//   return colorMap[colorName] || colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1)] || "#9CA3AF";
// }

// // Sanitize strings to remove extra quotes
// function sanitizeString(str) {
//   if (!str) return "";
//   return String(str)
//     .replace(/^["']|["']$/g, "") // Remove leading/trailing quotes
//     .replace(/\\"/g, '"') // Unescape double quotes
//     .replace(/\\'/g, "'") // Unescape single quotes
//     .trim();
// }

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const productId = params.id;

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Track current media (image or video)
//   const [mediaType, setMediaType] = useState("image"); // Track if current media is image or video
//   const [wishlisted, setWishlisted] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [buyingNow, setBuyingNow] = useState(false);

//   // Fetch product details
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/product/details/${productId}`, {
//           credentials: "include",
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           setError(data.message || "Failed to fetch product");
//           return;
//         }

//         setProduct(data.data);
        
//         // Set default selections
//         if (data.data.sizes?.length > 0) {
//           setSelectedSize(data.data.sizes[0]);
//         }
//         if (data.data.colors?.length > 0) {
//           setSelectedColor(data.data.colors[0]);
//         }
//       } catch (err) {
//         setError("Error fetching product details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId]);

//   const handleAddToCart = async () => {
//     if (!user) {
//       router.push("/auth/signup");
//       return;
//     }

//     if (product.stock === 0) {
//       toast.error("Product is out of stock", {
//         position: "top-center",
//         duration: 3000,
//       });
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       const res = await fetch(
//         `${API_BASE}/cart/add/${productId}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             quantity,
//             size: selectedSize || undefined,
//             color: selectedColor || undefined,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.message || "Failed to add to cart", {
//           position: "top-center",
//           duration: 3000,
//         });
//       } else {
//         toast.success("Added to cart successfully! 🛒", {
//           position: "top-center",
//           duration: 2500,
//         });
//       }
//     } catch (err) {
//       toast.error("Error adding to cart", {
//         position: "top-center",
//         duration: 3000,
//       });
//       console.error(err);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const handleBuyNow = async () => {
//     if (!user) {
//       router.push("/auth/signup");
//       return;
//     }

//     if (product.stock === 0) {
//       toast.error("Product is out of stock", {
//         position: "top-center",
//         duration: 3000,
//       });
//       return;
//     }

//     setBuyingNow(true);
//     try {
//       // First add to cart
//       const res = await fetch(
//         `${API_BASE}/cart/add/${productId}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             quantity,
//             size: selectedSize || undefined,
//             color: selectedColor || undefined,
//           }),
//         }
//       );

//       if (res.ok) {
//         // Redirect to checkout/cart page
//         router.push("/profile/cart");
//       } else {
//         toast.error("Failed to process. Please try again.", {
//           position: "top-center",
//           duration: 3000,
//         });
//       }
//     } catch (err) {
//       toast.error("Error processing order", {
//         position: "top-center",
//         duration: 3000,
//       });
//       console.error(err);
//     } finally {
//       setBuyingNow(false);
//     }
//   };

//   const handleWishlist = async () => {
//     if (!user) {
//       router.push("/auth/signup");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/wishlist/toggle/${productId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setWishlisted(!wishlisted);
//         toast.success(
//           data.data?.wishlisted ? "Added to wishlist ♥" : "Removed from wishlist",
//           {
//             position: "top-center",
//             duration: 2500,
//           }
//         );
//       }
//     } catch (err) {
//       toast.error("Error updating wishlist", {
//         position: "top-center",
//         duration: 3000,
//       });
//     }
//   };

//   // Helper function to get media array with videos first, then images
//   const getMediaArray = () => {
//     const allMedia = [];
//     // Videos first
//     if (product.video && product.video.length > 0) {
//       product.video.forEach(() => allMedia.push("video"));
//     }
//     // Images second
//     if (product.images && product.images.length > 0) {
//       product.images.forEach(() => allMedia.push("image"));
//     }
//     return allMedia;
//   };

//   const nextImage = () => {
//     const allMedia = getMediaArray();
//     if (allMedia.length === 0) return;

//     let nextIndex = currentMediaIndex + 1;
//     if (nextIndex >= allMedia.length) nextIndex = 0;

//     setCurrentMediaIndex(nextIndex);
//     setMediaType(allMedia[nextIndex]);
//   };

//   const prevImage = () => {
//     const allMedia = getMediaArray();
//     if (allMedia.length === 0) return;

//     let prevIndex = currentMediaIndex - 1;
//     if (prevIndex < 0) prevIndex = allMedia.length - 1;

//     setCurrentMediaIndex(prevIndex);
//     setMediaType(allMedia[prevIndex]);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
//           <button
//             onClick={() => router.push("/product")}
//             className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isOutOfStock = product.stock === 0;
//   const isLowStock = product.stock > 0 && product.stock <= 5;
//   const hasDiscount = product.discountPercentage > 0;

//   return (
//     <div className="min-h-screen bg-white">
//       <Toaster position="top-center" />

//       {/* Breadcrumb Navigation */}
//       <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <button onClick={() => router.push("/")} className="hover:text-gray-900 transition">Home</button>
//             <span>/</span>
//             <button onClick={() => router.push("/product")} className="hover:text-gray-900 transition">Products</button>
//             <span>/</span>
//             <span className="text-gray-900 font-medium truncate">{sanitizeString(product.title)}</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Main Product Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
//           {/* Product Media - Takes full width on mobile, 6 cols on desktop */}
//           <div className="lg:col-span-6">
//             {/* Main Image/Video */}
//             <div className="sticky top-20 space-y-4">
//               <div className="relative w-full bg-gray-50 rounded-3xl overflow-hidden aspect-square shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
//                 {(product.images && product.images.length > 0) || (product.video && product.video.length > 0) ? (
//                   <>
//                     {mediaType === "video" && product.video && product.video[currentMediaIndex] ? (
//                       <video
//                         src={product.video[currentMediaIndex]}
//                         className="w-full h-full object-cover"
//                         autoPlay
//                         muted
//                         loop
//                         controls
//                       />
//                     ) : mediaType === "image" && product.images && product.images[currentMediaIndex - (product.video?.length || 0)] ? (
//                       <img
//                         src={product.images[currentMediaIndex - (product.video?.length || 0)]}
//                         alt={sanitizeString(product.title)}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : product.video && product.video.length > 0 ? (
//                       <video
//                         src={product.video[0]}
//                         className="w-full h-full object-cover"
//                         autoPlay
//                         muted
//                         loop
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={product.images?.[0]}
//                         alt={sanitizeString(product.title)}
//                         className="w-full h-full object-cover"
//                       />
//                     )}

//                     {/* Navigation Arrows */}
//                     {((product.images?.length || 0) + (product.video?.length || 0) > 1) && (
//                       <>
//                         <button
//                           onClick={prevImage}
//                           className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
//                         >
//                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={nextImage}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
//                         >
//                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                           </svg>
//                         </button>
//                       </>
//                     )}

//                     {/* Badge Overlays */}
//                     <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
//                       {hasDiscount && (
//                         <span className="inline-flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
//                           <TrendingUp size={16} /> {product.discountPercentage}% OFF
//                         </span>
//                       )}
//                       {isLowStock && (
//                         <span className="inline-flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
//                           ⚡ Only {product.stock} left
//                         </span>
//                       )}
//                     </div>

//                     {/* Media Counter */}
//                     {((product.images?.length || 0) + (product.video?.length || 0) > 1) && (
//                       <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold">
//                         {currentMediaIndex + 1} / {(product.images?.length || 0) + (product.video?.length || 0)}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                     No Media Available
//                   </div>
//                 )}
//               </div>

//               {/* Thumbnail Gallery */}
//               {((product.images && product.images.length > 0) || (product.video && product.video.length > 0)) && (
//                 (product.images?.length || 0) + (product.video?.length || 0) > 1 && (
//                   <div className="flex gap-3 overflow-x-auto pb-2">
//                     {product.video && product.video.map((vid, idx) => (
//                       <button
//                         key={`vid-${idx}`}
//                         onClick={() => { setCurrentMediaIndex(idx); setMediaType("video"); }}
//                         className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-3 cursor-pointer transition-all relative group ${
//                           idx === currentMediaIndex && mediaType === "video"
//                             ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
//                             : "border-gray-200 hover:border-gray-400"
//                         }`}
//                       >
//                         <video src={vid} className="w-full h-full object-cover" muted />
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
//                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
//                           <div className="w-4 h-4 ml-0.5">▶</div>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                     {product.images && product.images.map((img, idx) => {
//                       const imageIndex = (product.video?.length || 0) + idx;
//                       return (
//                         <button
//                           key={`img-${idx}`}
//                           onClick={() => { setCurrentMediaIndex(imageIndex); setMediaType("image"); }}
//                           className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-3 cursor-pointer transition-all ${
//                             imageIndex === currentMediaIndex && mediaType === "image"
//                               ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
//                               : "border-gray-200 hover:border-gray-400"
//                           }`}
//                         >
//                           <img src={img} alt={`${sanitizeString(product.title)} ${idx}`} className="w-full h-full object-cover" />
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Product Details - Right side */}
//           <div className="lg:col-span-6 space-y-6">
            
//             {/* Title & Rating Section */}
//             <div className="space-y-4">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1">
//                   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
//                     {sanitizeString(product.title)}
//                   </h1>
//                   {product.brand && (
//                     <p className="text-sm text-gray-600 font-medium">Brand: <span className="text-gray-900 font-bold">{sanitizeString(product.brand)}</span></p>
//                   )}
//                 </div>
//               </div>

//               {/* Rating & Reviews */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 <div className="flex items-center gap-2">
//                   <div className="flex gap-1">
//                     {[1,2,3,4,5].map(i => (
//                       <Star key={i} size={18} fill={i <= Math.round(product.rating || 0) ? "#FBBF24" : "none"} className={i <= Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
//                     ))}
//                   </div>
//                   <span className="text-sm font-bold text-gray-900">{(product.rating || 0).toFixed(1)}</span>
//                 </div>
//                 <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
//                   <span className="font-bold text-gray-900">{product.totalReviews || 0}</span> reviews
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-bold ${
//                   isOutOfStock
//                     ? "text-red-600 bg-red-50"
//                     : isLowStock
//                     ? "text-orange-600 bg-orange-50"
//                     : "text-green-600 bg-green-50"
//                 }`}>
//                   {isOutOfStock ? "Out of Stock" : isLowStock ? "Limited Stock" : "In Stock"}
//                 </span>
//               </div>
//             </div>

//             {/* Pricing Section */}
//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 sm:p-8 border border-gray-200">
//               <div className="flex items-baseline gap-4 mb-4">
//                 <span className="text-5xl sm:text-6xl font-bold text-gray-900">
//                   ₹{product.finalPrice?.toLocaleString("en-IN") || product.price?.toLocaleString("en-IN")}
//                 </span>
//                 {hasDiscount && (
//                   <div className="flex flex-col gap-1">
//                     <span className="text-lg sm:text-xl text-gray-500 line-through">
//                       ₹{product.price?.toLocaleString("en-IN")}
//                     </span>
//                     <span className="text-sm font-bold text-green-600">
//                       Save ₹{(product.price - product.finalPrice).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Seller Badge */}
//             {product.store && (
//               <div 
//                 onClick={() => router.push(`/store/${product.store._id}`)}
//                 className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
//               >
//                 {product.store.logo && (
//                   <img
//                     src={product.store.logo}
//                     alt={sanitizeString(product.store.storeName)}
//                     className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Sold by</p>
//                   <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
//                     {sanitizeString(product.store.storeName)}
//                   </p>
//                 </div>
//                 <div className="text-blue-600">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </div>
//             )}

//             {/* Options: Color & Size */}
//             <div className="space-y-6">
//               {/* Color Selection */}
//               {product.colors && product.colors.length > 0 && (
//                 <div>
//                   <label className="block text-sm sm:text-base font-bold text-gray-900 mb-4">
//                     Color: <span className="text-blue-600">{selectedColor}</span>
//                   </label>
//                   <div className="flex flex-wrap gap-4">
//                     {product.colors.map((color) => {
//                       const hexColor = getColorHex(color);
//                       const isSelected = selectedColor === color;
//                       return (
//                         <button
//                           key={color}
//                           onClick={() => setSelectedColor(color)}
//                           className={`relative group transition-transform ${isSelected ? "scale-110" : ""}`}
//                         >
//                           <div
//                             className={`w-16 h-16 rounded-2xl border-4 shadow-md cursor-pointer transition-all ${
//                               isSelected
//                                 ? "border-gray-900 ring-4 ring-gray-900 ring-offset-2"
//                                 : "border-gray-300 hover:border-gray-500 hover:scale-105"
//                             }`}
//                             style={{
//                               backgroundColor: hexColor,
//                               ...(hexColor === "#FFFFFF" && { border: "4px solid #D1D5DB" })
//                             }}
//                           >
//                             {isSelected && (
//                               <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
//                                 <Check className="w-8 h-8 text-white" />
//                               </div>
//                             )}
//                           </div>
//                           <span className="block text-center text-xs font-bold text-gray-900 mt-2">{color}</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Size Selection */}
//               {product.sizes && product.sizes.length > 0 && (
//                 <div>
//                   <label className="block text-sm sm:text-base font-bold text-gray-900 mb-4">
//                     Size: <span className="text-blue-600">{selectedSize}</span>
//                   </label>
//                   <div className="flex flex-wrap gap-3">
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 font-bold transition-all text-sm sm:text-base ${
//                           selectedSize === size
//                             ? "bg-gray-900 text-white border-gray-900 ring-2 ring-gray-900 ring-offset-2"
//                             : "bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
//                         }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Quantity & Actions */}
//             <div className="space-y-4">
//               <label className="block text-sm sm:text-base font-bold text-gray-900">Quantity</label>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="w-12 h-12 hover:bg-gray-100 transition flex items-center justify-center font-bold text-lg"
//                   >
//                     −
//                   </button>
//                   <span className="w-12 text-center font-bold text-lg">{quantity}</span>
//                   <button
//                     onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                     disabled={quantity >= product.stock}
//                     className="w-12 h-12 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center font-bold text-lg"
//                   >
//                     +
//                   </button>
//                 </div>
//                 <span className="text-sm text-gray-600">{product.stock} available</span>
//               </div>

//               {/* Main Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={isOutOfStock || addingToCart}
//                   className="flex-1 flex items-center justify-center gap-2 py-4 px-6 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
//                 >
//                   <ShoppingCart size={22} />
//                   {addingToCart ? "Adding..." : "Add to Cart"}
//                 </button>
//                 <button
//                   onClick={handleBuyNow}
//                   disabled={isOutOfStock || buyingNow}
//                   className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base shadow-lg"
//                 >
//                   <Zap size={22} />
//                   {buyingNow ? "Processing..." : "Buy Now"}
//                 </button>
//                 <button
//                   onClick={handleWishlist}
//                   className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${
//                     wishlisted
//                       ? "bg-red-50 border-red-300 text-red-600 shadow-md"
//                       : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
//                   }`}
//                 >
//                   <Heart size={24} fill={wishlisted ? "currentColor" : "none"} />
//                 </button>
//               </div>
//             </div>

//             {/* Key Features */}
//             <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
//               {product.isReturnable && (
//                 <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
//                   <RotateCcw size={24} className="text-blue-600 flex-shrink-0" />
//                   <div>
//                     <p className="font-bold text-gray-900 text-sm">Easy Returns</p>
//                     <p className="text-xs text-gray-600">7-day return</p>
//                   </div>
//                 </div>
//               )}
//               {product.deliveryTime && (
//                 <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
//                   <Truck size={24} className="text-green-600 flex-shrink-0" />
//                   <div>
//                     <p className="font-bold text-gray-900 text-sm">Fast Delivery</p>
//                     <p className="text-xs text-gray-600">{sanitizeString(product.deliveryTime)}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Product Description Section */}
//         {product.description && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Product Highlights</h2>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-100">
//                 <p className="text-gray-700 leading-relaxed text-lg">
//                   {sanitizeString(product.description)}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {product.category && (
//                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <p className="text-xs font-bold text-gray-600 uppercase mb-1">Category</p>
//                     <p className="font-bold text-gray-900">{sanitizeString(product.category)}</p>
//                   </div>
//                 )}
//                 {product.gender && (
//                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <p className="text-xs font-bold text-gray-600 uppercase mb-1">For</p>
//                     <p className="font-bold text-gray-900 capitalize">{sanitizeString(product.gender)}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Merchant Section */}
//         {product.store && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Meet the Merchant</h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div 
//                 onClick={() => router.push(`/store/${product.store._id}`)}
//                 className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-100 cursor-pointer hover:shadow-2xl hover:border-indigo-300 transition-all group"
//               >
//                 <div className="flex items-start gap-6 mb-6">
//                   {product.store.logo && (
//                     <img
//                       src={product.store.logo}
//                       alt={sanitizeString(product.store.storeName)}
//                       className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition">
//                         {sanitizeString(product.store.storeName)}
//                       </h3>
//                       {product.store.isApproved && <Award size={20} className="text-blue-600" title="Verified Merchant" />}
//                     </div>
//                     <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">
//                       {sanitizeString(product.store.category)}
//                     </p>
//                     {product.store.address && (
//                       <div className="flex items-start gap-2 text-gray-700 text-sm">
//                         <MapPin size={16} className="flex-shrink-0 mt-0.5" />
//                         <span>
//                           {product.store.address.city && product.store.address.state
//                             ? `${sanitizeString(product.store.address.city)}, ${sanitizeString(product.store.address.state)}`
//                             : "Location not specified"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {product.store.description && (
//                   <div className="p-4 bg-white rounded-2xl border border-indigo-100">
//                     <p className="text-xs font-bold text-gray-700 uppercase mb-2">About Store</p>
//                     <p className="text-sm text-gray-700 line-clamp-3">{sanitizeString(product.store.description)}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Merchant Stats */}
//               <div className="space-y-4">
//                 <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Star size={24} className="text-amber-500" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Rating</p>
//                       <p className="text-2xl font-bold text-gray-900">{(product.store.ratings || 4.5).toFixed(1)} / 5.0</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <TrendingUp size={24} className="text-green-600" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Total Orders</p>
//                       <p className="text-2xl font-bold text-gray-900">{product.store.totalOrders || 0}+</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Shield size={24} className="text-blue-600" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Trust Score</p>
//                       <p className="text-2xl font-bold text-gray-900">Verified</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Seller Contact Section */}
//         {(product.seller || product.store?.owner) && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
//               {product.store?.owner ? "Merchant Contact" : "Seller Contact"}
//             </h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100 shadow-lg">
//                 <div className="flex items-start gap-6 mb-6">
//                   {(product.store?.owner?.avatar || product.seller?.avatar) && (
//                     <img
//                       src={product.store?.owner?.avatar || product.seller?.avatar}
//                       alt={sanitizeString(product.store?.owner?.username || product.seller?.username)}
//                       className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
//                       {product.store?.owner ? "Merchant Owner" : "Seller"}
//                     </p>
//                     <p className="text-3xl font-bold text-gray-900">
//                       {product.store?.owner
//                         ? sanitizeString(product.store.owner.username) || "Merchant Owner"
//                         : product.seller
//                         ? sanitizeString(product.seller.username) || "Seller"
//                         : "Not Available"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {(product.store?.owner?.email || product.seller?.email) && (
//                     <a
//                       href={`mailto:${sanitizeString(product.store?.owner?.email || product.seller?.email)}`}
//                       className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-purple-100"
//                     >
//                       <Mail size={22} className="text-purple-600 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-gray-600 uppercase">Email</p>
//                         <p className="text-sm font-medium text-gray-900 break-all">
//                           {sanitizeString(product.store?.owner?.email || product.seller?.email)}
//                         </p>
//                       </div>
//                     </a>
//                   )}
//                   {(product.store?.owner?.phone || product.seller?.phone) && (
//                     <a
//                       href={`tel:${sanitizeString(product.store?.owner?.phone || product.seller?.phone)}`}
//                       className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-green-50 transition-colors border border-purple-100"
//                     >
//                       <Phone size={22} className="text-green-600 flex-shrink-0" />
//                       <div className="flex-1">
//                         <p className="text-xs font-bold text-gray-600 uppercase">Phone</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {sanitizeString(product.store?.owner?.phone || product.seller?.phone)}
//                         </p>
//                       </div>
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//                   {product.brand && (
//                     <p className="text-sm text-gray-600 font-medium">Brand: <span className="text-gray-900 font-bold">{sanitizeString(product.brand)}</span></p>
//                   )}
//                 </div>
//               </div>

//               {/* Rating & Reviews */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 <div className="flex items-center gap-2">
//                   <div className="flex gap-1">
//                     {[1,2,3,4,5].map(i => (
//                       <Star key={i} size={18} fill={i <= Math.round(product.rating || 0) ? "#FBBF24" : "none"} className={i <= Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
//                     ))}
//                   </div>
//                   <span className="text-sm font-bold text-gray-900">{(product.rating || 0).toFixed(1)}</span>
//                 </div>
//                 <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
//                   <span className="font-bold text-gray-900">{product.totalReviews || 0}</span> reviews
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-bold ${
//                   isOutOfStock
//                     ? "text-red-600 bg-red-50"
//                     : isLowStock
//                     ? "text-orange-600 bg-orange-50"
//                     : "text-green-600 bg-green-50"
//                 }`}>
//                   {isOutOfStock ? "Out of Stock" : isLowStock ? "Limited Stock" : "In Stock"}
//                 </span>
//               </div>
//             </div>

//             {/* Pricing Section */}
//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 sm:p-8 border border-gray-200">
//               <div className="flex items-baseline gap-4 mb-4">
//                 <span className="text-5xl sm:text-6xl font-bold text-gray-900">
//                   ₹{product.finalPrice?.toLocaleString("en-IN") || product.price?.toLocaleString("en-IN")}
//                 </span>
//                 {hasDiscount && (
//                   <div className="flex flex-col gap-1">
//                     <span className="text-lg sm:text-xl text-gray-500 line-through">
//                       ₹{product.price?.toLocaleString("en-IN")}
//                     </span>
//                     <span className="text-sm font-bold text-green-600">
//                       Save ₹{(product.price - product.finalPrice).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Seller Badge */}
//             {product.store && (
//               <div 
//                 onClick={() => router.push(`/store/${product.store._id}`)}
//                 className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
//               >
//                 {product.store.logo && (
//                   <img
//                     src={product.store.logo}
//                     alt={sanitizeString(product.store.storeName)}
//                     className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Sold by</p>
//                   <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
//                     {sanitizeString(product.store.storeName)}
//                   </p>
//                 </div>
//                 <div className="text-blue-600">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </div>
//             )}

//             {/* Options: Color & Size */}
//             <div className="space-y-6">
//               {/* Color Selection */}
//               {product.colors && product.colors.length > 0 && (
//                 <div>
//                   <label className="block text-sm sm:text-base font-bold text-gray-900 mb-4">
//                     Color: <span className="text-blue-600">{selectedColor}</span>
//                   </label>
//                   <div className="flex flex-wrap gap-4">
//                     {product.colors.map((color) => {
//                       const hexColor = getColorHex(color);
//                       const isSelected = selectedColor === color;
//                       return (
//                         <button
//                           key={color}
//                           onClick={() => setSelectedColor(color)}
//                           className={`relative group transition-transform ${isSelected ? "scale-110" : ""}`}
//                         >
//                           <div
//                             className={`w-16 h-16 rounded-2xl border-4 shadow-md cursor-pointer transition-all ${
//                               isSelected
//                                 ? "border-gray-900 ring-4 ring-gray-900 ring-offset-2"
//                                 : "border-gray-300 hover:border-gray-500 hover:scale-105"
//                             }`}
//                             style={{
//                               backgroundColor: hexColor,
//                               ...(hexColor === "#FFFFFF" && { border: "4px solid #D1D5DB" })
//                             }}
//                           >
//                             {isSelected && (
//                               <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
//                                 <Check className="w-8 h-8 text-white" />
//                               </div>
//                             )}
//                           </div>
//                           <span className="block text-center text-xs font-bold text-gray-900 mt-2">{color}</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Size Selection */}
//               {product.sizes && product.sizes.length > 0 && (
//                 <div>
//                   <label className="block text-sm sm:text-base font-bold text-gray-900 mb-4">
//                     Size: <span className="text-blue-600">{selectedSize}</span>
//                   </label>
//                   <div className="flex flex-wrap gap-3">
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 font-bold transition-all text-sm sm:text-base ${
//                           selectedSize === size
//                             ? "bg-gray-900 text-white border-gray-900 ring-2 ring-gray-900 ring-offset-2"
//                             : "bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
//                         }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Quantity & Actions */}
//             <div className="space-y-4">
//               <label className="block text-sm sm:text-base font-bold text-gray-900">Quantity</label>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="w-12 h-12 hover:bg-gray-100 transition flex items-center justify-center font-bold text-lg"
//                   >
//                     −
//                   </button>
//                   <span className="w-12 text-center font-bold text-lg">{quantity}</span>
//                   <button
//                     onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                     disabled={quantity >= product.stock}
//                     className="w-12 h-12 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center font-bold text-lg"
//                   >
//                     +
//                   </button>
//                 </div>
//                 <span className="text-sm text-gray-600">{product.stock} available</span>
//               </div>

//               {/* Main Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={isOutOfStock || addingToCart}
//                   className="flex-1 flex items-center justify-center gap-2 py-4 px-6 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
//                 >
//                   <ShoppingCart size={22} />
//                   {addingToCart ? "Adding..." : "Add to Cart"}
//                 </button>
//                 <button
//                   onClick={handleBuyNow}
//                   disabled={isOutOfStock || buyingNow}
//                   className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base shadow-lg"
//                 >
//                   <Zap size={22} />
//                   {buyingNow ? "Processing..." : "Buy Now"}
//                 </button>
//                 <button
//                   onClick={handleWishlist}
//                   className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${
//                     wishlisted
//                       ? "bg-red-50 border-red-300 text-red-600 shadow-md"
//                       : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
//                   }`}
//                 >
//                   <Heart size={24} fill={wishlisted ? "currentColor" : "none"} />
//                 </button>
//               </div>
//             </div>

//             {/* Key Features */}
//             <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
//               {product.isReturnable && (
//                 <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
//                   <RotateCcw size={24} className="text-blue-600 flex-shrink-0" />
//                   <div>
//                     <p className="font-bold text-gray-900 text-sm">Easy Returns</p>
//                     <p className="text-xs text-gray-600">7-day return</p>
//                   </div>
//                 </div>
//               )}
//               {product.deliveryTime && (
//                 <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
//                   <Truck size={24} className="text-green-600 flex-shrink-0" />
//                   <div>
//                     <p className="font-bold text-gray-900 text-sm">Fast Delivery</p>
//                     <p className="text-xs text-gray-600">{sanitizeString(product.deliveryTime)}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Product Description Section */}
//         {product.description && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Product Highlights</h2>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-100">
//                 <p className="text-gray-700 leading-relaxed text-lg">
//                   {sanitizeString(product.description)}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {product.category && (
//                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <p className="text-xs font-bold text-gray-600 uppercase mb-1">Category</p>
//                     <p className="font-bold text-gray-900">{sanitizeString(product.category)}</p>
//                   </div>
//                 )}
//                 {product.gender && (
//                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <p className="text-xs font-bold text-gray-600 uppercase mb-1">For</p>
//                     <p className="font-bold text-gray-900 capitalize">{sanitizeString(product.gender)}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Merchant Section */}
//         {product.store && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Meet the Merchant</h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div 
//                 onClick={() => router.push(`/store/${product.store._id}`)}
//                 className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-100 cursor-pointer hover:shadow-2xl hover:border-indigo-300 transition-all group"
//               >
//                 <div className="flex items-start gap-6 mb-6">
//                   {product.store.logo && (
//                     <img
//                       src={product.store.logo}
//                       alt={sanitizeString(product.store.storeName)}
//                       className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition">
//                         {sanitizeString(product.store.storeName)}
//                       </h3>
//                       {product.store.isApproved && <Award size={20} className="text-blue-600" title="Verified Merchant" />}
//                     </div>
//                     <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">
//                       {sanitizeString(product.store.category)}
//                     </p>
//                     {product.store.address && (
//                       <div className="flex items-start gap-2 text-gray-700 text-sm">
//                         <MapPin size={16} className="flex-shrink-0 mt-0.5" />
//                         <span>
//                           {product.store.address.city && product.store.address.state
//                             ? `${sanitizeString(product.store.address.city)}, ${sanitizeString(product.store.address.state)}`
//                             : "Location not specified"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {product.store.description && (
//                   <div className="p-4 bg-white rounded-2xl border border-indigo-100">
//                     <p className="text-xs font-bold text-gray-700 uppercase mb-2">About Store</p>
//                     <p className="text-sm text-gray-700 line-clamp-3">{sanitizeString(product.store.description)}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Merchant Stats */}
//               <div className="space-y-4">
//                 <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Star size={24} className="text-amber-500" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Rating</p>
//                       <p className="text-2xl font-bold text-gray-900">{(product.store.ratings || 4.5).toFixed(1)} / 5.0</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <TrendingUp size={24} className="text-green-600" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Total Orders</p>
//                       <p className="text-2xl font-bold text-gray-900">{product.store.totalOrders || 0}+</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Shield size={24} className="text-blue-600" />
//                     <div>
//                       <p className="text-xs font-bold text-gray-600 uppercase">Trust Score</p>
//                       <p className="text-2xl font-bold text-gray-900">Verified</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Seller Contact Section */}
//         {(product.seller || product.store?.owner) && (
//           <div className="mt-12 pt-12 border-t border-gray-200">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
//               {product.store?.owner ? "Merchant Contact" : "Seller Contact"}
//             </h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100 shadow-lg">
//                 <div className="flex items-start gap-6 mb-6">
//                   {(product.store?.owner?.avatar || product.seller?.avatar) && (
//                     <img
//                       src={product.store?.owner?.avatar || product.seller?.avatar}
//                       alt={sanitizeString(product.store?.owner?.username || product.seller?.username)}
//                       className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
//                       {product.store?.owner ? "Merchant Owner" : "Seller"}
//                     </p>
//                     <p className="text-3xl font-bold text-gray-900">
//                       {product.store?.owner
//                         ? sanitizeString(product.store.owner.username) || "Merchant Owner"
//                         : product.seller
//                         ? sanitizeString(product.seller.username) || "Seller"
//                         : "Not Available"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {(product.store?.owner?.email || product.seller?.email) && (
//                     <a
//                       href={`mailto:${sanitizeString(product.store?.owner?.email || product.seller?.email)}`}
//                       className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-purple-100"
//                     >
//                       <Mail size={22} className="text-purple-600 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-gray-600 uppercase">Email</p>
//                         <p className="text-sm font-medium text-gray-900 break-all">
//                           {sanitizeString(product.store?.owner?.email || product.seller?.email)}
//                         </p>
//                       </div>
//                     </a>
//                   )}
//                   {(product.store?.owner?.phone || product.seller?.phone) && (
//                     <a
//                       href={`tel:${sanitizeString(product.store?.owner?.phone || product.seller?.phone)}`}
//                       className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-green-50 transition-colors border border-purple-100"
//                     >
//                       <Phone size={22} className="text-green-600 flex-shrink-0" />
//                       <div className="flex-1">
//                         <p className="text-xs font-bold text-gray-600 uppercase">Phone</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {sanitizeString(product.store?.owner?.phone || product.seller?.phone)}
//                         </p>
//                       </div>
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import {
  Heart,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  MapPin,
  Mail,
  Phone,
  Star,
  Shield,
  TrendingUp,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  BadgeCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Comprehensive color mapping
const colorMap = {
  red: "#EF4444", Red: "#EF4444",
  blue: "#3B82F6", Blue: "#3B82F6",
  green: "#22C55E", Green: "#22C55E",
  black: "#1F2937", Black: "#1F2937",
  white: "#FFFFFF", White: "#FFFFFF",
  yellow: "#FBBF24", Yellow: "#FBBF24",
  pink: "#EC4899", Pink: "#EC4899",
  purple: "#A855F7", Purple: "#A855F7",
  orange: "#F97316", Orange: "#F97316",
  gray: "#9CA3AF", Gray: "#9CA3AF",
  grey: "#9CA3AF", Grey: "#9CA3AF",
  brown: "#92400E", Brown: "#92400E",
  navy: "#001F3F", Navy: "#001F3F",
  maroon: "#800000", Maroon: "#800000",
  teal: "#14B8A6", Teal: "#14B8A6",
  cyan: "#06B6D4", Cyan: "#06B6D4",
  lime: "#84CC16", Lime: "#84CC16",
  indigo: "#4F46E5", Indigo: "#4F46E5",
  violet: "#6366F1", Violet: "#6366F1",
  rose: "#F43F5E", Rose: "#F43F5E",
  slate: "#64748B", Slate: "#64748B",
  silver: "#C0C0C0", Silver: "#C0C0C0",
  gold: "#FFD700", Gold: "#FFD700",
  beige: "#F5F5DC", Beige: "#F5F5DC",
  cream: "#FFFDD0", Cream: "#FFFDD0",
  khaki: "#F0E68C", Khaki: "#F0E68C",
  turquoise: "#40E0D0", Turquoise: "#40E0D0",
};

const getColorHex = (colorName) => {
  if (!colorName) return "#D1D5DB";
  return colorMap[colorName] || colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1)] || "#9CA3AF";
};

const sanitizeString = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/^["']|["']$/g, "")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/product/details/${productId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch product");
          return;
        }

        setProduct(data.data);

        // Set default selections
        if (data.data.sizes?.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
        if (data.data.colors?.length > 0) {
          setSelectedColor(data.data.colors[0]);
        }
      } catch (err) {
        setError("Error fetching product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart", { position: "top-center" });
      router.push("/auth/signup");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock", { position: "top-center" });
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch(`${API_BASE}/cart/add/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart", { position: "top-center" });
      } else {
        toast.success("Added to cart successfully! 🛒", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error adding to cart", { position: "top-center" });
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to proceed", { position: "top-center" });
      router.push("/auth/signup");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock", { position: "top-center" });
      return;
    }

    setBuyingNow(true);
    try {
      const res = await fetch(`${API_BASE}/cart/add/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        }),
      });

      if (res.ok) {
        router.push("/profile/cart");
      } else {
        toast.error("Failed to process. Please try again.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error processing order", { position: "top-center" });
      console.error(err);
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please log in to add to wishlist", { position: "top-center" });
      router.push("/auth/signup");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/wishlist/toggle/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setWishlisted(!wishlisted);
        toast.success(
          data.data?.wishlisted ? "Added to wishlist ♥" : "Removed from wishlist",
          { position: "top-center" }
        );
      }
    } catch (err) {
      toast.error("Error updating wishlist", { position: "top-center" });
    }
  };

  // Get all media (videos + images)
  const getAllMedia = () => {
    const media = [];
    if (product?.video?.length > 0) {
      product.video.forEach((vid) => media.push({ type: "video", src: vid }));
    }
    if (product?.images?.length > 0) {
      product.images.forEach((img) => media.push({ type: "image", src: img }));
    }
    return media;
  };

  const allMedia = product ? getAllMedia() : [];

  const nextMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/product")}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasDiscount = product.discountPercentage > 0;
  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Toaster position="top-center" />

      {/* Sticky Breadcrumb Navigation */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </button>
            <ChevronRight size={16} className="text-gray-400" />
            <button
              onClick={() => router.push("/product")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Products
            </button>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-semibold truncate max-w-md">
              {sanitizeString(product.title)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* Product Media Gallery */}
          <div className="space-y-6">
            {/* Main Media Display */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-square">
              {allMedia.length > 0 ? (
                <>
                  {currentMedia?.type === "video" ? (
                    <video
                      key={currentMedia.src}
                      src={currentMedia.src}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  ) : (
                    <img
                      key={currentMedia?.src}
                      src={currentMedia?.src}
                      alt={sanitizeString(product.title)}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Navigation Controls */}
                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={prevMedia}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white shadow-xl rounded-full flex items-center justify-center transition-all hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={nextMedia}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white shadow-xl rounded-full flex items-center justify-center transition-all hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                      </button>
                    </>
                  )}

                  {/* Badge Overlays */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {hasDiscount && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <TrendingUp size={16} />
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Zap size={16} />
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Media Counter */}
                  {allMedia.length > 1 && (
                    <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {currentMediaIndex + 1} / {allMedia.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <Package size={64} className="mb-4" />
                  <p className="font-medium">No media available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all relative group ${
                      idx === currentMediaIndex
                        ? "border-gray-900 ring-4 ring-gray-900 ring-offset-2 scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {media.type === "video" ? (
                      <>
                        <video src={media.src} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <div className="w-0 h-0 border-l-8 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img src={media.src} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
                    {sanitizeString(product.title)}
                  </h1>
                  {product.brand && (
                    <p className="text-base text-gray-600">
                      by <span className="font-bold text-gray-900">{sanitizeString(product.brand)}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleWishlist}
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center ${
                    wishlisted
                      ? "bg-red-50 border-red-300 text-red-600"
                      : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={24} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Rating & Stock Status */}
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i <= Math.round(product.rating || 0) ? "#FBBF24" : "none"}
                        className={i <= Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{(product.rating || 0).toFixed(1)}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600">{product.totalReviews || 0} reviews</span>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    isOutOfStock
                      ? "text-red-700 bg-red-100"
                      : isLowStock
                      ? "text-orange-700 bg-orange-100"
                      : "text-green-700 bg-green-100"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : isLowStock ? "Limited Stock" : "In Stock"}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Price</p>
                  <p className="text-5xl lg:text-6xl font-bold text-gray-900">
                    ₹{(product.finalPrice || product.price)?.toLocaleString("en-IN")}
                  </p>
                </div>
                {hasDiscount && (
                  <div className="mb-2">
                    <p className="text-2xl text-gray-500 line-through">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Save ₹{(product.price - product.finalPrice)?.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Store Badge */}
            {product.store && (
              <div
                onClick={() => router.push(`/store/${product.store._id}`)}
                className="flex items-center gap-4 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 cursor-pointer hover:shadow-lg hover:border-cyan-300 transition-all group"
              >
                {product.store.logo && (
                  <img
                    src={product.store.logo}
                    alt={sanitizeString(product.store.storeName)}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">Sold by</p>
                  <p className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition truncate">
                    {sanitizeString(product.store.storeName)}
                  </p>
                </div>
                <ChevronRight className="text-cyan-600 flex-shrink-0" size={24} />
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-base font-bold text-gray-900 mb-4">
                  Color: <span className="text-blue-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const hexColor = getColorHex(color);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group transition-transform ${isSelected ? "scale-110" : ""}`}
                      >
                        <div
                          className={`w-14 h-14 rounded-xl border-4 shadow cursor-pointer transition-all ${
                            isSelected
                              ? "border-gray-900 ring-4 ring-gray-900 ring-offset-2"
                              : "border-gray-300 hover:border-gray-500 hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: hexColor,
                            ...(hexColor === "#FFFFFF" && { borderColor: "#D1D5DB" }),
                          }}
                        >
                          {isSelected && (
                            <div className="w-full h-full flex items-center justify-center rounded-lg bg-black/20">
                              <Check className="w-7 h-7 text-white drop-shadow" />
                            </div>
                          )}
                        </div>
                        <span className="block text-center text-xs font-semibold text-gray-700 mt-2">
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-base font-bold text-gray-900 mb-4">
                  Size: <span className="text-blue-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-4 rounded-xl border-2 font-bold transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-4">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 hover:bg-gray-100 transition flex items-center justify-center font-bold text-xl"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-14 h-14 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center font-bold text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600 font-medium">{product.stock} available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={22} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || buyingNow}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-bold hover:from-gray-800 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl"
              >
                <Zap size={22} />
                {buyingNow ? "Processing..." : "Buy Now"}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-gray-200">
              {product.isReturnable && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <RotateCcw size={24} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">7-day return policy</p>
                  </div>
                </div>
              )}
              {product.deliveryTime && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                  <Truck size={24} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-600">{sanitizeString(product.deliveryTime)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        {product.description && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {sanitizeString(product.description)}
                </p>
              </div>
              <div className="space-y-4">
                {product.category && (
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Category</p>
                    <p className="text-xl font-bold text-gray-900">{sanitizeString(product.category)}</p>
                  </div>
                )}
                {product.gender && (
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Gender</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">{sanitizeString(product.gender)}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Merchant Section */}
        {product.store && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Merchant</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div
                onClick={() => router.push(`/store/${product.store._id}`)}
                className="lg:col-span-3 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-100 cursor-pointer hover:shadow-2xl hover:border-indigo-300 transition-all group"
              >
                <div className="flex items-start gap-6 mb-6">
                  {product.store.logo && (
                    <img
                      src={product.store.logo}
                      alt={sanitizeString(product.store.storeName)}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition">
                        {sanitizeString(product.store.storeName)}
                      </h3>
                      {product.store.isApproved && (
                        <BadgeCheck size={24} className="text-blue-600" title="Verified Merchant" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">
                      {sanitizeString(product.store.category)}
                    </p>
                    {product.store.address?.city && product.store.address?.state && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <MapPin size={16} className="flex-shrink-0 mt-1" />
                        <span className="text-sm">
                          {sanitizeString(product.store.address.city)}, {sanitizeString(product.store.address.state)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {product.store.description && (
                  <div className="p-6 bg-white rounded-2xl border border-indigo-100">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {sanitizeString(product.store.description)}
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Star size={28} className="text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Rating</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Number(product?.store?.ratings ?? 4.5).toFixed(1)} <span className="text-lg text-gray-500">/ 5.0</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={28} className="text-green-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{product.store.totalOrders || 0}+</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Shield size={28} className="text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Trust</p>
                      <p className="text-xl font-bold text-gray-900">Verified Seller</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {(product.seller || product.store?.owner) && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="max-w-2xl">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100 shadow-lg">
                <div className="flex items-start gap-6 mb-6">
                  {(product.store?.owner?.avatar || product.seller?.avatar) && (
                    <img
                      src={product.store?.owner?.avatar || product.seller?.avatar}
                      alt={sanitizeString(product.store?.owner?.username || product.seller?.username)}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
                      {product.store?.owner ? "Store Owner" : "Seller"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {sanitizeString(
                        product.store?.owner?.username || product.seller?.username || "Not Available"
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(product.store?.owner?.email || product.seller?.email) && (
                    <a
                      href={`mailto:${sanitizeString(product.store?.owner?.email || product.seller?.email)}`}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-purple-100"
                    >
                      <Mail size={22} className="text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-600 uppercase">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {sanitizeString(product.store?.owner?.email || product.seller?.email)}
                        </p>
                      </div>
                    </a>
                  )}
                  {(product.store?.owner?.phone || product.seller?.phone) && (
                    <a
                      href={`tel:${sanitizeString(product.store?.owner?.phone || product.seller?.phone)}`}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-green-50 transition-colors border border-purple-100"
                    >
                      <Phone size={22} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-600 uppercase">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sanitizeString(product.store?.owner?.phone || product.seller?.phone)}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 