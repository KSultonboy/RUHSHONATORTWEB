"use client";

import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import { toAbsoluteImage } from "@/lib/image";
import type { PublicProduct } from "@/lib/types";

type Props = {
  index: number;
  product: PublicProduct;
  onAdd: (product: PublicProduct) => void;
};

export default function ProductCard({ index, product, onAdd }: Props) {
  const image = toAbsoluteImage(product.images?.[0]);

  return (
    <article className="product-card card-enter" style={{ animationDelay: `${Math.min(index * 55, 550)}ms`, border: 'none', boxShadow: 'var(--shadow-premium)', transition: 'var(--transition-smooth)', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/catalog/${product.id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
        <div className="product-image-wrap" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
          <Image
            src={image || "https://dummyimage.com/600x600/f8f3ed/800020&text=Ruxshona"}
            alt={product.name}
            width={600}
            height={600}
            className="product-image"
          />
        </div>

        <div className="product-body" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{product.name}</h3>
          <p style={{ color: 'var(--accent-strong)', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>{product.category?.name || "Kategoriyasiz"}</p>
          <div className="product-price" style={{ color: 'var(--primary)', fontSize: '22px' }}>{money(product.currentPrice)}</div>
        </div>
      </Link>

      <button onClick={() => onAdd(product)} style={{ margin: '0 20px 20px', padding: '12px', borderRadius: '12px' }}>
        Savatga qo'shish
      </button>
    </article>
  );
}
