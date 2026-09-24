import Link from "next/link";
import { getCatalogData } from "@/lib/catalog-server";
import ProductTable from "@/components/admin/ProductTable";

export default async function AdminPage() {
  const { products } = await getCatalogData();
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  return <main className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Panel privado</p><h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: .95, letterSpacing: "-.06em" }}>Catálogo en control.</h1></div><Link className="button secondary" href="/catalogo">Ver catálogo público</Link></div><div className="catalog-grid"><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Productos</span><h2>{products.length}</h2><p>Registros cargados desde Supabase.</p></div></article><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Variantes</span><h2>{products.reduce((total, product) => total + product.variants.length, 0)}</h2><p>Medidas y presentaciones disponibles para cotizar.</p></div></article><article className="catalog-card"><div className="product-copy"><span className="eyebrow">Estado</span><h2>{isSupabaseConfigured ? "Producción" : "Sin conexión"}</h2><p>{isSupabaseConfigured ? "Supabase está configurado para este entorno." : "Faltan las variables públicas de Supabase."}</p></div></article></div><section aria-labelledby="admin-products-heading"><div className="admin-page-header"><div><p className="eyebrow">Catálogo</p><h2 id="admin-products-heading">Productos</h2></div><Link className="admin-btn admin-btn-primary" href="/admin/productos/nuevo">Crear producto nuevo</Link></div><ProductTable products={products} embedded /></section></div></main>;
}
