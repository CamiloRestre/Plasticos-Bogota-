import Link from "next/link";
import { getCatalogData } from "@/lib/catalog-server";

export default async function AdminPage() {
  const { products } = await getCatalogData();
  return <main className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Panel privado</p><h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: .95, letterSpacing: "-.06em" }}>Catálogo en control.</h1></div><Link className="button secondary" href="/catalogo">Ver catálogo público</Link></div><div className="catalog-grid"><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Productos</span><h2>{products.length}</h2><p>Registros en la vista local. Conecta Supabase para edición persistente.</p></div></article><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Variantes</span><h2>{products.reduce((total, product) => total + product.variants.length, 0)}</h2><p>Medidas y presentaciones disponibles para cotizar.</p></div></article><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Estado</span><h2>Preview</h2><p>El modo local funciona sin credenciales; producción usa Supabase Auth.</p></div></article></div></div></main>;
}
