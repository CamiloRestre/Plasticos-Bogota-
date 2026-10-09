"use client";

import { FileText, Minus, Plus, Search, Send, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion as useMotionReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Category, formatCop, lowestPrice, Product } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

type QuoteItem = {
  id: string;
  product: Product;
  variantId: string;
  quantity: number;
};

type CustomerData = {
  name: string;
  business: string;
  taxId: string;
  phone: string;
  city: string;
  address: string;
};

export function CatalogBrowser({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Product | null>(null);
  const [quote, setQuote] = useState<QuoteItem[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerData>({ name: "", business: "", taxId: "", phone: "", city: "", address: "" });
  const [customerError, setCustomerError] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const reducedMotion = useMotionReducedMotion();
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

  function addToQuote(product: Product, variantId: string) {
    const id = `${product.id}-${variantId}`;
    setQuote((items) => {
      const existing = items.find((item) => item.id === id);
      return existing
        ? items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { id, product, variantId, quantity: 1 }];
    });
    setQuoteOpen(true);
  }

  function updateQuantity(id: string, quantity: number) {
    setQuote((items) => quantity < 1 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, quantity } : item));
  }

  function getVariant(item: QuoteItem) {
    return item.product.variants.find((variant) => variant.id === item.variantId) ?? item.product.variants[0];
  }

  function quoteTotal() {
    return quote.reduce((total, item) => total + (getVariant(item)?.price ?? 0) * item.quantity, 0);
  }

  function quoteMessage() {
    const lines = quote.map((item, index) => {
      const variant = getVariant(item);
      return `${index + 1}. ${item.product.name} | ${variant.measure} | ${variant.presentation} | Cantidad: ${item.quantity} | ${formatCop(variant.price)} c/u`;
    });
    return `Hola, quiero solicitar esta cotización.\n\nDatos del cliente:\nCliente: ${customer.name}\nNegocio: ${customer.business || "No informado"}\nNIT/Cédula: ${customer.taxId || "No informado"}\nTeléfono: ${customer.phone}\nCiudad: ${customer.city || "No informada"}\nDirección: ${customer.address || "No informada"}\n\nDetalle:\n${lines.join("\n")}\n\nTotal de referencia: ${formatCop(quoteTotal())}\n\nQuedo atento a disponibilidad, IVA y envío.`;
  }

  function hasCustomerData() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setCustomerError("Escribe el nombre y teléfono del cliente para continuar.");
      return false;
    }
    setCustomerError("");
    return true;
  }

  function downloadQuotePdf() {
    if (!quote.length || !hasCustomerData()) return;
    void import("jspdf").then(({ jsPDF }) => {
      const pdf = new jsPDF();
      const margin = 18;
      let y = 22;
      pdf.setFillColor(11, 75, 49);
      pdf.rect(0, 0, 210, 42, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(17);
      pdf.setFont("helvetica", "bold");
      pdf.text("PLÁSTICOS BOGOTÁ", margin, 16);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("Soluciones en empaques plásticos", margin, 23);
      pdf.text("Tel. 602 232 5992 · Cel. 318 795 1504 · WhatsApp 312 218 4430", margin, 31);
      pdf.text("Carrera 25 # 31-20, barrio Salesianos · Tuluá, Valle del Cauca", margin, 37);
      pdf.setTextColor(20, 48, 37);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("SOLICITUD DE COTIZACIÓN", margin, y + 32);
      y += 47;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Fecha: ${new Intl.DateTimeFormat("es-CO").format(new Date())}`, margin, y);
      pdf.text("Valores expresados en pesos colombianos", 125, y);
      y += 12;
      pdf.setFillColor(239, 247, 240);
      pdf.setDrawColor(210, 222, 215);
      pdf.rect(margin, y, 174, 34, "FD");
      pdf.setTextColor(20, 48, 37);
      pdf.setFont("helvetica", "bold");
      pdf.text("DATOS DEL CLIENTE", margin + 5, y + 8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Cliente: ${customer.name}`, margin + 5, y + 16);
      pdf.text(`Negocio: ${customer.business || "No informado"}`, 105, y + 16);
      pdf.text(`NIT / Cédula: ${customer.taxId || "No informado"}`, margin + 5, y + 24);
      pdf.text(`Teléfono: ${customer.phone}`, 105, y + 24);
      pdf.text(`Ciudad: ${customer.city || "No informada"}`, margin + 5, y + 32);
      pdf.text(`Dirección: ${customer.address || "No informada"}`, 105, y + 32);
      y += 46;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("DETALLE DEL PEDIDO", margin, y);
      y += 10;
      quote.forEach((item, index) => {
        const variant = getVariant(item);
        const subtotal = (variant.price ?? 0) * item.quantity;
        pdf.setDrawColor(210, 222, 215);
        pdf.line(margin, y - 5, 192, y - 5);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${item.product.name}`, margin, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${variant.measure} · ${variant.presentation}`, margin, y + 6);
        pdf.text(`Cantidad: ${item.quantity}`, 120, y + 3);
        pdf.text(`Total: ${formatCop(subtotal)}`, 160, y + 3);
        y += 18;
        if (y > 270) { pdf.addPage(); y = 20; }
      });
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(`Total de referencia: ${formatCop(quoteTotal())}`, margin, y + 8);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("El total es de referencia. Plásticos Bogotá confirmará disponibilidad, IVA aplicable y costo de envío.", margin, y + 17);
      pdf.text("Buscamos brindarle siempre el mejor servicio y calidad.", margin, y + 24);
      pdf.text("Para confirmar condiciones de compra, comunícate con nuestro equipo comercial.", margin, y + 31);
      pdf.save(`cotizacion-plasticos-bogota-${Date.now()}.pdf`);
    });
  }

  function sendQuoteToWhatsApp() {
    if (!quote.length || !hasCustomerData()) return;
    window.open(`https://wa.me/573122184430?text=${encodeURIComponent(quoteMessage())}`, "_blank", "noopener,noreferrer");
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
    <div className="catalog-meta"><span aria-live="polite">{result.length} {result.length === 1 ? "resultado" : "resultados"}</span><div className="catalog-meta-actions">{(query || category !== "Todos") && <button className="catalog-clear" type="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Limpiar filtros</button>}{quote.length > 0 && <button className="quote-counter" type="button" onClick={() => setQuoteOpen(true)}><ShoppingBag size={16} /> {quote.length} referencias</button>}</div></div>
    <div className="catalog-grid">{result.map((product, index) => <motion.article className="catalog-card" key={product.id} initial={reducedMotion ? false : { opacity: 0, y: 26, rotate: index % 2 === 0 ? -2 : 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={reducedMotion ? undefined : { delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <button type="button" className="product-image" onClick={() => openProduct(product)}><ProductImage src={product.image} alt={product.name} /><span>{product.category}</span></button>
      <div className="product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="product-footer"><strong>{lowestPrice(product.variants) ? `Desde ${formatCop(lowestPrice(product.variants))}` : "Consultar precio"}</strong><button type="button" onClick={() => openProduct(product)}>Ver detalle <span>↗</span></button></div></div>
    </motion.article>)}</div>
    {result.length === 0 && <div className="empty-state"><h2>No encontramos ese producto</h2><p>Prueba con otra medida o escríbenos para ayudarte a encontrarlo.</p></div>}
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSelected()}><div className="product-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="product-title">
      <button type="button" className="modal-close" aria-label="Cerrar detalle" onClick={closeSelected}><X size={20} /></button>
      <div className="modal-media embla" ref={emblaRef}><div className="embla-container"><div className="embla-slide"><ProductImage src={selected.image} alt={selected.name} /></div></div></div>
      <div className="modal-content"><span className="eyebrow">{selected.category}</span><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p>
        <div className="variant-list">{selected.variants.map((variant) => <div className="variant-row" key={variant.id}><div><strong>{variant.measure}</strong><small>{variant.gauge ? `Calibre ${variant.gauge} · ` : ""}{variant.presentation}</small></div><strong>{formatCop(variant.price)}</strong><button type="button" className="variant-add" aria-label={`Añadir ${variant.measure} al carrito`} onClick={() => addToQuote(selected, variant.id)}><Plus size={16} /></button></div>)}</div>
        <div className="modal-actions"><button type="button" className="button primary" onClick={() => { if (selected.variants[0]) addToQuote(selected, selected.variants[0].id); }}>Añadir primera referencia</button><button type="button" className="button secondary" onClick={() => { closeSelected(); setQuoteOpen(true); }}><ShoppingBag size={16} /> Ver carrito</button></div>
      </div>
    </div></div>}
    {quoteOpen && <div className="modal-backdrop quote-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setQuoteOpen(false)}><div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
      <button type="button" className="modal-close" aria-label="Cerrar carrito" onClick={() => setQuoteOpen(false)}><X size={20} /></button>
      <div className="quote-header"><div><span className="eyebrow">Tu selección</span><h2 id="quote-title">Carrito de cotización</h2></div><ShoppingBag size={26} aria-hidden="true" /></div>
      {quote.length === 0 ? <p className="quote-empty">Aún no has añadido referencias.</p> : <>
        <div className="quote-customer-form">
          <h3>Datos para la cotización</h3>
          <div className="quote-form-grid">
            <label><span>Cliente *</span><input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Nombre completo" /></label>
            <label><span>Teléfono *</span><input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="312 000 0000" /></label>
            <label><span>Negocio</span><input value={customer.business} onChange={(event) => setCustomer({ ...customer, business: event.target.value })} placeholder="Nombre del negocio" /></label>
            <label><span>NIT / Cédula</span><input value={customer.taxId} onChange={(event) => setCustomer({ ...customer, taxId: event.target.value })} placeholder="Opcional" /></label>
            <label><span>Ciudad</span><input value={customer.city} onChange={(event) => setCustomer({ ...customer, city: event.target.value })} placeholder="Tuluá" /></label>
            <label><span>Dirección</span><input value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="Dirección de entrega" /></label>
          </div>
          {customerError && <p className="quote-form-error" role="alert">{customerError}</p>}
        </div>
        <div className="quote-items">{quote.map((item) => { const variant = getVariant(item); return <div className="quote-item" key={item.id}><div><strong>{item.product.name}</strong><small>{variant.measure} · {variant.presentation}</small><span>{formatCop(variant.price)} por unidad</span></div><div className="quote-item-controls"><button type="button" aria-label="Disminuir cantidad" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={15} /></button><strong>{item.quantity}</strong><button type="button" aria-label="Aumentar cantidad" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={15} /></button><button type="button" className="quote-remove" aria-label="Eliminar referencia" onClick={() => updateQuantity(item.id, 0)}><Trash2 size={15} /></button></div></div>; })}</div>
        <div className="quote-total"><span>Total de referencia</span><strong>{formatCop(quoteTotal())}</strong></div>
        <p className="quote-note">El total es referencial y se confirma con disponibilidad, IVA y envío.</p>
        <div className="modal-actions quote-actions"><button type="button" className="button secondary" onClick={downloadQuotePdf}><FileText size={16} /> Descargar PDF</button><button type="button" className="button primary" onClick={sendQuoteToWhatsApp}><Send size={16} /> Enviar por WhatsApp</button></div>
      </>}
    </div></div>}
  </section>;
}
