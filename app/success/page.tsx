import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ trackCode?: string }>;
}) {
  const params = await searchParams;
  const trackCode = params.trackCode || "-";

  return (
    <main className="container section">
      <Reveal className="panel success-panel">
        <h1>Buyurtma qabul qilindi</h1>
        <p>Operator tez orada siz bilan bog'lanadi.</p>

        <div className="track-box">
          <span>Track code:</span>
          <strong>{trackCode}</strong>
        </div>

        <div className="hero-actions">
          <Link href="/catalog" className="btn-primary">
            Yana buyurtma berish
          </Link>
          <Link href="/" className="btn-ghost">
            Bosh sahifa
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
