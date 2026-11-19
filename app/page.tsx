import {
  ArrowRight,
  BarChart3,
  Check,
  CircleDashed,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const highlights = [
  "One workspace for every client, project, and task",
  "Clear ownership with roles your team understands",
  "Live signals that keep deadlines from going quiet",
];

const metrics = [
  { label: "Active projects", value: "18", change: "+12.5%", tone: "violet" },
  { label: "Open tasks", value: "64", change: "8 due soon", tone: "cyan" },
  { label: "Client health", value: "94%", change: "+4.2%", tone: "green" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfbfd] text-ink">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white shadow-sm">
            <span className="text-sm font-semibold tracking-tight">PB</span>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em]">PulseBoard</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
          <a className="transition hover:text-ink" href="#workflow">
            Workflow
          </a>
          <a className="transition hover:text-ink" href="#signals">
            Signals
          </a>
          <a className="transition hover:text-ink" href="#security">
            Security
          </a>
        </div>
        <a
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
          href="#preview"
        >
          View preview <ArrowRight className="h-4 w-4" />
        </a>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -left-32 top-48 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="relative grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Built for calm, accountable delivery
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.65rem]">
              Agency operations, <span className="text-brand-600">in focus.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
              PulseBoard gives small teams one clear place to run client work, understand what needs
              attention, and move every project forward without the spreadsheet sprawl.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800"
                href="#preview"
              >
                Explore the workspace <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-ink"
                href="#workflow"
              >
                See how it works
              </a>
            </div>
            <div className="mt-10 space-y-3">
              {highlights.map((highlight) => (
                <div className="flex items-center gap-3 text-sm text-slate-600" key={highlight}>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div id="preview" className="relative lg:pt-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-soft">
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-25">
                <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-[10px] font-semibold text-white">
                      PB
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-ink">Northstar Studio</p>
                      <p className="text-[10px] text-slate-400">Operations workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-medium text-slate-500">
                      All systems clear
                    </span>
                    <div className="ml-2 h-7 w-7 rounded-full bg-brand-100" />
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[148px_1fr]">
                  <aside className="hidden border-r border-slate-100 bg-white p-3 sm:block">
                    <p className="mb-5 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Workspace
                    </p>
                    <div className="space-y-1 text-[11px]">
                      <div className="rounded-lg bg-brand-50 px-2.5 py-2 font-semibold text-brand-700">
                        Overview
                      </div>
                      <div className="px-2.5 py-2 text-slate-500">Clients</div>
                      <div className="px-2.5 py-2 text-slate-500">Projects</div>
                      <div className="px-2.5 py-2 text-slate-500">Tasks</div>
                    </div>
                    <p className="mb-2 mt-8 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Manage
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-500">
                      <div className="px-2.5 py-2">Team</div>
                      <div className="px-2.5 py-2">Activity</div>
                      <div className="px-2.5 py-2">Settings</div>
                    </div>
                  </aside>
                  <div className="min-w-0 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
                          Monday, October 21
                        </p>
                        <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
                          Good morning, Alex
                        </h2>
                      </div>
                      <button className="rounded-md bg-ink px-3 py-2 text-[10px] font-semibold text-white">
                        New project
                      </button>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                      {metrics.map((metric) => (
                        <div
                          className="rounded-xl border border-slate-100 bg-white p-3"
                          key={metric.label}
                        >
                          <div
                            className={`mb-3 h-1.5 w-7 rounded-full ${metric.tone === "violet" ? "bg-brand-500" : metric.tone === "cyan" ? "bg-cyan-500" : "bg-emerald-400"}`}
                          />
                          <p className="text-[9px] text-slate-400">{metric.label}</p>
                          <div className="mt-1 flex items-end justify-between gap-1">
                            <p className="text-xl font-semibold tracking-tight text-ink">
                              {metric.value}
                            </p>
                            <span className="text-[8px] font-semibold text-emerald-600">
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-ink">Project momentum</p>
                          <span className="text-[9px] text-slate-400">Last 30 days</span>
                        </div>
                        <div className="mt-5 flex h-24 items-end gap-2">
                          {[38, 52, 44, 66, 58, 75, 68, 88, 78, 92, 84, 98].map((height, index) => (
                            <div className="flex flex-1 flex-col justify-end gap-1" key={index}>
                              <div
                                className={`rounded-t-sm ${index > 8 ? "bg-brand-500" : "bg-brand-100"}`}
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-[8px] text-slate-400">
                          <span>Sep 22</span>
                          <span>Oct 21</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-ink">Needs attention</p>
                          <CircleDashed className="h-3.5 w-3.5 text-slate-300" />
                        </div>
                        <div className="mt-4 space-y-3">
                          {["Homepage review", "Q4 campaign brief", "Analytics handoff"].map(
                            (task, index) => (
                              <div className="flex items-center gap-2" key={task}>
                                <span
                                  className={`h-2 w-2 rounded-full ${index === 0 ? "bg-amber-400" : "bg-brand-400"}`}
                                />
                                <span className="truncate text-[10px] text-slate-600">{task}</span>
                                <span className="ml-auto text-[8px] text-slate-400">
                                  {index + 1}d
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border border-slate-100 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-ink">Recent activity</p>
                        <span className="text-[9px] font-semibold text-brand-600">View all</span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-[9px] text-slate-500">
                        <span>
                          <b className="font-semibold text-ink">Maya</b> updated Atlas project
                        </span>
                        <span>
                          <b className="font-semibold text-ink">Jordan</b> completed a task
                        </span>
                        <span>
                          <b className="font-semibold text-ink">You</b> added a client
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-soft sm:flex">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-ink">Workspace isolated</p>
                <p className="text-[9px] text-slate-400">Built for accountable teams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-slate-200/70 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              The operating layer
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              The details that keep work moving.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              Every part of PulseBoard is shaped around the daily handoffs that make a small agency
              feel bigger than it is.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<Layers3 />}
              title="One source of truth"
              text="Clients, projects, tasks, and due dates stay connected instead of scattered across tabs."
            />
            <FeatureCard
              icon={<Users />}
              title="Clear ownership"
              text="Roles and assignments make responsibility visible without adding process overhead."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Useful signals"
              text="A live overview surfaces momentum, overdue work, and the next decision to make."
            />
          </div>
        </div>
      </section>

      <section id="signals" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
              Designed to scale with trust
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              Start small. Operate like a product team.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              PulseBoard is intentionally opinionated: fewer moving parts, clearer states, and a
              foundation that can grow into automations and AI-assisted reporting.
            </p>
          </div>
          <div id="security" className="grid gap-4 sm:grid-cols-2">
            <Signal
              title="Workspace isolation"
              text="Each agency’s data is scoped to its own workspace and membership."
            />
            <Signal
              title="Permission-aware"
              text="Owner, Admin, and Member roles keep high-impact actions intentional."
            />
            <Signal
              title="Audit-ready"
              text="Important changes create a visible activity trail for the whole team."
            />
            <Signal
              title="AI-ready foundation"
              text="Structured data makes future weekly briefs useful, grounded, and reviewable."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-[9px] text-white">
              PB
            </div>
            PulseBoard
          </div>
          <p>Phase 0 foundation · Built for a focused agency workflow.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-25 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-soft">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">{icon}</div>
      <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function Signal({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-8 rounded-full bg-brand-500" />
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
