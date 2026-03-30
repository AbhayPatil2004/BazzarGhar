"use client";

import { useRouter } from "next/navigation";
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaUsers, FaBoxOpen, FaShoppingBag,
} from "react-icons/fa";
import { MdCategory, MdVerified } from "react-icons/md";
import { useAuth } from "../../../context/Authcontext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function StoreDetailsPage({
  store,
  owner,
  subscribed: initialSubscribed,
  subscriberCount: initialCount,
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [subscribed, setSubscribed] = useState(initialSubscribed ?? false);
  const [subscriberCount, setSubscriberCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(store?.rating || 0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/subscription/${store._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setSubscribed(data.data.isSubscribed);
      } catch (err) { console.error(err); }
    };
    checkSubscription();
  }, [user, store._id]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/rating/${store._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUserRating(data.data.userRating);
          setAvgRating(data.data.avgRating);
        }
      } catch (err) { console.error(err); }
    };
    fetchRating();
  }, [store._id]);

  const handleSubscribe = async () => {
    if (!user) { router.push("/auth/signup"); return; }
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/subscribe/${store._id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubscribed(data.data.isSubscribed);
      setSubscriberCount(data.data.subscriberCount);
      data.data.isSubscribed ? toast.success("Subscribed! 🎉") : toast("Unsubscribed 👋");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleRating = async (value) => {
    if (!user) { router.push("/auth/signup"); return; }
    if (ratingLoading) return;
    try {
      setRatingLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/rate/${store._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating: value }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserRating(data.data.userRating);
      setAvgRating(data.data.avgRating);
      toast.success("Rating saved ⭐");
    } catch { toast.error("Rating failed"); }
    finally { setRatingLoading(false); }
  };

  if (!store) return null;

  const displayRating = hoverRating || userRating || Math.round(avgRating);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root{
          --w:#ffffff;
          --bg:#f7f6f3;
          --bg2:#f0ede6;
          --bd:#e8e3db;
          --bd2:#ccc8c0;
          --t1:#1a1814;
          --t2:#5c5852;
          --t3:#9e9994;
          --amber:#2563eb;
          --amber-bg:#dbeafe;
          --amber-bd:#93c5fd;
          --green:#16a34a;
          --green-bg:#dcfce7;
          --red:#dc2626;
          --red-bg:#fee2e2;
          --indigo:#4338ca;
          --sh1:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --sh2:0 4px 16px rgba(0,0,0,.08),0 2px 6px rgba(0,0,0,.04);
          --sh3:0 12px 40px rgba(0,0,0,.09),0 4px 12px rgba(0,0,0,.05);
          --r1:8px;--r2:14px;--r3:20px;--r4:28px;
        }

        .sd,
        .sd * { box-sizing:border-box; }

        .sd {
          font-family:'Outfit',sans-serif;
          background:var(--bg);
          min-height:100vh;
          color:var(--t1);
          width:100%;
        }

        /* ─── HERO ─── */
        .sd-hero{
          width:100%;
          height:400px;
          position:relative;
          overflow:hidden;
        }
        @media(max-width:768px){.sd-hero{height:260px;}}
        @media(max-width:480px){.sd-hero{height:190px;}}

        .sd-hero-img{
          width:100%;height:100%;
          object-fit:cover;
          transition:transform 8s ease;
          display:block;
        }
        .sd-hero:hover .sd-hero-img{transform:scale(1.04);}

        .sd-hero-grad{
          position:absolute;inset:0;
          background:linear-gradient(to bottom,rgba(247,246,243,0) 35%,rgba(247,246,243,.7) 75%,rgba(247,246,243,1) 100%);
          pointer-events:none;
        }

        .sd-live{
          position:absolute;top:22px;left:24px;
          display:flex;align-items:center;gap:7px;
          background:rgba(255,255,255,.92);
          backdrop-filter:blur(10px);
          border:1px solid var(--bd);
          border-radius:100px;
          padding:5px 14px;
          font-size:12px;font-weight:600;
          color:var(--t2);
          box-shadow:var(--sh1);
        }
        .sd-live-dot{
          width:7px;height:7px;border-radius:50%;
          background:var(--green);
          animation:blink 1.8s infinite;
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

        /* ─── PROFILE STRIP ─── */
        .sd-profile{
          width:100%;
          background:var(--w);
          border-bottom:1px solid var(--bd);
          padding:0 40px 32px;
          margin-top:-64px;
          position:relative;z-index:10;
          box-shadow:var(--sh2);
          animation:fadeUp .45s ease both;
        }
        @media(max-width:768px){.sd-profile{padding:0 20px 28px;margin-top:-44px;}}
        @media(max-width:480px){.sd-profile{padding:0 16px 24px;margin-top:-32px;}}

        .sd-top{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:16px;
          padding-top:20px;
          flex-wrap:wrap;
        }
        @media(max-width:560px){
          .sd-top{flex-direction:column;align-items:flex-start;}
        }

        .sd-logo-group{display:flex;align-items:flex-end;gap:18px;}

        .sd-logo{
          width:96px;height:96px;
          border-radius:var(--r3);
          overflow:hidden;
          border:3px solid var(--w);
          box-shadow:0 8px 24px rgba(37,99,235,.2);
          flex-shrink:0;
          background:linear-gradient(135deg,var(--bg2) 0%,#f0f9ff 100%);
          position:relative;
        }
        .sd-logo img{
          width:100%;height:100%;object-fit:cover;
          transition:transform .4s ease;
          display:block;
        }
        .sd-logo:hover img{transform:scale(1.12);}
        @media(max-width:480px){.sd-logo{width:72px;height:72px;}}

        .sd-name-col{padding-bottom:4px;}
        .sd-name{
          font-family:'Fraunces',serif;
          font-size:clamp(19px,3.5vw,30px);
          font-weight:700;
          color:var(--t1);
          margin:0;
          display:flex;align-items:center;gap:8px;
          line-height:1.2;
          letter-spacing:-.5px;
        }
        .sd-verified{color:#2563eb;font-size:18px;animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
        .sd-cat{
          display:inline-flex;align-items:center;gap:5px;
          margin-top:8px;
          background:linear-gradient(135deg,var(--bg2) 0%,#fef3c7 100%);
          border:1.5px solid #fcd34d;
          border-radius:100px;
          padding:4px 14px;
          font-size:12px;font-weight:600;
          color:#92400e;
          box-shadow:0 2px 4px rgba(217,119,6,.1);
        }

        /* BUTTONS */
        .sd-btn-follow{
          padding:12px 28px;
          border-radius:var(--r2);
          font-size:14px;font-weight:600;
          cursor:pointer;border:none;
          background:linear-gradient(135deg,var(--amber) 0%,#1e40af 100%);
          color:#fff;
          letter-spacing:.01em;
          transition:all .25s cubic-bezier(.4,.0,.2,1);
          white-space:nowrap;
          box-shadow:0 4px 15px rgba(37,99,235,.25);
          position:relative;
          overflow:hidden;
        }
        .sd-btn-follow::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.2) 0%,transparent 50%);
          opacity:0;transition:opacity .25s;
        }
        .sd-btn-follow:hover::before{opacity:1;}
        .sd-btn-follow:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(37,99,235,.35);}
        .sd-btn-follow.following{
          background:var(--w);color:var(--t1);
          border:2px solid var(--amber);
          box-shadow:0 2px 8px rgba(37,99,235,.12);
        }
        .sd-btn-follow.following:hover{border-color:var(--red);color:var(--red);background:var(--red-bg);}
        .sd-btn-follow:disabled{opacity:.5;cursor:not-allowed;transform:none;}

        .sd-btn-signup{
          padding:12px 26px;
          border-radius:var(--r2);
          font-size:14px;font-weight:600;
          cursor:pointer;
          border:2px solid var(--t1);
          background:var(--t1);color:var(--w);
          transition:all .25s;
          white-space:nowrap;
          box-shadow:0 4px 15px rgba(26,24,20,.15);
        }
        .sd-btn-signup:hover{background:var(--w);color:var(--t1);border-color:var(--t1);box-shadow:0 6px 20px rgba(26,24,20,.2);transform:translateY(-2px);}

        /* DIVIDER */
        .sd-hr{width:100%;height:1px;background:var(--bd);margin:22px 0;}

        /* RATING */
        .sd-rating-row{
          display:flex;align-items:center;gap:14px;flex-wrap:wrap;
        }
        .sd-stars{display:flex;gap:3px;}
        .sd-star{
          font-size:24px;cursor:pointer;
          color:#e5e5e0;
          transition:color .12s,transform .12s;
          line-height:1;user-select:none;
          filter:drop-shadow(0 1px 2px rgba(0,0,0,.05));
        }
        .sd-star.lit{color:#fbbf24;filter:drop-shadow(0 2px 4px rgba(251,191,36,.4));}
        .sd-star:hover{transform:scale(1.35);color:#fbbf24;}
        .sd-rat-avg{font-size:18px;font-weight:700;color:var(--t1);font-family:'Fraunces',serif;}
        .sd-rat-sub{font-size:13px;color:var(--t3);font-weight:500;}
        .sd-rat-yours{
          font-size:12px;font-weight:600;
          background:linear-gradient(135deg,var(--amber-bg) 0%,#bfdbfe 100%);
          color:var(--amber);
          border:1.5px solid var(--amber-bd);
          border-radius:100px;padding:4px 12px;
          box-shadow:0 2px 4px rgba(37,99,235,.08);
        }

        /* STATS STRIP */
        .sd-stats{
          display:flex;
          background:linear-gradient(135deg,var(--w) 0%,#f8fafc 100%);
          border:1.5px solid var(--bd);
          border-radius:var(--r2);
          overflow:hidden;
          margin-top:24px;
          box-shadow:0 4px 12px rgba(0,0,0,.04);
        }
        .sd-stat{
          flex:1;padding:18px 20px;
          display:flex;align-items:center;gap:14px;
          border-right:1px solid var(--bd);
          transition:all .2s;
          position:relative;
          overflow:hidden;
        }
        .sd-stat::before{
          content:'';position:absolute;left:0;top:0;bottom:0;
          width:3px;background:var(--amber);
          transform:scaleY(0);transition:transform .3s;transform-origin:top;
        }
        .sd-stat:hover::before{transform:scaleY(1);}
        .sd-stat:last-child{border-right:none;}
        .sd-stat:hover{background:var(--bg2);}
        .sd-stat-ico{
          width:42px;height:42px;
          border-radius:var(--r2);
          background:linear-gradient(135deg,var(--amber-bg) 0%,#dbeafe 100%);
          border:1.5px solid var(--amber-bd);
          display:flex;align-items:center;justify-content:center;
          font-size:18px;color:var(--amber);flex-shrink:0;
          box-shadow:0 2px 6px rgba(37,99,235,.12);
        }
        .sd-stat-v{font-size:19px;font-weight:700;color:var(--t1);line-height:1;font-family:'Fraunces',serif;}
        .sd-stat-l{font-size:12px;color:var(--t3);font-weight:500;margin-top:2px;}
        @media(max-width:520px){
          .sd-stats{flex-direction:column;}
          .sd-stat{border-right:none;border-bottom:1px solid var(--bd);}
          .sd-stat:last-child{border-bottom:none;}
        }

        /* ─── BODY ─── */
        .sd-body{
          width:100%;
          padding:24px 40px 80px;
        }
        @media(max-width:768px){.sd-body{padding:20px 20px 60px;}}
        @media(max-width:480px){.sd-body{padding:16px 16px 48px;}}

        /* SECTION CARD */
        .sd-card{
          width:100%;
          background:linear-gradient(135deg,var(--w) 0%,#fafaf8 100%);
          border:1.5px solid var(--bd);
          border-radius:var(--r4);
          padding:30px 36px;
          margin-bottom:20px;
          box-shadow:0 4px 12px rgba(0,0,0,.05);
          transition:all .3s cubic-bezier(.4,.0,.2,1);
          position:relative;
          overflow:hidden;
        }
        .sd-card::before{
          content:'';position:absolute;top:0;left:-100%;
          width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
          transition:left .5s;
        }
        .sd-card:hover::before{left:100%;}
        .sd-card:hover{box-shadow:0 12px 32px rgba(0,0,0,.08);transform:translateY(-2px);border-color:#dbeafe;}
        @media(max-width:600px){.sd-card{padding:22px 18px;}}

        .sd-card-head{
          display:flex;align-items:center;
          justify-content:space-between;
          margin-bottom:20px;
          gap:12px;
        }
        .sd-card-title{
          font-family:'Fraunces',serif;
          font-size:19px;font-weight:700;
          color:var(--t1);margin:0;
          letter-spacing:-.3px;
        }
        .sd-card-badge{
          font-size:12px;font-weight:600;
          background:linear-gradient(135deg,var(--amber-bg) 0%,#dbeafe 100%);
          border:1.5px solid var(--amber-bd);
          border-radius:100px;padding:4px 14px;
          color:var(--amber);
          box-shadow:0 2px 4px rgba(37,99,235,.08);
        }

        .sd-desc{font-size:15px;line-height:1.82;color:var(--t2);margin:0;}

        /* TAGS */
        .sd-tags{display:flex;flex-wrap:wrap;gap:8px;}
        .sd-tag{
          display:inline-flex;align-items:center;
          padding:8px 18px;
          background:linear-gradient(135deg,var(--bg2) 0%,#f5f5f0 100%);
          border:1.5px solid var(--bd);
          border-radius:100px;
          font-size:13px;font-weight:600;
          color:var(--t1);
          transition:all .2s;
          cursor:default;
          box-shadow:0 2px 4px rgba(0,0,0,.03);
        }
        .sd-tag:hover{
          background:linear-gradient(135deg,var(--amber-bg) 0%,#fef3c7 100%);
          color:var(--t1);
          border-color:var(--amber-bd);
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(37,99,235,.1);
        }

        /* 2 COL */
        .sd-2col{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;margin-bottom:20px;
        }
        @media(max-width:700px){.sd-2col{grid-template-columns:1fr;}}

        .sd-2col .sd-card{margin-bottom:0;}

        /* OWNER */
        .sd-owner{display:flex;align-items:center;gap:14px;}
        .sd-owner-av{
          width:60px;height:60px;border-radius:50%;
          object-fit:cover;border:3px solid var(--amber-bd);flex-shrink:0;
          box-shadow:0 4px 12px rgba(37,99,235,.15);
        }
        .sd-owner-name{font-weight:700;font-size:16px;color:var(--t1);margin:0 0 4px;}
        .sd-owner-row{
          display:flex;align-items:center;gap:6px;
          font-size:13px;color:var(--t2);margin-top:4px;
        }
        .sd-owner-row svg{color:var(--amber);}

        /* ADDRESS */
        .sd-addr{font-size:14px;color:var(--t2);line-height:1.88;margin:12px 0 0;}

        /* META 3-COL */
        .sd-meta{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px;
        }
        @media(max-width:520px){.sd-meta{grid-template-columns:1fr;}}

        .sd-meta-card{
          background:linear-gradient(135deg,var(--w) 0%,#fafaf8 100%);
          border:1.5px solid var(--bd);
          border-radius:var(--r3);
          padding:24px 26px;
          display:flex;flex-direction:column;gap:8px;
          box-shadow:0 4px 12px rgba(0,0,0,.04);
          transition:all .3s cubic-bezier(.4,.0,.2,1);
          cursor:default;
        }
        .sd-meta-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.08);border-color:#93c5fd;}
        .sd-meta-lbl{
          font-size:11px;font-weight:700;
          text-transform:uppercase;letter-spacing:.12em;color:var(--t3);
        }
        .sd-meta-val{
          font-family:'Fraunces',serif;
          font-size:28px;font-weight:700;color:var(--t1);line-height:1;
          letter-spacing:-.5px;
        }
        .sd-meta-val.yes{color:var(--green);}
        .sd-meta-val.no{color:var(--red);}
        .sd-meta-chip{
          display:inline-block;font-size:11px;font-weight:700;
          border-radius:100px;padding:4px 12px;width:fit-content;
          box-shadow:0 2px 4px rgba(0,0,0,.05);
        }
        .sd-meta-chip.yes{background:var(--green-bg);color:var(--green);box-shadow:0 2px 8px rgba(22,163,74,.1);}
        .sd-meta-chip.no{background:var(--red-bg);color:var(--red);box-shadow:0 2px 8px rgba(220,38,38,.1);}

        /* ANIMATIONS */
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .sd-a0{animation:fadeUp .45s ease both;}
        .sd-a1{animation:fadeUp .45s .06s ease both;}
        .sd-a2{animation:fadeUp .45s .12s ease both;}
        .sd-a3{animation:fadeUp .45s .18s ease both;}
        .sd-a4{animation:fadeUp .45s .24s ease both;}
        .sd-a5{animation:fadeUp .45s .30s ease both;}
      `}</style>

      <div className="sd">

        {/* HERO */}
        <div className="sd-hero">
          <img src={store.banner || "/default-banner.jpg"} alt="Store Banner" className="sd-hero-img" />
          <div className="sd-hero-grad" />
          <div className="sd-live">
            <span className="sd-live-dot" /> Live Store
          </div>
        </div>

        {/* PROFILE */}
        <div className="sd-profile sd-a0">
          <div className="sd-top">
            <div className="sd-logo-group">
              <div className="sd-logo">
                <img src={store.logo || "/default-logo.png"} alt={store.storeName} />
              </div>
              <div className="sd-name-col">
                <h1 className="sd-name">
                  {store.storeName}
                  {store.isApproved && <MdVerified className="sd-verified" />}
                </h1>
                <span className="sd-cat"><MdCategory /> {store.category || "General"}</span>
              </div>
            </div>

            {!user ? (
              <button className="sd-btn-signup" onClick={() => router.push("/auth/signup")}>
                Sign up to Subscribe
              </button>
            ) : (
              <button
                className={`sd-btn-follow ${subscribed ? "following" : ""}`}
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "..." : subscribed ? "✓ Subscribed" : "+ Subscribe Store"}
              </button>
            )}
          </div>

          <div className="sd-hr" />

          <div className="sd-rating-row">
            <div className="sd-stars">
              {[1,2,3,4,5].map(s => (
                <span
                  key={s}
                  className={`sd-star ${s <= displayRating ? "lit" : ""}`}
                  onClick={() => handleRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                >★</span>
              ))}
            </div>
            <span className="sd-rat-avg">{avgRating?.toFixed(1) || "0.0"}</span>
            <span className="sd-rat-sub">Store Rating</span>
            {userRating > 0 && <span className="sd-rat-yours">You: {userRating}★</span>}
            {ratingLoading && <span style={{fontSize:12,color:"var(--t3)"}}>Saving…</span>}
          </div>

          <div className="sd-stats">
            <div className="sd-stat">
              <div className="sd-stat-ico"><FaUsers /></div>
              <div><div className="sd-stat-v">{subscriberCount.toLocaleString()}</div><div className="sd-stat-l">Subscribers</div></div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-ico"><FaBoxOpen /></div>
              <div><div className="sd-stat-v">{store.totalProducts ?? 0}</div><div className="sd-stat-l">Products</div></div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-ico"><FaShoppingBag /></div>
              <div><div className="sd-stat-v">{store.totalOrders ?? 0}</div><div className="sd-stat-l">Orders</div></div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="sd-body">

          {/* ABOUT */}
          <div className="sd-card sd-a1">
            <div className="sd-card-head">
              <h2 className="sd-card-title">About This Store</h2>
            </div>
            <p className="sd-desc">{store.description || "No description provided for this store yet."}</p>
          </div>

          {/* PRODUCTS */}
          <div className="sd-card sd-a2">
            <div className="sd-card-head">
              <h2 className="sd-card-title">What We Sell</h2>
              {store.storeProducts?.length > 0 && (
                <span className="sd-card-badge">{store.storeProducts.length} items</span>
              )}
            </div>
            <div className="sd-tags">
              {store.storeProducts?.length > 0
                ? store.storeProducts.map((p, i) => (
                    <span key={i} className="sd-tag">{p.replace(/"/g,"").trim()}</span>
                  ))
                : <p style={{fontSize:14,color:"var(--t3)",margin:0}}>No products listed yet.</p>
              }
            </div>
          </div>

          {/* OWNER + ADDRESS */}
          <div className="sd-2col sd-a3">
            <div className="sd-card">
              <div className="sd-card-head"><h2 className="sd-card-title">Store Owner</h2></div>
              <div className="sd-owner">
                <img src={owner?.avatar || "/default-avatar.png"} alt={owner?.username} className="sd-owner-av" />
                <div>
                  <p className="sd-owner-name">{owner?.username || "Unknown"}</p>
                  <div className="sd-owner-row"><FaEnvelope />{owner?.email || "N/A"}</div>
                  {owner?.phone && <div className="sd-owner-row"><FaPhoneAlt />{owner.phone}</div>}
                </div>
              </div>
            </div>

            <div className="sd-card">
              <div className="sd-card-head">
                <h2 className="sd-card-title" style={{display:"flex",alignItems:"center",gap:8}}>
                  <FaMapMarkerAlt style={{color:"var(--red)"}} /> Store Location
                </h2>
              </div>
              <p className="sd-addr">
                {store.address?.street || "N/A"}<br />
                {store.address?.city} {store.address?.state}<br />
                {store.address?.postalCode}<br />
                {store.address?.country}
              </p>
            </div>
          </div>

          {/* META */}
          <div className="sd-meta sd-a4">
            <div className="sd-meta-card">
              <span className="sd-meta-lbl">Commission Rate</span>
              <span className="sd-meta-val">{store.commissionRate ?? 0}%</span>
            </div>
            <div className="sd-meta-card">
              <span className="sd-meta-lbl">Store Status</span>
              <span className={`sd-meta-val ${store.isActive ? "yes" : "no"}`}>
                {store.isActive ? "Active" : "Inactive"}
              </span>
              <span className={`sd-meta-chip ${store.isActive ? "yes" : "no"}`}>
                {store.isActive ? "Live" : "Offline"}
              </span>
            </div>
            <div className="sd-meta-card">
              <span className="sd-meta-lbl">Verification</span>
              <span className={`sd-meta-val ${store.isApproved ? "yes" : "no"}`}>
                {store.isApproved ? "Verified" : "Pending"}
              </span>
              <span className={`sd-meta-chip ${store.isApproved ? "yes" : "no"}`}>
                {store.isApproved ? "Approved" : "Under Review"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}