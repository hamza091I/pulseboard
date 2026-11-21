"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Building2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noMembership, setNoMembership] = useState(false);

  useEffect(() => {
    setNoMembership(new URLSearchParams(window.location.search).get("reason") === "no-membership");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: createError } = await supabase.rpc("create_workspace", {
      workspace_name: workspaceName.trim(),
    });

    if (createError) {
      setError(createError.message);
      setLoading(false);
      return;
    }

    window.location.assign("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfbfd] px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center gap-3 font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-xs font-bold text-white">
            PB
          </span>
          PulseBoard
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft sm:p-10">
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Building2 className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            One last step
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
            Name your workspace.
          </h1>
          <p className="mt-3 leading-7 text-slate-500">
            This is the shared home for your clients, projects, tasks, and team.
          </p>
          {noMembership ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              PulseBoard could not find a visible workspace membership for the signed-in user. If
              you already have a workspace, verify that <code>workspace_members.user_id</code>{" "}
              exactly matches the current Supabase Auth user ID and that the membership RLS policy
              is enabled.
            </div>
          ) : null}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-ink">
              Workspace name
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Northstar Studio"
                required
                value={workspaceName}
              />
            </label>
            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            ) : null}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating workspace…" : "Create workspace"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
