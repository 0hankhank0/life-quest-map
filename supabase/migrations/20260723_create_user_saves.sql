create table if not exists public.user_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null check (jsonb_typeof(save_data) = 'object' and octet_length(save_data::text) <= 1048576),
  schema_version integer not null check (schema_version >= 1),
  revision bigint not null default 1 check (revision >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_user_saves_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.revision = old.revision + 1;
  return new;
end;
$$;

drop trigger if exists user_saves_set_updated_at
on public.user_saves;

create trigger user_saves_set_updated_at
before update on public.user_saves
for each row
execute function public.set_user_saves_updated_at();

alter table public.user_saves enable row level security;

revoke all on public.user_saves from anon;
revoke delete on public.user_saves from authenticated;
grant select, insert, update on public.user_saves to authenticated;

drop policy if exists "user_saves_select_own"
on public.user_saves;

create policy "user_saves_select_own"
on public.user_saves
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_saves_insert_own"
on public.user_saves;

create policy "user_saves_insert_own"
on public.user_saves
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "user_saves_update_own"
on public.user_saves;

create policy "user_saves_update_own"
on public.user_saves
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
