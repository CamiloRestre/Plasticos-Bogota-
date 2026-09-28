import Link from "next/link";
import Image from "next/image";
import { getCatalogData } from "@/lib/catalog-server";
import { formatCop, lowestPrice } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";
import dynamic from "next/dynamic";

const AnimatedCanvas = dynamic(() => import("@/components/animated-canvas"), { ssr: false });

export default async function Home() {
  const { products } = await getCatalogData();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  return <main>
    <section className="hero"><AnimatedCanvas particleCount={80} /><div className="shell hero-shell">
      <div className="hero-copy">
        <p className="eyebrow">Empaques que resuelven</p>
        <h1>Soluciones plásticas para cada día.</h1>
        <p>Encuentra productos prácticos, presentaciones claras y atención cercana para hogares, comercios y empresas.</p>
        <div className="hero-actions"><Link className="button primary" href="/catalogo">Ver catálogo</Link><a className="button secondary" href="https://wa.me/573122184430" target="_blank" rel="noreferrer">Cotizar por WhatsApp</a></div>
      </div>
      <div className="hero-art-slot">
        <div className="hero-art-ring hero-art-ring-large" />
        <div className="hero-art-ring hero-art-ring-small" />
        <Image
          className="hero-character"
          src="/img/personaje-bolsa.png"
          alt="Trabajador de Plásticos Bogotá cargando una bolsa grande"
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 820px) 92vw, (max-width: 1200px) 44vw, 580px"
        />
      </div>
    </div></section>
    <section className="trust-bar" aria-label="Por qué elegirnos">
      <div className="shell trust-bar-grid">
        <div><strong>Atención personalizada</strong><span>Te ayudamos a encontrar la presentación adecuada.</span></div>
        <div><strong>Catálogo práctico</strong><span>Productos para hogares, comercios y empresas.</span></div>
        <div><strong>Servicio en Colombia</strong><span>Consulta disponibilidad y zonas de entrega.</span></div>
      </div>
    </section>
    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Productos destacados</p><h2>Lo que necesitas, sin vueltas.</h2></div><p>Explora productos reales del catálogo, revisa sus presentaciones y arma una solicitud de cotización.</p></div><div className="catalog-grid">{featuredProducts.map((product) => <article className="catalog-card" key={product.id}><div className="product-image"><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></div><div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>{lowestPrice(product.variants) ? `Desde ${formatCop(lowestPrice(product.variants))}` : "Consultar precio"}</strong><Link href={`/producto/${product.slug}`}>Ver producto <span>↗</span></Link></div></div></article>)}</div></div></section>
    <section className="section section-muted"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Cómo te ayudamos</p><h2>Una compra más clara.</h2></div><p>Información útil y acompañamiento para que puedas decidir con tranquilidad.</p></div><div className="benefits-grid"><article><h3>Explora</h3><p>Encuentra referencias por nombre, categoría o medida.</p></article><article><h3>Compara</h3><p>Revisa presentaciones y precios disponibles en cada variante.</p></article><article><h3>Consulta</h3><p>Escríbenos para confirmar disponibilidad y coordinar tu pedido.</p></article></div></div></section>
    <section className="service-band"><div className="shell"><div><p className="eyebrow">Estamos para ayudarte</p><h2>¿Necesitas un producto plástico?</h2><p>Servimos en Colombia con atención cercana y servicio a domicilio.</p></div><Link className="button primary" href="/catalogo">Explorar productos</Link></div></section>
  </main>;
}
