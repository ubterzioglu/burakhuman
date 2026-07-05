# Coolify Deployment

This app is ready for Coolify using the included `Dockerfile`.

## Build settings

- Build Pack: `Dockerfile`
- Port: `3000`
- Healthcheck path: `/api/health`
- Start command: leave empty; Docker uses `node server.js`

## Required environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
MAIL_FROM=
MAIL_TO=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

SMTP variables are optional for first deploy. Without them, the contact form stores messages in Supabase but skips email sending.
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are required for `/admin`.

## Supabase setup

1. Run `database/schema.sql` in Supabase SQL Editor.
2. Create a public Storage bucket named `legacy-assets`.
3. Fill the Supabase and admin env variables in Coolify.

## Admin panel

- URL: `/admin`
- Login: `/admin/login`
- Auth: single password from `ADMIN_PASSWORD`
- Sections: dashboard, content pages, categories, revision requests, messages, settings

Public pages keep working with fallback content when Supabase is not configured. `/admin` requires admin env vars, and database-backed admin actions require Supabase service role env vars.
