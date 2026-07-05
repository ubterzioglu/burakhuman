# Human Consciousness Decoded

Next.js App Router + Supabase Postgres rebuild of the legacy `httpdocs` ASP.NET WebForms site.

## Run locally

```bash
npm install
npm run dev
```

The public site works with fallback content if Supabase env vars are not configured. Admin CMS requires Supabase.

## Supabase setup

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL Editor.
3. Create a public Storage bucket named `legacy-assets`.
4. Add an Auth user, then insert that user into `admin_profiles`:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('AUTH_USER_UUID', 'Admin', 'admin');
```

5. Copy `.env.example` to `.env` and fill Supabase and optional SMTP values.

## Routes

- `/`
- `/books`
- `/blogs`
- `/contact`
- `/product1`
- `/i/[id]-[slug]`
- `/admin`

Legacy `.aspx` URLs are redirected where applicable.

## Coolify

Coolify deployment is supported with the included `Dockerfile`.

- App port: `3000`
- Healthcheck: `/api/health`
- Full deployment notes: `coolify.md`
