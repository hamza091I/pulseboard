/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { RecordForm } from "@/components/record-form";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";
import { getCurrentUserWorkspace } from "@/lib/client-workspace";
import { formatDate } from "@/lib/format";

export default function ClientsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [ctx, setCtx] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  async function load() {
    const context = await getCurrentUserWorkspace();
    setCtx(context);
    if (context) {
      const { data } = await context.supabase
        .from("clients")
        .select("*")
        .eq("workspace_id", context.workspace.id)
        .order("created_at", { ascending: false });
      setRows(data || []);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const filtered = rows.filter(
    (row) =>
      `${row.name} ${row.company || ""}`.toLowerCase().includes(query.toLowerCase()) &&
      (status === "all" || row.status === status),
  );
  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        eyebrow="Relationships"
        title="Clients"
        description="Keep every client relationship visible and connected to the work behind it."
        action={
          ctx ? (
            <RecordForm
              kind="client"
              workspaceId={ctx.workspace.id}
              userId={ctx.user.id}
              onDoneAction={load}
            />
          ) : null
        }
      />
      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            value={query}
          />
          <select
            aria-label="Filter clients by status"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="all">All statuses</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {filtered.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr className="border-b border-slate-100 last:border-0" key={row.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink">{row.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{row.company || "Independent"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{row.email || "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        tone={
                          row.status === "active"
                            ? "green"
                            : row.status === "inactive"
                              ? "slate"
                              : "amber"
                        }
                      >
                        {row.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No clients yet"
            description="Add your first client to start building a connected operations workspace."
          />
        )}
      </div>
    </div>
  );
}
