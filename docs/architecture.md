# PulseBoard architecture notes

## Boundary map

```text
Browser
  │
  ▼
Next.js App Router
  ├── Public marketing routes
  ├── Auth routes
  └── Protected workspace routes
          │
          ├── Permission-aware domain operations
          ├── Supabase Auth session
          └── PostgreSQL + Row Level Security
                    ├── Workspace-owned records
                    └── Activity history
```

## Data ownership rule

A workspace is the tenant boundary. Every business record—client, project, task, activity event, and invitation—must carry `workspace_id`. The application derives the active workspace from the authenticated user’s membership and checks that membership before reading or mutating data.

The client-side workspace identifier is a navigation hint, not an authorization mechanism. Database policies and server-side domain functions remain authoritative.

## Why Supabase for this portfolio project?

Supabase keeps authentication and relational PostgreSQL data close together while preserving the concepts that matter in real SaaS work: sessions, memberships, policies, migrations, and typed data boundaries. It reduces infrastructure overhead for a student portfolio project without hiding the important engineering decisions.

## Future AI boundary

The AI Workspace Brief should receive a compact, non-sensitive summary of already-authorized workspace metrics. It should return structured sections—wins, risks, follow-ups, and next-week suggestions—and never become the source of truth for permissions or business data.
