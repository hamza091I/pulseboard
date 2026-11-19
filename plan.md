# PulseBoard — Implementation and Design Plan

## Product intent

PulseBoard is a multi-tenant operations dashboard for small agencies. Each agency has an isolated workspace where its team can manage clients, projects, tasks, members, activity history, and live delivery metrics.

The product is intentionally narrower than a generic project-management tool: it is a portfolio-quality demonstration of a real SaaS foundation, with strong data boundaries and a calm operational interface.

## Implementation approach

- **Frontend:** Next.js App Router with TypeScript and Tailwind CSS.
- **Backend boundary:** Supabase Auth and PostgreSQL, accessed through server-safe clients and typed domain functions.
- **Data model:** Every workspace-owned record carries `workspace_id`; membership determines access.
- **Permissions:** Owner, Admin, and Member roles are enforced in domain operations, not only hidden in the UI.
- **Validation:** Zod schemas sit at the boundary of every form and mutation.
- **Observability:** Important mutations create `activity_logs` records for a filterable audit feed.
- **Deployment:** Vercel for the Next.js application and Supabase for authentication/database services.
- **AI extension:** After the core application is stable, an AI Workspace Brief will summarize grounded workspace metrics using structured output.

## Repository structure

```text
app/                  Route segments, pages, layout, metadata, and global styles
components/           Reusable product UI grouped by domain
lib/                  Supabase clients, permissions, validation, and domain services
types/                Generated database types and shared domain types
supabase/migrations/  Ordered SQL migrations and Row Level Security policies
supabase/seed.sql     Deterministic demo data for the showcase workspace
public/               Static files and route manifest
docs/                 Architecture and portfolio documentation
```

## Phase 0 boundaries

Phase 0 creates a clean, runnable foundation without pretending that the product already has authentication or persisted data. It includes:

- Next.js and TypeScript configuration.
- Tailwind/PostCSS configuration.
- Safe environment template.
- Supabase dependencies ready for the next phase.
- A responsive landing page that communicates the product direction.
- A stable visual language for the future application shell.
- Project documentation, route manifest, and quality scripts.

It deliberately does not add a fake dashboard, fake login, or hard-coded production data.

## Design direction

### Considered styles

1. **Quiet B2B editorial** — 0.07 probability: generous whitespace, precise typography, and restrained product surfaces.
2. **Operational instrument panel** — 0.06 probability: dense utility UI, status colors, and compact data blocks.
3. **Playful startup canvas** — 0.04 probability: bright gradients, expressive illustrations, and more consumer-like motion.

### Chosen movement: Quiet B2B editorial

PulseBoard should feel like a calm control room for a team that takes delivery seriously: precise enough for operations, warm enough for a small agency, and quiet enough that the important signal wins.

### Core principles

- **Clarity before decoration:** every visual element should explain hierarchy or state.
- **Visible accountability:** ownership, status, and activity should be legible without digging.
- **Soft confidence:** use subtle surfaces and restrained contrast rather than loud gradients.
- **Progressive detail:** show the next useful decision first; expose depth on demand.

### Color philosophy

The base is near-white and ink rather than stark black-and-white, creating a paper-like editorial foundation. A proprietary violet accent marks action and progress; cyan is reserved for supporting signals. Emerald communicates healthy state, while amber is used sparingly for attention. The palette should feel trustworthy and composed, not playful or alarmist.

### Layout paradigm

Use a left-anchored workspace model: persistent navigation establishes the mental map, while a wide content canvas lets tables, forms, and metrics breathe. Marketing pages pair a focused narrative column with a product preview rather than centering every element in a generic grid.

### Signature elements

- A compact `PB` monogram used as the product anchor.
- Violet progress bars and status marks that identify the active signal.
- Rounded, low-contrast data surfaces that make the interface feel assembled rather than boxed in.

### Interaction philosophy

Actions should be explicit and reversible. Destructive operations need confirmation, mutations need visible feedback, and empty states should tell the user what to do next. Permission-aware actions should disappear from the UI when unavailable, while the server still enforces the same rule.

### Animation

Keep motion short and purposeful: 150–220ms transitions for hover/focus, a small upward lift for interactive cards, and skeletons rather than distracting spinners for loading. Avoid ambient motion in the application shell; use motion only to explain a state change.

### Typography system

Use a clean system sans stack for reliable rendering in the foundation phase, with tight tracking for major headings and relaxed line-height for explanatory text. Headlines are compact and confident; labels are small, uppercase, and letter-spaced only when they act as category markers.

### Brand essence

**PulseBoard is the calm operating layer for small agencies that want client work to stay visible, owned, and moving.**

Personality: **focused, accountable, composed**.

### Brand voice

Headlines are direct and outcome-oriented. CTAs describe the next action rather than making vague promises.

- “Agency operations, in focus.”
- “See what needs attention. Move every project forward.”

### Wordmark and logo

The wordmark pairs the name in a compact semibold sans with a square `PB` monogram. The monogram is deliberately simple so it can live in a sidebar, favicon, or project badge without losing recognition.

### Signature brand color

Pulse Violet — `#7F56D9` — is the ownable action color. It signals momentum, not urgency, and creates a consistent bridge between the marketing page and future dashboard states.

## Constraints and decisions

- Phase 0 must run without Supabase credentials; integration begins in Phase 1.
- No secrets are committed; `.env.example` contains names and safe placeholders only.
- No fake authenticated experience is presented as complete.
- The route manifest is kept synchronized as routes are added.
- The project uses pnpm 11.25.0 and an explicit build-script policy.
