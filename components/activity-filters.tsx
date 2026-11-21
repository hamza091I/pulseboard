"use client";

import { useMemo, useState } from "react";
import { formatDateTime } from "@/lib/format";

type ActivityEvent = {
  id: string;
  description: string;
  entity_type: string;
  action: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};

export function ActivityFilters({ events }: { events: ActivityEvent[] }) {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("all");
  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          `${event.description} ${event.profiles?.full_name || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (action === "all" || event.action === action),
      ),
    [action, events, query],
  );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search activity"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search activity…"
          value={query}
        />
        <select
          aria-label="Filter activity by action"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          onChange={(event) => setAction(event.target.value)}
          value={action}
        >
          <option value="all">All actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="status_changed">Status changed</option>
          <option value="invited">Invited</option>
        </select>
      </div>
      {filtered.length ? (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {filtered.map((event) => (
            <div className="flex gap-4 p-5" key={event.id}>
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
              <div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-ink">
                    {event.profiles?.full_name || "A teammate"}
                  </span>{" "}
                  {event.description}
                </p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(event.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          No activity matches the current filters.
        </div>
      )}
    </div>
  );
}
