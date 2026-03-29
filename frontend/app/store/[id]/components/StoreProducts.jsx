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
          background: #ffffff;
          padding: 56px 40px 64px;
          border-top: 1px solid #e8e3db;
          border-bottom: 1px solid #e8e3db;
        }
        @media (max-width: 768px) {
          .sp-root {
            padding: 44px 20px 52px;
          }
        }
        @media (max-width: 480px) {
          .sp-root {
            padding: 36px 16px 44px;
          }
        }

        .sp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .sp-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(20px, 3vw, 32px);
          font-weight: 700;
          color: #1a1814;
          margin: 0;
        }

        .sp-title span {
          color: #d97706;
        }

        .sp-sub {
          font-size: 13px;
          color: #9e9994;
          margin-top: 4px;
        }

        .sp-count {
          font-size: 12px;
          font-weight: 600;
          background: #f0ede6;
          border: 1px solid #e8e3db;
          border-radius: 100px;
          padding: 4px 14px;
          color: #5c5852;
          white-space: nowrap;
        }

        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, max-content));
          justify-content: center;
          gap: 32px 24px;
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
          padding: 40px;
          color: #9e9994;
          font-size: 14px;
        }

        .sp-empty {
          text-align: center;
          padding: 60px 20px;
          color: #9e9994;
          font-size: 15px;
        }

        .sp-error {
          text-align: center;
          padding: 40px;
          color: #dc2626;
          font-size: 14px;
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