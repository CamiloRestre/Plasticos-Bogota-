import { CatalogBrowser } from "@/components/catalog-browser";
import { getCatalogData } from "@/lib/catalog-server";

export default async function CatalogoPage() {
  const { categories, products } = await getCatalogData();
  return <main><section className="section" style={{ paddingBottom: 35 }}><div className="shell"><p className="eyebrow">Catálogo</p><h1 style={{ fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: .95, letterSpacing: "-.06em", maxWidth: 800, margin: "15px 0 0" }}>Empaques para resolver lo cotidiano.</h1></div></section><CatalogBrowser categories={categories} products={products} /></main>;
}
