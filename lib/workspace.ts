import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceRole = "owner" | "admin" | "member";

export class WorkspaceLookupError extends Error {
  readonly code?: string;
  readonly details?: string;
  readonly hint?: string;

  constructor(
    message: string,
    context?: { code?: string; details?: string | null; hint?: string | null },
  ) {
    super(message);
    this.name = "WorkspaceLookupError";
    this.code = context?.code;
    this.details = context?.details || undefined;
    this.hint = context?.hint || undefined;
  }
}

function throwQueryError(
  label: string,
  error: { message: string; code?: string; details?: string | null; hint?: string | null },
): never {
  throw new WorkspaceLookupError(`${label} failed: ${error.message}`, error);
}

export async function getCurrentWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throwQueryError("Supabase auth lookup", userError);
  if (!user) redirect("/login");

  // Keep this query independent from the workspace lookup. Nested relation
  // selects can return null/arrays or hide an RLS/relationship error.
  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("id, workspace_id, user_id, role, joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .limit(1);

  if (membershipError) throwQueryError("Workspace membership lookup", membershipError);

  const membership = memberships?.[0];
  if (!membership) redirect("/onboarding?reason=no-membership");

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug, created_by, created_at")
    .eq("id", membership.workspace_id)
    .maybeSingle();

  if (workspaceError) throwQueryError("Workspace lookup", workspaceError);
  if (!workspace) {
    throw new WorkspaceLookupError(
      `Membership ${membership.id} points to workspace ${membership.workspace_id}, but that workspace was not returned. Check Supabase RLS policies and that the workspace still exists.`,
    );
  }

  return {
    supabase,
    user,
    membership: {
      ...membership,
      role: membership.role as WorkspaceRole,
    },
    workspace,
  };
}
