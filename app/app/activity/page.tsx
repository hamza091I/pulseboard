import { getCurrentWorkspace } from "@/lib/workspace";
import { EmptyState, PageHeader } from "@/components/ui";
import { ActivityFilters } from "@/components/activity-filters";
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
          <ActivityFilters events={events} />
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
