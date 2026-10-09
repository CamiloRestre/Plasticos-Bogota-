"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductModal from "./ProductModal";
import ProductTable, { type AdminCategory, type AdminProduct } from "./ProductTable";

export default function ProductListClient({ products, categories }: { products: AdminProduct[]; categories: AdminCategory[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const queryMode = params.get("new") === "1" ? "create" : params.get("edit") ? "edit" : null;
  const queryProduct = params.get("edit");
  const [open, setOpen] = useState(Boolean(queryMode));
  const [mode, setMode] = useState<"create" | "edit">(queryMode === "edit" ? "edit" : "create");
  const [selected, setSelected] = useState<AdminProduct | undefined>(
    queryProduct ? products.find((product) => product.id === queryProduct) : undefined,
  );

  useEffect(() => {
    const openNew = () => {
      setSelected(undefined);
      setMode("create");
      setOpen(true);
      router.replace("/admin/productos?new=1");
    };
    window.addEventListener("admin:new-product", openNew);
    return () => window.removeEventListener("admin:new-product", openNew);
  }, [router]);

  function create() {
    setSelected(undefined);
    setMode("create");
    setOpen(true);
    router.replace("/admin/productos?new=1");
  }
  function edit(product: AdminProduct) {
    setSelected({ ...product });
    setMode("edit");
    setOpen(true);
    router.replace(`/admin/productos?edit=${encodeURIComponent(product.id)}`);
  }
  function close() {
    setOpen(false);
    setSelected(undefined);
    router.replace("/admin/productos");
    router.refresh();
  }

  return <>
    <div className="admin-list-toolbar"><button className="admin-btn admin-btn-primary" type="button" onClick={create}>+ Nuevo producto</button></div>
    <ProductTable products={products} categories={categories} onEdit={edit} onCreate={create} />
    <ProductModal open={open} onClose={close} mode={mode} categorias={categories.map((category) => ({ id: category.id, nombre: category.name, slug: category.slug }))} producto={selected ? { id: selected.id, nombre: selected.name, descripcion: selected.descripcion ?? null, categoria_id: selected.categoryId, activo: selected.active, destacado: selected.featured, imageUrl: selected.imageUrl, imageId: selected.imageId, variantes: (selected.variantes ?? []).map((variant) => ({ id: variant.id, medida: variant.medida ?? "", cantidad_unidades: String(variant.cantidad_unidades ?? ""), precio_unidad: String(variant.precio_unidad ?? ""), precio_bulto: String(variant.precio_bulto ?? ""), stock: String(variant.stock ?? "") })) } : undefined} />
  </>;
}
