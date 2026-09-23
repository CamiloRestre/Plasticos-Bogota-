import Link from "next/link";
import { getCatalogData } from "@/lib/catalog-server";
import { formatCop } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

export default async function Home() {
  const { products } = await getCatalogData();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  return <main>
    <section className="hero"><div className="shell">
      <p className="eyebrow">Empaques que resuelven</p>
      <h1>Soluciones plásticas para cada día.</h1>
      <p>Encuentra productos prácticos, presentaciones claras y atención cercana para hogares, comercios y empresas.</p>
      <div className="hero-actions"><Link className="button primary" href="/catalogo">Ver catálogo</Link><a className="button secondary" href="https://wa.me/573122184430" target="_blank" rel="noreferrer">Hablar con un asesor</a></div>
    </div></section>
    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Productos destacados</p><h2>Lo que necesitas, sin vueltas.</h2></div><p>Explora productos reales del catálogo, revisa sus presentaciones y arma una solicitud de cotización.</p></div><div className="catalog-grid">{featuredProducts.map((product) => <article className="catalog-card" key={product.id}><div className="product-image"><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></div><div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>Desde {formatCop(Math.min(...product.variants.map((variant) => variant.price).filter(Boolean)))}</strong><Link href="/catalogo">Ver catálogo <span>↗</span></Link></div></div></article>)}</div></div></section>
    <section className="service-band"><div className="shell"><div><p className="eyebrow">Estamos para ayudarte</p><h2>¿Necesitas un producto plástico?</h2><p>Servimos en Colombia con atención cercana y servicio a domicilio.</p></div><Link className="button primary" href="/catalogo">Explorar productos</Link></div></section>
  </main>;
}
