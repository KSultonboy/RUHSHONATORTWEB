"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, PublicProduct } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useCart } from "@/providers/CartProvider";

type Props = {
  compact?: boolean;
};

export default function StorefrontCatalog({ compact = false }: Props) {
  const { addProduct } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [nextCategories, nextProducts] = await Promise.all([
        getCategories(),
        getProducts({ categoryId: categoryId || undefined, q: q.trim() || undefined }),
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
  }, [categoryId, q]);

  const visibleProducts = useMemo(() => (compact ? products.slice(0, 8) : products), [compact, products]);

  return (
    <section className="catalog-block">
      <div className="catalog-toolbar">
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Barcha kategoriyalar</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Mahsulot qidirish"
        />
      </div>

      {!loading ? <div className="catalog-count">{visibleProducts.length} ta mahsulot</div> : null}

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
