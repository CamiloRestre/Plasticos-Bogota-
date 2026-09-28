-- Catálogo canónico de Plásticos Bogotá.
-- Este archivo NO se ejecuta automáticamente.
-- Requiere revisar el diff contra Supabase antes de aplicarlo.
--
-- La fuente entregada define 8 familias de producto. El detalle recibido
-- contiene 56 filas de variante; se conserva ese detalle literal.
-- No se eliminan productos ajenos porque la fuente no incluye los 26
-- nombres individuales necesarios para distinguirlos con seguridad.

begin;

insert into categorias (nombre, slug, orden)
values
  ('Bolsas Basureras', 'bolsas-basureras', 1),
  ('Precorte', 'precorte', 2),
  ('Maniguetas', 'maniguetas', 3),
  ('Bolsas Plásticas Impresas', 'bolsas-plasticas-impresas', 4),
  ('Nylon', 'nylon', 5),
  ('Transparente Alta', 'transparente-alta', 6),
  ('Empaque Estándar', 'empaque-estandar', 7)
on conflict (slug) do update
set nombre = excluded.nombre,
    orden = excluded.orden;

insert into productos (nombre, slug, descripcion, categoria_id, activo, destacado)
select source.nombre, source.slug, source.descripcion, categorias.id, true, source.destacado
from (
  values
    ('Bolsa basurera negra', 'bolsa-basurera-negra', 'Bolsas basureras negras para diferentes necesidades.', 'bolsas-basureras', true),
    ('Bolsa basurera colores', 'bolsa-basurera-colores', 'Bolsas basureras en verde, rojo, azul, gris y blanco.', 'bolsas-basureras', false),
    ('Precorte', 'precorte', 'Rollos precortados para diferentes aplicaciones.', 'precorte', false),
    ('Manigueta', 'manigueta', 'Bolsas manigueta en diferentes capacidades y materiales.', 'maniguetas', true),
    ('Bolsas plásticas impresas', 'bolsas-plasticas-impresas', 'Bolsas plásticas impresas bajo cotización.', 'bolsas-plasticas-impresas', false),
    ('Nylon', 'nylon', 'Nylon en diferentes medidas.', 'nylon', false),
    ('Transparente alta', 'transparente-alta', 'Canastillas y empaques transparentes.', 'transparente-alta', false),
    ('Empaque estándar', 'empaque-estandar', 'Empaques estándar en diferentes medidas.', 'empaque-estandar', false)
) as source(nombre, slug, descripcion, categoria_slug, destacado)
join categorias on categorias.slug = source.categoria_slug
on conflict (slug) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    categoria_id = excluded.categoria_id,
    activo = true,
    destacado = excluded.destacado,
    updated_at = now();

-- Se reemplazan únicamente las variantes de las 8 familias canónicas.
-- Las variantes existentes de otros productos quedan intactas.
delete from variantes
where producto_id in (
  select id from productos where slug in (
    'bolsa-basurera-negra',
    'bolsa-basurera-colores',
    'precorte',
    'manigueta',
    'bolsas-plasticas-impresas',
    'nylon',
    'transparente-alta',
    'empaque-estandar'
  )
);

insert into variantes (producto_id, medida, calibre, presentacion, precio_bulto, precio_unidad, precio_kilo, unidad, orden)
select productos.id, v.medida, v.calibre, v.presentacion, v.precio_bulto, v.precio_unidad, v.precio_kilo, v.unidad, v.orden
from (
  values
    ('bolsa-basurera-negra', '65x90', '0,8', 'Bulto x 50 pqts', 85000::numeric, 1750::numeric, null::numeric, 'COP', 1),
    ('bolsa-basurera-negra', '50x80', '0,8', 'Bulto x 50 pqts', 92500::numeric, 2000::numeric, null::numeric, 'COP', 2),
    ('bolsa-basurera-negra', '65x90', '1,3', 'Bulto', 140000::numeric, 3000::numeric, null::numeric, 'COP', 3),
    ('bolsa-basurera-negra', '70x100', '1,3', 'Bulto', 180000::numeric, 3900::numeric, null::numeric, 'COP', 4),
    ('bolsa-basurera-negra', '90x110', '1,7', 'Bulto', 287500::numeric, 6200::numeric, null::numeric, 'COP', 5),
    ('bolsa-basurera-negra', '90x130', '1,8', 'Bulto', 410000::numeric, 8500::numeric, null::numeric, 'COP', 6),
    ('bolsa-basurera-negra', 'Por kilo', null, 'Venta por kilo', null::numeric, null::numeric, 8200::numeric, 'COP', 7),
    ('bolsa-basurera-colores', '40,64x50,8 (16"x20")', '0,8', 'Pqt x 10', null::numeric, 900::numeric, null::numeric, 'COP', 1),
    ('bolsa-basurera-colores', '50x76 (20"x30")', '0,8', 'Pqt x 10', null::numeric, 1550::numeric, null::numeric, 'COP', 2),
    ('bolsa-basurera-colores', '65x85', '0,8', 'Pqt x 10', null::numeric, 1950::numeric, null::numeric, 'COP', 3),
    ('bolsa-basurera-colores', '90x110', '1,5', 'Pqt x 10', null::numeric, 6800::numeric, null::numeric, 'COP', 4),
    ('bolsa-basurera-colores', '90x130', '1,5', 'Pqt x 10', null::numeric, 8000::numeric, null::numeric, 'COP', 5),
    ('precorte', 'Negro', null, 'Precio por kilo', null::numeric, null::numeric, 7500::numeric, 'COP', 1),
    ('precorte', 'Blanco alta', null, 'Precio por kilo', null::numeric, null::numeric, 9500::numeric, 'COP', 2),
    ('precorte', 'Transparente biodegradable', null, 'Precio por kilo', null::numeric, null::numeric, 14600::numeric, 'COP', 3),
    ('precorte', 'Transparente Fruver', null, 'Precio por kilo', null::numeric, null::numeric, 7800::numeric, 'COP', 4),
    ('manigueta', 'T15 · 1 1/2 kg', null, 'Caribe Bio', null::numeric, 28750::numeric, null::numeric, 'COP · IVA incluido', 1),
    ('manigueta', 'T15 · 1 1/2 kg', null, 'Nacional Bio', null::numeric, 26400::numeric, null::numeric, 'COP · IVA incluido', 2),
    ('manigueta', 'T19 · 2 kg', null, 'Caribe Bio', null::numeric, 33400::numeric, null::numeric, 'COP · IVA incluido', 3),
    ('manigueta', 'T19 · 2 kg', null, 'Bogotá Bio', null::numeric, 25000::numeric, null::numeric, 'COP · IVA incluido', 4),
    ('manigueta', 'T20 · 3 kg', null, 'Caribe Bio', null::numeric, 47800::numeric, null::numeric, 'COP · IVA incluido', 5),
    ('manigueta', 'T20 · 3 kg', null, 'Bogotá Bio', null::numeric, 29400::numeric, null::numeric, 'COP · IVA incluido', 6),
    ('manigueta', 'T25 · 5 kg', null, 'Caribe Bio', null::numeric, 70250::numeric, null::numeric, 'COP · IVA incluido', 7),
    ('manigueta', 'T25 · 5 kg', null, 'Bogotá Bio', null::numeric, 47400::numeric, null::numeric, 'COP · IVA incluido', 8),
    ('manigueta', 'T30 · 15 kg negra', null, 'Caribe Bio', null::numeric, 112900::numeric, null::numeric, 'COP · IVA incluido', 9),
    ('manigueta', 'T30 · 15 kg negra', null, 'Bogotá Bio', null::numeric, 60500::numeric, null::numeric, 'COP · IVA incluido', 10),
    ('manigueta', 'T30 · 15 kg blanca', null, 'Caribe Bio', null::numeric, 118400::numeric, null::numeric, 'COP · IVA incluido', 11),
    ('manigueta', 'T30 · 15 kg blanca', null, 'Bogotá Bio', null::numeric, 60500::numeric, null::numeric, 'COP · IVA incluido', 12),
    ('manigueta', 'T40 · 25 kg negra', null, 'Caribe Bio', null::numeric, 210400::numeric, null::numeric, 'COP · IVA incluido', 13),
    ('manigueta', 'T40 · 25 kg negra', null, 'Bogotá Bio', null::numeric, 128750::numeric, null::numeric, 'COP · IVA incluido', 14),
    ('manigueta', 'T40 · 25 kg blanca', null, 'Caribe Bio', null::numeric, 228250::numeric, null::numeric, 'COP · IVA incluido', 15),
    ('manigueta', 'T40 · 25 kg blanca', null, 'Bogotá Bio', null::numeric, 114100::numeric, null::numeric, 'COP · IVA incluido', 16),
    ('manigueta', 'T45 · 30 kg colores', null, 'Nacional Bio', null::numeric, 155000::numeric, null::numeric, 'COP · IVA incluido', 17),
    ('bolsas-plasticas-impresas', 'Por confirmar', null, 'Cotización', null::numeric, null::numeric, null::numeric, 'Consultar', 1),
    ('nylon', '15x20', null, 'Nylon', null::numeric, 152313::numeric, null::numeric, 'COP · IVA incluido', 1),
    ('nylon', '10x18', null, 'Nylon', null::numeric, 91438::numeric, null::numeric, 'COP · IVA incluido', 2),
    ('nylon', '18x25', null, 'Nylon', null::numeric, 228438::numeric, null::numeric, 'COP · IVA incluido', 3),
    ('nylon', '20x25', null, 'Nylon', null::numeric, 253750::numeric, null::numeric, 'COP · IVA incluido', 4),
    ('nylon', '20x30', null, 'Nylon', null::numeric, 304563::numeric, null::numeric, 'COP · IVA incluido', 5),
    ('nylon', '20x35', null, 'Nylon', null::numeric, 355438::numeric, null::numeric, 'COP · IVA incluido', 6),
    ('nylon', '25x35', null, 'Nylon', null::numeric, 444188::numeric, null::numeric, 'COP · IVA incluido', 7),
    ('nylon', '25x45', null, 'Nylon', null::numeric, 571188::numeric, null::numeric, 'COP · IVA incluido', 8),
    ('nylon', '32x42', null, 'Nylon', null::numeric, 682375::numeric, null::numeric, 'COP · IVA incluido', 9),
    ('nylon', '40x50', null, 'Nylon', null::numeric, 1015313::numeric, null::numeric, 'COP · IVA incluido', 10),
    ('transparente-alta', 'Canastilla grande 100x80', null, 'Pqt x 100', null::numeric, 42500::numeric, null::numeric, 'COP · IVA incluido', 1),
    ('transparente-alta', 'Canastilla estándar 100x60', null, 'Pqt x 100', null::numeric, 25507::numeric, null::numeric, 'COP · IVA incluido', 2),
    ('transparente-alta', 'Empaque 28x36 T.A.', '1,80', 'Unidad', null::numeric, 921::numeric, null::numeric, 'COP · IVA incluido', 3),
    ('transparente-alta', 'Canales 100x200 T.A.', '1,80', 'Pqt x 100', null::numeric, 138000::numeric, null::numeric, 'COP · IVA incluido', 4),
    ('empaque-estandar', '4x6', null, 'Empaque estándar', null::numeric, 11400::numeric, null::numeric, 'COP · IVA incluido', 1),
    ('empaque-estandar', '4x9', null, 'Empaque estándar', null::numeric, 13000::numeric, null::numeric, 'COP · IVA incluido', 2),
    ('empaque-estandar', '5x10', null, 'Empaque estándar', null::numeric, 18500::numeric, null::numeric, 'COP · IVA incluido', 3),
    ('empaque-estandar', '6x12', null, 'Empaque estándar', null::numeric, 27000::numeric, null::numeric, 'COP · IVA incluido', 4),
    ('empaque-estandar', '8x12', null, 'Empaque estándar', null::numeric, 35500::numeric, null::numeric, 'COP · IVA incluido', 5),
    ('empaque-estandar', '7x14', null, 'Empaque estándar', null::numeric, 36000::numeric, null::numeric, 'COP · IVA incluido', 6),
    ('empaque-estandar', '9x14', null, 'Empaque estándar', null::numeric, 46250::numeric, null::numeric, 'COP · IVA incluido', 7),
    ('empaque-estandar', '10x16', null, 'Empaque estándar', null::numeric, 53000::numeric, null::numeric, 'COP · IVA incluido', 8)
) as v(product_slug, medida, calibre, presentacion, precio_bulto, precio_unidad, precio_kilo, unidad, orden)
join productos on productos.slug = v.product_slug;

commit;
