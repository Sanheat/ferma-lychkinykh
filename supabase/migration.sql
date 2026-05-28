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

-- ── Начальные данные ───────────────────────────────
insert into settings (key, value) values
  ('admin_password', '"лычкины2024"'),
  ('banner', '{"kind":"promo","title":"Свежее мясо птицы — каждую неделю","subtitle":"Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня","badge":"Ферма Лычкиных","bg":"#c94030","image":""}');

insert into counterparties (name, login, password, address) values
  ('ИП Соколова А.В.',  'sokolova', 'sok-2026',     'г. Москва, ул. Садовая, д. 12'),
  ('ООО Продукты Плюс', 'plus',     'plus-prod-26', 'г. Москва, пр-т Мира, д. 45'),
  ('ИП Краснов П.И.',   'krasnov',  'kr-2026',      'г. Подольск, ул. Ленина, д. 3'),
  ('ООО Мясной Двор',   'dvor',     'dvor-26',      'г. Химки, Ленинградское ш., 16');
