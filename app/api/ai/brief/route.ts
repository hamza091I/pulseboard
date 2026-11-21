import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(name)")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 400 });
  const workspaceId = membership.workspace_id;
  const [{ data: projects }, { data: tasks }, { data: clients }] = await Promise.all([
    supabase
      .from("projects")
      .select("name,status,priority,due_date")
      .eq("workspace_id", workspaceId),
    supabase.from("tasks").select("title,status,priority,due_date").eq("workspace_id", workspaceId),
    supabase.from("clients").select("name,status").eq("workspace_id", workspaceId),
  ]);
  const metrics = { projects: projects || [], tasks: tasks || [], clients: clients || [] };
  const fallback = {
    title: "Workspace brief",
    wins: [
      `${metrics.tasks.filter((task) => task.status === "done").length} tasks completed`,
      `${metrics.projects.filter((project) => project.status === "active").length} active projects in motion`,
    ],
    risks: [
      `${metrics.tasks.filter((task) => task.status !== "done" && task.due_date && task.due_date < new Date().toISOString().slice(0, 10)).length} overdue tasks need review`,
    ],
    next: "Review the highest-priority open task and confirm the next client handoff.",
  };
  const apiKey = process.env.OPENAI_API_KEY;
  const base = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  if (!apiKey) return NextResponse.json({ brief: fallback, source: "fallback" });
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Return only valid JSON with keys title, wins, risks, next. wins and risks are arrays of short strings. Ground every statement in the supplied workspace data.",
        },
        { role: "user", content: JSON.stringify(metrics) },
      ],
    }),
  });
  if (!response.ok) return NextResponse.json({ brief: fallback, source: "fallback" });
  const payload = await response.json();
  let brief = fallback;
  try {
    brief = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
  } catch {
    /* keep grounded fallback */
  }
  return NextResponse.json({ brief, source: "ai" });
}
