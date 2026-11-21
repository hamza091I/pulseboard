/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { RecordForm } from "@/components/record-form";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";
import { getCurrentUserWorkspace } from "@/lib/client-workspace";
export default function ProjectsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [ctx, setCtx] = useState<any>(null);
  async function load() {
    const context = await getCurrentUserWorkspace();
    setCtx(context);
    if (context) {
      const { data } = await context.supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("workspace_id", context.workspace.id)
        .order("created_at", { ascending: false });
      setRows(data || []);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        eyebrow="Delivery"
        title="Projects"
        description="Track the work that turns client relationships into delivered outcomes."
        action={
          ctx ? (
            <RecordForm
              kind="project"
              workspaceId={ctx.workspace.id}
              userId={ctx.user.id}
              onDoneAction={load}
            />
          ) : null
        }
      />
      <div className="mt-8">
        {rows.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <article
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                key={row.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-ink">{row.name}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {row.clients?.name || "No client linked"}
                    </p>
                  </div>
                  <StatusBadge
                    tone={
                      row.status === "active"
                        ? "green"
                        : row.status === "completed"
                          ? "violet"
                          : "slate"
                    }
                  >
                    {row.status.replaceAll("_", " ")}
                  </StatusBadge>
                </div>
                <p className="mt-5 min-h-12 text-sm leading-6 text-slate-500">
                  {row.description || "No description added yet."}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span className="capitalize">{row.priority} priority</span>
                  <span>{row.due_date ? `Due ${row.due_date}` : "No due date"}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects yet"
            description="Create a project to give your client work a clear home."
          />
        )}
      </div>
    </div>
  );
}
