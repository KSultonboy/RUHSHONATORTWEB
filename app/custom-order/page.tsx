"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { postCustomRequest } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import { Calendar, ChefHat, Edit3, Users, Info, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CustomOrderPage() {
    const router = useRouter();
    const { customer, token } = useAuth();

    // Detailed form state
    const [description, setDescription] = useState("");
    const [cakeType, setCakeType] = useState("");
    const [servings, setServings] = useState("");
    const [flavors, setFlavors] = useState("");
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
            // Bundle structured data into description
            const finalDescription = `
[TUR]: ${cakeType || "Belgilanmagan"}
[ODAMLAR]: ${servings || "Belgilanmagan"}
[TA'M]: ${flavors || "Belgilanmagan"}
---
[TAFSILOT]: ${description}
            `.trim();

            await postCustomRequest(token, {
                description: finalDescription,
                desiredDate: date,
                referenceImages: [],
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <main className="container section">
                <Reveal className="panel success-panel" style={{ textAlign: 'center', padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}>
                    <div className="success-icon-wrapper" style={{ display: 'inline-flex', padding: '24px', background: 'var(--accent-soft)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '32px' }}>
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '20px' }}>So'rovingiz qabul qilindi!</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                        Rahmat! Bizning mutaxassislarimiz so'rovingizni ko'rib chiqib, 24 soat ichida siz bilan bog'lanishadi
                        va eng yaxshi narx taklifini yuborishadi.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => router.push("/orders")}>
                            Buyurtmalarimga o'tish
                        </button>
                        <button className="btn-ghost" onClick={() => router.push("/")}>
                            Asosiy sahifa
                        </button>
                    </div>
                </Reveal>
            </main>
        );
    }

    return (
        <main className="container section">
            <div style={{ marginBottom: '40px' }}>
                <Link href="/" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
                    <ArrowLeft size={18} />
                    <span>Orqaga qaytish</span>
                </Link>
            </div>

            <Reveal className="section-head">
                <div style={{ maxWidth: '600px' }}>
                    <span className="eyebrow">Maxsus buyurtma</span>
                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontFamily: 'var(--font-display)', marginTop: '12px' }}>
                        O'z orzuingizdagi <span style={{ color: 'var(--primary)' }}>tortni yarating</span>
                    </h1>
                    <p style={{ marginTop: '20px', color: 'var(--muted)', fontSize: '18px' }}>
                        Har bir detalni siz istagandek bajaramiz. Bizga g'oyangizni ayting, biz esa uni amalga oshiramiz.
                    </p>
                </div>
            </Reveal>

            <div className="order-form-grid">
                <Reveal className="panel custom-order-panel">
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>

                        <div className="form-section">
                            <h3 className="section-title">
                                <ChefHat className="icon-gold" size={24} />
                                1. Asosiy ma'lumotlar
                            </h3>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Tort turi</label>
                                    <select
                                        value={cakeType}
                                        onChange={(e) => setCakeType(e.target.value)}
                                        className="premium-select"
                                        required
                                    >
                                        <option value="">Tanlang...</option>
                                        <option value="To'y torti">To'y torti</option>
                                        <option value="Tug'ilgan kun">Tug'ilgan kun torti</option>
                                        <option value="Bolalar uchun">Bolalar uchun</option>
                                        <option value="Korporativ">Korporativ</option>
                                        <option value="Boshqa">Boshqa</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Mehmonlar soni (kishi)</label>
                                    <div className="input-with-icon">
                                        <Users size={18} className="input-icon" />
                                        <input
                                            type="number"
                                            placeholder="Masalan: 20"
                                            value={servings}
                                            onChange={(e) => setServings(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">
                                <Edit3 className="icon-gold" size={24} />
                                2. Dizayn va Ta'm
                            </h3>
                            <div className="form-group">
                                <label>Yoqtirgan ingrediyentlar / Ta'mlar</label>
                                <input
                                    type="text"
                                    placeholder="Masalan: Shokolad, mevalar, karamel..."
                                    value={flavors}
                                    onChange={(e) => setFlavors(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tafsilotlar va istaklar</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tortning ko'rinishi, ranglari va yozuvlar bo'yicha batafsil to'xtaling..."
                                    style={{ minHeight: '140px' }}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">
                                <Calendar className="icon-gold" size={24} />
                                3. Sana
                            </h3>
                            <div className="form-group">
                                <label>Qachonga tayyor bo'lishi kerak?</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <div className="message error">{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary custom-order-submit"
                            disabled={loading}
                        >
                            {loading ? "Yuborilmoqda..." : "So'rovni rasmiylashtirish"}
                        </button>
                    </form>
                </Reveal>

                <div className="order-sidebar">
                    <Reveal className="panel info-sidebar">
                        <div className="sidebar-header">
                            <Info size={24} />
                            <h4>Ma'lumot uchun</h4>
                        </div>
                        <p className="sidebar-text">
                            Maxsus buyurtmalar kamida <strong>3-5 kun</strong> oldin berilishi tavsiya etiladi.
                        </p>
                        <hr className="sidebar-divider" />
                        <ul className="sidebar-list">
                            <li>✅ To'liq be'shikast yetkazish</li>
                            <li>✅ Faqat tabiiy mahsulotlar</li>
                            <li>✅ Eksklyuziv dizaynlar</li>
                        </ul>
                    </Reveal>
                </div>
            </div>
        </main>
    );
}
