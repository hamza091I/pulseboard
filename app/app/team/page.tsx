/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users } from "lucide-react";
import { getCurrentWorkspace } from "@/lib/workspace";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";
export default async function TeamPage() {
  const { supabase, workspace } = await getCurrentWorkspace();
  const { data: members } = await supabase
    .from("workspace_members")
    .select("id, user_id, role, joined_at, profiles(full_name)")
    .eq("workspace_id", workspace.id)
    .order("joined_at");
  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        eyebrow="People"
        title="Team"
        description="See who has access to this workspace and how responsibility is distributed."
        action={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500">
            <Users className="h-4 w-4" />
            Invitations next
          </span>
        }
      />
      <div className="mt-8">
        {members?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member: any) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5"
                key={member.id}
              >
                <div>
                  <p className="font-semibold text-ink">
                    {member.profiles?.full_name || "Workspace member"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge tone={member.role === "owner" ? "violet" : "slate"}>
                  {member.role}
                </StatusBadge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No team members yet"
            description="The workspace owner will be able to invite teammates here."
          />
        )}
      </div>
    </div>
  );
}
