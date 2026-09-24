import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductEditor, { type EditableProduct, type EditorImage } from "@/components/admin/ProductEditor";

type ProductPageProps = { params: { id: string } };

export default async function AdminProductoPage({ params }: ProductPageProps) {
  const supabase = await createSupabaseServerClient();
  const [{ data: product, error: productError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase
      .from("productos")
      .select("id,categoria_id,nombre,descripcion,slug,activo,destacado,imagenes(id,producto_id,url,alt,es_principal,orden),variantes(id,medida,calibre,presentacion,precio_bulto,precio_unidad,precio_kilo,stock)")
      .eq("id", params.id)
      .single(),
    supabase.from("categorias").select("id,nombre,slug").order("orden", { ascending: true }),
  ]);

  if (productError || !product || categoriesError) notFound();

  const images: EditorImage[] = (product.imagenes ?? [])
    .slice()
    .sort((a, b) => Number(Boolean(b.es_principal)) - Number(Boolean(a.es_principal)) || (a.orden ?? 0) - (b.orden ?? 0))
    .map((image) => ({
      ...image,
      publicUrl: image.url.startsWith("http") ? image.url : supabase.storage.from("productos").getPublicUrl(image.url).data.publicUrl,
    }));

  const editableProduct: EditableProduct = {
    id: product.id,
    nombre: product.nombre,
    descripcion: product.descripcion,
    slug: product.slug,
    categoria_id: product.categoria_id,
    activo: Boolean(product.activo),
    destacado: Boolean(product.destacado),
    variantes: product.variantes ?? [],
  };

  return (
    <main className="admin-page">
      <div className="shell">
        <div className="admin-breadcrumb"><Link href="/admin/productos">Productos</Link><span>/</span><span>Editar</span></div>
        <header className="admin-page-header">
          <div><p className="eyebrow">Edición de producto</p><h1>{product.nombre}</h1></div>
          <Link className="admin-btn admin-btn-secondary" href="/admin/productos">Volver al catálogo</Link>
        </header>
        <ProductEditor product={editableProduct} categories={categories ?? []} initialImages={images} />
      </div>
    </main>
  );
}