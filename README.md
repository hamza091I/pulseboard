# PulseBoard

PulseBoard is a portfolio-grade, multi-tenant SaaS operations dashboard for small agencies and delivery teams. It gives an agency one focused workspace for managing client relationships, projects, tasks, team membership, activity history, and delivery signals.

The project is intentionally narrower than a generic project-management tool. Its purpose is to demonstrate the engineering decisions behind a real SaaS product: authentication, workspace isolation, role-aware access, relational PostgreSQL data, Row Level Security, server-side session handling, operational dashboards, safe demo data, and a grounded AI summary layer.

## Product idea

Small agencies often manage client work across scattered spreadsheets, chat messages, task lists, and documents. This makes it difficult to answer simple operational questions:

- Which client relationships need attention?

- Which projects are active, blocked, or approaching a deadline?

- Which tasks are overdue or waiting for review?

- Who has access to the workspace?

- What changed recently, and what should the team do next?

PulseBoard brings those answers into one calm operating layer. Each agency has an isolated workspace. Team members can see the operational picture, create connected client/project/task records, review activity history, and use the dashboard as a daily delivery overview.

## Portfolio positioning

This project demonstrates a complete full-stack workflow rather than only a visual landing page:

1. A public marketing surface explains the product and its value.

1. Supabase Auth manages account creation and login.

1. Workspace onboarding creates the tenant boundary for each agency.

1. Every operational record carries a `workspace_id`.

1. PostgreSQL Row Level Security protects data at the database layer.

1. The application reads the authenticated session on the server and in the browser through Supabase SSR clients.

1. Dashboard metrics are calculated from persisted data instead of hard-coded mock values.

1. Important create actions write activity log entries.

1. Demo data can be loaded into an empty workspace for portfolio presentations.

1. The AI Workspace Brief summarizes authorized workspace metrics and falls back safely when no AI key is configured.

## Current feature set

### Public and authentication experience

- Responsive product landing page at `/`.

- Email/password signup at `/signup`.

- Email/password login at `/login`.

- Supabase auth callback at `/auth/callback`.

- Protected application routes under `/app`.

- Workspace onboarding at `/onboarding`.

- Session refresh and protected-route handling through `middleware.ts`.

### Workspace operations

- Overview dashboard with database-backed counts for clients, active projects, open tasks, and overdue tasks.

- Client records with name, company, email, and status.

- Project records with description, status, priority, due date, and optional client relationship.

- Task records with project relationship, status, priority, and due date.

- Team page showing workspace members and their roles.

- Activity page showing recent workspace events.

- Settings page for the current workspace context.

- Responsive application shell with persistent navigation and workspace identity.

### Creation workflows

- Create clients from the Clients page.

- Create projects from the Projects page and optionally link them to an existing client.

- Create tasks from the Tasks page and require a project relationship.

- Record create actions in `activity_logs`.

- Prevent demo data from overwriting a workspace that already contains clients.

- Search and status filters for clients, projects, and tasks.

- Activity search and action filters.

- Client pagination for larger workspaces.

- Form validation with Zod before database writes.

- Loading, error, and not-found states for a more resilient user experience.

### AI Workspace Brief

The dashboard can request a brief based on the current workspace metrics. The route collects already-authorized project, task, and client data, then either:

- Returns a grounded local fallback when `OPENAI_API_KEY` is not configured.

- Calls an OpenAI-compatible Chat Completions endpoint when a server-side key is available.

- Falls back to the grounded local result if the external model request fails or returns invalid JSON.

The AI layer is not an authorization layer and is not the source of truth for business data. It receives a compact summary of data the current user is already allowed to access.

## Technology stack

- Next.js 15 App Router

- React 19

- TypeScript

- Tailwind CSS

- Supabase Auth

- Supabase SSR

- Supabase PostgreSQL

- PostgreSQL Row Level Security

- `@supabase/ssr`

- `@supabase/supabase-js`

- Lucide React

- Prettier

- ESLint

- pnpm 11.25.0

- Docker-compatible Next.js standalone output

- GitHub Actions CI

- Production health smoke check

Zod validates the client, project, and task create forms before database writes. Database constraints and server/database authorization policies remain the final enforcement boundaries.

## Architecture

The application is organized around a clear browser, application, and database boundary:

```
Browser
  |
  v
Next.js App Router
  |
  +-- Public marketing routes
  +-- Authentication routes
  +-- Protected workspace routes
  |       |
  |       +-- Server and browser Supabase clients
  |       +-- Workspace membership lookup
  |       +-- Dashboard and operational modules
  |       +-- AI Workspace Brief API
  |
  v
Supabase Auth and PostgreSQL
  |
  +-- profiles
  +-- workspaces
  +-- workspace_members
  +-- clients
  +-- projects
  +-- tasks
  +-- activity_logs
  +-- Row Level Security policies
```

### Tenant boundary

A workspace is the tenant boundary. Every business record is associated with a workspace through `workspace_id`. The current workspace is resolved from the authenticated user's membership, not from a client-provided workspace ID.

The server helper in `lib/workspace.ts` deliberately performs two separate reads:

1. It finds the authenticated user's membership in `workspace_members`.

1. It loads the related row from `workspaces` using `membership.workspace_id`.

This makes Supabase relationship and Row Level Security failures visible instead of silently treating a query error as a missing workspace. Protected application errors are rendered by `app/app/error.tsx` with the real error message.

### Authorization model

The database is authoritative. UI visibility is not treated as security. The SQL migrations define policies for workspace-scoped reads and writes. The role values are:

- `owner`: workspace owner and highest administrative role.

- `admin`: administrative workspace role.

- `member`: standard workspace member.

The current migration gives members access to operational reads and creation flows, while administrative updates and deletes are restricted according to the policy definitions.

## Database model

Migration `001_phase_1_auth_workspaces.sql` creates:

- `profiles`

- `workspaces`

- `workspace_members`

- The `handle_new_user` profile trigger

- The secure `create_workspace` function

- Membership and workspace Row Level Security policies

Migration `002_phase_2_operations.sql` creates:

- `clients`

- `projects`

- `tasks`

- `activity_logs`

- Timestamp update triggers

- Workspace-scoped Row Level Security policies

- Indexes for workspace, project, and activity lookups

Projects optionally reference clients. Tasks require a project. Activity events reference the workspace and the user who performed the action.

## Repository structure

```
app/
  (auth)/                 Login and signup routes
  api/                    AI brief, demo seed, and health endpoints
  app/                    Protected workspace shell and product modules
  auth/callback/          Supabase email confirmation callback
  onboarding/             Workspace creation flow
  page.tsx                Public landing page
  globals.css             Global styles and design tokens

components/
  ai-brief.tsx            AI brief interaction
  demo-seed-button.tsx    Demo data loader
  record-form.tsx         Client, project, and task creation form
  ui.tsx                  Shared headers, badges, and empty states

lib/
  activity.ts             Activity log helper
  client-workspace.ts     Browser-side workspace lookup
  workspace.ts            Server-side session and workspace lookup
  supabase/               Browser and server Supabase clients

types/
  domain.ts               Shared workspace, client, project, task, and role types
  database.ts             Database row contracts

supabase/
  migrations/              Ordered SQL schema and RLS migrations
  seed.sql                 Safe seed guidance

docs/
  architecture.md         System boundaries and data ownership notes
  project-documentation.md Complete implementation and delivery documentation

public/
  manus-routes.json       Route manifest

.github/workflows/ci.yml  Automated quality checks
scripts/smoke-health.sh   Production health smoke test

Dockerfile                Production container contract
app.config.ts             Project metadata and logo configuration
next.config.ts            Next.js standalone output configuration
plan.md                   Product, design, and implementation plan
TODO.md                   Delivery checklist
.env.example              Safe environment variable template
```

## Local development

### Prerequisites

Install the following before starting:

- Node.js 20 or newer.

- pnpm 11 or newer.

- A Supabase project.

- Git.

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Copy the safe template:

```bash
cp .env.example .env.local
```

Then set the public Supabase values in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The `.env.local` file is intentionally ignored by Git. Never commit it, a Supabase service-role key, or an AI provider key.

### Apply the database migrations

Open the Supabase SQL Editor and run these files in order:

```
supabase/migrations/001_phase_1_auth_workspaces.sql
supabase/migrations/002_phase_2_operations.sql
```

The first migration must run before the second because the operations migration depends on workspace membership helper functions and the `workspaces` table.

### Configure Supabase authentication URLs

In Supabase Authentication URL Configuration, use the following local values:

```
Site URL:
http://localhost:3000

Redirect URL:
http://localhost:3000/auth/callback
```

If the application is deployed, add the deployed domain and its callback route as additional redirect URLs.

### Start the application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. Create an account, complete onboarding, and open the protected dashboard.

### Load showcase data

After creating a workspace, use **Load demo data** on the Overview page. The loader creates a small connected dataset containing clients, projects, tasks, and an activity event.

The loader checks whether the workspace already contains clients. If it does, the request is rejected instead of overwriting the workspace.

## Workspace membership troubleshooting

If a user is redirected to onboarding even though a workspace membership exists, verify that the membership belongs to the same authenticated Supabase user.

Run the following query in Supabase SQL Editor using the user's email only for investigation:

```sql
select id, email
from auth.users
where email = 'your-email@example.com';
```

Then compare the returned `id` with the membership row:

```sql
select id, workspace_id, user_id, role, joined_at
from public.workspace_members
where user_id = 'AUTH_USER_ID';
```

The `workspace_members.user_id` value must exactly equal the authenticated user's `auth.users.id`. The role should be one of `owner`, `admin`, or `member`.

The application does not silently hide database lookup failures anymore. Membership query errors, workspace query errors, and missing related workspaces are rendered as visible errors in the protected app. If no membership is visible at all, the onboarding page shows a diagnostic message explaining that the user ID and RLS policy should be checked.

## Optional AI configuration

The grounded fallback works without an AI provider. To enable live AI-generated summaries, add the following server-only variables:

```
OPENAI_API_KEY=your-server-side-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_API_BASE` can point to another OpenAI-compatible provider. The key must never use a `NEXT_PUBLIC_` prefix and must never be committed to the repository.

## Quality checks

Run the complete local verification sequence before opening a pull request or publishing a portfolio update:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

GitHub Actions runs the same quality sequence on pushes and pull requests targeting `main`. After starting the production server, the health smoke check can be run with:

```bash
pnpm smoke:health
```

The production server can be tested locally after a successful build:

```bash
pnpm start
```

The unauthenticated health endpoint is:

```
GET /api/health
```

It returns a small JSON response such as:

```json
{
  "status": "ok",
  "service": "pulseboard"
}
```

## Production deployment

The project is configured for Next.js standalone output and includes a root `Dockerfile`. The container runs the production server on port `3000` and expects runtime environment variables to be supplied by the deployment platform.

For a Vercel deployment:

1. Import the GitHub repository.

1. Select the `main` branch.

1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.

1. Add the production site URL and `/auth/callback` to Supabase Authentication URL Configuration.

1. Deploy and test signup, login, onboarding, dashboard loading, and the health route.

For a Docker-compatible host:

```bash
docker build -t pulseboard .
docker run --env-file .env.production -p 3000:3000 pulseboard
```

Do not bake `.env.production` into the image. Inject secrets through the host's environment or secret manager.

## GitHub repository

The public repository is:

[github.com/hamza091I/pulseboard](https://github.com/hamza091I/pulseboard)

The default branch is `main`. The repository intentionally excludes `.env.local`, `.next`, `node_modules`, TypeScript build information, and Git internals from the final portfolio ZIP.

For a detailed explanation of every phase, architectural decision, database table, API route, security boundary, quality check, and portfolio walkthrough, read [the complete project documentation](docs/project-documentation.md).

## Portfolio presentation

A concise way to describe the project is:

> PulseBoard is a multi-tenant SaaS operations dashboard I designed and built for small agencies. It centralizes clients, projects, tasks, team access, activity history, and delivery metrics in workspace-isolated PostgreSQL data secured with Supabase Auth and Row Level Security. I also added demo data loading, a grounded AI Workspace Brief, server-side session handling, and a production Docker contract.

The strongest portfolio talking points are:

- Tenant isolation through `workspace_id` and Row Level Security.

- Separate server and browser Supabase clients for session-safe access.

- Relational data flow from clients to projects to tasks.

- Operational KPIs calculated from real database rows.

- Diagnostic handling for membership and workspace lookup failures.

- A fallback-first AI integration that remains useful without an external API key.

- Production checks with TypeScript, ESLint, Prettier, and Next.js build output.

## Scope and next extensions

The current release focuses on the core portfolio story: authentication, workspace isolation, connected operational records, activity visibility, dashboard metrics, demo data, and AI summarization.

Natural next extensions for a production SaaS release would include invitation emails, member management screens, full edit and delete workflows, filters and pagination for large workspaces, generated Supabase TypeScript types, automated tests, billing, notifications, and a deployed public demo environment.

## License

This repository is a portfolio project. Add a license file before accepting external contributions or distributing the code as an open-source package.
