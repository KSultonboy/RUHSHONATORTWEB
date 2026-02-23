"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/store/CartSummary";
import Reveal from "@/components/ui/Reveal";
import { createPublicOrder } from "@/lib/api";
import { parseQuantity } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { customer, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [usePoints, setUsePoints] = useState(false);

  const disabled = useMemo(() => submitting || items.length === 0, [items.length, submitting]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Savat bo'sh.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const customerName = String(formData.get("customerName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const note = String(formData.get("note") || "").trim();

    if (!customerName || !phone) {
      setError("Ism va telefon majburiy.");
      return;
    }

    setSubmitting(true);

    try {
      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const pointsToUse = usePoints && customer ? Math.min(customer.points, subtotal) : 0;

      const result = await createPublicOrder({
        customerName,
        phone,
        address,
        note,
        customerId: customer?.id,
        couponCode: appliedCoupon?.code,
        pointsToUse: pointsToUse || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: parseQuantity(item.quantity),
        })),
      });

      clear();
      router.push(`/success?trackCode=${encodeURIComponent(result.trackCode || result.id)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Buyurtma yuborilmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container section checkout-layout">
      <Reveal className="panel" style={{ padding: '32px', boxShadow: 'var(--shadow-premium)' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Buyurtmani rasmiylashtirish</h1>
        <p style={{ marginBottom: '24px' }}>Ma'lumotlarni to'ldiring, biz siz bilan tez orada bog'lanamiz.</p>

        {customer && customer.points > 0 && (
          <div className="loyalty-card" style={{ background: 'var(--cream-light)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--accent-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>Sizning ballaringiz: <span style={{ color: 'var(--accent)' }}>{customer.points} ball</span></h4>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--muted)' }}>1 ball = 1 so'm. Xarid uchun ballardan foydalanasizmi?</p>
              </div>
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        <div className="coupon-card" style={{ background: 'var(--cream-light)', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid var(--cream-dark)' }}>
          <h4 style={{ margin: '0 0 12px' }}>Kuponingiz bormi?</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="KUPON KODI"
              style={{ padding: '12px', flex: 1 }}
            />
            <button
              type="button"
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
              onClick={async () => {
                if (!token || !couponCode) return;
                try {
                  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
                  const res = await (await import('@/lib/api')).validateCoupon(token, couponCode, total);
                  setAppliedCoupon(res);
                  setError("");
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              Qo'llash
            </button>
          </div>
          {appliedCoupon && (
            <div style={{ marginTop: '12px', color: 'var(--success)', fontWeight: '600' }}>
              ✓ Kupon qo'llandi: {appliedCoupon.discount}{appliedCoupon.isPercent ? '%' : " so'm"} chegirma
            </div>
          )}
        </div>

        <form className="checkout-form" onSubmit={onSubmit} style={{ gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Ismingiz</span>
              <input name="customerName" defaultValue={customer?.name || ""} placeholder="Masalan: Dilnoza" required style={{ padding: '14px' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Telefon raqamingiz</span>
              <input name="phone" defaultValue={customer?.phone || ""} placeholder="+998 90 000 00 00" required style={{ padding: '14px' }} />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Yetkazib berish manzili</span>
            <input name="address" defaultValue={customer?.address || ""} placeholder="Masalan: Chilonzor tumani, 5-kvartal..." style={{ padding: '14px' }} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Qo'shimcha izoh</span>
            <textarea name="note" rows={4} placeholder="Buyurtma bo'yicha maxsus istaklaringiz..." style={{ padding: '14px' }} />
          </label>

          {error ? <div className="message error" style={{ padding: '14px', borderRadius: '12px' }}>{error}</div> : null}

          <button className="btn-primary" disabled={disabled} style={{ padding: '16px', fontSize: '18px' }}>
            {submitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
          </button>
        </form>
      </Reveal>

      <Reveal delayMs={120}>
        <CartSummary />
      </Reveal>
    </main>
  );
}
