import { getCurrentWorkspace } from "@/lib/workspace";
import { PageHeader } from "@/components/ui";
export default async function SettingsPage() {
  const { workspace, membership } = await getCurrentWorkspace();
  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Review the workspace identity and the access level of your current account."
      />
      <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace name
            </p>
            <p className="mt-2 font-semibold text-ink">{workspace.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace slug
            </p>
            <p className="mt-2 font-mono text-sm text-slate-600">{workspace.slug}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your role
            </p>
            <p className="mt-2 font-semibold capitalize text-brand-700">{membership.role}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Created</p>
            <p className="mt-2 text-sm text-slate-600">
              {new Date(workspace.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
