"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FloatingObjects } from "../floating-objects";
import { useReducedMotion } from "./use-reduced-motion";

export function HeroLanding({ productCount, categoryCount, variantCount }: { productCount: number; categoryCount: number; variantCount: number }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const move = (event: PointerEvent) => setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 14, y: (event.clientY / window.innerHeight - 0.5) * 10 });
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reducedMotion]);
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <FloatingObjects />
      <div className="landing-shape landing-shape-one" style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0) rotate(18deg)` }} />
      <div className="landing-shape landing-shape-two" style={{ transform: `translate3d(${-pointer.x}px, ${-pointer.y}px, 0) rotate(-24deg)` }} />
      <div className="shell landing-hero-grid">
        <div className="landing-hero-copy">
          <p className="landing-kicker">Solución en empaques plásticos</p>
          <h1 id="landing-title"><span>Empaques</span> que mueven tu negocio.</h1>
          <p className="landing-hero-lede">Fabricamos soluciones prácticas, resistentes y a tu medida para hogares, comercios y empresas.</p>
          <div className="landing-actions">
            <a className="button primary landing-pulse" href="https://wa.me/573122184430?text=Hola%2C%20quiero%20cotizar%20un%20empaque." target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
            <Link className="button secondary" href="#catalogo">Ver catálogo</Link>
          </div>
          <div className="landing-proof" aria-label="Información del catálogo">
            <span><strong>{productCount}</strong> productos activos</span>
            <span><strong>{categoryCount}</strong> categorías</span>
            <span><strong>{variantCount}</strong> variantes disponibles</span>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-orbit landing-orbit-a" />
          <div className="landing-orbit landing-orbit-b" />
          <div className="hero-character">
            <Image src="/img/personaje-bolsa.png" alt="Trabajador cargando una bolsa grande" width={1536} height={1024} priority sizes="(max-width: 480px) 240px, (max-width: 968px) 320px, 480px" className="hero-character-image" />
          </div>
          <span className="landing-sticker">Hecho para<br />lo cotidiano</span>
        </div>
      </div>
      <a className="landing-scroll-cue" href="#catalogo" aria-label="Ir al catálogo"><span />Descubre</a>
    </section>
  );
}
