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
MAIL_FROM=
MAIL_TO=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

SMTP variables are optional for first deploy. Without them, the contact form stores messages in Supabase but skips email sending.

## Supabase admin setup

1. Run `database/schema.sql` in Supabase SQL Editor.
2. Create a public Storage bucket named `legacy-assets`.
3. Create an Auth user for the site admin.
4. Add that user to `admin_profiles`:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('AUTH_USER_UUID', 'Admin', 'admin');
```

5. In Supabase Auth URL settings, add your Coolify domain as the site URL.

## Admin panel

- URL: `/admin`
- Login: `/admin/login`
- Sections: dashboard, content pages, categories, messages, settings

Public pages keep working with fallback content when Supabase is not configured, but `/admin` requires Supabase.
