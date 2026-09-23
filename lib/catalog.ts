export type Variant = {
  id: string;
  measure: string;
  gauge?: string;
  presentation: string;
  price: number;
  unit: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  featured: boolean;
  variants: Variant[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export function formatCop(value: number) {
  return value ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value) : "Consultar";
}

export function toProduct(
  product: {
    id: string;
    nombre: string;
    slug: string | null;
    descripcion: string | null;
    destacado: boolean | null;
    categoria_id: string | null;
  },
  category: Category | undefined,
  variants: Array<{
    id: string;
    medida: string | null;
    calibre: string | null;
    presentacion: string | null;
    precio_bulto: number | null;
    precio_unidad: number | null;
    precio_kilo: number | null;
    unidad: string | null;
  }>,
  images: Array<{ url: string; alt: string | null; es_principal: boolean | null; orden: number | null }>,
): Product {
  const primaryImage = [...images].sort((a, b) => Number(Boolean(b.es_principal)) - Number(Boolean(a.es_principal)) || (a.orden ?? 0) - (b.orden ?? 0))[0];

  return {
    id: product.id,
    name: product.nombre,
    category: category?.name ?? "Sin categoría",
    description: product.descripcion ?? "Consulta disponibilidad y presentación con nuestro equipo.",
    image: primaryImage?.url ?? null,
    featured: Boolean(product.destacado),
    variants: variants.map((variant) => ({
      id: variant.id,
      measure: variant.medida ?? "Por confirmar",
      gauge: variant.calibre ?? undefined,
      presentation: variant.presentacion ?? "Consulta disponibilidad",
      price: variant.precio_bulto ?? variant.precio_unidad ?? variant.precio_kilo ?? 0,
      unit: variant.unidad ?? "COP",
    })),
  };
}
