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
          background:#ffffff;
          padding:56px 40px 64px;
          border-top:1px solid #e8e3db;
          border-bottom:1px solid #e8e3db;
        }
        @media(max-width:768px){.os-root{padding:44px 20px 52px;}}
        @media(max-width:480px){.os-root{padding:36px 16px 44px;}}

        .os-header{
          display:flex;align-items:flex-end;
          justify-content:space-between;gap:12px;
          margin-bottom:32px;flex-wrap:wrap;
        }
        .os-title{
          font-family:'Fraunces',serif;
          font-size:clamp(20px,3vw,32px);
          font-weight:700;color:#1a1814;margin:0;
        }
        .os-title span{color:#d97706;}
        .os-sub{font-size:13px;color:#9e9994;margin-top:4px;}
        .os-count{
          font-size:12px;font-weight:600;
          background:#f0ede6;border:1px solid #e8e3db;
          border-radius:100px;padding:4px 14px;color:#5c5852;
          white-space:nowrap;
        }

        .os-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
          gap:16px;
        }
        @media(max-width:480px){
          .os-grid{grid-template-columns:repeat(2,1fr);gap:12px;}
        }

        .os-loading{
          text-align:center;padding:40px;
          color:#9e9994;font-size:14px;
        }
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
         <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,max-content))] justify-center gap-x-8 gap-y-8">
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}