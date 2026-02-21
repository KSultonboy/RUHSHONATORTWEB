"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/providers/CartProvider";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();

  const links = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/catalog", label: "Katalog" },
    { href: "/checkout", label: "Checkout" },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-logo">RT</span>
          <span>
            <strong>Ruhshona Tort</strong>
            <small>Onlayn buyurtma</small>
          </span>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(pathname, link.href) ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/checkout" className="cart-link">
          Savat
          <span>{Math.round(count)}</span>
        </Link>
      </div>
    </header>
  );
}
