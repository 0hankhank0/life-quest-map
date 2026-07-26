begin;

revoke all privileges
on table public.user_saves
from anon, authenticated;

revoke all privileges
on table public.user_saves
from public;

grant select, insert, update
on table public.user_saves
to authenticated;

commit;
