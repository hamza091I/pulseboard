import { createClient } from "@/lib/supabase/client";

export async function getCurrentUserWorkspace() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug, created_by, created_at)")
    .eq("user_id", user.id)
    .limit(1);
  const membership = memberships?.[0];
  const workspace = Array.isArray(membership?.workspaces)
    ? membership.workspaces[0]
    : membership?.workspaces;
  return membership && workspace ? { supabase, user, membership, workspace } : null;
}
