"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { parseQuantity } from "@/lib/format";
import type { CartItem, PublicProduct } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  addProduct: (product: PublicProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number | string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "ruxshona_storefront_cart";

function calculateTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + Math.round(item.unitPrice * item.quantity), 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore parse/storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const total = useMemo(() => calculateTotal(items), [items]);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  function addProduct(product: PublicProduct) {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.productId === product.id);
      if (index === -1) {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            image: product.images?.[0],
            unitPrice: product.currentPrice,
            quantity: 1,
          },
        ];
      }

      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + 1,
      };
      return next;
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number | string) {
    const nextQty = parseQuantity(quantity);
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: nextQty } : item)),
    );
  }

  function clear() {
    setItems([]);
  }

  const value: CartContextValue = {
    items,
    total,
    count,
    addProduct,
    removeItem,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
