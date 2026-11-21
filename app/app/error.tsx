"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PulseBoard application error", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfbfd] px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
          Workspace lookup failed
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
          PulseBoard could not load this workspace.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The session is valid, but the membership or workspace query returned an error. Check the
          exact message below, then verify the Supabase migrations, user ID, and RLS policies.
        </p>
        <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-red-50 p-4 text-xs leading-6 text-red-800">
          {error.message}
          {error.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => reset()}
            type="button"
          >
            Try again
          </button>
          <Link
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/onboarding"
          >
            Open onboarding
          </Link>
        </div>
      </div>
    </main>
  );
}
