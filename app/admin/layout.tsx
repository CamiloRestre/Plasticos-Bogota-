import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/admin-header";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestPath = (await headers()).get("x-admin-path");
  if (requestPath === "/admin/login") return <>{children}</>;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: categories } = await supabase.from("categorias").select("id,nombre,slug").order("orden", { ascending: true });
  return (
    <>
      <AdminHeader categories={categories ?? []} />
      <main className="admin-main">{children}</main>
    </>
  );
}
