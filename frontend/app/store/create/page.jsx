// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import TrustBuildingSection from './components/Trust-Building.jsx'

// export default function CreateStorePage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     storeName: "",
//     description: "",
//     storeProducts: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       postalCode: "",
//       country: "India"
//     }
//   });


//   const [logo, setLogo] = useState(null);
//   const [banner, setBanner] = useState(null);
//   const [loading, setLoading] = useState(false);

//   function handleChange(e) {
//     const { name, value } = e.target;

//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [field]: value
//         }
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   }


//   // 🔹 Upload image using YOUR backend Cloudinary API
//   async function uploadImage(file) {
//     const data = new FormData();
//     data.append("file", file);

//     const res = await fetch("/api/upload", {
//       method: "POST",
//       credentials: "include",
//       body: data
//     });

//     const result = await res.json();

//     return result.url;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let logoUrl = "";
//       let bannerUrl = "";

//       if (logo) logoUrl = await uploadImage(logo);
//       if (banner) bannerUrl = await uploadImage(banner);

//       const payload = {
//         storeName: formData.storeName,
//         description: formData.description,
//         storeProducts: formData.storeProducts.split(","),
//         address: formData.address,
//         logoUrl,
//         bannerUrl
//       };

//       const res = await fetch(
//         "http://localhost:8000/store/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           credentials: "include",
//           body: JSON.stringify(payload)
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.message === "Unauthorized: Please login first") {
//           router.push("/auth/signup");
//           return;
//         }
//         throw new Error(data.message || "Store creation failed");
//       }

//       router.push("/")
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
      
//       <div className=" text-black min-h-screen bg-gray-100 flex items-center justify-center px-4">


//         <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

//           <h1 className="text-3xl font-semibold text-gray-900 mb-2">
//             Open Your Store On AURAWEAR
//           </h1>
//           <p className="text-black  mb-8">
//             Create your store and start selling your products
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Store Name */}
//             <div>
//               <label className="block text-sm font-medium text-black  mb-1">
//                 Store Name
//               </label>
//               <input
//                 name="storeName"
//                 placeholder="Enter store name"
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-black  mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 placeholder="Describe your store"
//                 rows={3}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             {/* Products */}
//             <div>
//               <label className="block text-sm font-medium text-black  mb-1">
//                 Products
//               </label>
//               <input
//                 name="storeProducts"
//                 placeholder="Shoes, Shirts, Watches"
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             {/* Address */}
//             {/* Address Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-black">
//                 Store Address
//               </h3>

//               <input
//                 name="address.street"
//                 placeholder="Street Address"
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
//               />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input
//                   name="address.city"
//                   placeholder="City"
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
//                 />

//                 <input
//                   name="address.state"
//                   placeholder="State"
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input
//                   name="address.postalCode"
//                   placeholder="Postal Code"
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
//                 />

//                 <input
//                   name="address.country"
//                   value={formData.address.country}
//                   disabled
//                   className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-600"
//                 />
//               </div>
//             </div>

//             {/* Upload Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-black  mb-1">
//                   Store Logo
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setLogo(e.target.files[0])}
//                   className="w-full text-sm file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0
//               file:bg-gray-100 file:text-gray-700
//               hover:file:bg-gray-200"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-black  mb-1">
//                   Store Banner
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setBanner(e.target.files[0])}
//                   className="w-full text-sm file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0
//               file:bg-gray-100 file:text-gray-700
//               hover:file:bg-gray-200"
//                 />
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-black text-white py-3 rounded-xl font-medium
//           hover:bg-gray-900 transition disabled:opacity-60"
//             >
//               {loading ? "Creating Store..." : "Create Store"}
//             </button>

//           </form>
//         </div>
//       </div>

//     </div>

//   );
// }
"use client"

import CreateStorePage from './components/Open-Store.jsx'
import TrustBuildingSection from './components/Trust-Building'
import HowItWorks from './components/How-It-works.jsx'
import OpenStoreHeading from './components/Heading.jsx'
import WhyAuraStore from './components/Why-Aura-Store.jsx'
import EarningsAndBenefits from './components/Earning-Benefits.jsx'
import WhoCanSell from './components/Who-Can-Sell.jsx'
import Faq from './components/Faq.jsx'
import FinalCTA from './components/Final-CTA.jsx'

export default function Page(){

  return(
    <div className="relative">
      <OpenStoreHeading />
      <TrustBuildingSection />
      <HowItWorks />
      <CreateStorePage /> {/* Form has id="open-store-form" */}
      <WhyAuraStore />
      <EarningsAndBenefits />
      <WhoCanSell />
      <Faq />
      {/* <FinalCTA /> */}

      {/* Sticky Button */}
     <button
  onClick={() => {
    const form = document.getElementById("open-store-form");
    form?.scrollIntoView({ behavior: "smooth" });
  }}
  className="
    fixed 
    right-6 
    bottom-16  /* mobile default thoda upar */
    sm:bottom-6 /* desktop normal bottom */
    bg-purple-700 text-white px-5 py-3 rounded-full shadow-lg 
    hover:bg-purple-800 transition z-50
  "
>
  Open Your Store
</button>

    </div>
  )
}
