"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.assign("/onboarding");
    } else {
      setMessage("Check your email to confirm your account, then return here to sign in.");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#fbfbfd] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-3 font-semibold" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xs font-bold text-brand-700">
            PB
          </span>
          PulseBoard
        </Link>
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
            Start with a clear workspace
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em]">
            Bring the moving parts into focus.
          </h2>
          <p className="mt-5 text-base leading-7 text-brand-100">
            Create your agency workspace, invite the team, and give every project a visible next
            step.
          </p>
        </div>
        <p className="text-xs text-brand-200">PulseBoard Phase 1 · Workspace onboarding</p>
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
              <UserPlus className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Create your account
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
              Start with your workspace.
            </h1>
            <p className="mt-3 leading-7 text-slate-500">
              Set up your account first. We’ll create your agency workspace next.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Full name" value={name} onChange={setName} placeholder="Alex Morgan" />
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
              placeholder="At least 8 characters"
            />
            {error ? <Alert>{error}</Alert> : null}
            {message ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                {message}
              </div>
            ) : null}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create account"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-brand-600 hover:text-brand-700" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
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
