"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Package, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Category = { id: string; nombre: string; slug: string };

export default function AdminHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  function newProduct() {
    if (pathname === "/admin/productos") {
      window.dispatchEvent(new CustomEvent("admin:new-product"));
    } else {
      router.push("/admin/productos?new=1");
    }
  }
  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <header className="admin-header">
      <div className="shell admin-header-inner">
        <Link className="admin-brand" href="/admin"><span className="admin-brand-mark">B</span><span><strong>Panel Admin</strong><small>Plásticos Bogotá</small></span></Link>
        <nav className="admin-nav" aria-label="Navegación del panel">
          <Link className={pathname.startsWith("/admin/productos") ? "is-active" : ""} href="/admin/productos"><Package size={16} /> Productos</Link>
          <button className="admin-nav-create" type="button" onClick={newProduct}><Plus size={16} /> Nuevo producto</button>
        </nav>
        <div className="admin-header-actions">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> Ver sitio</a>
          <button type="button" onClick={signOut}><LogOut size={16} /> Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
}
