# Setup

## Local Environment

Create `.env.local` from `.env.example`.

```bash
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
ADMIN_CODE_SECRET=replace-with-at-least-32-random-characters
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=replace-with-a-long-password

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_` variables are visible in browser bundles. Only public Supabase URL and anon key should use that prefix. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## Supabase

1. Create a Supabase project.
2. Run the migrations in `supabase/migrations` through Supabase CLI.
3. Confirm the `wedding-media` Storage bucket exists and is public.
4. Add the same env values to Vercel Project Settings.

## Admin

The admin uses invitation-specific admin codes.

- Login page: `/admin`
- Dashboard: `/admin/[slug]`
- Session: signed httpOnly cookie that stores the authorized invitation slug
- Code lookup: HMAC-SHA256 hash stored in `invitations.admin_code_hash`
- New invitation creation: clone an existing dashboard, generate a new admin code, and show it once

Do not make the public slug and admin code identical. The public URL can be shared widely, while the admin code should be treated like a password.

## Super Admin

The super admin is separate from invitation-specific admin codes.

- Login page: `/admin/super`
- Credentials: `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`
- Capabilities: list invitations and reset invitation admin codes
- Reset codes are shown only once after regeneration
