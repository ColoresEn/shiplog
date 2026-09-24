-- shiplog schema: projects and weekly entries

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  repo_url text,
  created_at timestamptz not null default now(),
  unique (owner_id, slug)
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  week_start date not null,
  title text not null,
  body text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists entries_week_start_idx on public.entries (week_start desc);
create index if not exists entries_project_idx on public.entries (project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.entries enable row level security;

drop policy if exists "projects are public" on public.projects;
create policy "projects are public"
  on public.projects for select
  using (true);

drop policy if exists "owner manages projects" on public.projects;
create policy "owner manages projects"
  on public.projects for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "published entries are public" on public.entries;
create policy "published entries are public"
  on public.entries for select
  using (published or auth.uid() = owner_id);

drop policy if exists "owner manages entries" on public.entries;
create policy "owner manages entries"
  on public.entries for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
