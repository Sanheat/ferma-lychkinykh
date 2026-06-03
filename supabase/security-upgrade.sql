-- ════════════════════════════════════════════════════
--  Ферма Лычкиных — апгрейд безопасности (RLS + RPC)
--  Выполнить ОДИН РАЗ в: Supabase Dashboard → SQL Editor → New query
--  Безопасно запускать на уже существующей базе (идемпотентно).
--
--  Что делает:
--   • Включает RLS на всех таблицах.
--   • Закрывает прямой доступ к counterparties и settings
--     (там хранятся пароли клиентов и пароль админа).
--   • Доступ к ним — только через SECURITY DEFINER функции,
--     которые сверяют пароль на сервере и НЕ возвращают его наружу.
--   • orders оставляет доступным приложению (паролей там нет).
-- ════════════════════════════════════════════════════

-- ── 1. Включаем RLS ────────────────────────────────
alter table counterparties enable row level security;
alter table orders         enable row level security;
alter table settings       enable row level security;

-- ── 2. Политики ────────────────────────────────────
-- counterparties и settings: НИ ОДНОЙ политики для anon →
-- прямые запросы возвращают пусто / запрещены. Доступ только через функции ниже.
drop policy if exists "app full access"   on counterparties;
drop policy if exists "app full access"   on settings;
drop policy if exists "orders app access" on orders;

-- orders: паролей нет, оставляем доступ приложению как раньше.
create policy "orders app access" on orders
  for all to anon, authenticated
  using (true) with check (true);

-- ── 3. Хелпер: проверка пароля админа ──────────────
create or replace function is_admin(p_admin text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from settings
    where key = 'admin_password' and value = to_jsonb(p_admin)
  );
$$;

-- ── 4. Публичные функции (для клиента) ─────────────

-- Вход клиента по логину/паролю. Возвращает профиль БЕЗ пароля.
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

-- Профиль контрагента по id (для восстановления сессии после перезагрузки).
create or replace function get_counterparty(p_id uuid)
returns table (id uuid, name text, address text)
language sql
security definer
set search_path = public
as $$
  select id, name, address from counterparties where id = p_id limit 1;
$$;

-- Баннер (публичное чтение).
create or replace function get_banner()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select value from settings where key = 'banner' limit 1;
$$;

-- ── 5. Админские функции (первый аргумент — пароль админа) ──

create or replace function verify_admin(p_password text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select is_admin(p_password);
$$;

-- Список контрагентов БЕЗ паролей.
create or replace function admin_list_counterparties(p_admin text)
returns table (id uuid, name text, login text, address text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  return query
    select c.id, c.name, c.login, c.address, c.created_at
    from counterparties c
    order by c.created_at;
end;
$$;

create or replace function admin_create_counterparty(
  p_admin text, p_name text, p_login text, p_password text, p_address text
)
returns table (id uuid, name text, login text, address text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  return query
    insert into counterparties (name, login, password, address)
    values (p_name, p_login, p_password, coalesce(p_address, ''))
    returning counterparties.id, counterparties.name, counterparties.login, counterparties.address;
end;
$$;

-- Обновление профиля. Пароль меняется только если p_password не пустой.
create or replace function admin_update_counterparty(
  p_admin text, p_id uuid, p_name text, p_login text, p_address text, p_password text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  update counterparties
     set name     = p_name,
         login    = p_login,
         address  = coalesce(p_address, ''),
         password = case when p_password is null or p_password = '' then password else p_password end
   where id = p_id;
end;
$$;

create or replace function admin_reset_password(p_admin text, p_id uuid, p_new_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  if p_new_password is null or p_new_password = '' then raise exception 'empty password'; end if;
  update counterparties set password = p_new_password where id = p_id;
end;
$$;

create or replace function admin_delete_counterparty(p_admin text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  delete from counterparties where id = p_id;
end;
$$;

create or replace function admin_save_banner(p_admin text, p_value jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  insert into settings (key, value) values ('banner', p_value)
  on conflict (key) do update set value = excluded.value;
end;
$$;

-- ── 6. Права на вызов функций ──────────────────────
-- is_admin намеренно НЕ выдаётся anon (вызывается только изнутри других функций).
grant execute on function client_login(text, text)                                  to anon, authenticated;
grant execute on function get_counterparty(uuid)                                     to anon, authenticated;
grant execute on function get_banner()                                               to anon, authenticated;
grant execute on function verify_admin(text)                                         to anon, authenticated;
grant execute on function admin_list_counterparties(text)                            to anon, authenticated;
grant execute on function admin_create_counterparty(text, text, text, text, text)    to anon, authenticated;
grant execute on function admin_update_counterparty(text, uuid, text, text, text, text) to anon, authenticated;
grant execute on function admin_reset_password(text, uuid, text)                     to anon, authenticated;
grant execute on function admin_delete_counterparty(text, uuid)                      to anon, authenticated;
grant execute on function admin_save_banner(text, jsonb)                             to anon, authenticated;
