/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentWorkspace } from "@/lib/workspace";
import { EmptyState, PageHeader } from "@/components/ui";
export default async function ActivityPage() {
  const { supabase, workspace } = await getCurrentWorkspace();
  const { data: events } = await supabase
    .from("activity_logs")
    .select("*, profiles(full_name)")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(50);
  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        eyebrow="Visibility"
        title="Activity"
        description="A clear history of the changes that keep the workspace accountable."
      />
      <div className="mt-8">
        {events?.length ? (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            {events.map((event: any) => (
              <div className="flex gap-4 p-5" key={event.id}>
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-ink">
                      {event.profiles?.full_name || "A teammate"}
                    </span>{" "}
                    {event.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No activity yet"
            description="Important workspace actions will appear here as your team works."
          />
        )}
      </div>
    </div>
  );
}
