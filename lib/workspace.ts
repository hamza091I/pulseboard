import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug, created_by, created_at)")
    .eq("user_id", user.id)
    .limit(1);

  const membership = memberships?.[0];
  const workspace = Array.isArray(membership?.workspaces)
    ? membership.workspaces[0]
    : membership?.workspaces;
  if (!membership || !workspace) redirect("/onboarding");
  return {
    supabase,
    user,
    membership: { ...membership, role: membership.role as "owner" | "admin" | "member" },
    workspace,
  };
}
