"use client";

import { money, parseQuantity, quantity } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";

type Props = {
  editable?: boolean;
};

export default function CartSummary({ editable = true }: Props) {
  const { items, total, removeItem, updateQuantity, clear } = useCart();

  return (
    <section className="cart-summary">
      <div className="cart-summary-head">
        <h2>Savat</h2>
        {editable ? (
          <button type="button" className="ghost" onClick={clear}>
            Tozalash
          </button>
        ) : null}
      </div>

      {items.length === 0 ? <div className="message">Savat bo'sh.</div> : null}

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.productId} className="cart-row">
            <div>
              <strong>{item.name}</strong>
              <p>{money(item.unitPrice)} x {quantity(item.quantity)}</p>
            </div>

            <div className="cart-actions">
              {editable ? (
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.productId, parseQuantity(event.target.value))}
                />
              ) : (
                <span className="badge">{quantity(item.quantity)}</span>
              )}

              {editable ? (
                <button type="button" className="ghost" onClick={() => removeItem(item.productId)}>
                  O'chirish
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total-line">
        <span>Jami</span>
        <strong>{money(total)}</strong>
      </div>
    </section>
  );
}
