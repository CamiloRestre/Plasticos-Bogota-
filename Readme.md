# Plásticos Bogotá

Catálogo web responsive para descubrir productos plásticos y enviar solicitudes de cotización por WhatsApp.

## Estructura

```text
app/                 Rutas App Router, layout, estilos globales y providers
components/          Header, footer y navegador interactivo del catálogo
lib/                 Tipos, datos locales, utilidades y clientes Supabase
public/img/           Assets servidos por Next.js
supabase/             Schema y seed ejecutables en Supabase
docs/catalogo/        PDFs de referencia del catálogo original
```

## Ejecutar localmente

```bash
npm install
npm run dev
```

La vista pública funciona con datos locales para que el proyecto pueda previsualizarse sin credenciales. Copia `.env.local.example` a `.env.local` para preparar la conexión de Supabase.

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta [`supabase/schema.sql`](./supabase/schema.sql) en el SQL Editor.
3. Ejecuta [`supabase/seed.sql`](./supabase/seed.sql).
4. Configura `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.

Las imágenes semilla permanecen en [`public/img/`](./public/img). El bucket público `productos` está incluido en el schema para futuras cargas administradas.

## Rutas

- `/` — entrada y propuesta de valor.
- `/catalogo` — búsqueda, categorías, detalle de variantes y cotización.
- `/nosotros` — historia y forma de servir.
- `/contacto` — canales de atención.
- `/admin` — resumen inicial para el equipo.

## Deploy en Render

Usa un servicio web Node con:

- Build command: `npm install && npm run build`
- Start command: `npm start`

El proyecto genera una build de Next.js 14 y es compatible con `next start`.
