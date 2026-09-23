"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  return { supabase, user };
}

function revalidateProducts() {
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}

export async function deleteProducto(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    throw new Error(`No fue posible eliminar el producto: ${error.message}`);
  }

  revalidateProducts();
}

export async function duplicateProducto(id: string) {
  const { supabase } = await requireUser();
  const { data: source, error: sourceError } = await supabase
    .from("productos")
    .select("categoria_id,nombre,descripcion,slug,activo,destacado")
    .eq("id", id)
    .single();

  if (sourceError || !source) {
    throw new Error("No encontramos el producto que quieres duplicar.");
  }

  const baseSlug = source.slug || `producto-${id.slice(0, 8)}`;
  let slug = `${baseSlug}-copia`;
  let suffix = 2;

  while (true) {
    const { data: existing, error: slugError } = await supabase
      .from("productos")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugError) {
      throw new Error(`No fue posible validar el slug: ${slugError.message}`);
    }

    if (!existing) break;
    slug = `${baseSlug}-copia-${suffix}`;
    suffix += 1;
  }

  const { data: copy, error: copyError } = await supabase
    .from("productos")
    .insert({
      ...source,
      nombre: `${source.nombre} (copia)`,
      slug,
    })
    .select("id")
    .single();

  if (copyError || !copy) {
    throw new Error(`No fue posible duplicar el producto: ${copyError?.message ?? "error desconocido"}`);
  }

  const { data: variants, error: variantsError } = await supabase
    .from("variantes")
    .select("medida,calibre,presentacion,precio_bulto,precio_unidad,precio_kilo,unidad,stock,orden")
    .eq("producto_id", id);

  if (variantsError) {
    throw new Error(`El producto fue creado, pero no se copiaron sus variantes: ${variantsError.message}`);
  }

  if (variants?.length) {
    const { error: insertVariantsError } = await supabase
      .from("variantes")
      .insert(variants.map((variant) => ({ ...variant, producto_id: copy.id })));

    if (insertVariantsError) {
      throw new Error(`El producto fue creado, pero no se copiaron sus variantes: ${insertVariantsError.message}`);
    }
  }

  revalidateProducts();
}

export async function toggleActivo(id: string, activo: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);

  if (error) {
    throw new Error(`No fue posible actualizar el estado: ${error.message}`);
  }

  revalidateProducts();
}

export async function toggleDestacado(id: string, destacado: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("productos").update({ destacado }).eq("id", id);

  if (error) {
    throw new Error(`No fue posible actualizar el destacado: ${error.message}`);
  }

  revalidateProducts();
}
