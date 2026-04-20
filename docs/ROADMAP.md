# Wedding Invitation SaaS Roadmap

## Product Direction

Build a mobile-first wedding invitation that can later support multiple invitation pages through a small SaaS-style admin.

The first real customer is our own invitation. The system should still be shaped around reusable invitation records instead of a hard-coded single page.

## Phase 1: App Foundation

- Dynamic public invitation route: `/w/[slug]`
- Admin entry route: `/admin`
- Mock invitation data model
- Detailed mobile invitation UI
- Exclude RSVP and guest upload features for now
- Keep data boundaries ready for Supabase

## Phase 2: Supabase Integration

- Add Supabase client packages
- Create schema SQL for invitations, media, accounts, and admin records
- Create Storage bucket for invitation media
- Replace mock data reads with Supabase reads
- Add seed data for `jjym0818`

## Phase 3: Admin Editing

- `ADMIN_PASSWORD` based login
- httpOnly session cookie
- Protected admin layout
- Edit couple, wedding, copy, location, and account fields
- Upload hero, gallery, timeline, location, and OG images

Current admin authentication is a single global password for the whole app. It does not yet route different passwords to different invitations.

Target multi-invitation admin model:

- Public page: `/w/[slug]`
- Admin page: `/admin/[slug]`
- Login: invitation-specific admin code
- Storage: hashed admin code per invitation, never plaintext
- Session: stores the authorized invitation slug
- Authorization: every admin mutation checks both session and invitation slug

## Phase 4: Publishing Workflow

- Draft and published states
- Slug management
- Preview URL
- Open Graph metadata
- Vercel environment variable checklist

## Explicitly Deferred

- RSVP form
- Guest photo/video uploads
- Guestbook
- Payment links
- Multi-tenant billing
