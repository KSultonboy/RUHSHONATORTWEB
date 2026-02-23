"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { postCustomRequest } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

export default function CustomOrderPage() {
    const router = useRouter();
    const { customer, token } = useAuth();
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!customer || !token) {
            router.push("/login?callback=/custom-order");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await postCustomRequest(token, {
                description,
                desiredDate: date,
                referenceImages: [], // For now empty, can be enhanced with upload later
            });
            setSuccess(true);
            setDescription("");
            setDate("");
        } catch (err: any) {
            setError(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <main className="container section">
                <Reveal className="panel" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
                    <h1 style={{ marginBottom: '16px' }}>So'rovingiz qabul qilindi!</h1>
                    <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
                        Bizning mutaxassislarimiz so'rovingizni ko'rib chiqib, tez orada siz bilan bog'lanishadi
                        va narx taklifini yuborishadi.
                    </p>
                    <button className="btn-primary" onClick={() => router.push("/orders")}>
                        Mening buyurtmalarim
                    </button>
                </Reveal>
            </main>
        );
    }

    return (
        <main className="container section">
            <Reveal className="section-head stacked">
                <h1>Maxsus tort buyurtma qilish</h1>
                <p>Siz orzu qilgan tortni biz bilan birga yarating. Barcha detallarni quyida yozib qoldiring.</p>
            </Reveal>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Reveal className="panel">
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                        <div className="form-group">
                            <label>Tort haqida batafsil ma'lumot</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Masalan: 3 qavatli, shokoladli, ustida 'Tug'ilgan kuning bilan' yozuvi va qizil gullar bilan bezatilgan bo'lsin..."
                                style={{ minHeight: '150px', padding: '16px', borderRadius: '12px', border: '1px solid var(--cream-dark)', width: '100%', font: 'inherit' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Kutilayotgan sana</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--cream-dark)', width: '100%', font: 'inherit' }}
                            />
                        </div>

                        {error && <div className="message error">{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ padding: '18px', fontSize: '18px' }}
                        >
                            {loading ? "Yuborilmoqda..." : "So'rov yuborish"}
                        </button>
                    </form>
                </Reveal>
            </div>
        </main>
    );
}
