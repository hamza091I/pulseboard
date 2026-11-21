"use client";
import { useState } from "react";
import { Database, Loader2 } from "lucide-react";
export function DemoSeedButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function seed() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/demo/seed", { method: "POST" });
    const body = await response.json();
    setMessage(response.ok ? "Demo data loaded" : body.error || "Could not load demo data");
    setLoading(false);
    if (response.ok) window.location.reload();
  }
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-emerald-600 sm:block">{message}</span>
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:opacity-60"
        disabled={loading}
        onClick={seed}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
        {loading ? "Loading…" : "Load demo data"}
      </button>
    </div>
  );
}
