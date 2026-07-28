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
DATABASE_URL=
POSTGRES_URL=
SUPABASE_DB_URL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
# Public member auth (signup/login/profile). Required for the membership flow.
MEMBER_SESSION_SECRET=
MAIL_FROM=
MAIL_TO=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
# PayPal (Orders v2). Optional — without these the checkout stays bank-transfer / external-links only.
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
```

Use either Supabase API variables or one direct Postgres variable such as `DATABASE_URL`.
SMTP variables are optional for first deploy. Without them, the contact form stores messages in the database but skips email sending.
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are required for `/admin`.
`MEMBER_SESSION_SECRET` is required for public member login/signup/profile (generate a long random value).
PayPal variables are optional; without them the e-book checkout falls back to bank transfer / external store links.
Note: `NEXT_PUBLIC_*` variables are inlined at build time — set them as build-time env in Coolify as well.

## Supabase setup

1. Run `database/schema.sql` in Supabase SQL Editor (includes the e-commerce tables).
2. Create a **public** Storage bucket named `legacy-assets` (page images / media library).
3. Create a **private** Storage bucket named `member-assets` (protected e-book downloads).
4. Fill the Supabase, admin and member env variables in Coolify.

## Admin panel

- URL: `/admin`
- Login: `/admin/login`
- Auth: single password from `ADMIN_PASSWORD`
- Sections: dashboard, content pages, categories, revision requests, messages, settings

Public pages keep working with fallback content when Supabase is not configured. `/admin` requires admin env vars, and database-backed admin actions require Supabase service role env vars.
