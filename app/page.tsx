import type { Metadata } from "next";
import { getCatalogData } from "@/lib/catalog-server";
import { CatalogBrowser } from "@/components/catalog-browser";
import { HeroLanding } from "@/components/landing/hero-landing";
import { LandingSections } from "@/components/landing/landing-sections";

export const metadata: Metadata = {
  title: "Solución en empaques plásticos | Plásticos Bogotá",
  description: "Empaques plásticos para hogares, comercios y empresas en Tuluá y Colombia. Explora el catálogo y cotiza por WhatsApp.",
  openGraph: {
    title: "Solución en empaques plásticos | Plásticos Bogotá",
    description: "Fabricamos empaques prácticos, resistentes y a tu medida.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function Home() {
  const { categories, products } = await getCatalogData();
  const variantCount = products.reduce((total, product) => total + product.variants.length, 0);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Plásticos Bogotá",
            description: "Solución en empaques plásticos.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Carrera 25 # 31-20, Barrio Salesianos",
              addressLocality: "Tuluá",
              addressRegion: "Valle del Cauca",
              addressCountry: "CO",
            },
            telephone: ["+57 602 232 5992", "+57 318 795 1504"],
            url: "https://wa.me/573122184430",
          }),
        }}
      />
      <HeroLanding productCount={products.length} categoryCount={categories.length} variantCount={variantCount} />
      <LandingSections variantCount={variantCount} />
      <section id="catalogo" className="section landing-catalog">
        <div className="shell">
          <div className="landing-section-intro">
            <p className="landing-kicker">Catálogo</p>
            <h2>Encuentra el empaque que necesitas.</h2>
            <p>Busca por producto, categoría o medida. Abre cada referencia para revisar variantes y cotizar.</p>
          </div>
          <CatalogBrowser categories={categories} products={products} />
        </div>
      </section>
    </main>
  );
}
