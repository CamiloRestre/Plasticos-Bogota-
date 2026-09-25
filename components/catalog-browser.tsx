"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Category, formatCop, Product } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

export function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) window.requestAnimationFrame(animate);
    };

    const frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span>{count}</span>;
}

export function CatalogBrowser({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Product | null>(null);
  const [quote, setQuote] = useState<Product[]>([]);
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const result = useMemo(() => products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.description} ${product.variants.map((variant) => variant.measure).join(" ")}`.toLowerCase();
    return (category === "Todos" || product.category === category) && haystack.includes(query.toLowerCase());
  }), [category, query]);

  function addToQuote(product: Product) {
    setQuote((items) => items.some((item) => item.id === product.id) ? items : [...items, product]);
  }

  return <section className="catalog-shell shell">
    <div className="catalog-toolbar">
      <label className="search-box"><Search size={19} /><span className="sr-only">Buscar productos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por producto, medida o categoría" /></label>
      <div className="category-tabs" role="tablist" aria-label="Categorías">
        <button className={category === "Todos" ? "selected" : ""} onClick={() => setCategory("Todos")}>Todos</button>
        {categories.map((item) => <button key={item.id} className={category === item.name ? "selected" : ""} onClick={() => setCategory(item.name)}>{category === item.name && <motion.span className="tab-indicator" layoutId="tab-indicator" />}{item.name}</button>)}
      </div>
    </div>
    <div className="catalog-meta"><span>{result.length} productos</span>{quote.length > 0 && <button className="quote-counter" onClick={() => setSelected(quote[0])}><ShoppingBag size={16} /> {quote.length} en tu cotización</button>}</div>
    <AnimatePresence mode="popLayout"><div className="catalog-grid">{result.map((product, index) => <motion.article layout className="catalog-card" key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <button className="product-image" onClick={() => setSelected(product)}><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></button>
      <div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>Desde {formatCop(Math.min(...product.variants.map((variant) => variant.price).filter(Boolean)))}</strong><button onClick={() => setSelected(product)}>Ver detalle <span>↗</span></button></div></div>
    </motion.article>)}</div></AnimatePresence>
    {result.length === 0 && <div className="empty-state"><h2>No encontramos ese producto</h2><p>Prueba con otra medida o escríbenos para ayudarte a encontrarlo.</p></div>}
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title">
      <button className="modal-close" aria-label="Cerrar detalle" onClick={() => setSelected(null)}><X size={20} /></button>
      <div className="modal-media embla" ref={emblaRef}><div className="embla-container"><div className="embla-slide"><ProductImage src={selected.image} alt={selected.name} /></div></div></div>
      <div className="modal-content"><span className="eyebrow">{selected.category}</span><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p>
        <div className="variant-list">{selected.variants.map((variant) => <div className="variant-row" key={variant.id}><div><strong>{variant.measure}</strong><small>{variant.gauge ? `Calibre ${variant.gauge} · ` : ""}{variant.presentation}</small></div><strong>{formatCop(variant.price)}</strong></div>)}</div>
        <div className="modal-actions"><button className="button primary" onClick={() => addToQuote(selected)}>Añadir a cotización</button><a className="button secondary" target="_blank" rel="noreferrer" href={`https://wa.me/573122184430?text=${encodeURIComponent(`Hola, quiero cotizar: ${selected.name}`)}`}>Cotizar por WhatsApp</a></div>
      </div>
    </div></div>}
  </section>;
}
