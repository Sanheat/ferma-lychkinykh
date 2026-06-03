-- Вход клиента нечувствителен к регистру логина (и игнорирует крайние пробелы).
-- Пароль по-прежнему сравнивается точно (с учётом регистра).
-- Запустить один раз в Supabase → SQL Editor. Идемпотентно (create or replace).

create or replace function client_login(p_login text, p_password text)
returns table (id uuid, name text, address text)
language sql
security definer
set search_path = public
as $$
  select id, name, address
  from counterparties
  where lower(btrim(login)) = lower(btrim(p_login)) and password = p_password
  limit 1;
$$;

grant execute on function client_login(text, text) to anon, authenticated;
