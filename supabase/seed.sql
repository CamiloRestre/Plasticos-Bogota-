insert into categorias (nombre, slug, orden) values
('Bolsas Basureras','bolsas-basureras',1), ('Precorte','precorte',2), ('Maniguetas','maniguetas',3),
('Bolsas Estándar','bolsas-estandar',4), ('Nylon','nylon',5), ('Transparente Alta','transparente-alta',6),
('Bolsas Herméticas','bolsas-hermeticas',7) on conflict (slug) do nothing;

insert into productos (nombre, slug, descripcion, destacado, categoria_id)
select 'Bolsa basurera negra','bolsa-basurera-negra','Opciones industriales y de uso general.',true,id from categorias where slug='bolsas-basureras'
on conflict (slug) do nothing;
insert into productos (nombre, slug, descripcion, categoria_id)
select 'Rollo precorte','rollo-precorte','Presentaciones Bio y Alta.',id from categorias where slug='precorte'
on conflict (slug) do nothing;
insert into productos (nombre, slug, descripcion, categoria_id)
select 'Bolsa hermética','bolsa-hermetica','Cierre práctico para organizar y proteger.',id from categorias where slug='bolsas-hermeticas'
on conflict (slug) do nothing;
insert into productos (nombre, slug, descripcion, categoria_id)
select 'Bolsa manigueta','bolsa-manigueta','Soluciones resistentes para transportar.',id from categorias where slug='maniguetas'
on conflict (slug) do nothing;
insert into productos (nombre, slug, descripcion, categoria_id)
select 'Bolsa nylon','bolsa-nylon','Diferentes medidas para empaque.',id from categorias where slug='nylon'
on conflict (slug) do nothing;
insert into productos (nombre, slug, descripcion, categoria_id)
select 'Transparente alta','transparente-alta','Canastillas y empaques transparentes.',id from categorias where slug='transparente-alta'
on conflict (slug) do nothing;

insert into variantes (producto_id, medida, calibre, presentacion, precio_bulto, unidad)
select id, '65x90', '0,8', 'Bulto x 50 paquetes', 65900, 'COP' from productos where slug='bolsa-basurera-negra'
and not exists (select 1 from variantes v where v.producto_id=productos.id);
insert into variantes (producto_id, medida, presentacion, precio_kilo, unidad)
select id, 'Por confirmar', 'Bio o Alta', 7500, 'COP' from productos where slug='rollo-precorte'
and not exists (select 1 from variantes v where v.producto_id=productos.id);
