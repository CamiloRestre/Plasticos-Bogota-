"use client";

export default function CatalogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="section"><div className="shell empty-state"><p className="eyebrow">Catálogo no disponible</p><h1>No pudimos cargar los productos.</h1><p>Revisa la conexión de Supabase e inténtalo de nuevo.</p><button className="button primary" onClick={() => reset()}>Intentar de nuevo</button></div></main>;
}
