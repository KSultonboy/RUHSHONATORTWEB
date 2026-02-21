import StorefrontCatalog from "@/components/store/StorefrontCatalog";
import Reveal from "@/components/ui/Reveal";

export default function CatalogPage() {
  return (
    <main className="container section">
      <Reveal className="section-head stacked">
        <h1>Katalog</h1>
        <p>Mahsulotlarni kategoriya va qidiruv bo'yicha tez toping.</p>
      </Reveal>
      <StorefrontCatalog />
    </main>
  );
}
