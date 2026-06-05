create extension if not exists "pgcrypto";

create type content_status as enum ('Pendiente', 'Revisada', 'Contactada', 'Publicada', 'Descartada');
create type app_role as enum ('Administrador', 'Editor', 'Usuario');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role app_role not null default 'Usuario',
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  short_description text not null,
  story text not null,
  founder_name text,
  start_year integer,
  location text,
  whatsapp text,
  instagram text,
  facebook text,
  website text,
  featured boolean not null default false,
  published boolean not null default false,
  main_image text,
  gallery text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text not null,
  category text not null,
  cover_image text,
  excerpt text,
  content text not null,
  reading_time integer,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  guest_name text,
  category text,
  summary text,
  spotify_url text,
  youtube_url text,
  image_url text,
  highlights text[] not null default '{}',
  project_id uuid references projects(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  date date not null,
  time time,
  location text,
  organizer text,
  category text,
  description text,
  image_url text,
  whatsapp text,
  external_link text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists indicators (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value text not null,
  category text not null,
  description text,
  source text,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  status content_status not null default 'Pendiente',
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  recommender_name text not null,
  email text not null,
  phone text,
  recommended_name text not null,
  category text not null,
  story text not null,
  instagram text,
  whatsapp text,
  status content_status not null default 'Pendiente',
  created_at timestamptz not null default now()
);

alter table projects add column if not exists published boolean not null default false;
alter table stories add column if not exists published boolean not null default false;
alter table podcast_episodes add column if not exists published boolean not null default false;
alter table events add column if not exists published boolean not null default false;
alter table indicators add column if not exists published boolean not null default false;

alter table profiles enable row level security;
alter table projects enable row level security;
alter table stories enable row level security;
alter table podcast_episodes enable row level security;
alter table events enable row level security;
alter table indicators enable row level security;
alter table opportunities enable row level security;
alter table recommendations enable row level security;

create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Public read projects" on projects for select using (published = true);
create policy "Public read stories" on stories for select using (published = true);
create policy "Public read podcast" on podcast_episodes for select using (published = true);
create policy "Public read events" on events for select using (published = true);
create policy "Public read indicators" on indicators for select using (published = true);
create policy "Public read published opportunities" on opportunities for select using (status = 'Publicada');
create policy "Public insert recommendations" on recommendations for insert with check (status = 'Pendiente');

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('Administrador', 'Editor')
  );
$$;

create policy "Editors manage projects" on projects for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage stories" on stories for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage podcast" on podcast_episodes for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage events" on events for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage indicators" on indicators for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage opportunities" on opportunities for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors manage recommendations" on recommendations for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());


create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null unique,
  public_url text not null,
  bucket text not null default 'media',
  type text,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists site_home (
  id uuid primary key default gen_random_uuid(),
  hero_title text not null default 'HECHO EN LA DORADA',
  hero_subtitle text not null default 'Historias, personas y proyectos que construyen nuestra ciudad.',
  hero_badge text default 'Plataforma editorial comunitaria',
  hero_quote text default 'Aquí están pasando cosas buenas.',
  hero_image text,
  hero_cta_primary text default 'Explorar historias',
  hero_cta_primary_url text default '/historias',
  hero_cta_secondary text default 'Descubrir proyectos',
  hero_cta_secondary_url text default '/hecho-en-la-dorada',
  updated_at timestamptz not null default now()
);

alter table media_assets enable row level security;
alter table site_home enable row level security;

create policy "Public read media assets" on media_assets for select using (true);
create policy "Editors manage media assets" on media_assets for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Public read site home" on site_home for select using (true);
create policy "Editors manage site home" on site_home for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "Public read media storage" on storage.objects for select using (bucket_id = 'media');
create policy "Editors upload media storage" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin_or_editor());
create policy "Editors update media storage" on storage.objects for update using (bucket_id = 'media' and public.is_admin_or_editor()) with check (bucket_id = 'media' and public.is_admin_or_editor());
create policy "Editors delete media storage" on storage.objects for delete using (bucket_id = 'media' and public.is_admin_or_editor());
