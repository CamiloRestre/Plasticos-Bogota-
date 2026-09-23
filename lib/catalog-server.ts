import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Category, Product, toProduct } from "@/lib/catalog";

type DbProduct = {
  id: string;
  categoria_id: string | null;
  nombre: string;
  descripcion: string | null;
  slug: string | null;
  destacado: boolean | null;
};

type DbVariant = {
  id: string;
  producto_id: string;
  medida: string | null;
  calibre: string | null;
  presentacion: string | null;
  precio_bulto: number | null;
  precio_unidad: number | null;
  precio_kilo: number | null;
  unidad: string | null;
};

type DbImage = {
  producto_id: string;
  url: string;
  alt: string | null;
  es_principal: boolean | null;
  orden: number | null;
};

export type CatalogData = {
  categories: Category[];
  products: Product[];
};

export async function getCatalogData(): Promise<CatalogData> {
  const supabase = await createSupabaseServerClient();
  const [categoriesResult, productsResult, variantsResult, imagesResult] = await Promise.all([
    supabase.from("categorias").select("id,nombre,slug").order("orden", { ascending: true }),
    supabase.from("productos").select("id,categoria_id,nombre,descripcion,slug,destacado").eq("activo", true).order("destacado", { ascending: false }).order("nombre", { ascending: true }),
    supabase.from("variantes").select("id,producto_id,medida,calibre,presentacion,precio_bulto,precio_unidad,precio_kilo,unidad").order("orden", { ascending: true }),
    supabase.from("imagenes").select("producto_id,url,alt,es_principal,orden").order("es_principal", { ascending: false }).order("orden", { ascending: true }),
  ]);

  const failed = [categoriesResult, productsResult, variantsResult, imagesResult].find((result) => result.error);
  if (failed?.error) {
    throw new Error(`No fue posible cargar el catálogo desde Supabase: ${failed.error.message}`);
  }

  const categories = (categoriesResult.data ?? []).map((category) => ({ id: category.id, name: category.nombre, slug: category.slug }));
  const images = (imagesResult.data as DbImage[] ?? []).map((image) => ({
    ...image,
    url: image.url.startsWith("http") ? image.url : supabase.storage.from("productos").getPublicUrl(image.url).data.publicUrl,
  }));
  const products = (productsResult.data as DbProduct[] ?? []).map((product) => toProduct(
    product,
    categories.find((category) => category.id === product.categoria_id),
    (variantsResult.data as DbVariant[] ?? []).filter((variant) => variant.producto_id === product.id),
    images.filter((image) => image.producto_id === product.id),
  ));

  return { categories, products };
}
