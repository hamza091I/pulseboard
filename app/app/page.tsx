import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, FolderKanban, ListTodo, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AppDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name)")
    .eq("user_id", user.id)
    .limit(1);

  const membership = memberships?.[0];
  const workspace = Array.isArray(membership?.workspaces)
    ? membership.workspaces[0]
    : membership?.workspaces;

  if (!membership || !workspace) redirect("/onboarding");

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 border-r border-slate-200/80 bg-white p-5 lg:block">
          <div className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-xs font-bold text-white">
              PB
            </span>
            PulseBoard
          </div>
          <div className="mt-10">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>
            <div className="mt-3 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700">
              Overview
            </div>
            <div className="px-3 py-2.5 text-sm text-slate-500">Clients</div>
            <div className="px-3 py-2.5 text-sm text-slate-500">Projects</div>
            <div className="px-3 py-2.5 text-sm text-slate-500">Tasks</div>
          </div>
          <div className="mt-9">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Manage
            </p>
            <div className="mt-3 px-3 py-2.5 text-sm text-slate-500">Team</div>
            <div className="px-3 py-2.5 text-sm text-slate-500">Activity</div>
            <div className="px-3 py-2.5 text-sm text-slate-500">Settings</div>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-5 lg:px-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Workspace
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight">{workspace.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">{user.email}</span>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {(user.user_metadata?.full_name || user.email || "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
          </header>
          <div className="p-6 lg:p-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-600">
                  Your operations overview
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  Good morning, {user.user_metadata?.full_name?.split(" ")[0] || "there"}.
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-slate-500">
                  Your workspace is ready. We’ll add clients, projects, tasks, and live metrics in
                  the next phase.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Workspace active
              </span>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              <Stat icon={<Users />} label="Members" value="1" />
              <Stat icon={<FolderKanban />} label="Projects" value="0" />
              <Stat icon={<ListTodo />} label="Open tasks" value="0" />
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">Phase 1 foundation is live</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Authentication, protected routing, profile creation, workspace onboarding, and
                    workspace membership are now connected. The next step is the real operations
                    data model.
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-brand-600" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
