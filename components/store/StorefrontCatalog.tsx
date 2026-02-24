"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, PublicProduct } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useCart } from "@/providers/CartProvider";

type Props = {
  compact?: boolean;
};

import { Search, Filter, SlidersHorizontal } from "lucide-react";

export default function StorefrontCatalog({ compact = false }: Props) {
  const { addProduct } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [nextCategories, nextProducts] = await Promise.all([
        getCategories(),
        getProducts({
          categoryId: categoryId || undefined,
          q: q.trim() || undefined,
          minPrice: minPrice ? parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        }),
      ]);
      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAll();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [categoryId, q, minPrice, maxPrice]);

  const visibleProducts = useMemo(() => (compact ? products.slice(0, 8) : products), [compact, products]);

  return (
    <section className="catalog-block premium">
      <div className="catalog-toolbar-premium">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Shirinlik qidirish..."
          />
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Barcha kategoriyalar</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="price-inputs">
            <SlidersHorizontal size={16} className="price-icon" />
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
            />
            <span className="price-dash">—</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {!loading ? (
        <div className="catalog-status">
          <div className="catalog-count-pill">{visibleProducts.length} mahsulot</div>
          {q && <div className="search-query-pill">Qidiruv: "{q}"</div>}
        </div>
      ) : null}

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: compact ? 4 : 8 }).map((_, index) => (
            <div key={index} className="product-skeleton" />
          ))}
        </div>
      ) : null}
      {error ? <div className="message error">Xatolik: {error}</div> : null}

      {!loading && !error && visibleProducts.length === 0 ? (
        <div className="message">Mahsulot topilmadi.</div>
      ) : null}

      <div className="products-grid">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} index={index} product={product} onAdd={addProduct} />
        ))}
      </div>
    </section>
  );
}
