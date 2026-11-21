import { createClient } from "@/lib/supabase/server";
import { apiError, apiOk } from "@/lib/api";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) return apiError(`Authentication lookup failed: ${userError.message}`, 500);
  if (!user) return apiError("Unauthorized", 401);

  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .limit(1);
  if (membershipError) {
    return apiError(`Workspace membership lookup failed: ${membershipError.message}`, 500);
  }

  const membership = memberships?.[0];
  if (!membership) return apiError("No workspace membership found", 400);

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("id", membership.workspace_id)
    .maybeSingle();
  if (workspaceError) return apiError(`Workspace lookup failed: ${workspaceError.message}`, 500);
  if (!workspace) return apiError("Workspace membership points to a missing workspace", 400);

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
  if (!apiKey) return apiOk({ brief: fallback, source: "fallback" });

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
  if (!response.ok) return apiOk({ brief: fallback, source: "fallback" });

  const payload = await response.json();
  let brief = fallback;
  try {
    brief = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
  } catch {
    // Keep the grounded fallback when a model returns invalid JSON.
  }
  return apiOk({ brief, source: "ai" });
}
