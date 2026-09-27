import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  const formData = await request.formData();
  const productId = String(formData.get("producto_id") ?? "");
  const file = formData.get("file");
  if (!productId || !(file instanceof File) || !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagen inválida. Usa JPG, PNG o WebP de máximo 8 MB." }, { status: 400 });
  }
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("productos").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const publicUrl = supabase.storage.from("productos").getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ path, publicUrl });
}
