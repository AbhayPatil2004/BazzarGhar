"use client";

import { useEffect, useState } from "react";
import StoreCard from "../../components/StoreCard";

export default function OwnerStores({ ownerId, ownerName, storeId }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/owner/${ownerId}`);
        const result = await res.json();
        if (result.success) {
          setStores(result.data.filter((s) => s._id !== storeId));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStores();
  }, [ownerId, storeId]);

  if (!ownerId || (!loading && stores.length === 0)) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&family=Outfit:wght@400;500;600&display=swap');

        .os-root{
          font-family:'Outfit',sans-serif;
          width:100%;
          background:linear-gradient(135deg,#ffffff 0%,#f9fafb 100%);
          padding:64px 40px 80px;
          border-top:1.5px solid #e5e5e0;
          border-bottom:1.5px solid #e5e5e0;
        }
        @media(max-width:768px){.os-root{padding:48px 20px 64px;}}
        @media(max-width:480px){.os-root{padding:40px 16px 56px;}}

        .os-header{
          display:flex;align-items:flex-end;
          justify-content:space-between;gap:16px;
          margin-bottom:40px;flex-wrap:wrap;
        }
        .os-title{
          font-family:'Fraunces',serif;
          font-size:clamp(22px,3.5vw,36px);
          font-weight:700;color:#1a1814;margin:0;
          letter-spacing:-0.5px;line-height:1.2;
        }
        .os-title span{
          background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          font-weight:800;
        }
        .os-sub{font-size:14px;color:#9e9994;margin-top:6px;font-weight:500;}
        .os-count{
          font-size:13px;font-weight:700;
          background:linear-gradient(135deg,#dbeafe 0%,#f0f9ff 100%);
          border:1.5px solid #93c5fd;
          border-radius:100px;padding:6px 16px;color:#2563eb;
          white-space:nowrap;
          box-shadow:0 2px 8px rgba(37,99,235,.12);
        }

        .os-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,max-content));
          justify-content:center;gap:28px 24px;
        }
        @media(max-width:480px){
          .os-grid{grid-template-columns:repeat(2,1fr);gap:16px 12px;}
        }

        .os-loading{
          text-align:center;padding:60px 20px;
          color:#9e9994;font-size:15px;font-weight:500;
        }
        .os-loading::before{
          content:'';
          display:inline-block;
          width:20px;height:20px;
          border:2px solid #e5e5e0;
          border-top-color:#2563eb;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
          margin-right:10px;
          vertical-align:middle;
        }
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>

      <div className="os-root">
        <div className="os-header">
          <div>
            <h2 className="os-title">
              More from <span>{ownerName}</span>
            </h2>
            <p className="os-sub">Other stores by this seller</p>
          </div>
          {!loading && (
            <span className="os-count">{stores.length} Store{stores.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {loading ? (
          <div className="os-loading">Loading stores…</div>
        ) : (
         <div className="os-grid">
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}