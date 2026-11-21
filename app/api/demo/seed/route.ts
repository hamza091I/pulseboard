import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!member) return NextResponse.json({ error: "Create a workspace first" }, { status: 400 });
  const workspaceId = member.workspace_id;
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);
  if (count && count > 0)
    return NextResponse.json({ error: "This workspace already has data" }, { status: 409 });
  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .insert([
      {
        workspace_id: workspaceId,
        name: "Maya Chen",
        company: "Northstar Studio",
        email: "maya@northstar.example",
        status: "active",
      },
      {
        workspace_id: workspaceId,
        name: "Omar Haddad",
        company: "Atlas Coffee",
        email: "omar@atlas.example",
        status: "lead",
      },
      {
        workspace_id: workspaceId,
        name: "Lina Saleh",
        company: "Bloom Clinic",
        email: "lina@bloom.example",
        status: "active",
      },
    ])
    .select("id, name");
  if (clientsError) return NextResponse.json({ error: clientsError.message }, { status: 400 });
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .insert([
      {
        workspace_id: workspaceId,
        created_by: user.id,
        client_id: clients?.[0]?.id,
        name: "Northstar website refresh",
        description: "A conversion-focused website refresh with a stronger content system.",
        status: "active",
        priority: "high",
        due_date: "2026-12-05",
      },
      {
        workspace_id: workspaceId,
        created_by: user.id,
        client_id: clients?.[1]?.id,
        name: "Atlas seasonal campaign",
        description: "Plan and launch the winter campaign across web and social.",
        status: "planning",
        priority: "medium",
        due_date: "2026-12-18",
      },
      {
        workspace_id: workspaceId,
        created_by: user.id,
        client_id: clients?.[2]?.id,
        name: "Bloom patient portal",
        description: "A clearer onboarding flow for the clinic patient portal.",
        status: "active",
        priority: "medium",
        due_date: "2026-12-12",
      },
    ])
    .select("id, name");
  if (projectsError) return NextResponse.json({ error: projectsError.message }, { status: 400 });
  const { error: tasksError } = await supabase.from("tasks").insert([
    {
      workspace_id: workspaceId,
      project_id: projects?.[0]?.id,
      title: "Approve homepage direction",
      status: "review",
      priority: "high",
      due_date: "2026-11-23",
    },
    {
      workspace_id: workspaceId,
      project_id: projects?.[0]?.id,
      title: "Prepare analytics handoff",
      status: "in_progress",
      priority: "medium",
      due_date: "2026-11-28",
    },
    {
      workspace_id: workspaceId,
      project_id: projects?.[1]?.id,
      title: "Write campaign brief",
      status: "todo",
      priority: "medium",
      due_date: "2026-11-30",
    },
    {
      workspace_id: workspaceId,
      project_id: projects?.[2]?.id,
      title: "Review onboarding copy",
      status: "done",
      priority: "low",
      due_date: "2026-11-19",
    },
  ]);
  if (tasksError) return NextResponse.json({ error: tasksError.message }, { status: 400 });
  await supabase.from("activity_logs").insert([
    {
      workspace_id: workspaceId,
      user_id: user.id,
      entity_type: "workspace",
      action: "created",
      description: "loaded the PulseBoard demo workspace data",
    },
  ]);
  return NextResponse.json({ ok: true });
}
