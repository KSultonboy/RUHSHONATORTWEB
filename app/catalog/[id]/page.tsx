"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getProducts } from "@/lib/api";
import { PublicProduct } from "@/lib/types";
import { money } from "@/lib/format";
import { toAbsoluteImage } from "@/lib/image";
import { useCart } from "@/providers/CartProvider";
import Reveal from "@/components/ui/Reveal";
import Reviews from "@/components/store/Reviews";
import ProductGallery from "@/components/store/ProductGallery";
import RelatedProducts from "@/components/store/RelatedProducts";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addProduct } = useCart();
    const [product, setProduct] = useState<PublicProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const id = params.id as string;
                const products = await getProducts();
                const found = products.find(p => p.id === id);
                if (found) {
                    setProduct(found);
                } else {
                    router.push("/catalog");
                }
            } catch (e) {
                console.error("Product fetch error:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [params.id]);

    if (loading) return <main className="container section"><p>Yuklanmoqda...</p></main>;
    if (!product) return null;

    return (
        <main className="container section">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                <ProductGallery images={product.images} videos={product.videos} />

                <div style={{ padding: '20px 0' }}>
                    <Reveal>
                        <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>{product.name}</h1>
                        <p style={{ color: 'var(--accent-strong)', fontWeight: '600', fontSize: '18px', marginBottom: '32px' }}>
                            {product.category?.name}
                        </p>

                        <div style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: '800', marginBottom: '40px' }}>
                            {money(product.currentPrice)}
                        </div>

                        <p style={{ lineHeight: '1.8', color: 'var(--cocoa-light)', fontSize: '16px', marginBottom: '40px' }}>
                            Ruxshona tortlarining betakror ta'mi va nafis dizayni sizga yoqadi deb ishonamiz.
                            Biz har bir tortni maxsus mehr bilan tayyorlaymiz.
                        </p>

                        <button
                            className="btn-primary"
                            onClick={() => addProduct(product)}
                            style={{ padding: '20px 40px', fontSize: '20px', borderRadius: '16px', width: '100%', maxWidth: '300px' }}
                        >
                            Savatga qo'shish
                        </button>
                    </Reveal>
                </div>
            </div>

            <Reviews productId={product.id} />

            <RelatedProducts
                categoryId={product.categoryId}
                excludeId={product.id}
            />
        </main>
    );
}
