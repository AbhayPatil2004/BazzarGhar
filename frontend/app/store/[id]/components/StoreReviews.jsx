"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../context/Authcontext";
import { useRouter } from "next/navigation";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const RatingStars = ({ rating = 0 }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RatingInput = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          onClick={() => setRating(i + 1)}
          className={`text-2xl cursor-pointer transition transform ${
            i < rating ? "text-yellow-400 scale-110" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StoreReviews = ({ storeId, storeName }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/storereview/${storeId}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          setReviews(data?.data?.reviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [storeId]);

  const handleAddReview = async () => {
    if (!user) {
      toast.error("Please signup to add review");
      router.push("/auth/signup");
      return;
    }

    if (!newComment.trim()) return toast.error("Comment cannot be empty");
    if (rating === 0) return toast.error("Please select rating");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/storereview/${storeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: newComment,
            rating: rating,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        const newReview = data?.data?.review;

        if (!newReview) {
          toast.error("Invalid response from server");
          return;
        }

        setReviews((prev) => [newReview, ...prev]);

        setNewComment("");
        setRating(0);
        setShowForm(false);

        toast.success("Review added successfully!");
      } else {
        toast.error(data?.message || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleReviewButton = () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    setShowForm((prev) => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16">

      <Toaster position="top-center" />

      {/* Heading */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          What people say about{" "}
          <span className="text-blue-600">{storeName}</span>
        </h2>

        <button
          onClick={handleReviewButton}
          className="cursor-pointer bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {user
            ? showForm
              ? "Cancel"
              : "Say Something"
            : "Signup to Say Something"}
        </button>

      </div>

      {/* Review Form */}

      {showForm && user && (
        <div className="mb-10 p-6 border rounded-2xl shadow-lg max-w-lg bg-white">

          <p className="text-sm text-gray-500 mb-2">Your Rating</p>

          <RatingInput rating={rating} setRating={setRating} />

          <textarea
            placeholder="Write your review..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          />

          <button
            onClick={handleAddReview}
            className="cursor-pointer bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit Review
          </button>

        </div>
      )}

      {/* Reviews */}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No reviews found
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

          {reviews.map((review) => (

            <div
              key={`${review.userName}-${review.createdAt}`}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:-translate-y-1"
            >

              <div className="flex items-center gap-4 mb-4">

                {review?.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.userName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                    👤
                  </div>
                )}

                <div className="flex-1">

                  <h4 className="font-semibold text-gray-900">
                    {review?.userName || "User"}
                  </h4>

                  <RatingStars rating={review.rating || 0} />

                </div>

                <span className="text-xs text-gray-400">
                  {formatDate(review.createdAt)}
                </span>

              </div>

              <p className="text-gray-600 leading-relaxed">
                {review.comment}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default StoreReviews;