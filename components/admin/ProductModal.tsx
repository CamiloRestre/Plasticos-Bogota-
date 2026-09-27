"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ProductForm, { type ProductFormProduct } from "./ProductForm";

type Category = { id: string; nombre: string; slug: string };

export default function ProductModal({ open, onClose, mode, producto, categorias }: {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  producto?: ProductFormProduct;
  categorias: Category[];
  detalle?: ProductFormProduct;
}) {
  const [dirty, setDirty] = useState(false);
  function requestClose() {
    if (dirty && !window.confirm("Hay cambios sin guardar. ¿Cerrar de todos modos?")) return;
    setDirty(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") requestClose(); };
    window.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", escape); };
  }, [dirty, onClose, open]);

  return (
    <AnimatePresence>
      {open && <motion.div className="admin-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={requestClose}>
        <motion.section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} onMouseDown={(event) => event.stopPropagation()}>
          <header className="admin-modal-heading"><div><p className="eyebrow">{mode === "create" ? "Nuevo registro" : "Edición"}</p><h2 id="product-modal-title">{mode === "create" ? "Crear producto" : "Editar producto"}</h2></div><button className="admin-icon-btn" type="button" onClick={requestClose} aria-label="Cerrar modal"><X size={20} /></button></header>
          <div className="admin-modal-body"><ProductForm mode={mode} product={detalle ?? producto} categories={categorias} onDirty={() => setDirty(true)} onCancel={requestClose} onSuccess={() => { setDirty(false); onClose(); }} /></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  );
}
