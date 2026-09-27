"use client";

import { FormEvent, useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { createProducto, updateProducto, uploadProductoImage } from "@/app/admin/productos/actions";
import type { ProductInput, VariantInput } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import VariantsEditor, { type VariantDraft } from "./VariantsEditor";

export type ProductFormProduct = ProductInput & {
  id?: string;
  imageUrl?: string | null;
  variantes?: Array<VariantDraft>;
};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: ProductFormProduct;
  categories: Array<{ id: string; nombre: string; slug: string }>;
  onSuccess?: () => void;
  onCancel?: () => void;
  onDirty?: () => void;
};

function numberValue(form: FormData, name: string) {
  const value = String(form.get(`${name}_raw`) ?? form.get(name) ?? "").replace(/\D/g, "");
  return value ? Number(value) : null;
}

export default function ProductForm({ mode, product, categories, onSuccess, onCancel, onDirty }: ProductFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nombre = String(form.get("nombre") ?? "").trim();
    if (!nombre) {
      setError("Escribe un nombre para el producto.");
      return;
    }
    const variants: VariantInput[] = [];
    for (let index = 0; form.has(`variant_${index}_medida`); index += 1) {
      const medida = String(form.get(`variant_${index}_medida`) ?? "").trim();
      if (!medida && !numberValue(form, `variant_${index}_precio_unidad`)) continue;
      variants.push({
        id: product?.variantes?.[index]?.id,
        medida,
        cantidad_unidades: Number(form.get(`variant_${index}_cantidad_unidades`) || 0) || null,
        precio_unidad: numberValue(form, `variant_${index}_precio_unidad`),
        precio_bulto: numberValue(form, `variant_${index}_precio_bulto`),
        stock: Number(form.get(`variant_${index}_stock`) || 0) || 0,
        orden: index,
      });
    }
    const input: ProductInput = {
      nombre,
      descripcion: String(form.get("descripcion") ?? "").trim(),
      categoria_id: String(form.get("categoria_id") ?? "") || null,
      activo: form.get("activo") === "on",
      destacado: form.get("destacado") === "on",
    };
    setError("");
    startTransition(async () => {
      try {
        let productId = product?.id;
        if (mode === "create") {
          productId = await createProducto(input, variants);
        } else if (productId) {
          const update = new FormData();
          update.set("id", productId);
          update.set("nombre", input.nombre);
          update.set("descripcion", input.descripcion ?? "");
          update.set("categoria_id", input.categoria_id ?? "");
          if (input.activo) update.set("activo", "on");
          if (input.destacado) update.set("destacado", "on");
          variants.forEach((variant, index) => {
            if (!variant.id) return;
            update.append("variant_id", variant.id);
            update.set(`variant_${variant.id}_medida`, variant.medida ?? "");
            update.set(`variant_${variant.id}_cantidad_unidades`, String(variant.cantidad_unidades ?? ""));
            update.set(`variant_${variant.id}_precio_unidad`, String(variant.precio_unidad ?? ""));
            update.set(`variant_${variant.id}_precio_bulto`, String(variant.precio_bulto ?? ""));
            update.set(`variant_${variant.id}_stock`, String(variant.stock ?? 0));
          });
          await updateProducto(update);
        }
        if (image && productId) {
          const upload = new FormData();
          upload.set("producto_id", productId);
          upload.set("file", image);
          await uploadProductoImage(upload);
        }
        toast.success(mode === "create" ? "Producto creado correctamente." : "Producto actualizado correctamente.");
        onSuccess?.();
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "No fue posible guardar el producto.";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <form className="admin-modal-form" onSubmit={submit} onChange={onDirty}>
      <div className="admin-form-grid">
        <div className="admin-field admin-field-wide"><label htmlFor="modal-nombre">Nombre</label><input className="admin-input" id="modal-nombre" name="nombre" defaultValue={product?.nombre ?? ""} placeholder="Ej: Bolsa basurera negra 65x90" required /></div>
        <div className="admin-field"><label htmlFor="modal-categoria">Categoría</label><select className="admin-select" id="modal-categoria" name="categoria_id" defaultValue={product?.categoria_id ?? ""}><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></div>
        <div className="admin-field admin-field-wide"><label htmlFor="modal-descripcion">Descripción</label><textarea className="admin-textarea" id="modal-descripcion" name="descripcion" rows={4} defaultValue={product?.descripcion ?? ""} placeholder="Describe el producto para tus clientes." /></div>
      </div>
      <ImageUploader initialUrl={product?.imageUrl} onFile={setImage} />
      <VariantsEditor initial={product?.variantes} />
      <div className="admin-checks"><label><input type="checkbox" name="activo" defaultChecked={product?.activo ?? true} /> Producto activo</label><label><input type="checkbox" name="destacado" defaultChecked={product?.destacado ?? false} /> Producto destacado</label></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-editor-actions"><button className="admin-btn admin-btn-primary" type="submit" disabled={isPending}>{isPending ? <><LoaderCircle size={16} className="admin-spin" /> Guardando...</> : "Guardar producto"}</button>{onCancel && <button className="admin-btn admin-btn-secondary" type="button" onClick={onCancel} disabled={isPending}>Cancelar</button>}</div>
    </form>
  );
}
