export type DatabaseRow = {
  id: string;
  created_at: string;
  updated_at?: string;
};

export type ClientRow = DatabaseRow & {
  workspace_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: "lead" | "active" | "inactive";
  notes: string | null;
};

export type ProjectRow = DatabaseRow & {
  workspace_id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  status: "planning" | "active" | "on_hold" | "completed";
  priority: "low" | "medium" | "high";
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
  created_by: string;
};

export type TaskRow = DatabaseRow & {
  workspace_id: string;
  project_id: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
};

export type ActivityLogRow = DatabaseRow & {
  workspace_id: string;
  user_id: string;
  entity_type: "client" | "project" | "task" | "member" | "workspace";
  entity_id: string | null;
  action: "created" | "updated" | "deleted" | "status_changed" | "invited";
  description: string;
};
