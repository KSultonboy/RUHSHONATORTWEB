"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/store/CartSummary";
import Reveal from "@/components/ui/Reveal";
import { createPublicOrder } from "@/lib/api";
import { parseQuantity } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const result = await createPublicOrder({
        customerName,
        phone,
        address,
        note,
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
      <Reveal className="panel">
        <h1>Checkout</h1>
        <p>Ma'lumotlarni to'ldiring, buyurtma admin panelga tushadi.</p>

        <form className="checkout-form" onSubmit={onSubmit}>
          <label>
            Mijoz ismi
            <input name="customerName" placeholder="Masalan: Dilnoza" required />
          </label>

          <label>
            Telefon
            <input name="phone" placeholder="+998 90 000 00 00" required />
          </label>

          <label>
            Manzil
            <input name="address" placeholder="Masalan: Chilonzor" />
          </label>

          <label>
            Izoh
            <textarea name="note" rows={4} placeholder="Buyurtma bo'yicha qo'shimcha izoh" />
          </label>

          {error ? <div className="message error">{error}</div> : null}

          <button className="btn-primary" disabled={disabled}>
            {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
          </button>
        </form>
      </Reveal>

      <Reveal delayMs={120}>
        <CartSummary />
      </Reveal>
    </main>
  );
}
