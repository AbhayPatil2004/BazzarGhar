"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const StarRating = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="text-yellow-400 text-lg">
        {i < rating ? "★" : "☆"}
      </span>
    ))}
  </div>
);

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const StoreReviews = ({ storeId, storeName }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch reviews from backend
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${storeId}`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data.data.reviews);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [storeId]);

  const handleAddReview = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storereview/${storeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
        credentials: "include", 
      });

      const data = await res.json();

      if (res.ok) {
        // Add new review to state
        setReviews([data.data.review, ...reviews]);
        setNewComment("");
        setShowForm(false);
        toast.success("Review added successfully!");
      } else {
        toast.error(data.message || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 font-sans pt-16">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Heading + Add Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          What people say about <span className="text-blue-600">{storeName}</span>
        </h2>
        <div className="sm:mt-0 mt-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            {showForm ? "Cancel" : "Add Review"}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-4 border rounded-xl shadow-md max-w-md bg-white">
          <textarea
            placeholder="Your Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
          />
          <button
            onClick={handleAddReview}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Send
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-start">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="review-card w-full rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2"
          >
            <div className="flex items-center mb-4 gap-4">
              <img
  src={review.avatar || "https://i.pravatar.cc/100?u=default"} // fallback
  alt={review.userName}
  className="w-14 h-14 rounded-full object-cover"
/>
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{review.userName}</h4>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-gray-400 text-sm">{formatDate(review.createdAt)}</span>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreReviews;