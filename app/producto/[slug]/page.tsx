import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getCatalogData } from "@/lib/catalog-server";
import { formatCop, lowestPrice } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

type Props = { params: { slug: string } };

async function getProduct(slug: string) {
  const { products } = await getCatalogData();
  return products.find((product) => product.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return product ? { title: `${product.name} | Plásticos Bogotá`, description: product.description } : { title: "Producto | Plásticos Bogotá" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const price = lowestPrice(product.variants);
  const whatsapp = `https://wa.me/573122184430?text=${encodeURIComponent(`Hola, estoy interesado en el producto ${product.name}. Me gustaría recibir información sobre precio y disponibilidad.`)}`;

  return <main className="product-page"><div className="shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/catalogo"><ArrowLeft size={15} aria-hidden="true" /> Catálogo</Link><span aria-hidden="true">/</span><span>{product.name}</span></nav>
    <div className="product-detail-layout"><div className="product-detail-media"><ProductImage src={product.image} alt={product.name} /></div><div className="product-detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-detail-description">{product.description}</p>{price > 0 && <p className="product-price">Desde {formatCop(price)}</p>}<div className="product-detail-variants"><h2>Presentaciones disponibles</h2>{product.variants.map((variant) => <div className="variant-row" key={variant.id}><span><strong>{variant.measure}</strong><small>{variant.gauge ? `Calibre ${variant.gauge} · ` : ""}{variant.presentation}</small></span><strong>{formatCop(variant.price)}</strong></div>)}</div><div className="hero-actions"><a className="button primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" /> Cotizar por WhatsApp</a><Link className="button secondary" href="/catalogo">Volver al catálogo</Link></div></div></div>
  </div></main>;
}
