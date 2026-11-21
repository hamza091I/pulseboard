import { createClient } from "@/lib/supabase/client";

export async function getCurrentUserWorkspace() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(`Supabase auth lookup failed: ${userError.message}`);
  if (!user) return null;

  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("id, workspace_id, user_id, role, joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .limit(1);

  if (membershipError) {
    throw new Error(`Workspace membership lookup failed: ${membershipError.message}`);
  }

  const membership = memberships?.[0];
  if (!membership) return null;

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug, created_by, created_at")
    .eq("id", membership.workspace_id)
    .maybeSingle();

  if (workspaceError) throw new Error(`Workspace lookup failed: ${workspaceError.message}`);
  if (!workspace) {
    throw new Error(
      `Membership ${membership.id} points to workspace ${membership.workspace_id}, but that workspace was not returned. Check Supabase RLS policies and that the workspace still exists.`,
    );
  }

  return { supabase, user, membership, workspace };
}
