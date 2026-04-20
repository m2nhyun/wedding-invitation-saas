# Wedding Invitation SaaS

Mobile-first wedding invitation builder built with Next.js, Vercel, and Supabase.

The app is structured around multiple invitation records. Each public invitation has a shareable slug, and each admin login uses a separate invitation-specific admin code.

## Routes

- Public invitation: `/w/[slug]`
- Admin login: `/admin`
- Invitation admin: `/admin/[slug]`
- Super admin: `/admin/super`

## Current Admin Flow

- Login with an admin code.
- The code is hashed and matched against `invitations.admin_code_hash`.
- The session stores the authorized invitation slug in an httpOnly cookie.
- Admin mutations verify that the session slug matches the invitation being edited.
- From an existing admin dashboard, create a new invitation by cloning the current invitation as a template.
- New invitations start as `draft`.
- Newly generated admin codes are shown once after creation and are not stored as plaintext.
- Super admin can create invitations from a template, list invitations, toggle publish state, and reset an invitation admin code.
- Super admin operations are recorded in `admin_audit_logs` without storing plaintext admin codes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Useful local URLs:

- [http://localhost:3000/w/jjym0818](http://localhost:3000/w/jjym0818)
- [http://localhost:3000/admin](http://localhost:3000/admin)

## Environment

See [docs/SETUP.md](docs/SETUP.md).

Required values:

```bash
ADMIN_SESSION_SECRET=
ADMIN_CODE_SECRET=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Docs

- [Roadmap](docs/ROADMAP.md)
- [Setup](docs/SETUP.md)
- [Data model](docs/DATA_MODEL.md)

## Verification

```bash
npm run lint
npm run build
```
