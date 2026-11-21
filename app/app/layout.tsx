import Link from "next/link";
import { Activity, FolderKanban, LayoutDashboard, ListTodo, Settings, Users } from "lucide-react";
import { getCurrentWorkspace } from "@/lib/workspace";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, membership, workspace } = await getCurrentWorkspace();
  const initials = (user.user_metadata?.full_name || user.email || "U").slice(0, 1).toUpperCase();
  const links = [
    { href: "/app", label: "Overview", icon: LayoutDashboard },
    { href: "/app/clients", label: "Clients", icon: Users },
    { href: "/app/projects", label: "Projects", icon: FolderKanban },
    { href: "/app/tasks", label: "Tasks", icon: ListTodo },
    { href: "/app/team", label: "Team", icon: Users },
    { href: "/app/activity", label: "Activity", icon: Activity },
  ];

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white p-5 lg:block">
          <Link className="flex items-center gap-3 font-semibold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-xs font-bold text-white">
              PB
            </span>
            PulseBoard
          </Link>
          <div className="mt-10">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>
            <nav className="mt-3 space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-ink"
                  href={href}
                  key={href}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-5">
            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-ink"
              href="/app/settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <div className="mt-auto pt-12">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="truncate text-xs font-semibold text-ink">{workspace.name}</p>
              <p className="mt-1 text-[11px] capitalize text-slate-400">
                {membership.role} workspace
              </p>
            </div>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-5 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-[10px] font-bold text-white">
                PB
              </span>
              <span className="font-semibold">PulseBoard</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {workspace.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">{user.email}</span>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {initials}
              </div>
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
