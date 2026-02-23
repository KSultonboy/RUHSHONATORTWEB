"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { customer, logout } = useAuth();

  const links = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/catalog", label: "Katalog" },
    { href: "/blog", label: "Blog" },
    { href: "/custom-order", label: "Maxsus buyurtma" },
  ];

  if (customer) {
    links.push({ href: "/orders", label: "Mening buyurtmalarim" });
  }

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

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {customer ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{customer.name}</span>
              <button
                onClick={logout}
                className="btn-ghost"
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
              >
                Chiqish
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '10px' }}>
              Kirish
            </Link>
          )}

          <Link href="/checkout" className="cart-link">
            Savat
            <span>{Math.round(count)}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

