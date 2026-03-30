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
      <span key={i} style={{ fontSize: 13, color: i < rating ? "#2563eb" : "#ddd8cf", lineHeight: 1 }}>★</span>
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
            color: i < (hover || rating) ? "#2563eb" : "#ddd8cf",
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
          background:linear-gradient(135deg,#f9fafb 0%,#ffffff 100%);
          padding:64px 40px 80px;
          border-top:1.5px solid #e5e5e0;
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
          letter-spacing:-0.5px;
        }
        .sr-title span{
          background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          font-weight:800;
        }
        .sr-sub{font-size:14px;color:#9e9994;margin-top:6px;font-weight:500;}

        .sr-btn-write{
          padding:12px 26px;
          border-radius:14px;font-size:14px;font-weight:600;
          cursor:pointer;
          border:none;
          background:linear-gradient(135deg,#1a1814 0%,#2d2522 100%);
          color:#fff;
          transition:all .25s cubic-bezier(.4,.0,.2,1);
          white-space:nowrap;
          box-shadow:0 4px 15px rgba(26,24,20,.25);position:relative;overflow:hidden;
        }
        .sr-btn-write::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.2) 0%,transparent 50%);
          opacity:0;transition:opacity .25s;
        }
        .sr-btn-write:hover::before{opacity:1;}
        .sr-btn-write:hover{transform:translateY(-2px);box-shadow:0 6px 25px rgba(26,24,20,.35);}
        .sr-btn-write.cancel{
          background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);
          box-shadow:0 4px 15px rgba(220,38,38,.25);
        }
        .sr-btn-write.cancel:hover{box-shadow:0 6px 25px rgba(220,38,38,.35);}

        /* FORM */
        .sr-form{
          background:linear-gradient(135deg,#ffffff 0%,#f9fafb 100%);
          border:1.5px solid #e5e5e0;
          border-radius:20px;
          padding:32px 36px;
          max-width:600px;
          margin-bottom:48px;
          box-shadow:0 8px 24px rgba(0,0,0,.06);
          animation:slideDown .3s ease;
        }
        @media(max-width:600px){.sr-form{padding:22px 18px;max-width:100%;}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}

        .sr-form-lbl{
          font-size:12px;font-weight:700;
          text-transform:uppercase;letter-spacing:.12em;
          color:#1a1814;margin-bottom:12px;color:#9e9994;
        }
        .sr-textarea{
          width:100%;background:linear-gradient(135deg,#f9fafb 0%,#ffffff 100%);
          border:1.5px solid #e5e5e0;border-radius:14px;
          padding:14px 16px;
          font-family:'Outfit',sans-serif;font-size:14px;color:#1a1814;
          resize:vertical;min-height:120px;
          outline:none;transition:all .2s;
          margin-bottom:20px;display:block;box-shadow:0 2px 4px rgba(0,0,0,.02);
        }
        .sr-textarea::placeholder{color:#9e9994;}
        .sr-textarea:focus{border-color:#2563eb;box-shadow:0 4px 12px rgba(37,99,235,.12);}
        .sr-btn-submit{
          padding:12px 28px;border-radius:12px;
          font-size:14px;font-weight:600;
          cursor:pointer;border:none;
          background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);
          color:#fff;
          transition:all .25s;box-shadow:0 4px 12px rgba(37,99,235,.25);
        }
        .sr-btn-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(37,99,235,.35);}
        .sr-btn-submit:disabled{opacity:.5;cursor:not-allowed;}

        /* STATES */
        .sr-loading,.sr-empty{
          text-align:center;padding:80px 20px;
          color:#9e9994;font-size:15px;font-weight:500;
        }
        .sr-loading::before{
          content:'';
          display:inline-block;
          width:24px;height:24px;
          border:2.5px solid #e5e5e0;
          border-top-color:#2563eb;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
          margin-right:12px;
          vertical-align:middle;
        }
        .sr-empty-icon{font-size:52px;margin-bottom:16px;opacity:.6;}
        @keyframes spin{to{transform:rotate(360deg);}}

        /* GRID */
        .sr-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
          gap:24px;
        }
        @media(max-width:480px){.sr-grid{grid-template-columns:1fr;}}

        /* REVIEW CARD */
        .sr-card{
          background:linear-gradient(135deg,#ffffff 0%,#fafaf8 100%);
          border:1.5px solid #e5e5e0;
          border-radius:18px;
          padding:28px;
          transition:all .3s cubic-bezier(.4,.0,.2,1);
          position:relative;overflow:hidden;
          box-shadow:0 4px 12px rgba(0,0,0,.04);
        }
        .sr-card::before{
          content:'';
          position:absolute;top:0;left:-100%;
          width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(37,99,235,.05),transparent);
          transition:left .6s;
        }
        .sr-card:hover::before{left:100%;}
        .sr-card:hover{
          border-color:#93c5fd;
          transform:translateY(-6px);
          box-shadow:0 16px 40px rgba(37,99,235,.12);
        }

        .sr-card-top{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px;}
        .sr-av{
          width:48px;height:48px;border-radius:50%;
          object-fit:cover;border:2px solid #e5e5e0;flex-shrink:0;
          box-shadow:0 2px 8px rgba(0,0,0,.08);
        }
        .sr-av-ph{
          width:48px;height:48px;border-radius:50%;
          background:linear-gradient(135deg,#dbeafe 0%,#f0f9ff 100%);
          border:1.5px solid #93c5fd;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;flex-shrink:0;
        }
        .sr-user{flex:1;min-width:0;}
        .sr-uname{
          font-weight:700;font-size:15px;color:#1a1814;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .sr-date{
          font-size:12px;color:#9e9994;font-weight:500;
          white-space:nowrap;
        }
        .sr-comment{
          font-size:14px;color:#5c5852;line-height:1.7;margin:0;font-weight:500;
        }

        /* TOP DIVIDER */
        .sr-sep{
          width:100%;height:1px;
          background:linear-gradient(to right,transparent,#e5e5e0,transparent);
          margin-bottom:0;
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