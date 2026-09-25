import Link from "next/link";
import { getCatalogData } from "@/lib/catalog-server";
import { formatCop } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";
import { AnimatedCounter, CatalogBrowser } from "@/components/catalog-browser";
import { HeroParallax, SectionReveal } from "@/components/section-reveal";

export default async function Home() {
  const { categories, products } = await getCatalogData();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const hasOffers = false;
  return <main>
    <section id="inicio" className="hero"><HeroParallax><div className="shell">
      <p className="eyebrow">Empaques que resuelven</p>
      <h1>Soluciones plásticas para cada día.</h1>
      <p>Encuentra productos prácticos, presentaciones claras y atención cercana para hogares, comercios y empresas.</p>
      <div className="hero-actions"><Link className="button primary" href="#catalogo">Ver catálogo</Link><a className="button secondary" href="https://wa.me/573122184430" target="_blank" rel="noreferrer">Hablar con un asesor</a></div>
    </div></HeroParallax></section>
    <SectionReveal id="categorias" className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Explora por necesidad</p><h2>Categorías claras para encontrar rápido.</h2></div><p>Filtra el catálogo por la familia de producto que necesitas.</p></div><div className="category-grid">{categories.map((category) => <Link className="category-tile" href="#catalogo" key={category.id}><span className="category-icon" aria-hidden="true">{category.name.charAt(0)}</span><strong>{category.name}</strong><span>Ver productos ↗</span></Link>)}</div></div></SectionReveal>
    <SectionReveal id="destacados" className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Productos destacados</p><h2>Lo que necesitas, sin vueltas.</h2></div><p>Explora productos reales del catálogo, revisa sus presentaciones y arma una solicitud de cotización.</p></div><div className="catalog-grid">{featuredProducts.map((product) => <article className="catalog-card" key={product.id}><div className="product-image"><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></div><div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>Desde {formatCop(Math.min(...product.variants.map((variant) => variant.price).filter(Boolean)))}</strong><Link href="#catalogo">Ver catálogo <span>↗</span></Link></div></div></article>)}</div></div></SectionReveal>
    {hasOffers && <SectionReveal id="ofertas" className="section"><div className="shell"><p className="eyebrow">Ofertas activas</p><h2>Precios especiales por tiempo limitado.</h2></div></SectionReveal>}
    <SectionReveal id="catalogo" className="section catalog-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Catálogo completo</p><h2>Encuentra tu próxima solución.</h2></div><p><AnimatedCounter value={products.length} /> productos listos para cotizar.</p></div><CatalogBrowser categories={categories} products={products} /></div></SectionReveal>
    <SectionReveal id="servicio" className="service-band"><div className="shell"><div><p className="eyebrow">Estamos para ayudarte</p><h2>Servicio a domicilio y atención cercana.</h2><p>Servimos en Colombia con atención cercana, servicio a domicilio y parqueadero.</p></div><Link className="button primary" href="#contacto">Hablar con nosotros</Link></div></SectionReveal>
    <SectionReveal id="contacto" className="section"><div className="shell footer-grid contact-section"><div><p className="eyebrow">Visítanos</p><h2>Tuluá · Valle del Cauca</h2><p>Carrera 25 # 31-20, B/ Salesianos</p></div><div><p className="eyebrow">Horario</p><p>Lun–Vie 8:00–12:00 y 14:00–17:30<br />Sáb 8:00–12:30<br />Domingos y festivos cerrado</p></div><div><p className="eyebrow">Contacto</p><a href="tel:+573122184430">312 218 4430</a><br /><a href="mailto:plasticosbogota@hotmail.com">plasticosbogota@hotmail.com</a></div></div></SectionReveal>
  </main>;
}
