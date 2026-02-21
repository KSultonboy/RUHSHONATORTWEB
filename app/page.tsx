import Link from "next/link";
import StorefrontCatalog from "@/components/store/StorefrontCatalog";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow">Ruhshona Tort</p>
            <h1>Bayram va kundalik buyurtmalar uchun yangi tayyorlangan shirinliklar</h1>
            <p>
              Katalogdan mahsulot tanlang, savatga qo'shing va 1 daqiqada buyurtma qoldiring.
              Buyurtma ERP tizimiga to'g'ridan-to'g'ri tushadi.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn-primary">
                Katalogni ko'rish
              </Link>
              <Link href="/checkout" className="btn-ghost">
                Buyurtma berish
              </Link>
            </div>
          </Reveal>

          <Reveal className="hero-card" delayMs={120}>
            <h3>Nega biz?</h3>
            <ul>
              <li>Yangi va sifatli mahsulotlar</li>
              <li>Tezkor buyurtma qabul qilish</li>
              <li>Telefon orqali tasdiqlash</li>
              <li>Yetkazib berish imkoniyati</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="container section">
        <Reveal className="section-head">
          <h2>Ommabop mahsulotlar</h2>
          <Link href="/catalog">Barchasini ko'rish</Link>
        </Reveal>
        <StorefrontCatalog compact />
      </section>

      <section className="container section features-grid">
        <Reveal className="feature-card" delayMs={40}>
          <h3>Premium ingredientlar</h3>
          <p>Har bir mahsulot sifat nazoratidan o'tadi va yangi ingredientlardan tayyorlanadi.</p>
        </Reveal>
        <Reveal className="feature-card" delayMs={120}>
          <h3>Tezkor logistika</h3>
          <p>Buyurtmangiz tasdiqlangandan so'ng yetkazib berish jarayoni darhol boshlanadi.</p>
        </Reveal>
        <Reveal className="feature-card" delayMs={200}>
          <h3>ERP bilan integratsiya</h3>
          <p>Saytdagi buyurtmalar admin panelga real vaqtga yaqin tezlikda tushadi.</p>
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
    </main>
  );
}
