# Data Model Draft

This is the target Supabase model. The current implementation uses `src/lib/mock-data.ts` with the same shape where practical.

## invitations

- `id uuid primary key`
- `slug text unique not null`
- `status text not null`
- `groom_name text`
- `groom_name_en text`
- `groom_father text`
- `groom_mother text`
- `bride_name text`
- `bride_name_en text`
- `bride_father text`
- `bride_mother text`
- `wedding_date date`
- `wedding_time time`
- `venue text`
- `hall text`
- `address text`
- `tel text`
- `kakao_map_url text`
- `naver_map_url text`
- `tmap_url text`
- `copy jsonb not null default '{}'`
- `profiles jsonb not null default '{}'`
- `admin_code_hash text unique`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

## invitation_media

- `id uuid primary key`
- `invitation_id uuid references invitations(id)`
- `type text not null`
- `storage_path text not null`
- `public_url text not null`
- `alt text`
- `sort_order int default 0`
- `created_at timestamptz default now()`

Media types:

- `hero`
- `intro`
- `quote`
- `calendar`
- `closing`
- `gallery`
- `timeline`
- `og`

## invitation_accounts

- `id uuid primary key`
- `invitation_id uuid references invitations(id)`
- `side text not null`
- `role text not null`
- `name text not null`
- `bank text not null`
- `number text not null`
- `sort_order int default 0`

## invitation_timeline_items

- `id uuid primary key`
- `invitation_id uuid references invitations(id)`
- `date_label text`
- `title text`
- `body text`
- `image_url text`
- `sort_order int default 0`

## admin_audit_logs

- `id uuid primary key`
- `actor text not null`
- `action text not null`
- `invitation_id uuid references invitations(id) on delete set null`
- `invitation_slug text`
- `metadata jsonb not null default '{}'`
- `created_at timestamptz default now()`

Current action values:

- `invitation.created`
- `invitation.status_updated`
- `admin_code.reset`

## Storage

Bucket: `wedding-media`

Path convention:

```text
invitations/{invitation_id}/hero/hero.jpg
invitations/{invitation_id}/gallery/001.jpg
invitations/{invitation_id}/timeline/001.jpg
invitations/{invitation_id}/og/og.jpg
```
