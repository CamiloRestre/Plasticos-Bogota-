import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductTable, { type AdminProduct, type AdminCategory } from "@/components/admin/ProductTable";

export default async function AdminProductosPage() {
  const supabase = await createSupabaseServerClient();
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("productos")
      .select("id,categoria_id,nombre,slug,activo,destacado,updated_at,categorias(nombre,slug),variantes(id),imagenes(url,es_principal,orden)")
      .order("updated_at", { ascending: false }),
    supabase.from("categorias").select("id,nombre,slug").order("orden", { ascending: true }),
  ]);

  if (productsResult.error) {
    throw new Error(`No fue posible cargar los productos: ${productsResult.error.message}`);
  }

  if (categoriesResult.error) {
    throw new Error(`No fue posible cargar las categorías: ${categoriesResult.error.message}`);
  }

  const products: AdminProduct[] = (productsResult.data ?? []).map((product) => {
    const category = Array.isArray(product.categorias) ? product.categorias[0] : product.categorias;
    const images = (product.imagenes ?? []).slice().sort(
      (a, b) => Number(Boolean(b.es_principal)) - Number(Boolean(a.es_principal)) || (a.orden ?? 0) - (b.orden ?? 0),
    );

    return {
      id: product.id,
      name: product.nombre,
      slug: product.slug,
      category: category?.nombre ?? "Sin categoría",
      categoryId: product.categoria_id,
      active: Boolean(product.activo),
      featured: Boolean(product.destacado),
      variantCount: product.variantes?.length ?? 0,
      imageUrl: images[0]?.url
        ? images[0].url.startsWith("http")
          ? images[0].url
          : supabase.storage.from("productos").getPublicUrl(images[0].url).data.publicUrl
        : null,
      updatedAt: product.updated_at,
    };
  });

  const categories: AdminCategory[] = (categoriesResult.data ?? []).map((category) => ({
    id: category.id,
    name: category.nombre,
    slug: category.slug,
  }));

  return (
    <main className="admin-page">
      <div className="shell">
        <header className="admin-page-header">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h1>Productos</h1>
          </div>
          <Link className="admin-btn admin-btn-primary" href="/admin/productos/nuevo">
            + Nuevo producto
          </Link>
        </header>
        <ProductTable products={products} categories={categories} />
      </div>
    </main>
  );
}
