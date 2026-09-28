"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Category, formatCop, lowestPrice, Product } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

export function CatalogBrowser({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Product | null>(null);
  const [quote, setQuote] = useState<Product[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const [emblaRef] = useEmblaCarousel({ loop: true });
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 220);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSelected();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>(".modal-close")?.focus(), 0);
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selected]);
  const result = useMemo(() => products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.description} ${product.variants.map((variant) => variant.measure).join(" ")}`.toLowerCase();
    return (category === "Todos" || product.category === category) && haystack.includes(debouncedQuery.toLowerCase());
  }), [category, debouncedQuery, products]);

  function addToQuote(product: Product) {
    setQuote((items) => items.some((item) => item.id === product.id) ? items : [...items, product]);
  }

  function openProduct(product: Product) {
    lastFocusedElement.current = document.activeElement as HTMLElement;
    setSelected(product);
  }

  function closeSelected() {
    setSelected(null);
    window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
  }

  return <section className="catalog-shell shell">
    <div className="catalog-toolbar">
      <label className="search-box"><Search size={19} aria-hidden="true" /><span className="sr-only">Buscar productos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué estás buscando?" /><button type="button" className="search-clear" aria-label="Limpiar búsqueda" onClick={() => setQuery("")} disabled={!query}><X size={16} /></button></label>
      <div className="category-tabs" role="tablist" aria-label="Categorías">
        <button type="button" role="tab" aria-selected={category === "Todos"} className={category === "Todos" ? "selected" : ""} onClick={() => setCategory("Todos")}>Todos</button>
        {categories.map((item) => <button type="button" role="tab" aria-selected={category === item.name} key={item.id} className={category === item.name ? "selected" : ""} onClick={() => setCategory(item.name)}>{item.name}</button>)}
      </div>
    </div>
    <div className="catalog-meta"><span aria-live="polite">{result.length} {result.length === 1 ? "resultado" : "resultados"}</span><div className="catalog-meta-actions">{(query || category !== "Todos") && <button className="catalog-clear" type="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Limpiar filtros</button>}{quote.length > 0 && <button className="quote-counter" type="button" onClick={() => setSelected(quote[0])}><ShoppingBag size={16} /> {quote.length} en tu cotización</button>}</div></div>
    <div className="catalog-grid">{result.map((product, index) => <motion.article className="catalog-card" key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.35 }}>
      <button type="button" className="product-image" onClick={() => openProduct(product)}><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></button>
      <div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>{lowestPrice(product.variants) ? `Desde ${formatCop(lowestPrice(product.variants))}` : "Consultar precio"}</strong><button type="button" onClick={() => openProduct(product)}>Ver detalle <span>↗</span></button></div></div>
    </motion.article>)}</div>
    {result.length === 0 && <div className="empty-state"><h2>No encontramos ese producto</h2><p>Prueba con otra medida o escríbenos para ayudarte a encontrarlo.</p></div>}
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSelected()}><div className="product-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="product-title">
      <button type="button" className="modal-close" aria-label="Cerrar detalle" onClick={closeSelected}><X size={20} /></button>
      <div className="modal-media embla" ref={emblaRef}><div className="embla-container"><div className="embla-slide"><ProductImage src={selected.image} alt={selected.name} /></div></div></div>
      <div className="modal-content"><span className="eyebrow">{selected.category}</span><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p>
        <div className="variant-list">{selected.variants.map((variant) => <div className="variant-row" key={variant.id}><div><strong>{variant.measure}</strong><small>{variant.gauge ? `Calibre ${variant.gauge} · ` : ""}{variant.presentation}</small></div><strong>{formatCop(variant.price)}</strong></div>)}</div>
        <div className="modal-actions"><button type="button" className="button primary" onClick={() => addToQuote(selected)}>Añadir a cotización</button><a className="button secondary" target="_blank" rel="noreferrer" href={`https://wa.me/573122184430?text=${encodeURIComponent(`Hola, estoy interesado en el producto ${selected.name}. Me gustaría recibir información sobre precio y disponibilidad.`)}`}>Cotizar por WhatsApp</a></div>
      </div>
    </div></div>}
  </section>;
}
