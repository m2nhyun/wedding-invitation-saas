# Setup

## Local Environment

Create `.env.local` from `.env.example`.

```bash
ADMIN_PASSWORD=jjym0818
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_` variables are visible in browser bundles. Only public Supabase URL and anon key should use that prefix. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_schema.sql` in SQL editor or through Supabase CLI.
3. Confirm the `wedding-media` Storage bucket exists and is public.
4. Add the same env values to Vercel Project Settings.

## Admin

The first admin version uses a single password from `ADMIN_PASSWORD`.

- Login page: `/admin`
- Dashboard: `/admin/dashboard`
- Session: signed httpOnly cookie

This can later be replaced by Supabase Auth without changing the public invitation route.
