"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ShoppingBag, User, LogOut, Menu } from "lucide-react";

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
          <div className="brand-logo">
            <span style={{ fontSize: '18px' }}>R</span>
          </div>
          <div className="brand-text">
            <strong>Ruhshona Tort</strong>
            <small>Premium Patisserie</small>
          </div>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(pathname, link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {customer ? (
            <div className="user-menu">
              <span className="user-name">{customer.name}</span>
              <button
                onClick={logout}
                className="btn-icon"
                title="Chiqish"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-ghost login-btn">
              <User size={18} />
              <span>Kirish</span>
            </Link>
          )}

          <Link href="/checkout" className="cart-link-modern">
            <ShoppingBag size={20} />
            {count > 0 && <span className="cart-badge">{Math.round(count)}</span>}
          </Link>

          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

