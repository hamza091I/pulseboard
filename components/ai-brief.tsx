"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";

type Brief = { title: string; wins: string[]; risks: string[]; next: string };

export function AIBrief() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  async function generate() {
    setLoading(true);
    const response = await fetch("/api/ai/brief", { method: "POST" });
    const payload = await response.json();
    if (response.ok) setBrief(payload.brief);
    setLoading(false);
  }
  return (
    <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-cyan-50 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-brand-700">
            <BrainCircuit className="h-5 w-5" />
            <p className="text-sm font-semibold">AI Workspace Brief</p>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Generate a grounded weekly readout from your current workspace data. Review it before
            acting.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          disabled={loading}
          onClick={generate}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Preparing brief…" : "Generate brief"}
        </button>
      </div>
      {brief ? (
        <div className="mt-6 grid gap-4 border-t border-brand-100 pt-5 md:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Wins
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {brief.wins?.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-600">
              Risks
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {brief.risks?.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-600">
              Next focus
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{brief.next}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
