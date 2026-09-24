"use client";

import { useState, useTransition } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, Save, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteProductoImage,
  replaceProductoImage,
  updateProducto,
  uploadProductoImage,
  type ProductImageActionResult,
} from "@/app/admin/productos/actions";

export type EditorImage = ProductImageActionResult;
export type EditableProduct = {
  id: string;
  nombre: string;
  descripcion: string | null;
  slug: string | null;
  categoria_id: string | null;
  activo: boolean;
  destacado: boolean;
  variantes: Array<{ id: string; medida: string | null; calibre: string | null; presentacion: string | null; precio_bulto: number | null; precio_unidad: number | null; precio_kilo: number | null; stock: number | null }>;
};
type Category = { id: string; nombre: string; slug: string };

function imageFormData(productId: string, file: File, imageId?: string) {
  const data = new FormData();
  data.set("producto_id", productId);
  data.set("file", file);
  if (imageId) data.set("imagen_id", imageId);
  return data;
}

export default function ProductEditor({ product, categories, initialImages }: { product: EditableProduct; categories: Category[]; initialImages: EditorImage[] }) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function run(action: () => Promise<void>, success: string) {
    setMessage(null);
    startTransition(async () => {
      try { await action(); setMessage({ type: "success", text: success }); router.refresh(); }
      catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "No fue posible completar la acción." }); }
    });
  }

  function saveProduct(formData: FormData) { run(() => updateProducto(formData), "Cambios guardados correctamente."); }

  function upload(file: File) {
    run(async () => { const image = await uploadProductoImage(imageFormData(product.id, file)); setImages((current) => [...current, image]); }, "Foto agregada correctamente.");
  }

  function replace(imageId: string, file: File) {
    run(async () => { const image = await replaceProductoImage(imageFormData(product.id, file, imageId)); setImages((current) => current.map((item) => item.id === image.id ? image : item)); }, "Foto reemplazada correctamente.");
  }

  function remove(image: EditorImage) {
    if (!window.confirm("¿Eliminar esta foto? También se borrará del bucket.")) return;
    run(async () => { await deleteProductoImage(product.id, image.id); setImages((current) => current.filter((item) => item.id !== image.id)); }, "Foto eliminada correctamente.");
  }

  return (
    <form className="admin-editor" action={saveProduct}>
      <input type="hidden" name="id" value={product.id} />
      <div className="admin-editor-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><p className="eyebrow">Información</p><h2>Datos del producto</h2></div><Save size={22} aria-hidden="true" /></div>
          <div className="admin-form-grid">
            <div className="admin-field admin-field-wide"><label htmlFor="nombre">Nombre</label><input className="admin-input" id="nombre" name="nombre" defaultValue={product.nombre} required /></div>
            <div className="admin-field"><label htmlFor="slug">Slug</label><input className="admin-input" id="slug" name="slug" defaultValue={product.slug ?? ""} /></div>
            <div className="admin-field"><label htmlFor="categoria_id">Categoría</label><select className="admin-select" id="categoria_id" name="categoria_id" defaultValue={product.categoria_id ?? ""}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></div>
            <div className="admin-field admin-field-wide"><label htmlFor="descripcion">Descripción</label><textarea className="admin-textarea" id="descripcion" name="descripcion" rows={5} defaultValue={product.descripcion ?? ""} /></div>
          </div>
          <div className="admin-checks"><label><input type="checkbox" name="activo" defaultChecked={product.activo} /> Producto activo</label><label><input type="checkbox" name="destacado" defaultChecked={product.destacado} /> Producto destacado</label></div>
        </section>

        <section className="admin-panel admin-photo-panel">
          <div className="admin-panel-heading"><div><p className="eyebrow">Media</p><h2>Fotos del producto</h2></div><ImagePlus size={22} aria-hidden="true" /></div>
          <p className="admin-help">JPG, PNG o WebP. Máximo 8 MB por archivo.</p>
          <label className="admin-upload"><Upload size={19} aria-hidden="true" /><span>Subir nueva foto<input type="file" accept="image/jpeg,image/png,image/webp" disabled={isPending} onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); event.currentTarget.value = ""; }} /></span></label>
          {images.length === 0 ? <div className="admin-photo-empty"><ImagePlus size={26} aria-hidden="true" /><span>Aún no hay fotos para este producto.</span></div> : <div className="admin-photo-grid">{images.map((image) => <figure className="admin-photo" key={image.id}><img src={image.publicUrl} alt={image.alt ?? product.nombre} /><figcaption><span>{image.es_principal ? "Principal" : `Foto ${image.orden + 1}`}</span><div><label className="admin-photo-action" title="Reemplazar foto"><RefreshCw size={15} aria-hidden="true" /><input type="file" accept="image/jpeg,image/png,image/webp" disabled={isPending} onChange={(event) => { const file = event.target.files?.[0]; if (file) replace(image.id, file); event.currentTarget.value = ""; }} /></label><button className="admin-photo-action danger" type="button" title="Eliminar foto" disabled={isPending} onClick={() => remove(image)}><Trash2 size={15} aria-hidden="true" /></button></div></figcaption></figure>)}</div>}
        </section>
      </div>

      {product.variantes.length > 0 && <section className="admin-panel admin-variants-panel"><div className="admin-panel-heading"><div><p className="eyebrow">Precios</p><h2>Variantes y existencias</h2></div></div><div className="admin-variant-list">{product.variantes.map((variant) => <div className="admin-variant-row" key={variant.id}><input type="hidden" name="variant_id" value={variant.id} /><strong>{[variant.medida, variant.calibre, variant.presentacion].filter(Boolean).join(" · ") || "Variante"}</strong><label><span>Precio unidad</span><input className="admin-input" name={`variant_${variant.id}_precio_unidad`} type="number" min="0" step="1" defaultValue={variant.precio_unidad ?? ""} /></label><label><span>Precio bulto</span><input className="admin-input" name={`variant_${variant.id}_precio_bulto`} type="number" min="0" step="1" defaultValue={variant.precio_bulto ?? ""} /></label><label><span>Stock</span><input className="admin-input" name={`variant_${variant.id}_stock`} type="number" min="0" step="1" defaultValue={variant.stock ?? 0} /></label><input type="hidden" name={`variant_${variant.id}_precio_kilo`} value={String(variant.precio_kilo ?? "")} /></div>)}</div></section>}
      {message && <p className={message.type === "error" ? "admin-error" : "admin-success"} role="status">{message.text}</p>}
      <div className="admin-editor-actions"><button className="admin-btn admin-btn-primary" type="submit" disabled={isPending}>{isPending ? <><LoaderCircle size={16} className="admin-spin" /> Guardando...</> : <><Save size={16} /> Guardar cambios</>}</button><button className="admin-btn admin-btn-secondary" type="button" disabled={isPending} onClick={() => router.push("/admin/productos")}><X size={16} /> Cancelar</button></div>
    </form>
  );
}