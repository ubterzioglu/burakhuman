# Human Consciousness Decoded

Next.js App Router + Supabase Postgres rebuild of the legacy `httpdocs` ASP.NET WebForms site.

## Run locally

```bash
npm install
npm run dev
```

The public site works with fallback content if Supabase env vars are not configured. Admin login uses `ADMIN_PASSWORD`; database-backed admin actions require Supabase.

## Supabase setup

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL Editor.
3. Create a public Storage bucket named `legacy-assets`.
4. Copy `.env.example` to `.env.local` and fill Supabase or direct Postgres, admin password/session secret, and optional SMTP values.

Admin login is a single-password flow:

```bash
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=generate-a-long-random-string
```

Database access works with Supabase API env vars, or a direct Postgres connection string:

```bash
DATABASE_URL=postgresql://...
```

For local development only, a raw Postgres URL pasted into `.env.local` is also detected, but Coolify/production should use `DATABASE_URL`.

## Routes

- `/`
- `/books`
- `/blogs`
- `/contact`
- `/product1`
- `/i/[id]-[slug]`
- `/admin`
- `/admin/revisions`

Legacy `.aspx` URLs are redirected where applicable.

## Coolify

Coolify deployment is supported with the included `Dockerfile`.

- App port: `3000`
- Healthcheck: `/api/health`
- Full deployment notes: `coolify.md`
