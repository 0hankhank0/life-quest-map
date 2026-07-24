-- Apply after 20260723_create_user_saves.sql. Keep account saves bounded so a
-- public authenticated user cannot store arbitrarily large JSONB documents.
alter table public.user_saves
  drop constraint if exists user_saves_save_data_check;

alter table public.user_saves
  add constraint user_saves_save_data_check
  check (jsonb_typeof(save_data) = 'object' and octet_length(save_data::text) <= 1048576);
