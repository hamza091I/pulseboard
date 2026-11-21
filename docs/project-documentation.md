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
