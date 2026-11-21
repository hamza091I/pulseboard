import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AIBrief } from "@/components/ai-brief";
import { getCurrentWorkspace } from "@/lib/workspace";
import { StatusBadge } from "@/components/ui";
import { DemoSeedButton } from "@/components/demo-seed-button";
import { formatDate, formatDateTime, humanizeStatus } from "@/lib/format";

export default async function AppDashboard() {
  const { supabase, user, workspace } = await getCurrentWorkspace();
  const [
    { count: clientCount },
    { count: projectCount },
    { count: taskCount },
    { count: overdueCount },
    { data: activity },
    { data: projects },
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .neq("status", "completed"),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .neq("status", "done"),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .neq("status", "done")
      .lt("due_date", new Date().toISOString().slice(0, 10)),
    supabase
      .from("activity_logs")
      .select("id, description, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("projects")
      .select("id, name, status, priority, due_date")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";
  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Your operations overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Good morning, {firstName}.
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            A live readout of the work moving through {workspace.name}.
          </p>
        </div>
        <DemoSeedButton />
      </div>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Users />}
          label="Clients"
          value={clientCount || 0}
          href="/app/clients"
          tone="violet"
        />
        <Stat
          icon={<FolderKanban />}
          label="Active projects"
          value={projectCount || 0}
          href="/app/projects"
          tone="cyan"
        />
        <Stat
          icon={<ListTodo />}
          label="Open tasks"
          value={taskCount || 0}
          href="/app/tasks"
          tone="green"
        />
        <Stat
          icon={<AlertTriangle />}
          label="Overdue"
          value={overdueCount || 0}
          href="/app/tasks"
          tone="amber"
        />
      </div>
      <div className="mt-6">
        <AIBrief />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Project momentum</p>
              <p className="mt-1 text-xs text-slate-400">Your latest delivery work</p>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600"
              href="/app/projects"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {projects?.length ? (
            <div className="mt-5 space-y-3">
              {projects.map((project) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
                  key={project.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{project.name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {project.due_date ? `Due ${formatDate(project.due_date)}` : "No due date"}
                    </p>
                  </div>
                  <StatusBadge
                    tone={
                      project.status === "active"
                        ? "green"
                        : project.priority === "high"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {humanizeStatus(project.status)}
                  </StatusBadge>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              Create a project or load demo data to see momentum here.
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Recent activity</p>
              <p className="mt-1 text-xs text-slate-400">What changed lately</p>
            </div>
            <Link className="text-xs font-semibold text-brand-600" href="/app/activity">
              View all
            </Link>
          </div>
          {activity?.length ? (
            <div className="mt-5 space-y-4">
              {activity.map((event) => (
                <div className="flex gap-3" key={event.id}>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm text-slate-600">{event.description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              Activity will appear as your team works.
            </div>
          )}
        </section>
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Workspace data is isolated with Row
        Level Security.
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
  tone: "violet" | "cyan" | "green" | "amber";
}) {
  const colors = {
    violet: "bg-brand-50 text-brand-600",
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Link
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
      href={href}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${colors[tone]}`}>{icon}</div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </Link>
  );
}
