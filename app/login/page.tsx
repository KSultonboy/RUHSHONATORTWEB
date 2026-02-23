"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { loginCustomer } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await loginCustomer({ phone, password });
            login(result.token, result.customer);
            router.push("/");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container section" style={{ maxWidth: '480px', marginTop: '60px' }}>
            <Reveal className="panel" style={{ padding: '40px', boxShadow: 'var(--shadow-premium)' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Xush kelibsiz</h1>
                <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--muted)' }}>
                    Akkauntingizga kiring va buyurtmalaringizni kuzatib boring.
                </p>

                <form onSubmit={onSubmit} style={{ display: 'grid', gap: '20px' }}>
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
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Parol</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '14px', borderRadius: '12px' }}
                        />
                    </label>

                    {error ? <div className="message error" style={{ padding: '12px', borderRadius: '10px' }}>{error}</div> : null}

                    <button className="btn-primary" disabled={loading} style={{ padding: '16px', fontSize: '18px', marginTop: '12px' }}>
                        {loading ? "Kirilmoqda..." : "Kirish"}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
                    Akkauntingiz yo'qmi? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Ro'yxatdan o'ting</Link>
                </div>
            </Reveal>
        </main>
    );
}
