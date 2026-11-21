-- PulseBoard Phase 1: profiles, workspaces, memberships, and secure onboarding.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update set full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_workspace_id uuid;
  workspace_slug text;
  base_slug text;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then raise exception 'You must be signed in.'; end if;
  if char_length(trim(workspace_name)) < 2 then raise exception 'Workspace name must be at least 2 characters.'; end if;

  base_slug := regexp_replace(lower(trim(workspace_name)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then base_slug := 'workspace'; end if;
  workspace_slug := base_slug || '-' || substring(replace(current_user_id::text, '-', '') from 1 for 8);

  insert into public.workspaces (name, slug, created_by)
  values (trim(workspace_name), workspace_slug, current_user_id)
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, current_user_id, 'owner');

  return new_workspace_id;
end;
$$;

grant execute on function public.create_workspace(text) to authenticated;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.workspace_members where workspace_id = target_workspace_id and user_id = auth.uid());
$$;

create or replace function public.workspace_role(target_workspace_id uuid)
returns text
language sql
stable
security definer set search_path = public
as $$
  select role from public.workspace_members where workspace_id = target_workspace_id and user_id = auth.uid() limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

drop policy if exists "profiles are visible to the owner" on public.profiles;
create policy "profiles are visible to the owner" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "profiles can be updated by the owner" on public.profiles;
create policy "profiles can be updated by the owner" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "members can view their workspaces" on public.workspaces;
create policy "members can view their workspaces" on public.workspaces for select to authenticated using (public.is_workspace_member(id));

drop policy if exists "members can view workspace members" on public.workspace_members;
create policy "members can view workspace members" on public.workspace_members for select to authenticated using (public.is_workspace_member(workspace_id));

drop policy if exists "owners can manage workspace members" on public.workspace_members;
create policy "owners can manage workspace members" on public.workspace_members for insert to authenticated with check (public.workspace_role(workspace_id) in ('owner', 'admin'));

drop policy if exists "owners can update workspace members" on public.workspace_members;
create policy "owners can update workspace members" on public.workspace_members for update to authenticated using (public.workspace_role(workspace_id) = 'owner') with check (public.workspace_role(workspace_id) = 'owner');

drop policy if exists "owners can delete workspace members" on public.workspace_members;
create policy "owners can delete workspace members" on public.workspace_members for delete to authenticated using (public.workspace_role(workspace_id) = 'owner');
