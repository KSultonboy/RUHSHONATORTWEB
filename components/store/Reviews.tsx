"use client";

import { useEffect, useState } from "react";
import { getProductReviews, postReview } from "@/lib/api";
import { ProductReview } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import Reveal from "@/components/ui/Reveal";

interface ReviewsProps {
    productId: string;
}

export default function Reviews({ productId }: ReviewsProps) {
    const { token, customer } = useAuth();
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReviews() {
            try {
                const data = await getProductReviews(productId);
                setReviews(data);
            } catch (e) {
                console.error("Reviews fetch error:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [productId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token) return;

        setSubmitting(true);
        setError("");

        try {
            const newReview = await postReview(token, { rating, comment, productId });
            setReviews([newReview, ...reviews]);
            setComment("");
            setRating(5);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Sharh qoldirishda xatolik");
        } finally {
            setSubmitting(false);
        }
    }

    const renderStars = (count: number, interactive = false) => {
        return (
            <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <span
                        key={s}
                        onClick={interactive ? () => setRating(s) : undefined}
                        style={{
                            cursor: interactive ? 'pointer' : 'default',
                            fontSize: '20px',
                            color: s <= (interactive ? rating : count) ? '#fbbf24' : '#e5e7eb',
                            transition: 'color 0.2s'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div style={{ marginTop: '60px' }}>
            <Reveal>
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Mijozlarimiz sharhlari</h2>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '40px', alignItems: 'start' }}>
                <div>
                    {loading ? (
                        <p>Yuklanmoqda...</p>
                    ) : reviews.length === 0 ? (
                        <div className="panel" style={{ padding: '40px', textAlign: 'center', background: 'var(--cream-light)' }}>
                            <p style={{ color: 'var(--muted)', margin: 0 }}>Hali sharhlar yo'q. Birinchi bo'ling!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {reviews.map((review) => (
                                <Reveal key={review.id} className="panel" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: '700' }}>{review.customer.name}</span>
                                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {renderStars(review.rating)}
                                    {review.comment && (
                                        <p style={{ marginTop: '12px', fontSize: '15px', lineHeight: '1.6', color: 'var(--cocoa-light)' }}>
                                            {review.comment}
                                        </p>
                                    )}
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sticky" style={{ top: '100px' }}>
                    {token ? (
                        <Reveal className="panel" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Sharh qoldiring</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Reyting</label>
                                    {renderStars(rating, true)}
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Sizning fikringiz</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tort sizga yoqdimi?..."
                                        rows={4}
                                        style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                {error && <div className="message error" style={{ fontSize: '13px', padding: '10px' }}>{error}</div>}
                                <button className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
                                    {submitting ? "Yuborilmoqda..." : "Yuborish"}
                                </button>
                            </form>
                        </Reveal>
                    ) : (
                        <Reveal className="panel" style={{ padding: '24px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Sharh qoldirish uchun tizimga kiring.</p>
                            <a href="/login" className="btn-primary" style={{ display: 'inline-block', width: '100%' }}>Kirish</a>
                        </Reveal>
                    )}
                </div>
            </div>
        </div>
    );
}
