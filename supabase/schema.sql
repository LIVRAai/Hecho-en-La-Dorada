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
  created_at timestamptz not null default now()
);

create table if not exists indicators (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value text not null,
  category text not null,
  description text,
  source text,
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

alter table projects enable row level security;
alter table stories enable row level security;
alter table podcast_episodes enable row level security;
alter table events enable row level security;
alter table indicators enable row level security;
alter table opportunities enable row level security;
alter table recommendations enable row level security;

create policy "Public read projects" on projects for select using (true);
create policy "Public read stories" on stories for select using (true);
create policy "Public read podcast" on podcast_episodes for select using (true);
create policy "Public read events" on events for select using (true);
create policy "Public read indicators" on indicators for select using (true);
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
