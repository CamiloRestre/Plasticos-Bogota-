"use client";

import { useMemo, useState } from "react";
import { useInView } from "./use-in-view";
import { ProductMarquee } from "./product-marquee";

const benefits = [
  ["Fabricación propia", "Soluciones pensadas para el uso real de cada cliente."],
  ["Empaque a tu medida", "Te ayudamos a elegir presentación, medida y cantidad."],
  ["Calidad y norma", "Cumplimiento de estándares y certificados según corresponda."],
  ["Atención cercana", "Estamos en Tuluá para acompañarte de principio a fin."],
];

export function LandingSections({ variantCount }: { variantCount: number }) {
  const [bag, setBag] = useState("Bolsa para empaque");
  const [measure, setMeasure] = useState("Por definir");
  const [quantity, setQuantity] = useState("");
  const why = useInView<HTMLDivElement>();
  const sustainability = useInView<HTMLDivElement>();
  const message = useMemo(() => `Hola, quiero cotizar un empaque. Tipo: ${bag}. Medida: ${measure}. Cantidad aproximada: ${quantity || "por definir"}.`, [bag, measure, quantity]);
  return (
    <>
      <ProductMarquee items={["Basureras", "Precorte", "Manigueta", "Impresas", "Empaques para alimentos", "Estándar"]} />
      <section className="section landing-benefits" ref={why.ref}><div className="shell"><div className="landing-section-intro"><p className="landing-kicker">Por qué elegirnos</p><h2>Orden, calidad y acompañamiento.</h2><p>Buscamos brindarle siempre el mejor servicio y calidad.</p></div><div className={`benefit-grid ${why.inView ? "is-visible" : ""}`}>{benefits.map(([title, text], index) => <article key={title} style={{ transitionDelay: `${index * 70}ms` }}><span className="benefit-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className={`section landing-sustainability ${sustainability.inView ? "is-visible" : ""}`} ref={sustainability.ref}><div className="shell landing-sustainability-grid"><div><p className="landing-kicker">Materiales con propósito</p><h2>Opciones Bio y puntos ecológicos.</h2><p>Explora líneas de colores y alternativas biodegradables disponibles en el catálogo. Hoy contamos con {variantCount} variantes activas para consultar.</p></div><div className="sustainability-art" aria-hidden="true"><span /><span /><span /></div></div></section>
      <section className="section landing-configurator"><div className="shell landing-config-grid"><div><p className="landing-kicker">Empaque a tu medida</p><h2>Cuéntanos qué necesitas.</h2><p>En pocos datos preparamos una conversación más útil para tu cotización.</p></div><form onSubmit={(event) => { event.preventDefault(); window.open(`https://wa.me/573122184430?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }}><label>Tipo de empaque<select value={bag} onChange={(event) => setBag(event.target.value)}><option>Bolsa para empaque</option><option>Bolsa basurera</option><option>Manigueta</option><option>Empaque para alimentos</option><option>Bolsa impresa personalizada</option></select></label><label>Medida aproximada<input value={measure} onChange={(event) => setMeasure(event.target.value.slice(0, 80))} maxLength={80} /></label><label>Cantidad aproximada<input value={quantity} onChange={(event) => setQuantity(event.target.value.replace(/[^\d.,\s]/g, "").slice(0, 30))} inputMode="numeric" maxLength={30} /></label><button className="button primary" type="submit">Cotizar esta idea</button></form></div></section>
      <section className="landing-contact-band"><div className="shell"><div><p className="landing-kicker">Estamos en Tuluá</p><h2>Hablemos de tu próximo empaque.</h2><p>Carrera 25 # 31-20, Barrio Salesianos, Tuluá, Valle del Cauca.</p></div><a className="button secondary" href="https://www.google.com/maps/search/?api=1&query=Carrera+25+31-20+Tuluá+Valle+del+Cauca" target="_blank" rel="noreferrer">Cómo llegar</a></div></section>
    </>
  );
}
