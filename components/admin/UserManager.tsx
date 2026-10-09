"use client";

import { useState, useTransition } from "react";
import { KeyRound, LoaderCircle, Plus, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { createUser, deleteUser, updateUser } from "@/app/admin/usuarios/actions";

type ManagedUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn: string | null;
  banned: boolean;
};

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(value)) : "Nunca";
}

export default function UserManager({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>, success: string) {
    setMessage(null);
    startTransition(async () => {
      try { await action(); setMessage({ type: "success", text: success }); setEditing(null); setCreating(false); window.location.reload(); }
      catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "No fue posible completar la acción." }); }
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (creating) run(() => createUser(data), "Usuario creado correctamente.");
    else run(() => updateUser(data), "Usuario actualizado correctamente.");
  }

  function remove(user: ManagedUser) {
    if (!window.confirm(`¿Eliminar el usuario ${user.email}? Esta acción no se puede deshacer.`)) return;
    run(() => deleteUser(user.id), "Usuario eliminado correctamente.");
  }

  const formUser = editing;
  return <>
    <div className="admin-users-toolbar"><div><p className="eyebrow">Acceso y seguridad</p><h1>Usuarios del panel</h1><p>Administra quién puede entrar al panel y restablece sus claves.</p></div><button className="admin-btn admin-btn-primary" type="button" onClick={() => { setCreating(true); setEditing(null); setMessage(null); }}><Plus size={17} /> Crear usuario</button></div>
    {message && <p className={message.type === "error" ? "admin-error" : "admin-success"} role="status">{message.text}</p>}
    <div className="admin-users-grid">{users.map((user) => <article className="admin-user-card" key={user.id}><div className="admin-user-card-top"><span className="admin-user-avatar"><UserRound size={20} /></span><div><strong>{user.name || "Sin nombre"}</strong><small>{user.email}</small></div><span className={`admin-user-status ${user.banned ? "is-banned" : "is-active"}`}>{user.banned ? "Bloqueado" : "Activo"}</span></div><dl><div><dt>Creado</dt><dd>{formatDate(user.createdAt)}</dd></div><div><dt>Último acceso</dt><dd>{formatDate(user.lastSignIn)}</dd></div></dl><div className="admin-user-actions"><button className="admin-btn admin-btn-secondary" type="button" onClick={() => { setEditing(user); setCreating(false); setMessage(null); }}><KeyRound size={15} /> Editar y cambiar clave</button><button className="admin-icon-btn admin-icon-btn-danger" type="button" aria-label={`Eliminar ${user.email}`} disabled={user.id === currentUserId} onClick={() => remove(user)}><Trash2 size={16} /></button></div></article>)}</div>
    {(creating || formUser) && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-user-modal" role="dialog" aria-modal="true" aria-labelledby="user-form-title"><header className="admin-modal-heading"><div><p className="eyebrow">{creating ? "Nuevo acceso" : "Editar acceso"}</p><h2 id="user-form-title">{creating ? "Crear usuario" : "Actualizar usuario"}</h2></div><button className="admin-icon-btn" type="button" aria-label="Cerrar" onClick={() => { setCreating(false); setEditing(null); }}><X size={20} /></button></header><form className="admin-user-form" onSubmit={submit}><input type="hidden" name="id" value={formUser?.id ?? ""} /><label className="admin-field"><span>Nombre completo</span><input className="admin-input" name="name" defaultValue={formUser?.name ?? ""} placeholder="Nombre del usuario" /></label><label className="admin-field"><span>Correo electrónico</span><input className="admin-input" name="email" type="email" defaultValue={formUser?.email ?? ""} required placeholder="usuario@empresa.com" /></label><label className="admin-field"><span>{creating ? "Clave" : "Nueva clave (opcional)"}</span><input className="admin-input" name="password" type="password" minLength={8} required={creating} placeholder="Mínimo 8 caracteres" /></label>{!creating && <label className="admin-user-check"><input type="checkbox" name="banned" value="true" defaultChecked={formUser?.banned ?? false} /> Bloquear acceso a este usuario</label>}<p className="admin-user-security"><ShieldCheck size={16} /> La clave nunca se muestra ni se envía al navegador.</p><div className="admin-editor-actions"><button className="admin-btn admin-btn-primary" type="submit" disabled={isPending}>{isPending ? <><LoaderCircle size={16} className="admin-spin" /> Guardando...</> : creating ? "Crear usuario" : "Guardar cambios"}</button><button className="admin-btn admin-btn-secondary" type="button" onClick={() => { setCreating(false); setEditing(null); }} disabled={isPending}>Cancelar</button></div></form></section></div>}
  </>;
}
