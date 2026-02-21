"use client";

import Image from "next/image";
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
    <article className="product-card card-enter" style={{ animationDelay: `${Math.min(index * 55, 550)}ms` }}>
      <div className="product-image-wrap">
        <Image
          src={image || "https://dummyimage.com/600x600/f8f3ed/b6a59b&text=Ruhshona"}
          alt={product.name}
          width={600}
          height={600}
          className="product-image"
        />
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.category?.name || "Kategoriyasiz"}</p>
        <div className="product-price">{money(product.currentPrice)}</div>
      </div>

      <button onClick={() => onAdd(product)}>Savatga qo'shish</button>
    </article>
  );
}
