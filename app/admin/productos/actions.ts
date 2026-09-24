"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProductImageActionResult = {
  id: string;
  producto_id: string;
  url: string;
  publicUrl: string;
  alt: string | null;
  es_principal: boolean;
  orden: number;
};

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

function storagePath(url: string) {
  if (!url.startsWith("http")) return url;

  const parsedUrl = new URL(url);
  const marker = "/storage/v1/object/";
  const markerIndex = parsedUrl.pathname.indexOf(marker);
  if (markerIndex === -1) return null;

  const [visibility, bucket, ...segments] = parsedUrl.pathname.slice(markerIndex + marker.length).split("/");
  return visibility === "public" || visibility === "sign"
    ? bucket === "productos"
      ? segments.map((segment) => decodeURIComponent(segment)).join("/")
      : null
    : null;
}

function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return extension || (file.type.split("/")[1] ?? "jpg").replace(/[^a-z0-9]/g, "");
}

async function getImage(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, id: string, productId: string) {
  const { data, error } = await supabase
    .from("imagenes")
    .select("id,producto_id,url,alt,es_principal,orden")
    .eq("id", id)
    .eq("producto_id", productId)
    .single();

  if (error || !data) throw new Error("No encontramos esa foto para este producto.");
  return data;
}

export async function updateProducto(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();

  if (!id || !nombre) throw new Error("El nombre del producto es obligatorio.");

  const { error } = await supabase
    .from("productos")
    .update({
      nombre,
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      slug: String(formData.get("slug") ?? "").trim() || null,
      categoria_id: String(formData.get("categoria_id") ?? "") || null,
      activo: formData.get("activo") === "on",
      destacado: formData.get("destacado") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(`No fue posible guardar el producto: ${error.message}`);

  const variantIds = formData.getAll("variant_id").map(String);
  for (const variantId of variantIds) {
    const numberValue = (field: string) => {
      const value = String(formData.get(`variant_${variantId}_${field}`) ?? "").trim();
      return value ? Number(value) : null;
    };
    const { error: variantError } = await supabase
      .from("variantes")
      .update({
        precio_bulto: numberValue("precio_bulto"),
        precio_unidad: numberValue("precio_unidad"),
        precio_kilo: numberValue("precio_kilo"),
        stock: numberValue("stock") ?? 0,
      })
      .eq("id", variantId)
      .eq("producto_id", id);

    if (variantError) throw new Error(`El producto se guardó, pero falló una variante: ${variantError.message}`);
  }

  revalidateProducts();
  revalidatePath(`/admin/productos/${id}`);
}

export async function uploadProductoImage(formData: FormData): Promise<ProductImageActionResult> {
  const { supabase } = await requireUser();
  const productId = String(formData.get("producto_id") ?? "");
  const file = formData.get("file");

  if (!productId || !(file instanceof File) || file.size === 0) throw new Error("Selecciona una imagen válida.");
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > 8 * 1024 * 1024) throw new Error("La imagen no puede superar 8 MB.");

  const path = `${productId}/${crypto.randomUUID()}.${fileExtension(file)}`;
  const { error: uploadError } = await supabase.storage.from("productos").upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw new Error(`No fue posible subir la foto: ${uploadError.message}`);

  const { data: lastImage } = await supabase
    .from("imagenes")
    .select("orden")
    .eq("producto_id", productId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const order = (lastImage?.orden ?? -1) + 1;
  const { data: image, error: imageError } = await supabase
    .from("imagenes")
    .insert({ producto_id: productId, url: path, orden: order, es_principal: order === 0 })
    .select("id,producto_id,url,alt,es_principal,orden")
    .single();

  if (imageError || !image) {
    await supabase.storage.from("productos").remove([path]);
    throw new Error(`La foto se subió, pero no se pudo registrar: ${imageError?.message ?? "error desconocido"}`);
  }

  revalidateProducts();
  revalidatePath(`/admin/productos/${productId}`);
  return { ...image, publicUrl: supabase.storage.from("productos").getPublicUrl(path).data.publicUrl };
}

export async function replaceProductoImage(formData: FormData): Promise<ProductImageActionResult> {
  const { supabase } = await requireUser();
  const productId = String(formData.get("producto_id") ?? "");
  const imageId = String(formData.get("imagen_id") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Selecciona una imagen válida.");
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > 8 * 1024 * 1024) throw new Error("La imagen no puede superar 8 MB.");

  const image = await getImage(supabase, imageId, productId);
  const oldPath = storagePath(image.url);
  const newPath = `${productId}/${crypto.randomUUID()}.${fileExtension(file)}`;
  const { error: uploadError } = await supabase.storage.from("productos").upload(newPath, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw new Error(`No fue posible subir la nueva foto: ${uploadError.message}`);

  const { data: updatedImage, error: updateError } = await supabase
    .from("imagenes")
    .update({ url: newPath })
    .eq("id", imageId)
    .eq("producto_id", productId)
    .select("id,producto_id,url,alt,es_principal,orden")
    .single();
  if (updateError || !updatedImage) {
    await supabase.storage.from("productos").remove([newPath]);
    throw new Error(`No fue posible actualizar el registro de la foto: ${updateError?.message ?? "error desconocido"}`);
  }

  if (oldPath) await supabase.storage.from("productos").remove([oldPath]);
  revalidateProducts();
  revalidatePath(`/admin/productos/${productId}`);
  return { ...updatedImage, publicUrl: supabase.storage.from("productos").getPublicUrl(newPath).data.publicUrl };
}

export async function deleteProductoImage(productId: string, imageId: string) {
  const { supabase } = await requireUser();
  const image = await getImage(supabase, imageId, productId);
  const path = storagePath(image.url);
  if (path) {
    const { error: storageError } = await supabase.storage.from("productos").remove([path]);
    if (storageError) throw new Error(`No fue posible borrar la foto del bucket: ${storageError.message}`);
  }

  const { error } = await supabase.from("imagenes").delete().eq("id", imageId).eq("producto_id", productId);
  if (error) throw new Error(`La foto se quitó del bucket, pero no de la base de datos: ${error.message}`);
  revalidateProducts();
  revalidatePath(`/admin/productos/${productId}`);
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
