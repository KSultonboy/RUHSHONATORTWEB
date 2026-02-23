"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { PublicProduct } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useCart } from "@/providers/CartProvider";
import Reveal from "@/components/ui/Reveal";

interface RelatedProductsProps {
    categoryId: string;
    excludeId: string;
}

export default function RelatedProducts({ categoryId, excludeId }: RelatedProductsProps) {
    const { addProduct } = useCart();
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRelated() {
            try {
                const all = await getProducts({ categoryId });
                const filtered = all.filter(p => p.id !== excludeId).slice(0, 4);
                setProducts(filtered);
            } catch (e) {
                console.error("Related products fetch error:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchRelated();
    }, [categoryId, excludeId]);

    if (loading || (!loading && products.length === 0)) return null;

    return (
        <section className="section" style={{ marginTop: '80px', borderTop: '1px solid var(--cream-dark)', paddingTop: '80px' }}>
            <Reveal className="section-head">
                <div style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '16px' }}>
                    <h2 style={{ fontSize: '28px' }}>Sizga yoqishi mumkin</h2>
                    <p style={{ color: 'var(--muted)' }}>Xuddi shu turdagi boshqa shirinliklarimiz</p>
                </div>
            </Reveal>

            <div className="products-grid" style={{ marginTop: '40px' }}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        index={index}
                        product={product}
                        onAdd={addProduct}
                    />
                ))}
            </div>
        </section>
    );
}
