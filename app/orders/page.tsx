"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { getCustomerOrders } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { money } from "@/lib/format";

export default function OrdersPage() {
    const { customer, token, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!token) {
            setLoading(false);
            return;
        }

        async function fetchOrders() {
            try {
                const data = await getCustomerOrders(token!);
                setOrders(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Buyurtmalarni yuklashda xatolik");
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [token, authLoading]);

    if (authLoading || loading) {
        return <main className="container section"><p>Yuklanmoqda...</p></main>;
    }

    if (!token) {
        return (
            <main className="container section" style={{ textAlign: 'center', marginTop: '100px' }}>
                <Reveal>
                    <h1>Buyurtmalarni ko'rish uchun kiring</h1>
                    <p style={{ marginBottom: '24px' }}>Sizning buyurtmalaringiz tarixi bu yerda saqlanadi.</p>
                    <Link href="/login" className="btn-primary">Kirish</Link>
                </Reveal>
            </main>
        );
    }

    return (
        <main className="container section">
            <Reveal className="section-head" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1>Mening buyurtmalarim</h1>
                    <p style={{ margin: 0 }}>Barcha buyurtmalaringiz tarixi va holati.</p>
                </div>
                {customer && (
                    <div style={{ background: 'var(--cream-light)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--accent-light)', textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>JAMG'ARILGAN BALLAR</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent)' }}>{customer.points} <span style={{ fontSize: '14px' }}>ball</span></div>
                    </div>
                )}
            </Reveal>

            {error ? <div className="message error">{error}</div> : null}

            {orders.length === 0 ? (
                <Reveal className="panel" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <h3>Hozirda buyurtmalar yo'q</h3>
                    <p style={{ marginBottom: '24px' }}>Katalogimizdan eng shirin tortlarni tanlang.</p>
                    <Link href="/catalog" className="btn-primary">Katalogni ko'rish</Link>
                </Reveal>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map((order, index) => (
                        <Reveal key={order.id} delayMs={index * 50} className="panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '18px' }}>#{order.trackCode || order.id.slice(-6).toUpperCase()}</span>
                                    <span className={`badge`} style={{
                                        backgroundColor: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'CANCELED' ? '#fee2e2' : '#fef9c3',
                                        color: order.status === 'DELIVERED' ? '#166534' : order.status === 'CANCELED' ? '#991b1b' : '#854d0e',
                                        fontSize: '12px',
                                        padding: '4px 12px',
                                        borderRadius: '999px',
                                        border: 'none'
                                    }}>
                                        {order.status === 'NEW' ? 'Yangi' :
                                            order.status === 'IN_DELIVERY' ? 'Yetkazilmoqda' :
                                                order.status === 'DELIVERED' ? 'Yetkazildi' : 'Bekor qilindi'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
                                    Sana: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                                    {money(order.total)}
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                                    {order.items.length} ta mahsulot
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}
        </main>
    );
}
