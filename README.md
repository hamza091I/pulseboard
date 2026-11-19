# PulseBoard

PulseBoard is a multi-tenant SaaS operations dashboard for small agencies. It gives teams one focused workspace to manage clients, projects, tasks, members, activity history, and delivery signals.

> **Portfolio positioning:** A full-stack operations workspace that shows authentication, workspace isolation, role-based permissions, relational data, live metrics, and production-minded UX.

## Current status

**Phase 0 — Foundation complete.** The repository includes the Next.js/TypeScript application shell, the visual foundation, environment template, project documentation, route manifest, Supabase-ready dependencies, and a polished marketing landing page.

Authentication, database schema, workspace isolation, CRUD modules, and dashboard data will be introduced in the next phases.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL (prepared for the next phase)
- Zod (prepared for server-side validation)
- Lucide React
- Vercel deployment target
- pnpm 11

## Run locally

### Prerequisites

- Node.js 20+
- pnpm 11+
- A Supabase project for the next phase (not required to view the Phase 0 landing page)

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the public Supabase URL and anon key when the authentication/database phase begins. Never commit `.env.local`, a service-role key, or any other secret.

## Repository map

```text
app/                  Next.js routes, layout, global styles, and landing page
components/           Reusable UI components (expanded in later phases)
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

The first useful release will support:

- Workspace onboarding and protected routes.
- Owner, Admin, and Member roles.
- Clients, projects, and tasks with real relationships.
- Database-backed KPIs and activity history.
- Responsive B2B SaaS navigation and stateful forms.
- A future AI Workspace Brief grounded in live workspace data.

## Portfolio case study outline

When the product is complete, describe it as:

> I designed and built a multi-tenant SaaS operations dashboard for small agencies. I modeled workspace-level data isolation, implemented permission-aware CRUD workflows, and connected live operational data to a focused performance overview.

Include the live demo, GitHub repository, a 60–90 second walkthrough, screenshots, the architecture trade-offs, and the next improvements.
