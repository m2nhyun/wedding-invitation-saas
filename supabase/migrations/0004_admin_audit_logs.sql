create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  invitation_id uuid references public.invitations(id) on delete set null,
  invitation_slug text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs(created_at desc);

create index if not exists admin_audit_logs_invitation_slug_idx
  on public.admin_audit_logs(invitation_slug);

alter table public.admin_audit_logs enable row level security;
