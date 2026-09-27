export type ProductInput = {
  nombre: string;
  descripcion?: string | null;
  slug?: string | null;
  categoria_id?: string | null;
  activo?: boolean;
  destacado?: boolean;
};

export type VariantInput = {
  id?: string;
  producto_id?: string;
  medida?: string | null;
  calibre?: string | null;
  presentacion?: string | null;
  precio_bulto?: number | null;
  precio_unidad?: number | null;
  precio_kilo?: number | null;
  unidad?: string | null;
  stock?: number;
  orden?: number;
  cantidad_unidades?: number | null;
};
