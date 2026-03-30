"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../../product/components/ProductCard";
import { useAuth } from "../../../context/Authcontext";

export default function StoreProducts({ storeId, storeName }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/products`
        );
        const result = await res.json();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  if (!storeId) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&family=Outfit:wght@400;500;600&display=swap');

        .sp-root {
          font-family: 'Outfit', sans-serif;
          width: 100%;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          padding: 64px 40px 80px;
          border-top: 1.5px solid #e5e5e0;
          border-bottom: 1.5px solid #e5e5e0;
          position: relative;
        }
        .sp-root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e5e0, transparent);
        }
        @media (max-width: 768px) {
          .sp-root {
            padding: 48px 20px 64px;
          }
        }
        @media (max-width: 480px) {
          .sp-root {
            padding: 40px 16px 56px;
          }
        }

        .sp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .sp-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: 700;
          color: #1a1814;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .sp-title span {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }

        .sp-sub {
          font-size: 14px;
          color: #9e9994;
          margin-top: 6px;
          font-weight: 500;
        }

        .sp-count {
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%);
          border: 1.5px solid #93c5fd;
          border-radius: 100px;
          padding: 6px 16px;
          color: #2563eb;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
        }

        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, max-content));
          justify-content: center;
          gap: 32px 24px;
          margin-top: 12px;
        }
        @media (max-width: 768px) {
          .sp-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, max-content));
            gap: 24px 16px;
          }
        }
        @media (max-width: 480px) {
          .sp-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .sp-loading {
          text-align: center;
          padding: 60px 20px;
          color: #9e9994;
          font-size: 15px;
          font-weight: 500;
        }
        .sp-loading::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #e5e5e0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 10px;
          vertical-align: middle;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sp-empty {
          text-align: center;
          padding: 80px 20px;
          color: #9e9994;
          font-size: 16px;
          font-weight: 500;
        }
        .sp-empty::before {
          content: '';
          display: block;
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sp-error {
          text-align: center;
          padding: 40px;
          color: #dc2626;
          font-size: 15px;
          font-weight: 500;
          background: #fee2e2;
          border: 1.5px solid #fca5a5;
          border-radius: 14px;
          margin-top: 12px;
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-header">
          <div>
            <h2 className="sp-title">
              Products from <span>{storeName}</span>
            </h2>
            <p className="sp-sub">Browse all available items</p>
          </div>
          {!loading && products.length > 0 && (
            <span className="sp-count">
              {products.length} Product{products.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="sp-loading">Loading products…</div>
        ) : error ? (
          <div className="sp-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="sp-empty">No products available in this store.</div>
        ) : (
          <div className="sp-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                user={user}
                apiBase={process.env.NEXT_PUBLIC_API_URL}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}