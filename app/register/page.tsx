"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { loginCustomer, registerCustomer } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerCustomer({ name, phone, password, address, birthday });
            const authResult = await loginCustomer({ phone, password });
            login(authResult.token, authResult.customer);
            router.push("/");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container section" style={{ maxWidth: '480px', marginTop: '40px' }}>
            <Reveal className="panel" style={{ padding: '40px', boxShadow: 'var(--shadow-premium)' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Ro'yxatdan o'tish</h1>
                <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--muted)' }}>
                    Yangi akkaunt yarating va qulayliklardan foydalaning.
                </p>

                <form onSubmit={onSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <label style={{ display: 'grid', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>To'liq ismingiz</span>
                        <input
                            type="text"
                            placeholder="Masalan: Dilnoza Ismoilova"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ padding: '14px', borderRadius: '12px' }}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Telefon raqam</span>
                        <input
                            type="text"
                            placeholder="+998 90 000 00 00"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            style={{ padding: '14px', borderRadius: '12px' }}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Parol (kamida 6 ta belgi)</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            style={{ padding: '14px', borderRadius: '12px' }}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Manzil (ixtiyoriy)</span>
                        <input
                            type="text"
                            placeholder="Masalan: Toshkent sh., Chilonzor"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ padding: '14px', borderRadius: '12px' }}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Tug'ilgan kuningiz (ixtiyoriy)</span>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--cream-dark)', outline: 'none' }}
                        />
                    </label>

                    {error ? <div className="message error" style={{ padding: '12px', borderRadius: '10px' }}>{error}</div> : null}

                    <button className="btn-primary" disabled={loading} style={{ padding: '16px', fontSize: '18px', marginTop: '12px' }}>
                        {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
                    Akkauntingiz bormi? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Tizimga kiring</Link>
                </div>
            </Reveal>
        </main>
    );
}
