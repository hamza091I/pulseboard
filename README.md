# PulseBoard

PulseBoard is a multi-tenant SaaS operations dashboard for small agencies. It gives teams one focused workspace to manage clients, projects, tasks, members, activity history, and delivery signals.

> **Portfolio positioning:** A full-stack operations workspace that shows authentication, workspace isolation, role-based permissions, relational data, live metrics, and production-minded UX.

## Current status

**Portfolio-ready implementation complete.** The repository includes the Next.js/TypeScript application shell, Supabase SSR authentication, protected `/app` routing, workspace onboarding, a secure SQL data model with RLS, clients/projects/tasks/team/activity modules, database-backed dashboard metrics, demo data loading, and a grounded AI Workspace Brief.

The remaining setup is external: create a Supabase project, apply both migrations, add the two public environment variables locally, and configure the email redirect URLs. The app works without an AI key by using a grounded fallback; an OpenAI-compatible key enables live AI-generated summaries.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL with Row Level Security
- Zod server-side validation
- Lucide React
- Vercel deployment target
- pnpm 11

## Run locally

### Prerequisites

- Node.js 20+
- pnpm 11+
- A Supabase project for authentication and database features

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 1 — Supabase setup

1. Create a project at [supabase.com](https://supabase.com) and open **Project Settings → API**.
2. Copy the **Project URL** and the public **anon key**.
3. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

4. Put the two values in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Open **SQL Editor** in Supabase and run `supabase/migrations/001_phase_1_auth_workspaces.sql`, then `supabase/migrations/002_phase_2_operations.sql`.
6. In **Authentication → URL Configuration**, use `http://localhost:3000` as the local Site URL and add `http://localhost:3000/auth/callback` as a redirect URL.
7. Start the app with `pnpm dev`, open `/signup`, create an account, confirm the email if email confirmation is enabled, then create a workspace.
8. From Overview, use **Load demo data** to create a safe showcase dataset for the current workspace.

Do not commit `.env.local` or any service-role key. The migrations create profiles, workspaces, memberships, operational tables, the secure `create_workspace` function, and Row Level Security policies. Run them in order in a fresh project. The demo loader refuses to run when the workspace already has clients, so it does not overwrite existing data.

### Optional AI configuration

The AI Workspace Brief uses a grounded local fallback by default. To enable live AI output, add these server-only variables to `.env.local` or the deployment environment:

```env
OPENAI_API_KEY=your-server-side-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

Never expose `OPENAI_API_KEY` with a `NEXT_PUBLIC_` prefix or commit it to GitHub.

## GitHub

The canonical portfolio repository is [github.com/hamza091I/pulseboard](https://github.com/hamza091I/pulseboard). Keep the repository public for portfolio visibility, but never commit secrets or `.env.local`.

### Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the public Supabase URL and anon key. Add optional AI variables only on the server. Never commit `.env.local`, a service-role key, an AI key, or any other secret.

## Repository map

```text
app/                  Next.js routes, layout, global styles, and landing page
components/           Reusable UI components, forms, badges, and AI/demo controls
lib/                  Supabase clients, permissions, validation, and domain logic
types/                Database and domain types
supabase/migrations/  Versioned SQL migrations
supabase/seed.sql     Safe deterministic demo data entry point
public/               Static assets and the Webdev route manifest
plan.md               Implementation and design decisions
TODO.md               Outcome-based project checklist
docs/architecture.md  System boundaries and data-flow notes
```

## Product direction

The current useful release supports:

- Workspace onboarding and protected routes.
- Owner, Admin, and Member roles.
- Clients, projects, and tasks with real relationships.
- Database-backed KPIs and activity history.
- Responsive B2B SaaS navigation and stateful forms.
- An AI Workspace Brief grounded in live workspace data, with a no-key fallback.

## Portfolio case study outline

When the product is complete, describe it as:

> I designed and built a multi-tenant SaaS operations dashboard for small agencies. I modeled workspace-level data isolation, implemented permission-aware CRUD workflows, and connected live operational data to a focused performance overview.

Include the live demo, GitHub repository, a 60–90 second walkthrough, screenshots, the architecture trade-offs, and the next improvements.
