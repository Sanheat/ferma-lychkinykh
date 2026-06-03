-- ════════════════════════════════════════════════════
--  Ферма Лычкиных — начальная миграция
--  Выполнить в: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════

-- ── Контрагенты (клиенты) ──────────────────────────
create table counterparties (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  login      text        unique not null,
  password   text        not null,
  address    text        not null default '',
  created_at timestamptz default now()
);

-- ── Заявки ─────────────────────────────────────────
create table orders (
  id               bigint      primary key,
  created_at       timestamptz not null default now(),
  counterparty_id  uuid        references counterparties(id) on delete set null,
  client_name      text        not null default '',
  delivery_address text        not null default '',
  delivery_type    text        not null default 'delivery',
  shipment_date    text,
  items            jsonb       not null default '[]',
  comment          text        not null default '',
  status           text        not null default 'pending'
);

-- ── Настройки (пароль админа, баннер) ──────────────
create table settings (
  key   text  primary key,
  value jsonb not null
);

-- ── Отключаем RLS (приложение использует server-side anon key) ──
alter table counterparties disable row level security;
alter table orders         disable row level security;
alter table settings       disable row level security;

-- ── Начальные данные ───────────────────────────────
insert into settings (key, value) values
  ('admin_password', '"лычкины2024"'),
  ('banner', '{"kind":"promo","title":"Свежее мясо птицы — каждую неделю","subtitle":"Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня","badge":"Ферма Лычкиных","bg":"#c94030","image":""}');

insert into counterparties (name, login, password, address) values
  ('ИП Соколова А.В.',  'sokolova', 'sok-2026',     'г. Москва, ул. Садовая, д. 12'),
  ('ООО Продукты Плюс', 'plus',     'plus-prod-26', 'г. Москва, пр-т Мира, д. 45'),
  ('ИП Краснов П.И.',   'krasnov',  'kr-2026',      'г. Подольск, ул. Ленина, д. 3'),
  ('ООО Мясной Двор',   'dvor',     'dvor-26',      'г. Химки, Ленинградское ш., 16');

-- ════════════════════════════════════════════════════
--  Безопасность: RLS + RPC-функции
--  (то же, что и в security-upgrade.sql — см. комментарии там)
-- ════════════════════════════════════════════════════

alter table counterparties enable row level security;
alter table orders         enable row level security;
alter table settings       enable row level security;

-- orders доступен приложению (паролей нет); counterparties и settings — только через функции ниже.
create policy "orders app access" on orders
  for all to anon, authenticated
  using (true) with check (true);

create or replace function is_admin(p_admin text)
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from settings where key = 'admin_password' and value = to_jsonb(p_admin));
$$;

create or replace function client_login(p_login text, p_password text)
returns table (id uuid, name text, address text)
language sql security definer set search_path = public as $$
  select id, name, address from counterparties
  where login = p_login and password = p_password limit 1;
$$;

create or replace function get_counterparty(p_id uuid)
returns table (id uuid, name text, address text)
language sql security definer set search_path = public as $$
  select id, name, address from counterparties where id = p_id limit 1;
$$;

create or replace function get_banner()
returns jsonb language sql security definer set search_path = public as $$
  select value from settings where key = 'banner' limit 1;
$$;

create or replace function verify_admin(p_password text)
returns boolean language sql security definer set search_path = public as $$
  select is_admin(p_password);
$$;

create or replace function admin_list_counterparties(p_admin text)
returns table (id uuid, name text, login text, address text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  return query select c.id, c.name, c.login, c.address, c.created_at
    from counterparties c order by c.created_at;
end;
$$;

create or replace function admin_create_counterparty(
  p_admin text, p_name text, p_login text, p_password text, p_address text
)
returns table (id uuid, name text, login text, address text)
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  return query
    insert into counterparties (name, login, password, address)
    values (p_name, p_login, p_password, coalesce(p_address, ''))
    returning counterparties.id, counterparties.name, counterparties.login, counterparties.address;
end;
$$;

create or replace function admin_update_counterparty(
  p_admin text, p_id uuid, p_name text, p_login text, p_address text, p_password text default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  update counterparties
     set name = p_name, login = p_login, address = coalesce(p_address, ''),
         password = case when p_password is null or p_password = '' then password else p_password end
   where id = p_id;
end;
$$;

create or replace function admin_reset_password(p_admin text, p_id uuid, p_new_password text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  if p_new_password is null or p_new_password = '' then raise exception 'empty password'; end if;
  update counterparties set password = p_new_password where id = p_id;
end;
$$;

create or replace function admin_delete_counterparty(p_admin text, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  delete from counterparties where id = p_id;
end;
$$;

create or replace function admin_save_banner(p_admin text, p_value jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin) then raise exception 'unauthorized'; end if;
  insert into settings (key, value) values ('banner', p_value)
  on conflict (key) do update set value = excluded.value;
end;
$$;

grant execute on function client_login(text, text)                                     to anon, authenticated;
grant execute on function get_counterparty(uuid)                                        to anon, authenticated;
grant execute on function get_banner()                                                  to anon, authenticated;
grant execute on function verify_admin(text)                                            to anon, authenticated;
grant execute on function admin_list_counterparties(text)                               to anon, authenticated;
grant execute on function admin_create_counterparty(text, text, text, text, text)       to anon, authenticated;
grant execute on function admin_update_counterparty(text, uuid, text, text, text, text) to anon, authenticated;
grant execute on function admin_reset_password(text, uuid, text)                        to anon, authenticated;
grant execute on function admin_delete_counterparty(text, uuid)                         to anon, authenticated;
grant execute on function admin_save_banner(text, jsonb)                                to anon, authenticated;
