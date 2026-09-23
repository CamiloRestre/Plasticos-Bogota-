create extension if not exists "pgcrypto";

create table if not exists categorias (id uuid primary key default gen_random_uuid(), nombre text not null unique, slug text not null unique, descripcion text, icono text, orden int default 0, created_at timestamptz default now());
create table if not exists productos (id uuid primary key default gen_random_uuid(), categoria_id uuid references categorias(id) on delete set null, nombre text not null, descripcion text, slug text unique, activo boolean default true, destacado boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists variantes (id uuid primary key default gen_random_uuid(), producto_id uuid references productos(id) on delete cascade, medida text, calibre text, presentacion text, precio_bulto numeric, precio_unidad numeric, precio_kilo numeric, unidad text default 'COP', stock int default 0, orden int default 0);
create table if not exists imagenes (id uuid primary key default gen_random_uuid(), producto_id uuid references productos(id) on delete cascade, url text not null, alt text, es_principal boolean default false, orden int default 0);
create table if not exists ofertas (id uuid primary key default gen_random_uuid(), titulo text not null, descripcion text, descuento_pct int, producto_id uuid references productos(id) on delete cascade, fecha_inicio timestamptz, fecha_fin timestamptz, activa boolean default true);

create or replace function set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists productos_updated_at on productos;
create trigger productos_updated_at before update on productos for each row execute function set_updated_at();

alter table categorias enable row level security;
alter table productos enable row level security;
alter table variantes enable row level security;
alter table imagenes enable row level security;
alter table ofertas enable row level security;
create policy "public active categories" on categorias for select using (true);
create policy "public active products" on productos for select using (activo = true);
create policy "public product variants" on variantes for select using (exists (select 1 from productos p where p.id = producto_id and p.activo = true));
create policy "public product images" on imagenes for select using (exists (select 1 from productos p where p.id = producto_id and p.activo = true));
create policy "public active offers" on ofertas for select using (activa = true);
create policy "authenticated writes categories" on categorias for all to authenticated using (true) with check (true);
create policy "authenticated writes products" on productos for all to authenticated using (true) with check (true);
create policy "authenticated writes variants" on variantes for all to authenticated using (true) with check (true);
create policy "authenticated writes images" on imagenes for all to authenticated using (true) with check (true);
create policy "authenticated writes offers" on ofertas for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('productos', 'productos', true) on conflict (id) do nothing;
create policy "public product media" on storage.objects for select using (bucket_id = 'productos');
create policy "authenticated product media insert" on storage.objects for insert to authenticated with check (bucket_id = 'productos');
create policy "authenticated product media update" on storage.objects for update to authenticated using (bucket_id = 'productos');
create policy "authenticated product media delete" on storage.objects for delete to authenticated using (bucket_id = 'productos');
