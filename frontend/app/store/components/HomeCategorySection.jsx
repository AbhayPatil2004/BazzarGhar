"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CategoriesSection() {
    const router = useRouter();

    const categories = [
        { name: "Grocery", slug: "grocery", image: "/glocery.jpg", description: "Fresh vegetables, fruits & daily essentials from local vendors." },
        { name: "Fashion & Clothing", slug: "fashion", image: "/fashion.jpg", description: "Trendy outfits and traditional wear from nearby stores." },
        { name: "Electronics", slug: "electronics", image: "/electronics.jpg", description: "Mobiles, accessories & gadgets at best local prices." },
        { name: "Home & Kitchen", slug: "home-kitchen", image: "/appliance.avif", description: "Furniture, decor & kitchen essentials from trusted sellers." },
        { name: "Medical & Pharmacy", slug: "medical", image: "/medical.jpg", description: "Medicines and healthcare products from verified pharmacies." },
        { name: "Books & Stationery", slug: "books", image: "/books.jpg", description: "Educational books and office supplies from local shops." },
        { name: "Sports & Fitness", slug: "sports", image: "/sports.jpg", description: "Gym equipment and sports gear from nearby sellers." },
        { name: "Beauty & Personal Care", slug: "beauty", image: "/beauty.jpg", description: "Cosmetics and grooming essentials from trusted brands." },
        { name: "Hardware & Tools", slug: "hardware", image: "/harware.jpg", description: "Construction materials and home improvement supplies." },
        { name: "Bakery & Sweets", slug: "bakery", image: "/bakery.jpg", description: "Fresh cakes and sweets from local shops." },
        { name: "Toys & Kids Store", slug: "toys", image: "/toys.jpg", description: "Toys, baby products and kids essentials." },
    ];

    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);

    const changeSlide = (newIndex) => {
        if (newIndex === index) return;

        setPrevIndex(index);
        setIndex(newIndex);

        setTimeout(() => {
            setPrevIndex(null);
        }, 700);
    };

    const handleNext = () => {
        changeSlide((index + 1) % categories.length);
    };

    const handlePrev = () => {
        changeSlide(index === 0 ? categories.length - 1 : index - 1);
    };

    const handleClick = () => {
        router.push(`/store/stores?categories=${categories[index].slug}`);
    };

    const category = categories[index];

    return (
        <section className="w-full bg-gray-50 py-4">

            <div className="relative w-[95%] mx-auto 
                h-[240px] sm:h-[320px] md:h-[420px] 
                rounded-xl overflow-hidden shadow-xl group">

                {/* Current Image */}
                <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Previous Image (Fade Out Smoothly) */}
                {prevIndex !== null && (
                    <img
                        src={categories[prevIndex].image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover 
                        transition-opacity duration-700 ease-in-out opacity-0"
                    />
                )}

                {/* Overlay */}
                <div
                    onClick={handleClick}
                    className="absolute inset-0 cursor-pointer
                    bg-gradient-to-r from-black/80 via-black/50 to-transparent
                    text-white flex flex-col justify-between
                    p-4 sm:p-6 md:p-12"
                >
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                            Top Selling Categories Stores On
                            <span className="text-blue-400"> BazzarGhar</span>
                        </h1>
                        <div className="w-12 h-1 bg-blue-500 mt-2 rounded-full"></div>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2">
                            {category.name}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-lg max-w-xl opacity-90 line-clamp-2">
                            {category.description}
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            className="cursor-pointer mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                            transition rounded-full text-xs sm:text-sm font-semibold shadow-md"
                        >
                            Visit Stores
                        </button>
                    </div>
                </div>

                {/* Left Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                    }}
                    className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-3 sm:left-6
                    bg-black/50 backdrop-blur-md text-white
                    p-2 sm:p-3 rounded-full hover:scale-110 
                    hover:bg-blue-600 transition"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Right Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 sm:right-6
                    bg-black/50 backdrop-blur-md text-white
                    p-2 sm:p-3 rounded-full hover:scale-110 
                    hover:bg-blue-600 transition"
                >
                    <ChevronRight size={24} />
                </button>

            </div>
        </section>
    );
}