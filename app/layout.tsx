import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/CartProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Ruhshona Tort | Onlayn buyurtma",
  description: "Ruhshona Tort mahsulotlarini onlayn buyurtma qiling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <CartProvider>
          <div className="ambient ambient-a" aria-hidden />
          <div className="ambient ambient-b" aria-hidden />
          <div className="ambient ambient-c" aria-hidden />
          <SiteHeader />
          <div className="page-shell">{children}</div>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
