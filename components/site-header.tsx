"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="shell header-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M10 8h17c6 0 10 3 10 8 0 3-2 6-5 7 4 1 6 4 6 8 0 6-5 9-12 9H10V8Zm8 7v8h8c3 0 5-1 5-4s-2-4-5-4h-8Zm0 14v8h9c3 0 5-1 5-4s-2-4-5-4h-9Z" fill="currentColor" />
            </svg>
          </span>
          <span><strong>Plásticos Bogotá</strong><small>Servimos en Colombia</small></span>
        </Link>
        <button className="menu-button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={open ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
          <Link href="#catalogo" onClick={() => setOpen(false)}>Catálogo</Link>
          <Link href="#servicio" onClick={() => setOpen(false)}>Nosotros</Link>
          <Link href="#contacto" onClick={() => setOpen(false)}>Contacto</Link>
          <Link className="nav-cta" href="#catalogo" onClick={() => setOpen(false)}>Ver productos</Link>
        </nav>
      </div>
    </header>
  );
}
