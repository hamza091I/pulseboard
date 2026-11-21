-- PulseBoard Phase 2: operational data model and workspace-scoped RLS.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  company text,
  email text,
  phone text,
  status text not null default 'lead' check (status in ('lead', 'active', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null check (char_length(trim(name)) between 2 and 140),
  description text,
  status text not null default 'planning' check (status in ('planning', 'active', 'on_hold', 'completed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  budget numeric(12,2),
  start_date date,
  due_date date,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null check (char_length(trim(title)) between 2 and 180),
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('client', 'project', 'task', 'member', 'workspace')),
  entity_id uuid,
  action text not null check (action in ('created', 'updated', 'deleted', 'status_changed', 'invited')),
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists clients_workspace_id_idx on public.clients(workspace_id);
create index if not exists projects_workspace_id_idx on public.projects(workspace_id);
create index if not exists tasks_workspace_id_idx on public.tasks(workspace_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists activity_logs_workspace_id_idx on public.activity_logs(workspace_id);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists clients_touch_updated_at on public.clients;
create trigger clients_touch_updated_at before update on public.clients for each row execute procedure public.touch_updated_at();
drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects for each row execute procedure public.touch_updated_at();
drop trigger if exists tasks_touch_updated_at on public.tasks;
create trigger tasks_touch_updated_at before update on public.tasks for each row execute procedure public.touch_updated_at();

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_logs enable row level security;

create policy "workspace members can view clients" on public.clients for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "workspace members can create clients" on public.clients for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy "workspace admins can update clients" on public.clients for update to authenticated using (public.workspace_role(workspace_id) in ('owner', 'admin')) with check (public.is_workspace_member(workspace_id));
create policy "workspace admins can delete clients" on public.clients for delete to authenticated using (public.workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace members can view projects" on public.projects for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "workspace members can create projects" on public.projects for insert to authenticated with check (public.is_workspace_member(workspace_id) and created_by = auth.uid());
create policy "workspace admins can update projects" on public.projects for update to authenticated using (public.workspace_role(workspace_id) in ('owner', 'admin')) with check (public.is_workspace_member(workspace_id));
create policy "workspace admins can delete projects" on public.projects for delete to authenticated using (public.workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace members can view tasks" on public.tasks for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "workspace members can create tasks" on public.tasks for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy "workspace members can update tasks" on public.tasks for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "workspace admins can delete tasks" on public.tasks for delete to authenticated using (public.workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace members can view activity" on public.activity_logs for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "workspace members can create activity" on public.activity_logs for insert to authenticated with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
