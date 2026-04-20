alter table public.invitations
  add column if not exists admin_code_hash text;

create index if not exists invitations_admin_code_hash_idx
  on public.invitations(admin_code_hash)
  where admin_code_hash is not null;

update public.invitations
set admin_code_hash = '1026365a854ed448dc025baab7dd5e1a4d59f2f4d0284e5e3db7b7965cac6521'
where slug = 'jjym0818'
  and admin_code_hash is null;
