/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";
import { getCurrentUserWorkspace } from "@/lib/client-workspace";
export default function TasksPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [ctx, setCtx] = useState<any>(null);
  async function load() {
    const context = await getCurrentUserWorkspace();
    setCtx(context);
    if (context) {
      const { data } = await context.supabase
        .from("tasks")
        .select("*, projects(name)")
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
        eyebrow="Execution"
        title="Tasks"
        description="Make the next action explicit, assignable, and easy to move through the workflow."
        action={
          ctx ? (
            <span className="text-xs text-slate-400">
              Create tasks from a project in the next iteration.
            </span>
          ) : null
        }
      />
      <div className="mt-8">
        {rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <div className="divide-y divide-slate-100">
              {rows.map((row) => (
                <div
                  className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  key={row.id}
                >
                  <div>
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{row.projects?.name || "Project"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      tone={
                        row.status === "done"
                          ? "green"
                          : row.status === "review"
                            ? "violet"
                            : row.priority === "high"
                              ? "red"
                              : "amber"
                      }
                    >
                      {row.status.replaceAll("_", " ")}
                    </StatusBadge>
                    <span className="text-xs text-slate-400">{row.due_date || "No due date"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No tasks yet"
            description="Tasks will appear here as you break projects into accountable next steps."
          />
        )}
      </div>
    </div>
  );
}
