# PulseBoard Project Documentation

## 1. Project overview

PulseBoard is a multi-tenant SaaS operations dashboard for small agencies and delivery teams. It is designed as a focused operational workspace rather than a generic project-management product.

The product addresses a common agency problem: client information, project delivery, task ownership, team access, and operational updates are often spread across several tools. PulseBoard consolidates those signals into one workspace so a team can understand what is active, what is overdue, who is responsible, and what changed recently.

The project also serves as a full-stack portfolio case study. It demonstrates product thinking, interface design, authentication, relational data modeling, tenant isolation, database authorization, server-side session handling, API design, AI integration, testing, documentation, and production packaging.

## 2. Product goals

The product was built around five goals:

1. Give a small agency a clear daily operating overview.
2. Keep data isolated by workspace at the database layer.
3. Connect clients, projects, and tasks through real PostgreSQL relationships.
4. Keep the interface calm, responsive, and easy to explain in a portfolio walkthrough.
5. Add AI as an optional summary layer without allowing AI to control permissions or become the source of truth.

The project deliberately avoids presenting fake authenticated data as a finished product. The public landing page works without Supabase credentials, while the application workspace requires real authentication and persisted data.

## 3. Delivery phases

### Phase 0: foundation and product direction

Phase 0 established the project identity and technical foundation.

Delivered outcomes:

- Next.js App Router project structure.
- React and TypeScript setup.
- Tailwind CSS and PostCSS configuration.
- ESLint and Prettier configuration.
- pnpm package management.
- Safe `.env.example` template.
- Public landing page.
- Initial responsive layout and visual system.
- Route manifest at `public/manus-routes.json`.
- Product plan and design direction.
- Architecture notes.
- A clear separation between the public marketing experience and the future authenticated application.

The design direction was named Quiet B2B Editorial. It uses generous whitespace, near-white surfaces, dark ink text, restrained borders, a violet action color, and compact status signals. The intent is to make the product feel reliable and operational rather than noisy or overly decorative.

### Phase 1: authentication and workspace onboarding

Phase 1 connected the application to Supabase.

Delivered outcomes:

- Supabase browser client using `@supabase/ssr`.
- Supabase server client with cookie support.
- Authenticated session lookup with `supabase.auth.getUser()`.
- Signup page.
- Login page.
- Auth callback route for email confirmation.
- Middleware session refresh.
- Protection for `/app` routes.
- Workspace onboarding page.
- `profiles` table.
- `workspaces` table.
- `workspace_members` table.
- `handle_new_user` database trigger.
- Secure `create_workspace` function.
- Owner membership creation during onboarding.
- Initial RLS policies.

The onboarding RPC is security-sensitive. It derives the owner from `auth.uid()` instead of trusting a user ID sent by the browser.

### Phase 2: operations data and workspace modules

Phase 2 added the actual product workspace.

Delivered outcomes:

- Clients table and page.
- Projects table and page.
- Tasks table and page.
- Activity log table and page.
- Team members page.
- Workspace settings page.
- Shared application shell and sidebar navigation.
- Dashboard KPI cards.
- Project momentum list.
- Recent activity feed.
- Connected project-to-client records.
- Connected task-to-project records.
- Create forms for clients, projects, and tasks.
- Activity logging for create operations.
- Database triggers for `updated_at` values.
- RLS policies for operational tables.

### Phase 3: demo, AI, and production readiness

The later implementation work focused on making the project easy to demonstrate and closer to production quality.

Delivered outcomes:

- Authenticated demo data loader.
- Safe demo seed protection that refuses to overwrite an existing client dataset.
- AI Workspace Brief API.
- Grounded fallback when no AI key is configured.
- OpenAI-compatible server-side model support.
- Dockerfile using Next.js standalone output.
- `/api/health` endpoint.
- Webdev deployment contract with Docker health path.
- Workspace lookup diagnostics.
- Visible protected application error screen.
- Membership troubleshooting guidance.
- Improved README and project documentation.

### Quality and maintainability milestones

The final milestone work added maintainability improvements that are useful in a real repository:

- GitHub Actions CI workflow.
- Docker build context exclusions.
- Zod validation for create forms.
- Protected workspace loading state.
- Shared API response helpers.
- Shared date and status formatting utilities.
- Client status filtering.
- Project search and status filtering.
- Task search and status filtering.
- Activity search and action filtering.
- Client pagination utility and pagination UI.
- Open Graph and social sharing metadata.
- Safe response security headers.
- Production health smoke script.
- Database row TypeScript contracts.
- AI workspace lookup hardening.
- Branded 404 page.
- Accessibility semantics for the record modal.

## 4. Technical architecture

The request flow is organized into three layers:

```text
Browser
  |
  v
Next.js App Router
  |
  +-- Public marketing routes
  +-- Authentication routes
  +-- Protected workspace routes
  |       |
  |       +-- Server Supabase client
  |       +-- Browser Supabase client
  |       +-- Workspace membership resolution
  |       +-- Product pages and components
  |       +-- API routes
  |
  v
Supabase
  |
  +-- Auth users and sessions
  +-- PostgreSQL relational data
  +-- Workspace memberships
  +-- Row Level Security policies
```

### Public routes

- `/`: product landing page.
- `/login`: login form.
- `/signup`: account creation form.
- `/onboarding`: workspace creation flow.
- `/auth/callback`: email confirmation callback.

### Protected routes

- `/app`: overview dashboard.
- `/app/clients`: client relationships and creation flow.
- `/app/projects`: projects, search, status filters, and client relationships.
- `/app/tasks`: tasks, search, status filters, and project relationships.
- `/app/team`: workspace members and role display.
- `/app/activity`: activity history, search, and action filters.
- `/app/settings`: workspace settings context.

The `app/app/layout.tsx` file is the protected shell. It calls `getCurrentWorkspace()` before rendering the sidebar and child page. This means child pages receive a workspace context only after authentication and membership resolution succeed.

## 5. Authentication flow

The authentication flow uses Supabase email/password authentication.

### Signup flow

1. The visitor opens `/signup`.
2. The browser Supabase client calls `signUp`.
3. Supabase creates the auth user.
4. The database trigger creates a corresponding profile row.
5. If email confirmation is enabled, Supabase sends a confirmation email.
6. The user returns through `/auth/callback`.
7. The application sends the authenticated user to the application or onboarding flow.

### Login flow

1. The user submits the login form.
2. The browser client calls `signInWithPassword`.
3. Supabase stores the session in cookies.
4. Middleware refreshes the session on protected requests.
5. The protected layout resolves the user's workspace membership.

### Middleware behavior

`middleware.ts` performs a session lookup when Supabase environment variables exist. It redirects unauthenticated visitors away from `/app` to `/login`. It also redirects authenticated visitors away from `/login` and `/signup` toward `/app`.

Middleware protects the route boundary, but it does not decide workspace membership. That decision belongs to `lib/workspace.ts` and the database policies.

## 6. Workspace resolution and the diagnostic fix

The application originally used a nested Supabase relationship query that selected a membership and its workspace in one response. It also ignored the Supabase error object. That made a relationship or RLS failure look identical to a user with no workspace, so the application redirected to onboarding without showing the cause.

The corrected server flow is intentionally explicit:

```text
1. Read the authenticated user.
2. Query workspace_members for that user.
3. If there is no membership, show the onboarding reason.
4. Query workspaces using membership.workspace_id.
5. If the workspace query fails, throw a visible lookup error.
6. If the workspace is missing, explain the broken relationship.
7. Return the complete workspace context.
```

The same two-query approach is implemented in `lib/client-workspace.ts` for browser-side pages.

The protected error UI is `app/app/error.tsx`. It displays the actual error message and gives the user a retry action. The onboarding diagnostic uses `reason=no-membership` to explain that the authenticated user's `auth.users.id` should be compared with `workspace_members.user_id`.

## 7. Database design

### Profiles

`profiles` stores application-level profile information linked one-to-one to `auth.users`.

Important columns:

- `id`: auth user ID.
- `full_name`.
- `avatar_url`.
- `created_at`.

### Workspaces

`workspaces` is the tenant table.

Important columns:

- `id`.
- `name`.
- `slug`.
- `created_by`.
- `created_at`.

### Workspace members

`workspace_members` maps users to workspaces.

Important columns:

- `id`.
- `workspace_id`.
- `user_id`.
- `role`.
- `joined_at`.

A unique constraint prevents the same user from being added twice to the same workspace.

### Clients

Clients belong to a workspace and contain relationship information.

Important columns:

- `workspace_id`.
- `name`.
- `company`.
- `email`.
- `phone`.
- `status`.
- `notes`.
- `created_at`.
- `updated_at`.

### Projects

Projects belong to a workspace and can optionally reference a client.

Important columns:

- `workspace_id`.
- `client_id`.
- `name`.
- `description`.
- `status`.
- `priority`.
- `budget`.
- `start_date`.
- `due_date`.
- `created_by`.
- `created_at`.
- `updated_at`.

### Tasks

Tasks belong to both a workspace and a project.

Important columns:

- `workspace_id`.
- `project_id`.
- `assigned_to`.
- `title`.
- `description`.
- `status`.
- `priority`.
- `due_date`.
- `created_at`.
- `updated_at`.

### Activity logs

Activity logs create an audit-style history of important changes.

Important columns:

- `workspace_id`.
- `user_id`.
- `entity_type`.
- `entity_id`.
- `action`.
- `description`.
- `created_at`.

The current create workflows record `created` events. The schema also supports `updated`, `deleted`, `status_changed`, and `invited` actions for future workflows.

## 8. Row Level Security

Every workspace-owned table enables RLS. Policies use helper functions from the first migration:

- `is_workspace_member(target_workspace_id)` checks membership.
- `workspace_role(target_workspace_id)` returns the current user's role.

The general policy model is:

- Workspace members can read workspace-owned records.
- Workspace members can create records in their workspace.
- Owners and admins can update or delete protected operational records according to the table policy.
- Activity inserts require `user_id = auth.uid()`.
- Workspace membership operations are controlled by owner/admin policies.

The browser cannot choose an arbitrary workspace and bypass these policies. The database remains the final authorization boundary.

## 9. API routes

### `POST /api/demo/seed`

Requires an authenticated user with a workspace membership. It creates connected showcase data only when the workspace does not already contain clients.

Returns:

```json
{ "ok": true }
```

The route returns an error when the user is unauthenticated, has no workspace, or the workspace already contains demo-protected data.

### `POST /api/ai/brief`

Requires an authenticated user and a visible workspace membership. It performs separate membership and workspace lookups, collects authorized metrics, and returns either AI or fallback output.

Fallback response shape:

```json
{
  "brief": {
    "title": "Workspace brief",
    "wins": ["1 tasks completed"],
    "risks": ["0 overdue tasks need review"],
    "next": "Review the highest-priority open task and confirm the next client handoff."
  },
  "source": "fallback"
}
```

### `GET /api/health`

Returns a lightweight unauthenticated service check:

```json
{
  "status": "ok",
  "service": "pulseboard"
}
```

## 10. AI boundary

The AI feature is deliberately limited to summarization.

The route does not send auth credentials, service-role credentials, or arbitrary client-provided workspace IDs to the model. It first resolves the user's workspace through Supabase, then queries data authorized for that workspace, then sends a compact metrics object to an OpenAI-compatible endpoint.

The fallback ensures the feature remains useful in a free local setup. If the AI provider is absent, unavailable, or returns invalid JSON, PulseBoard returns grounded metrics instead of failing the dashboard.

## 11. Validation and UI resilience

Record forms use Zod schemas in `lib/validation.ts`:

- `clientRecordSchema` validates client names, optional company, email, and status.
- `projectRecordSchema` validates project name, status, priority, dates, and optional client ID.
- `taskRecordSchema` validates task title, status, priority, dates, and required project ID.

The UI also includes:

- Protected workspace loading skeleton.
- Protected application error boundary.
- Branded 404 page.
- Empty states for records and activity.
- Search inputs and filters.
- Client pagination.
- Modal semantics and accessible labels for creation controls.
- Disabled states during form submission.

## 12. CI and production checks

The GitHub Actions workflow at `.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`.

It performs:

```text
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

The `scripts/smoke-health.sh` script verifies that the production server returns the expected health response.

The project has also been checked locally with:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## 13. Docker and deployment

`next.config.ts` enables standalone output. The production `Dockerfile` uses a multi-stage build:

1. Install dependencies with pnpm.
2. Build the Next.js application.
3. Copy the standalone server and static assets into a small runtime image.
4. Run as a non-root `nextjs` user.
5. Expose port `3000`.
6. Start `server.js`.

`.dockerignore` excludes Git data, dependencies, build output, environment secrets, and documentation from the Docker context.

Runtime Supabase and AI variables must be injected by the deployment platform. They must not be copied into the image.

## 14. Environment variables

Required public variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Optional server-only variables:

```env
OPENAI_API_KEY=your-server-side-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

The service-role key is intentionally not required by the current application flows. If it is added for a future server-only administration feature, it must never be exposed to the browser.

## 15. Local setup checklist

```bash
pnpm install
cp .env.example .env.local
```

Then:

1. Add the Supabase URL and anon key.
2. Run migration 001 in Supabase SQL Editor.
3. Run migration 002 in Supabase SQL Editor.
4. Configure the local auth redirect URL.
5. Start the app with `pnpm dev`.
6. Create an account.
7. Confirm the email if required.
8. Create a workspace.
9. Load demo data.
10. Run the quality checks.

## 16. Portfolio walkthrough

A strong demonstration sequence is:

1. Show the landing page and explain the agency operations problem.
2. Create or sign into an account.
3. Complete workspace onboarding.
4. Show the workspace-specific sidebar and dashboard.
5. Load demo data.
6. Explain the KPI cards.
7. Open a project and show the client relationship.
8. Open tasks and show project relationships and filters.
9. Open Activity and show recorded create events.
10. Run the AI Workspace Brief.
11. Explain Row Level Security and the workspace lookup diagnostic.
12. Show the GitHub repository, migrations, CI workflow, and README.

## 17. Honest scope boundaries

The current release is portfolio-ready and demonstrates the full SaaS foundation. It is not positioned as a finished enterprise product.

Recommended future extensions include:

- Email-based member invitations.
- Full edit and delete workflows.
- Member role management UI.
- Generated Supabase database types from the live schema.
- Automated browser and API tests.
- Pagination at the database query level for very large workspaces.
- Billing and subscription management.
- Notifications and reminders.
- Production deployment with a public live demo.
- Audit log export.
- More granular permission policies.

These boundaries are documented so the project remains credible in a technical review.

## 18. Implementation reference by directory

The repository is intentionally small enough to understand as a complete system. The following map explains the responsibility of each important area.

### `app/`

The `app` directory contains the Next.js App Router entry points.

- `app/page.tsx` renders the public product landing page.
- `app/layout.tsx` defines root metadata, global styles, and the document shell.
- `app/globals.css` contains global CSS, design tokens, and shared visual rules.
- `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` render the authentication screens.
- `app/auth/callback/route.ts` exchanges the Supabase authorization code and redirects the user into the application.
- `app/onboarding/page.tsx` lets an authenticated user create the first workspace.
- `app/app/layout.tsx` is the protected workspace layout. It resolves the current workspace before rendering navigation and child pages.
- `app/app/page.tsx` renders dashboard metrics, project momentum, recent activity, demo data access, and the AI brief action.
- `app/app/clients/page.tsx` renders client records, creation, search, status filtering, and pagination.
- `app/app/projects/page.tsx` renders projects, client relationships, search, status filtering, and creation.
- `app/app/tasks/page.tsx` renders project-linked tasks, search, status filtering, and creation.
- `app/app/team/page.tsx` renders workspace members and their roles.
- `app/app/activity/page.tsx` renders the workspace activity history and filtering controls.
- `app/app/settings/page.tsx` renders the current workspace identity and role context.
- `app/app/loading.tsx` provides the protected-route loading skeleton.
- `app/app/error.tsx` catches protected workspace failures and displays a retryable diagnostic state.
- `app/not-found.tsx` provides the branded application-level 404 experience.
- `app/api/health/route.ts` exposes the unauthenticated health check.
- `app/api/demo/seed/route.ts` creates safe showcase data for an empty workspace.
- `app/api/ai/brief/route.ts` creates a grounded workspace summary using either the configured model or a local fallback.

### `components/`

Reusable client and presentation components live here.

- `record-form.tsx` provides the shared create form for clients, projects, and tasks. It selects the correct Zod schema based on the record type and reports validation errors before submitting.
- `ai-brief.tsx` triggers the AI brief request and renders the returned wins, risks, and next action.
- `demo-seed-button.tsx` starts the protected demo-data request and handles pending and error states.
- `activity-filters.tsx` manages Activity Log search and action filters.
- `ui.tsx` contains shared visual primitives such as page headers, status badges, and empty states.

### `lib/`

The `lib` directory contains domain helpers and integration boundaries.

- `lib/supabase/client.ts` creates the browser Supabase client.
- `lib/supabase/server.ts` creates the server Supabase client with cookie-aware SSR behavior.
- `lib/workspace.ts` resolves the authenticated user's workspace on the server and preserves database diagnostics.
- `lib/client-workspace.ts` performs the equivalent browser-side lookup where client rendering needs workspace context.
- `lib/activity.ts` centralizes activity-log creation for important operations.
- `lib/api.ts` standardizes successful and failed JSON responses.
- `lib/format.ts` centralizes display formatting for dates and status values.
- `lib/pagination.ts` contains reusable page calculations for client-side pagination.
- `lib/validation.ts` contains Zod schemas for client, project, and task create payloads.

### `types/`

- `types/domain.ts` contains shared domain unions and UI-facing record types.
- `types/database.ts` documents the expected database row contracts for TypeScript consumers.

### `supabase/`

- `supabase/migrations/001_phase_1_auth_workspaces.sql` creates profiles, workspaces, memberships, auth triggers, onboarding RPC logic, helper functions, and initial RLS policies.
- `supabase/migrations/002_phase_2_operations.sql` creates clients, projects, tasks, activity logs, indexes, timestamp triggers, and operational RLS policies.
- `supabase/seed.sql` contains safe seed guidance and is not a substitute for the authenticated demo route.

### Configuration and delivery files

- `middleware.ts` refreshes Supabase sessions and protects route boundaries.
- `next.config.ts` enables standalone output and safe response headers.
- `Dockerfile` builds and runs the standalone production server.
- `.dockerignore` keeps dependencies, build artifacts, Git data, environment files, and development-only content out of the Docker context.
- `.github/workflows/ci.yml` runs the reproducible CI checks.
- `scripts/smoke-health.sh` verifies the deployed health response.
- `app.config.ts` stores project-level metadata used by the managed project environment.
- `public/manus-routes.json` documents the application route manifest.
- `plan.md` records the product and implementation direction.
- `TODO.md` records completed milestones and future scope.

## 19. End-to-end request flows

### New user to first workspace

```text
Signup form
  → Supabase signUp
  → auth.users row
  → handle_new_user trigger
  → profiles row
  → auth callback/session
  → onboarding page
  → create_workspace(workspace_name)
  → workspaces row
  → workspace_members owner row
  → /app
```

The onboarding function is executed as a security-definer PostgreSQL function, but it derives the owner from `auth.uid()`. The browser supplies only the workspace name; it cannot choose another user as the owner.

### Protected dashboard request

```text
Browser request to /app
  → middleware refreshes the session
  → protected layout calls getCurrentWorkspace()
  → server client calls auth.getUser()
  → workspace_members is queried by authenticated user ID
  → workspaces is queried by membership.workspace_id
  → dashboard queries workspace-scoped records
  → UI renders metrics and activity
```

The application never treats a workspace ID supplied by the browser as sufficient authorization. The current user's membership and PostgreSQL RLS policies remain authoritative.

### Creating a project

```text
Project form
  → client-side Zod validation
  → server action/request with workspace context
  → projects insert with workspace_id and created_by
  → PostgreSQL RLS checks membership and creator
  → activity_logs insert for the create event
  → project list refreshes
```

The same pattern is used for clients and tasks. A task must reference an existing project, and a project may reference an existing client.

## 20. Domain relationships and invariants

The main relational graph is:

```text
auth.users 1 ─── 1 profiles
              │
              └──< workspace_members >── 1 workspaces
                                             │
                                             ├──< clients
                                             ├──< projects ─── optional client
                                             ├──< tasks ────── required project
                                             └──< activity_logs
```

Important database invariants include:

- A workspace name must contain between 2 and 80 characters after trimming.
- A workspace slug is unique and uses lowercase URL-safe characters.
- A user can have only one membership row per workspace.
- Client, project, task, and activity records carry `workspace_id`.
- Project names must contain between 2 and 140 characters.
- Task titles must contain between 2 and 180 characters.
- Project and task statuses are constrained to the domain values defined in the migrations.
- Deleting a workspace cascades to its workspace-owned records.
- Deleting a client nulls the optional `projects.client_id` relationship.
- Deleting a project cascades to its tasks.
- Deleting a user removes their profile and membership rows according to the foreign-key rules.
- `updated_at` is refreshed by database triggers for clients, projects, and tasks.

## 21. Status and role vocabulary

The application uses the following controlled values:

```text
Roles:          owner | admin | member
Client status:  lead | active | inactive
Project status: planning | active | on_hold | completed
Task status:    todo | in_progress | review | done
Priority:       low | medium | high
Activity action: created | updated | deleted | status_changed | invited
```

These values exist in both the TypeScript domain types and the PostgreSQL check constraints. Keeping the two layers aligned prevents invalid UI options from becoming invalid database rows.

## 22. API contract summary

### `GET /api/health`

This endpoint is intentionally unauthenticated so a platform health check can call it without a user session.

Success response:

```json
{
  "status": "ok",
  "service": "pulseboard"
}
```

### `POST /api/demo/seed`

This endpoint requires a signed-in user with a workspace. It refuses to seed a workspace that already contains client data, which protects existing records during portfolio demonstrations.

Expected success shape:

```json
{
  "ok": true
}
```

Typical failure categories are `401` for missing authentication, `400` for a missing workspace or non-empty workspace, and `500` for an unexpected database failure.

### `POST /api/ai/brief`

This endpoint does not accept a workspace ID from the browser. It derives the workspace from the authenticated user's membership, queries workspace-scoped metrics, and then chooses the AI or fallback path.

The compact model input contains project, task, and client fields needed for the summary. It does not contain the user's password, auth token, service-role key, or arbitrary data from another workspace.

## 23. Security model

PulseBoard uses defense in depth rather than relying on one UI check.

1. Supabase Auth establishes the identity.
2. Middleware protects the application route boundary.
3. Server-side workspace resolution derives the tenant from membership.
4. RLS policies enforce the tenant boundary in PostgreSQL.
5. Foreign keys and check constraints protect relational integrity.
6. Zod rejects malformed create payloads before database writes.
7. Server-only AI variables are not prefixed with `NEXT_PUBLIC_`.
8. The Docker image runs the standalone server as a non-root user.
9. Security response headers reduce common browser-side risks without preventing the application's preview embedding.
10. `.gitignore` and `.dockerignore` exclude local secrets and development artifacts.

The public Supabase anon key is intended for browser use under RLS. It is not a replacement for a service-role key and does not bypass database policies.

## 24. Developer workflow

A normal feature workflow is:

```bash
git checkout -b feat/short-description
pnpm install
pnpm dev
# implement and manually verify the change
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
git diff --check
git status --short
git commit -m "feat: describe the meaningful change"
git push origin feat/short-description
```

Before a release or portfolio update, also start the production server and run:

```bash
pnpm start
pnpm smoke:health
```

The smoke script uses `BASE_URL` when provided and otherwise checks `http://localhost:3000`:

```bash
BASE_URL=https://your-deployment.example.com pnpm smoke:health
```

Do not run `pnpm format` blindly over files that contain intentional formatting or generated output. Use `pnpm format:check` first and review changes before committing.

## 25. Troubleshooting runbook

### The app redirects to onboarding unexpectedly

1. Confirm that the user is signed in to the expected Supabase project.
2. Get the authenticated user's ID from `auth.users`.
3. Confirm that `workspace_members.user_id` matches that ID exactly.
4. Confirm that the membership's `workspace_id` points to an existing workspace.
5. Check whether RLS policies are enabled and present.
6. Read the protected error boundary instead of assuming that the user has no membership.

### The app says Supabase variables are missing

Check that `.env.local` exists at the repository root and contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the development server after changing environment variables. Never paste `.env.local` into GitHub, screenshots, or support messages.

### The AI brief returns the fallback

This is expected when `OPENAI_API_KEY` is absent. It can also happen when the provider returns a non-success status or invalid JSON. The fallback is designed to keep the dashboard functional and grounded in database metrics.

### Demo data cannot be loaded

The seed route deliberately rejects a workspace that already contains clients. This is a safety feature, not a failure. Use a fresh workspace for a clean portfolio demonstration.

### The production health check fails

1. Confirm that the server is running.
2. Confirm that the port and `BASE_URL` are correct.
3. Open `/api/health` directly.
4. Check container logs if the endpoint returns a non-200 status.
5. Confirm that the production build completed successfully.

## 26. Verification matrix

| Area                | Command or check          | Expected result                        |
| ------------------- | ------------------------- | -------------------------------------- |
| TypeScript          | `pnpm typecheck`          | No type errors                         |
| Lint                | `pnpm lint`               | No ESLint errors                       |
| Formatting          | `pnpm format:check`       | All files pass Prettier                |
| Production build    | `pnpm build`              | Next.js build completes                |
| Health endpoint     | `pnpm smoke:health`       | JSON status is `ok`                    |
| Authentication      | Signup and login manually | Session is created and refreshed       |
| Workspace isolation | Use two workspaces        | Records do not cross tenant boundaries |
| Onboarding          | Create a workspace        | Owner membership is created            |
| Demo safety         | Seed twice                | Second seed is rejected                |
| Activity            | Create a record           | Activity event is visible              |
| AI fallback         | Omit AI key               | Grounded local brief is returned       |
| AI provider path    | Configure server key      | Valid model response or safe fallback  |

## 27. Known scope boundaries

The current implementation is intentionally honest about what is and is not complete. It demonstrates a credible SaaS foundation, but the following are not yet implemented as full product workflows:

- Email invitation delivery and acceptance.
- Full member administration screens.
- Complete edit and delete UI for every record type.
- Billing, subscription enforcement, and payment processing.
- Push, email, or in-app notifications.
- Automated browser tests and comprehensive API integration tests.
- Database-level cursor pagination for very large datasets.
- Generated database types directly from a live Supabase schema.
- Public production hosting and a live demo URL.
- Advanced audit export and retention policies.

These boundaries are part of the documentation because professional credibility comes from accurately describing the current system, not from presenting planned work as finished functionality.
