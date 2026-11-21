export type Role = "owner" | "admin" | "member";
export type ClientStatus = "lead" | "active" | "inactive";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
};
export type Client = {
  id: string;
  workspace_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
export type Project = {
  id: string;
  workspace_id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  clients?: { name: string } | null;
};
export type Task = {
  id: string;
  workspace_id: string;
  project_id: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  projects?: { name: string } | null;
};
export type ActivityLog = {
  id: string;
  workspace_id: string;
  user_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};
