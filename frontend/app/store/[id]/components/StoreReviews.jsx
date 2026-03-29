"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../context/Authcontext";
import { useRouter } from "next/navigation";

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const RatingStars = ({ rating = 0 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ fontSize: 13, color: i < rating ? "#f59e0b" : "#ddd8cf", lineHeight: 1 }}>★</span>
    ))}
  </div>
);

const RatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          onClick={() => setRating(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: 28, cursor: "pointer", lineHeight: 1,
            color: i < (hover || rating) ? "#f59e0b" : "#ddd8cf",
            transform: i < (hover || rating) ? "scale(1.15)" : "scale(1)",
            transition: "all .15s", userSelect: "none",
          }}
        >★</span>
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/storereview/${storeId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setReviews(data?.data?.reviews || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchReviews();
  }, [storeId]);

  const handleAddReview = async () => {
    if (!user) { toast.error("Please sign up first"); router.push("/auth/signup"); return; }
    if (!newComment.trim()) return toast.error("Comment cannot be empty");
    if (rating === 0) return toast.error("Please select a star rating");
    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/storereview/${storeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: newComment, rating }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        const newReview = data?.data?.review;
        if (!newReview) { toast.error("Invalid response"); return; }
        setReviews(prev => [newReview, ...prev]);
        setNewComment(""); setRating(0); setShowForm(false);
        toast.success("Review published! 🎉");
      } else {
        toast.error(data?.message || "Failed to post review");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const handleReviewButton = () => {
    if (!user) { router.push("/auth/signup"); return; }
    setShowForm(p => !p);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Outfit:wght@400;500;600&display=swap');

        .sr-root{
          font-family:'Outfit',sans-serif;
          width:100%;
          background:#f7f6f3;
          padding:60px 40px 80px;
          border-top:1px solid #e8e3db;
        }
        @media(max-width:768px){.sr-root{padding:48px 20px 64px;}}
        @media(max-width:480px){.sr-root{padding:40px 16px 56px;}}

        .sr-inner{width:100%;}

        /* HEADER */
        .sr-header{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:16px;margin-bottom:40px;
          flex-wrap:wrap;
        }
        .sr-title{
          font-family:'Fraunces',serif;
          font-size:clamp(22px,3.5vw,36px);
          font-weight:700;color:#1a1814;margin:0;line-height:1.2;
        }
        .sr-title span{color:#d97706;}
        .sr-sub{font-size:13px;color:#9e9994;margin-top:5px;}

        .sr-btn-write{
          padding:11px 24px;
          border-radius:14px;font-size:14px;font-weight:600;
          cursor:pointer;
          border:1.5px solid #1a1814;
          background:#1a1814;color:#fff;
          transition:all .18s;white-space:nowrap;
        }
        .sr-btn-write:hover{opacity:.82;transform:translateY(-1px);}
        .sr-btn-write.cancel{
          background:#fff;color:#5c5852;border-color:#ccc8c0;
        }
        .sr-btn-write.cancel:hover{background:#f7f6f3;color:#1a1814;}

        /* FORM */
        .sr-form{
          background:#fff;
          border:1px solid #e8e3db;
          border-radius:24px;
          padding:30px 32px;
          max-width:600px;
          margin-bottom:48px;
          box-shadow:0 4px 16px rgba(0,0,0,.07);
          animation:slideDown .3s ease;
        }
        @media(max-width:600px){.sr-form{padding:22px 18px;max-width:100%;}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}

        .sr-form-lbl{
          font-size:11px;font-weight:600;
          text-transform:uppercase;letter-spacing:.09em;
          color:#9e9994;margin-bottom:10px;
        }
        .sr-textarea{
          width:100%;background:#f7f6f3;
          border:1px solid #e8e3db;border-radius:12px;
          padding:13px 16px;
          font-family:'Outfit',sans-serif;font-size:14px;color:#1a1814;
          resize:vertical;min-height:110px;
          outline:none;transition:border-color .2s;
          margin-bottom:16px;display:block;
        }
        .sr-textarea::placeholder{color:#9e9994;}
        .sr-textarea:focus{border-color:#d97706;}
        .sr-btn-submit{
          padding:12px 28px;border-radius:12px;
          font-size:14px;font-weight:600;
          cursor:pointer;border:none;
          background:#1a1814;color:#fff;
          transition:all .18s;
        }
        .sr-btn-submit:hover:not(:disabled){opacity:.82;transform:translateY(-1px);}
        .sr-btn-submit:disabled{opacity:.5;cursor:not-allowed;}

        /* STATES */
        .sr-loading,.sr-empty{
          text-align:center;padding:60px 20px;
          color:#9e9994;font-size:15px;
        }
        .sr-empty-icon{font-size:44px;margin-bottom:14px;opacity:.5;}

        /* GRID */
        .sr-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
          gap:20px;
        }
        @media(max-width:480px){.sr-grid{grid-template-columns:1fr;}}

        /* REVIEW CARD */
        .sr-card{
          background:#fff;
          border:1px solid #e8e3db;
          border-radius:20px;
          padding:24px;
          transition:all .22s ease;
          position:relative;overflow:hidden;
        }
        .sr-card::before{
          content:'"';
          position:absolute;top:-6px;right:18px;
          font-size:72px;font-family:'Fraunces',serif;
          color:rgba(217,119,6,.07);line-height:1;pointer-events:none;
        }
        .sr-card:hover{
          border-color:#d97706;
          transform:translateY(-4px);
          box-shadow:0 16px 36px rgba(0,0,0,.09);
        }

        .sr-card-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
        .sr-av{
          width:46px;height:46px;border-radius:50%;
          object-fit:cover;border:2px solid #e8e3db;flex-shrink:0;
        }
        .sr-av-ph{
          width:46px;height:46px;border-radius:50%;
          background:#f0ede6;border:1px solid #e8e3db;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;flex-shrink:0;
        }
        .sr-user{flex:1;min-width:0;}
        .sr-uname{
          font-weight:600;font-size:14px;color:#1a1814;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .sr-date{
          font-size:11px;color:#9e9994;
          white-space:nowrap;align-self:flex-start;margin-top:2px;
        }
        .sr-comment{
          font-size:14px;color:#5c5852;line-height:1.72;margin:0;
        }

        /* TOP DIVIDER */
        .sr-sep{
          width:100%;height:1px;
          background:linear-gradient(to right,transparent,#e8e3db,transparent);
          margin-bottom:60px;
        }
      `}</style>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1a1814",
            border: "1px solid #e8e3db",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,.08)",
          },
        }}
      />

      <div className="sr-sep" />

      <div className="sr-root">
        <div className="sr-inner">

          <div className="sr-header">
            <div>
              <h2 className="sr-title">
                What people say about <span>{storeName}</span>
              </h2>
              <p className="sr-sub">
                {reviews.length > 0
                  ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`
                  : "Be the first to share your experience"}
              </p>
            </div>
            <button
              onClick={handleReviewButton}
              className={`sr-btn-write ${showForm ? "cancel" : ""}`}
            >
              {user
                ? showForm ? "✕ Cancel" : "✍ Write a Review"
                : "Sign up to Review"}
            </button>
          </div>

          {showForm && user && (
            <div className="sr-form">
              <div className="sr-form-lbl">Your Rating</div>
              <RatingInput rating={rating} setRating={setRating} />
              <div className="sr-form-lbl">Your Review</div>
              <textarea
                className="sr-textarea"
                placeholder="Share your honest experience with this store…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <button
                className="sr-btn-submit"
                onClick={handleAddReview}
                disabled={submitting}
              >
                {submitting ? "Publishing…" : "Publish Review"}
              </button>
            </div>
          )}

          {loading ? (
            <div className="sr-loading">Loading reviews…</div>
          ) : reviews.length === 0 ? (
            <div className="sr-empty">
              <div className="sr-empty-icon">💬</div>
              <div>No reviews yet — be the first!</div>
            </div>
          ) : (
            <div className="sr-grid">
              {reviews.map((review) => (
                <div key={`${review.userName}-${review.createdAt}`} className="sr-card">
                  <div className="sr-card-top">
                    {review?.avatar
                      ? <img src={review.avatar} alt={review.userName} className="sr-av" />
                      : <div className="sr-av-ph">👤</div>
                    }
                    <div className="sr-user">
                      <div className="sr-uname">{review?.userName || "Anonymous"}</div>
                      <RatingStars rating={review.rating || 0} />
                    </div>
                    <span className="sr-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="sr-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default StoreReviews;