import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Ruxshona Tort | Eng shirin va sifatli tortlar onlayn buyurtmasi",
  description: "Ruxshona Tort - professional qandolatchilik markazi. Bizning katalogimizdan eng mazali tort, shirinlik va desertlarni onlayn buyurtma qiling.",
  keywords: ["tort buyurtma qilish", "Ruxshona Tort", "Toshkent tortlari", "shirinliklar", "onlayn qandolat", "custom cakes Uzbekistan"],
  openGraph: {
    title: "Ruxshona Tort | Professional Qandolatchilik",
    description: "Eng shirin va sifatli tortlar onlayn buyurtmasi. Bayramingiz uchun maxsus dizayndagi tortlar.",
    url: "https://ruxshonatort.uz",
    siteName: "Ruxshona Tort",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ruxshona Tort - Professional Cakes",
      },
    ],
    locale: "uz-UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruxshona Tort | Professional Qandolatchilik",
    description: "Eng shirin va sifatli tortlar onlayn buyurtmasi.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Ruxshona Tort",
              "description": "Professional qandolatchilik markazi va onlayn buyurtma xizmati",
              "url": "https://ruxshonatort.uz",
              "telephone": "+998123456789",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Tashkent City",
                "addressLocality": "Tashkent",
                "addressCountry": "UZ"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "08:00",
                  "closes": "21:00"
                }
              ]
            })
          }}
        />
        <AuthProvider>
          <CartProvider>
            <div className="ambient ambient-a" aria-hidden />
            <div className="ambient ambient-b" aria-hidden />
            <div className="ambient ambient-c" aria-hidden />
            <SiteHeader />
            <div className="page-shell">{children}</div>
            <SiteFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
