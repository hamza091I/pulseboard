# PulseBoard TODO

## Phase 0 — Foundation and project shell

- [x] Create a managed Webdev project named PulseBoard with a clear SaaS description.
- [x] Add a pinned Node package manager configuration for pnpm 11.25.0.
- [x] Add a reviewed pnpm build-script policy before the first install.
- [x] Add Next.js App Router, React, TypeScript, Tailwind CSS, PostCSS, ESLint, and Prettier configuration.
- [x] Add Supabase client dependencies and a safe `.env.example` without real credentials.
- [x] Add a responsive landing page that communicates the product problem, workflow, signals, and security direction.
- [x] Add project metadata, an application logo URL, and `public/manus-routes.json` with the current page route.
- [x] Add a repository map, implementation plan, design direction, architecture notes, and local quality commands.
- [ ] Install dependencies and pass typecheck, lint, formatting, and production build checks.
- [ ] Start the development server on the configured runtime port and verify the route manifest returns HTTP 200 JSON.
- [ ] Save the completed foundation to the canonical project history.

## Phase 1 — Authentication and workspace onboarding

- [x] Add Supabase email/password authentication with protected `/app` routes.
- [x] Create a profile and a workspace when a new user completes onboarding.
- [x] Add the user to `workspace_members` as Owner and persist the active workspace.
- [x] Ensure unauthenticated users cannot access protected application pages.
- [x] Add the Phase 1 SQL migration, onboarding RPC, membership policies, and profile trigger.
- [x] Add Login, Signup, email callback, onboarding, and authenticated app overview pages.
- [ ] Apply the migration in the user's Supabase project and add local `.env.local` values.
- [ ] Test signup, email confirmation, workspace creation, refresh persistence, and logout against Supabase.

## Phase 2 — Workspace data foundation

- [ ] Add migrations for profiles, workspaces, workspace members, clients, projects, tasks, activity logs, and invitations.
- [ ] Add Row Level Security so users can only access records belonging to workspaces where they are members.
- [ ] Add Owner, Admin, and Member role checks to mutations and management pages.
- [ ] Add typed database/domain types and validated mutation boundaries.

## Phase 3 — Core operations

- [ ] Add client management with create, view, edit, delete, search, status filtering, notes, and linked projects.
- [ ] Add project management with client relationships, statuses, priorities, descriptions, budgets, dates, and progress tracking.
- [ ] Add task management with project relationships, assignments, statuses, priorities, due dates, filtering, and overdue visibility.
- [ ] Record important create, update, delete, and status-change actions in a filterable activity feed.

## Phase 4 — Dashboard and team

- [ ] Add database-backed KPI cards for clients, active projects, open tasks, and overdue tasks.
- [ ] Add project/task breakdowns, upcoming deadlines, and recent activity.
- [ ] Add team member listing, role display, invitation records, and role-aware administration.
- [ ] Add loading, empty, error, confirmation, and responsive mobile states across the product.

## Phase 5 — Portfolio delivery

- [ ] Add realistic deterministic seed data for a showcase workspace.
- [ ] Deploy the application and configure authentication redirect URLs.
- [ ] Write the final architecture and trade-off section in the README.
- [ ] Record a 60–90 second walkthrough showing the complete workflow.
- [ ] Add screenshots, live demo link, repository link, and a portfolio case study.
- [ ] Add one grounded AI Workspace Brief feature only after the core workflow is stable.
