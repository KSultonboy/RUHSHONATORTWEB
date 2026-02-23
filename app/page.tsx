import Link from "next/link";
import StorefrontCatalog from "@/components/store/StorefrontCatalog";
import Reveal from "@/components/ui/Reveal";
import InstagramFeed from "@/components/layout/InstagramFeed";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow" style={{ color: 'var(--accent-strong)' }}>Premium Patisserie</p>
            <h1>Sizning bayramingiz uchun nafis va shirin san'at asarlari</h1>
            <p>
              Ruxshona Tort — bu nafaqat shirinliklar, balki unutilmas lahzalar.
              Har bir buyurtma mahorat va mehr bilan tayyorlanadi.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn-primary">
                Katalogni o'rganish
              </Link>
              <Link href="/checkout" className="btn-ghost" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                Hozir buyurtma berish
              </Link>
            </div>
          </Reveal>

          <Reveal className="hero-card" delayMs={200} style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-600))', color: '#fff', border: 'none' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>Kafolatlangan sifat</h3>
            <ul style={{ color: 'rgba(255,255,255,0.9)', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>✨ 100% tabiiy va yangi mahsulotlar</li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>🧁 Eksklyuziv dizayn va bezaklar</li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>🚚 Xavfsiz va tezkor yetkazib berish</li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📞 24/7 mijozlarni qo'llab-quvvatlash</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
            <h2>Ommabop mahsulotlar</h2>
            <p style={{ color: 'var(--muted)' }}>Eng ko'p tanlanadigan va sevib iste'mol qilinadigan shirinliklarimiz</p>
          </div>
          <Link href="/catalog" className="btn-ghost" style={{ borderRadius: '12px' }}>Hammasini ko'rish</Link>
        </Reveal>
        <StorefrontCatalog compact />
      </section>

      <section className="container section features-grid">
        <Reveal className="feature-card" delayMs={100} style={{ borderBottom: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍯</div>
          <h3>Premium Ingredientlar</h3>
          <p>Biz faqat eng sara va yuqori sifatli ingredientlardan foydalanamiz.</p>
        </Reveal>
        <Reveal className="feature-card" delayMs={200} style={{ borderBottom: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
          <h3>Tezkor Logistika</h3>
          <p>Sizning buyurtmangiz belgilangan vaqtda va butun holatda yetkaziladi.</p>
        </Reveal>
        <Reveal className="feature-card" delayMs={300} style={{ borderBottom: '4px solid var(--accent-strong)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💻</div>
          <h3>ERP Integratsiyasi</h3>
          <p>Buyurtmangiz tizimimizga avtomatik tarzda tushadi va darhol qayta ishlanadi.</p>
        </Reveal>
      </section>

      <section className="container section process-section">
        <Reveal className="section-head stacked">
          <h2>Buyurtma jarayoni</h2>
          <p>3 oddiy qadam bilan buyurtmangiz qabul qilinadi.</p>
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
            <h4>Yetkazish</h4>
            <p>Operator aloqaga chiqadi va buyurtma tayyorlanadi.</p>
          </Reveal>
        </div>
      </section>

      <InstagramFeed />
    </main>
  );
}
