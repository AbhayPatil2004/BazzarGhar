"use client";

import { useEffect, useState } from "react";
import StoreCard from "../../components/StoreCard";

export default function SimilarStores({ category, storeId, storeName }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchStores = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/category`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category }),
          }
        );

        const result = await res.json();

        if (result.success) {
          setStores(result.data.filter((s) => s._id !== storeId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [category, storeId]);

  if (!category) return null;

  return (
    <div className="w-full" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', paddingTop: '64px', paddingBottom: '80px', borderTop: '1.5px solid #e5e5e0'}}>
      
      {/* Header */}
      <div style={{maxWidth: '100%', paddingLeft: '40px', paddingRight: '40px', marginBottom: '40px'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px'}}>
          <div>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)', color: '#2563eb', border: '1.5px solid #93c5fd', borderRadius: '9999px', paddingLeft: '14px', paddingRight: '14px', paddingTop: '6px', paddingBottom: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'}}>
              ● {category}
            </div>

            <h2 style={{fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: '700', color: '#1a1814', margin: '0', letterSpacing: '-0.5px', lineHeight: '1.2', fontFamily: "'Fraunces', serif"}}>
              Similar to <span style={{background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '800'}}>{storeName}</span>
            </h2>

            <p style={{fontSize: '14px', color: '#9e9994', marginTop: '6px', fontWeight: '500'}}>
              More stores you might like
            </p>
          </div>

          {!loading && stores.length > 0 && (
            <span style={{fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)', border: '1.5px solid #93c5fd', borderRadius: '9999px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '6px', paddingBottom: '6px', color: '#2563eb', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'}}>
              {stores.length} Store{stores.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{paddingLeft: '40px', paddingRight: '40px'}}>
        {loading ? (
          <div style={{textAlign: 'center', paddingTop: '60px', paddingBottom: '60px', color: '#9e9994', fontSize: '15px', fontWeight: '500', position: 'relative'}}>
            <span style={{display: 'inline-block', width: '20px', height: '20px', border: '2px solid #e5e5e0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '10px', verticalAlign: 'middle'}} />
            Discovering stores…
          </div>
        ) : stores.length === 0 ? (
          <div style={{textAlign: 'center', paddingTop: '80px', paddingBottom: '80px', color: '#9e9994', fontSize: '16px', fontWeight: '500'}}>
            No similar stores found in {category}.
          </div>
        ) : (
         <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, max-content))', justifyContent: 'center', gap: '28px 24px'}}>
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media(max-width: 768px) {
          div[style*="paddingLeft: 40px"] {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
        @media(max-width: 480px) {
          div[style*="paddingLeft: 40px"] {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}