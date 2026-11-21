import type { SupabaseClient } from "@supabase/supabase-js";

export async function logActivity(
  supabase: SupabaseClient,
  workspaceId: string,
  userId: string,
  entityType: string,
  entityId: string | null,
  action: string,
  description: string,
) {
  return supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    description,
  });
}
