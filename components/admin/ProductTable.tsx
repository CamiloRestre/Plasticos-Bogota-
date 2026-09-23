"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Package, Pencil, Search, Star, Trash2 } from "lucide-react";
import {
  deleteProducto,
  duplicateProducto,
  toggleActivo,
  toggleDestacado,
} from "@/app/admin/productos/actions";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string | null;
  category: string;
  categoryId: string | null;
  active: boolean;
  featured: boolean;
  variantCount: number;
  imageUrl: string | null;
  updatedAt: string | null;
};

type ProductTableProps = {
  products: AdminProduct[];
  categories: AdminCategory[];
};

export default function ProductTable({ products, categories }: ProductTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch =
      !debouncedSearch ||
      product.name.toLowerCase().includes(debouncedSearch) ||
      (product.slug ?? "").toLowerCase().includes(debouncedSearch);
    const matchesCategory = !category || product.categoryId === category;
    const matchesStatus =
      !status ||
      (status === "active" && product.active) ||
      (status === "inactive" && !product.active);

    return matchesSearch && matchesCategory && matchesStatus;
  }), [category, debouncedSearch, products, status]);

  function runAction(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "No fue posible completar la acción.");
      }
    });
  }

  function handleDelete(product: AdminProduct) {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    runAction(() => deleteProducto(product.id));
  }

  function handleDuplicate(product: AdminProduct) {
    runAction(() => duplicateProducto(product.id));
  }

  function handleRowClick(id: string) {
    if (!isPending) router.push(`/admin/productos/${id}`);
  }

  return (
    <section aria-label="Listado de productos">
      <div className="admin-filters">
        <label className="admin-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar productos</span>
          <input
            className="admin-input"
            type="search"
            placeholder="Buscar por nombre o slug..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por categoría</span>
          <select className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </label>
        <span className="admin-results">Mostrando {filteredProducts.length} de {products.length}</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-empty">No hay productos que coincidan con los filtros.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Variantes</th>
                <th scope="col">Estado</th>
                <th scope="col">Destacado</th>
                <th scope="col"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr className="admin-row" key={product.id} onClick={() => handleRowClick(product.id)}>
                  <td>
                    <div className="admin-product-cell">
                      {product.imageUrl ? (
                        <img className="admin-thumb" src={product.imageUrl} alt="" />
                      ) : (
                        <span className="admin-thumb admin-thumb-placeholder"><Package size={20} aria-hidden="true" /></span>
                      )}
                      <div><strong>{product.name}</strong><small>{product.slug}</small></div>
                    </div>
                  </td>
                  <td data-label="Categoría">{product.category}</td>
                  <td data-label="Variantes">{product.variantCount}</td>
                  <td data-label="Estado">
                    <button className={`admin-badge ${product.active ? "active" : "inactive"}`} onClick={(event) => { event.stopPropagation(); runAction(() => toggleActivo(product.id, !product.active)); }}>
                      {product.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td data-label="Destacado">
                    <button className={`admin-featured-toggle ${product.featured ? "is-featured" : ""}`} aria-label={product.featured ? "Quitar destacado" : "Marcar como destacado"} onClick={(event) => { event.stopPropagation(); runAction(() => toggleDestacado(product.id, !product.featured)); }}>
                      <Star size={16} fill={product.featured ? "currentColor" : "none"} aria-hidden="true" />
                    </button>
                  </td>
                  <td data-label="Acciones">
                    <div className="admin-actions" onClick={(event) => event.stopPropagation()}>
                      <button className="admin-icon-btn" aria-label={`Editar ${product.name}`} onClick={() => router.push(`/admin/productos/${product.id}`)}><Pencil size={16} /></button>
                      <button className="admin-icon-btn" aria-label={`Duplicar ${product.name}`} onClick={() => handleDuplicate(product)}><Copy size={16} /></button>
                      <button className="admin-icon-btn admin-icon-btn-danger" aria-label={`Eliminar ${product.name}`} onClick={() => handleDelete(product)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
