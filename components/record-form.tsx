"use client";

import { FormEvent, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { inputClass } from "@/components/ui";
import { logActivity } from "@/lib/activity";
import { clientRecordSchema, projectRecordSchema, taskRecordSchema } from "@/lib/validation";

export function RecordForm({
  kind,
  workspaceId,
  userId,
  projectId,
  clients = [],
  projects = [],
  onDoneAction,
}: {
  kind: "client" | "project" | "task";
  workspaceId: string;
  userId: string;
  projectId?: string;
  clients?: { id: string; name: string }[];
  projects?: { id: string; name: string }[];
  onDoneAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    company: "",
    email: "",
    title: "",
    description: "",
    status: kind === "client" ? "lead" : kind === "project" ? "planning" : "todo",
    priority: "medium",
    due_date: "",
    client_id: "",
    project_id: projectId || "",
  });
  const label = kind === "client" ? "New client" : kind === "project" ? "New project" : "New task";
  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const parsed =
      kind === "client"
        ? clientRecordSchema.safeParse(values)
        : kind === "project"
          ? projectRecordSchema.safeParse(values)
          : taskRecordSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check the form values.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    let recordId: string | null = null;
    let error: { message: string } | null = null;
    if (kind === "client") {
      const result = await supabase
        .from("clients")
        .insert({
          workspace_id: workspaceId,
          name: values.name,
          company: values.company || null,
          email: values.email || null,
          status: values.status,
        })
        .select("id")
        .single();
      recordId = result.data?.id || null;
      error = result.error;
    }
    if (kind === "project") {
      const result = await supabase
        .from("projects")
        .insert({
          workspace_id: workspaceId,
          created_by: userId,
          name: values.name,
          client_id: values.client_id || null,
          description: values.description || null,
          status: values.status,
          priority: values.priority,
          due_date: values.due_date || null,
        })
        .select("id")
        .single();
      recordId = result.data?.id || null;
      error = result.error;
    }
    if (kind === "task") {
      const result = await supabase
        .from("tasks")
        .insert({
          workspace_id: workspaceId,
          project_id: values.project_id,
          title: values.title,
          description: values.description || null,
          status: values.status,
          priority: values.priority,
          due_date: values.due_date || null,
        })
        .select("id")
        .single();
      recordId = result.data?.id || null;
      error = result.error;
    }
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (recordId) {
      await logActivity(
        supabase,
        workspaceId,
        userId,
        kind,
        recordId,
        "created",
        `${kind === "task" ? values.title : values.name} was created`,
      );
    }
    setOpen(false);
    setLoading(false);
    onDoneAction();
  }
  if (!open)
    return (
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {label}
      </button>
    );
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-5">
      <form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{label}</h2>
          <button type="button" onClick={() => setOpen(false)}>
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          {kind === "task" ? (
            <input
              className={inputClass}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Task title"
              required
              value={values.title}
            />
          ) : (
            <input
              className={inputClass}
              onChange={(e) => set("name", e.target.value)}
              placeholder={kind === "client" ? "Client name" : "Project name"}
              required
              value={values.name}
            />
          )}
          {kind === "client" ? (
            <>
              <input
                className={inputClass}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Company"
                value={values.company}
              />
              <input
                className={inputClass}
                onChange={(e) => set("email", e.target.value)}
                placeholder="Email"
                type="email"
                value={values.email}
              />
            </>
          ) : (
            <textarea
              className={inputClass}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description"
              rows={3}
              value={values.description}
            />
          )}
          {kind === "project" && clients.length ? (
            <select
              className={inputClass}
              onChange={(e) => set("client_id", e.target.value)}
              value={values.client_id}
            >
              <option value="">No client linked</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          ) : null}
          {kind === "task" && projects.length ? (
            <select
              className={inputClass}
              onChange={(e) => set("project_id", e.target.value)}
              required
              value={values.project_id}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          ) : null}
          {kind !== "client" ? (
            <div className="grid grid-cols-2 gap-3">
              <select
                className={inputClass}
                onChange={(e) => set("status", e.target.value)}
                value={values.status}
              >
                {(kind === "project"
                  ? ["planning", "active", "on_hold", "completed"]
                  : ["todo", "in_progress", "review", "done"]
                ).map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                onChange={(e) => set("priority", e.target.value)}
                value={values.priority}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
          ) : null}
          {kind !== "client" ? (
            <input
              className={inputClass}
              onChange={(e) => set("due_date", e.target.value)}
              type="date"
              value={values.due_date}
            />
          ) : null}
        </div>
        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        <button
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
