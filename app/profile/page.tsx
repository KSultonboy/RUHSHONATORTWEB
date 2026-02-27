"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { getCustomerMessages, getCustomerMe, updateCustomerMe } from "@/lib/api";
import type { CustomerMessage } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

function statusLabel(status: CustomerMessage["status"]) {
  if (status === "IN_DELIVERY") return "Qabul qilindi";
  if (status === "DELIVERED") return "Yetkazildi";
  if (status === "CANCELED") return "Bekor qilindi";
  return "Yangi";
}

export default function ProfilePage() {
  const { customer, token, loading: authLoading, setCustomer, refreshCustomer } = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<CustomerMessage[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [me, profileMessages] = await Promise.all([getCustomerMe(token), getCustomerMessages(token)]);
        setCustomer(me);
        setName(me.name || "");
        setAddress(me.address || "");
        setBirthday(me.birthday || "");
        setMessages(profileMessages);
        localStorage.setItem(`ruxshona_profile_messages_seen_${me.id}`, String(Date.now()));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Profil ma'lumotlari yuklanmadi");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [authLoading, setCustomer, token]);

  const stats = useMemo(() => {
    const accepted = messages.filter((item) => item.status === "IN_DELIVERY").length;
    const delivered = messages.filter((item) => item.status === "DELIVERED").length;
    return { accepted, delivered };
  }, [messages]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setError("");
    setSaving(true);
    try {
      const updated = await updateCustomerMe(token, {
        name: name.trim(),
        address: address.trim(),
        birthday: birthday || undefined,
      });
      setCustomer(updated);
      await refreshCustomer();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profilni saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return <main className="container section"><p>Yuklanmoqda...</p></main>;
  }

  if (!token || !customer) {
    return (
      <main className="container section" style={{ textAlign: "center", marginTop: "100px" }}>
        <Reveal>
          <h1>Profilni ko'rish uchun tizimga kiring</h1>
          <p style={{ marginBottom: "24px" }}>Buyurtma holatlari va shaxsiy ma'lumotlar shu bo'limda.</p>
          <Link href="/login" className="btn-primary">Kirish</Link>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="container section profile-layout">
      <Reveal className="panel profile-card">
        <h1>Shaxsiy profil</h1>
        <p>Ma'lumotlaringizni yangilang, buyurtmalar bo'yicha xabarlarni kuzating.</p>

        <form onSubmit={onSubmit} className="profile-form">
          <label>
            <span>Ism</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span>Telefon</span>
            <input value={customer.phone} disabled />
          </label>
          <label>
            <span>Manzil</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Toshkent..." />
          </label>
          <label>
            <span>Tug'ilgan kun</span>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </label>

          {error ? <div className="message error">{error}</div> : null}

          <div className="profile-actions">
            <div className="profile-points">Ballar: <strong>{customer.points}</strong></div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </Reveal>

      <Reveal className="panel profile-card" delayMs={100}>
        <div className="profile-head">
          <div>
            <h2>Buyurtma xabarlari</h2>
            <p>ERP’da holat o'zgarganida shu yerda ko'rinadi.</p>
          </div>
          <div className="profile-kpis">
            <span>Qabul: {stats.accepted}</span>
            <span>Yetkazilgan: {stats.delivered}</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="message">Hozircha xabarlar yo'q.</div>
        ) : (
          <div className="profile-messages">
            {messages.map((message) => (
              <article key={message.id} className="profile-message-row">
                <div>
                  <div className="profile-message-title">{message.title}</div>
                  <div className="profile-message-body">{message.body}</div>
                </div>
                <div className="profile-message-meta">
                  <span className={`profile-status status-${message.status.toLowerCase()}`}>{statusLabel(message.status)}</span>
                  <time>{new Date(message.createdAt).toLocaleString()}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </Reveal>
    </main>
  );
}
