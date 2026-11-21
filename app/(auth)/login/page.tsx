"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    window.location.assign("/app");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Keep the work moving."
      description="Sign in to return to your agency workspace."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
        />
        {error ? <Alert>{error}</Alert> : null}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign in"}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        New to PulseBoard?{" "}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" href="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-[#fbfbfd] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-3 font-semibold" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xs font-bold text-ink">
            PB
          </span>
          PulseBoard
        </Link>
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            A calmer operating layer
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em]">
            Your team’s next move should be easy to see.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-300">
            Clients, projects, tasks, and ownership—organized in one focused workspace.
          </p>
        </div>
        <p className="text-xs text-slate-500">PulseBoard Phase 1 · Secure workspace onboarding</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link className="mb-12 flex items-center gap-3 font-semibold text-ink lg:hidden" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-xs font-bold text-white">
              PB
            </span>
            PulseBoard
          </Link>
          <div className="mb-8">
            <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">{title}</h1>
            <p className="mt-3 leading-7 text-slate-500">{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
      {children}
    </div>
  );
}
