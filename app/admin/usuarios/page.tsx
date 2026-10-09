import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import UserManager from "@/components/admin/UserManager";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) redirect("/admin/login");

  const { data, error } = await createSupabaseAdminClient().auth.admin.listUsers({ page: 1, perPage: 100 });
  if (error) throw new Error(`No fue posible cargar los usuarios: ${error.message}`);

  const users = data.users.map((user) => ({
    id: user.id,
    email: user.email ?? "",
    name: String(user.user_metadata?.full_name ?? ""),
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at ?? null,
    banned: Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now()),
  }));

  return <main className="admin-page"><div className="shell"><UserManager users={users} currentUserId={currentUser.id} /></div></main>;
}
