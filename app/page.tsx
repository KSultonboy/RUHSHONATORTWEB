import Link from "next/link";
import StorefrontCatalog from "@/components/store/StorefrontCatalog";
import Reveal from "@/components/ui/Reveal";
import InstagramFeed from "@/components/layout/InstagramFeed";
import Hero3D from "@/components/home/Hero3D";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent)" />
              Premium Patisserie
            </div>
            <h1>
              Sizning bayramingiz uchun <span>nafis va shirin san'at</span>
            </h1>
            <p>
              Ruhshona Tort — bu nafaqat shirinliklar, balki unutilmas lahzalar.
              Har bir buyurtma mahorat va mehr bilan tayyorlanadi.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn-primary">
                Katalogni o'rganish <ArrowRight size={18} />
              </Link>
              <Link href="/custom-order" className="btn-ghost">
                Maxsus buyurtma
              </Link>
            </div>
          </Reveal>

          <div className="hero-3d-wrapper">
            <Hero3D />
          </div>
        </div>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Bizning do'kon</span>
            <h2>Ommabop mahsulotlar</h2>
            <p>Eng ko'p tanlanadigan va sevib iste'mol qilinadigan shirinliklarimiz</p>
          </div>
          <Link href="/catalog" className="btn-ghost">Hammasini ko'rish</Link>
        </Reveal>
        <StorefrontCatalog compact />
      </section>

      <section className="container section features-modern-grid">
        <div className="features-container">
          <Reveal className="feature-modern-card" delayMs={100}>
            <div className="feature-icon"><Sparkles /></div>
            <h3>Premium Sifat</h3>
            <p>100% tabiiy va eng saralangan premium mahsulotlar.</p>
          </Reveal>
          <Reveal className="feature-modern-card" delayMs={200}>
            <div className="feature-icon"><Truck /></div>
            <h3>Tezkor Yetkazish</h3>
            <p>Toshkent bo'ylab xavfsiz va tezkor yetkazib berish xizmati.</p>
          </Reveal>
          <Reveal className="feature-modern-card" delayMs={300}>
            <div className="feature-icon"><ShieldCheck /></div>
            <h3>Kafolat</h3>
            <p>Har bir mahsulot sifatiga va dizayniga to'liq kafolat beramiz.</p>
          </Reveal>
          <Reveal className="feature-modern-card" delayMs={400}>
            <div className="feature-icon"><Clock /></div>
            <h3>24/7 Qo'llab-quvvatlash</h3>
            <p>Buyurtmalar tunu-kun qabul qilinadi va tezda qayta ishlanadi.</p>
          </Reveal>
        </div>
      </section>

      <section className="container section process-section">
        <Reveal className="section-head stacked">
          <span className="eyebrow">Qanday ishlaydi?</span>
          <h2>Buyurtma jarayoni</h2>
          <p>3 oddiy qadam bilan shirinligingiz stolingizda!</p>
        </Reveal>
        <div className="process-grid">
          <Reveal className="process-item" delayMs={40}>
            <span>01</span>
            <h4>Tanlash</h4>
            <p>Katalogdan kerakli mahsulotlarni savatga qo'shing.</p>
          </Reveal>
          <Reveal className="process-item" delayMs={120}>
            <span>02</span>
            <h4>Tasdiqlash</h4>
            <p>Checkout formani to'ldiring va buyurtma bering.</p>
          </Reveal>
          <Reveal className="process-item" delayMs={200}>
            <span>03</span>
            <h4>Rohatlaning</h4>
            <p>Operator aloqaga chiqadi va shirinligingiz yetkaziladi.</p>
          </Reveal>
        </div>
      </section>

      <InstagramFeed />
    </main>
  );
}
