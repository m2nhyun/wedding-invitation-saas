create extension if not exists "pgcrypto";

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  groom_name text not null,
  groom_name_en text,
  groom_father text,
  groom_mother text,
  bride_name text not null,
  bride_name_en text,
  bride_father text,
  bride_mother text,
  wedding_date date not null,
  wedding_time time not null,
  venue text not null,
  hall text,
  address text,
  tel text,
  kakao_map_url text,
  naver_map_url text,
  tmap_url text,
  copy jsonb not null default '{}'::jsonb,
  profiles jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_media (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  type text not null,
  storage_path text not null,
  public_url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_accounts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  side text not null check (side in ('groom', 'bride')),
  role text not null,
  name text not null,
  bank text not null,
  number text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_timeline_items (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  date_label text,
  title text not null,
  body text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.invitations enable row level security;
alter table public.invitation_media enable row level security;
alter table public.invitation_accounts enable row level security;
alter table public.invitation_timeline_items enable row level security;

create policy "Published invitations are readable"
  on public.invitations for select
  using (status = 'published');

create policy "Published invitation media is readable"
  on public.invitation_media for select
  using (
    exists (
      select 1
      from public.invitations
      where invitations.id = invitation_media.invitation_id
      and invitations.status = 'published'
    )
  );

create policy "Published invitation accounts are readable"
  on public.invitation_accounts for select
  using (
    exists (
      select 1
      from public.invitations
      where invitations.id = invitation_accounts.invitation_id
      and invitations.status = 'published'
    )
  );

create policy "Published timeline items are readable"
  on public.invitation_timeline_items for select
  using (
    exists (
      select 1
      from public.invitations
      where invitations.id = invitation_timeline_items.invitation_id
      and invitations.status = 'published'
    )
  );

insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', true)
on conflict (id) do nothing;

create policy "Wedding media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'wedding-media');
