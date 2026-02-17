import React from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "Seller",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      message:
        "BazzarGhar made it so easy for me to set up my online store. I started selling within hours and reached thousands of customers in just a week!",
      rating: 5,
    },
    {
      name: "Sneha Patil",
      role: "Buyer",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      message:
        "I love shopping on BazzarGhar! The platform is intuitive, products are easy to find, and checkout is smooth and secure.",
      rating: 4.5,
    },
    {
      name: "Ankit Verma",
      role: "Seller",
      photo: "https://randomuser.me/api/portraits/men/58.jpg",
      message:
        "The analytics and sales tracking on BazzarGhar helped me understand my customers better. My sales have increased steadily!",
      rating: 5,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{testimonial.message}</p>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(testimonial.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              {testimonial.rating % 1 !== 0 && (
                <Star size={20} className="text-yellow-200" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
