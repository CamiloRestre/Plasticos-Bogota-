import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const urlDiagnostico = url ? {
    valor: url,
    longitud: url.length,
    bytes: Array.from(new TextEncoder().encode(url)),
    tieneEspacioInicial: url.startsWith(" ") || url.startsWith("\t"),
    tieneEspacioFinal: url.endsWith(" ") || url.endsWith("\t") || url.endsWith("\n"),
    tieneSlashFinal: url.endsWith("/"),
  } : null;

  let fetchResult = "no intentado";
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/categorias?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      const data = await res.json();
      fetchResult = `Status: ${res.status} | Data: ${JSON.stringify(data).slice(0, 200)}`;
    } catch (e: unknown) {
      const error = e as Error & { cause?: { message?: string; code?: string } };
      fetchResult = `Error: ${error.message} | Causa: ${error.cause?.message ?? "desconocida"} | Codigo: ${error.cause?.code ?? "sin codigo"}`;
    }
  }

  return NextResponse.json({
    urlDiagnostico,
    keyPrefix: key?.slice(0, 25),
    keyLength: key?.length,
    fetchResult,
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
  });
}
