alter table public.invitations
  add column if not exists admin_code_hash text;

create index if not exists invitations_admin_code_hash_idx
  on public.invitations(admin_code_hash)
  where admin_code_hash is not null;

update public.invitations
set admin_code_hash = '6f9e3f9ae54502696662a1e096e636a3a9605405e340b73d55b35e83dc9b3f38'
where slug = 'jjym0818'
  and admin_code_hash is null;
