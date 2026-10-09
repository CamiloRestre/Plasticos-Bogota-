"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  return { user, admin: createSupabaseAdminClient() };
}

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function validatePassword(password: string) {
  if (password.length < 8) throw new Error("La clave debe tener al menos 8 caracteres.");
}

function refreshUsers() {
  revalidatePath("/admin/usuarios");
}

export async function createUser(formData: FormData) {
  await requireAdmin();
  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");
  const name = readField(formData, "name");
  if (!email || !email.includes("@")) throw new Error("Escribe un correo válido.");
  validatePassword(password);

  const { error } = await createSupabaseAdminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (error) throw new Error(`No fue posible crear el usuario: ${error.message}`);
  refreshUsers();
}

export async function updateUser(formData: FormData) {
  const { user: currentUser, admin } = await requireAdmin();
  const id = readField(formData, "id");
  const email = readField(formData, "email").toLowerCase();
  const name = readField(formData, "name");
  const password = readField(formData, "password");
  const banned = formData.get("banned") === "true";
  if (!id || !email || !email.includes("@")) throw new Error("Escribe un correo válido.");
  if (password) validatePassword(password);
  if (id === currentUser.id && banned) throw new Error("No puedes bloquear tu propia sesión.");

  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    password: password || undefined,
    ban_duration: banned ? "876000h" : "none",
    user_metadata: { full_name: name },
  });
  if (error) throw new Error(`No fue posible actualizar el usuario: ${error.message}`);
  refreshUsers();
}

export async function deleteUser(id: string) {
  const { user: currentUser, admin } = await requireAdmin();
  if (!id || id === currentUser.id) throw new Error("No puedes eliminar tu propio usuario.");
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(`No fue posible eliminar el usuario: ${error.message}`);
  refreshUsers();
}
