"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Image
            src="/img/logo.png"
            alt="Plásticos Bogotá"
            width={200}
            height={60}
            priority
            className="brand-logo"
          />
        </Link>
        <button className="menu-button" type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav id="main-navigation" className={open ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
          <Link className={isActive("/catalogo") ? "is-active" : ""} aria-current={isActive("/catalogo") ? "page" : undefined} href="/catalogo" onClick={() => setOpen(false)}>Catálogo</Link>
          <Link className={isActive("/nosotros") ? "is-active" : ""} aria-current={isActive("/nosotros") ? "page" : undefined} href="/nosotros" onClick={() => setOpen(false)}>Nosotros</Link>
          <Link className={isActive("/contacto") ? "is-active" : ""} aria-current={isActive("/contacto") ? "page" : undefined} href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
          <Link className="nav-cta" href="/catalogo" onClick={() => setOpen(false)}>Ver productos</Link>
        </nav>
      </div>
    </header>
  );
}
