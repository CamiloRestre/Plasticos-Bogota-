"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import PriceInput from "./PriceInput";

export type VariantDraft = { id?: string; medida: string; cantidad_unidades: string; precio_unidad: string; precio_bulto: string; stock: string };

export default function VariantsEditor({ initial = [] }: { initial?: VariantDraft[] }) {
  const [variants, setVariants] = useState<VariantDraft[]>(initial.length ? initial : [{ medida: "", cantidad_unidades: "", precio_unidad: "", precio_bulto: "", stock: "" }]);
  return (
    <div className="admin-variants-editor">
      <div className="admin-panel-heading"><div><p className="eyebrow">Precios y medidas</p><h3>Variantes</h3></div><button className="admin-btn admin-btn-secondary" type="button" onClick={() => setVariants((current) => [...current, { medida: "", cantidad_unidades: "", precio_unidad: "", precio_bulto: "", stock: "" }])}><Plus size={15} /> Añadir medida</button></div>
      {variants.map((variant, index) => <div className="admin-variant-draft" key={variant.id ?? index}>
        <label className="admin-field"><span>Medida</span><input className="admin-input" name={`variant_${index}_medida`} value={variant.medida} placeholder="65 x 90 cm" onChange={(e) => setVariants((all) => all.map((item, i) => i === index ? { ...item, medida: e.target.value } : item))} /></label>
        <label className="admin-field"><span>Cantidad</span><input className="admin-input" name={`variant_${index}_cantidad_unidades`} value={variant.cantidad_unidades} placeholder="10" inputMode="numeric" onChange={(e) => setVariants((all) => all.map((item, i) => i === index ? { ...item, cantidad_unidades: e.target.value.replace(/\D/g, "") } : item))} /></label>
        <PriceInput name={`variant_${index}_precio_unidad`} label="Precio unidad" defaultValue={variant.precio_unidad} />
        <PriceInput name={`variant_${index}_precio_bulto`} label="Precio bulto" defaultValue={variant.precio_bulto} />
        <label className="admin-field"><span>Stock</span><input className="admin-input" name={`variant_${index}_stock`} value={variant.stock} placeholder="0" inputMode="numeric" onChange={(e) => setVariants((all) => all.map((item, i) => i === index ? { ...item, stock: e.target.value.replace(/\D/g, "") } : item))} /></label>
        {variants.length > 1 && <button className="admin-icon-btn admin-icon-btn-danger" type="button" aria-label="Eliminar variante" onClick={() => setVariants((all) => all.filter((_, i) => i !== index))}><Trash2 size={16} /></button>}
      </div>)}
    </div>
  );
}
