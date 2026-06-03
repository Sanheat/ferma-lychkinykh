import React from 'react';
import { supabase } from '../supabase';

/* ── DESIGN TOKENS ── */
export const BR='#c94030', BRH='#a8331f', ACC='#e8a838', NAT='#7a9e7e', ARCH='#8a7a90';
export const DRK='#3d2b1f', FG2='#6b5245', FG3='#9a8070';
export const BG='#fdfaf4', ALT='#f5edd6', CRD='#fff', BRD='#e8d9c4';
export const FD="'PT Serif',Georgia,serif";
export const FB="'PT Sans',Arial,sans-serif";
export const FL="'Nunito',sans-serif";

/* ── PACKAGING ── */
export const PKG = {
  yasik: { id:'yasik', label:'Ящик монолит', note:'≈14 кг',    unit:'ящ.',  type:'counter', step:1 },
  paket: { id:'paket', label:'Пакет',         note:'любой вес', unit:'кг',   type:'kg',      step:0.1 },
  lotok: { id:'lotok', label:'Лоток',          note:'≈0.8–1 кг', unit:'лот.', type:'counter', step:2 },
};

/* ── PRODUCTS ── */
export const PRODUCTS = [
  { name:'Тушка ЦБ 1 сорт',                  price:235, blank:'1.ТУШКА 1 СОРТ',         pkg:['yasik','paket','lotok'] },
  { name:'Тушка ЦБ 2 сорт',                  price:215, blank:'2.ТУШКА 2 СОРТ',         pkg:['yasik','paket','lotok'] },
  { name:'Бескостное мясо ЦБ',                price:350, blank:'3.БЕСКОСТНОЕ МЯСО',      pkg:['yasik'] },
  { name:'Грудка ЦБ',                         price:270, blank:'4.ГРУДКА',               pkg:['yasik','paket','lotok'] },
  { name:'Филе грудки ЦБ',                    price:385, blank:'5.ФИЛЕ ГРУДКИ',          pkg:['yasik','paket','lotok'] },
  { name:'Окорочка ЦБ',                       price:195, blank:'6.ОКОРОЧКА',             pkg:['yasik','paket','lotok'] },
  { name:'Бескостные окорочка ЦБ',            price:380, blank:'7.БЕСКОСТ. ОКОРОЧКА',   pkg:['yasik','paket','lotok'] },
  { name:'Голень ЦБ',                         price:225, blank:'8.ГОЛЕНИ',               pkg:['yasik','paket','lotok'] },
  { name:'Бедро ЦБ',                          price:210, blank:'9.БЕДРА',                pkg:['yasik','paket','lotok'] },
  { name:'Фарш ЦБ',                           price:360, blank:'10.ФАРШ',                pkg:['yasik','paket','lotok'] },
  { name:'Крылья ЦБ',                         price:240, blank:'11.КРЫЛЬЯ',              pkg:['yasik','paket','lotok'] },
  { name:'Набор для шашлыка ЦБ',              price:290, blank:'12.НАБОР ШАШЛЫК',        pkg:['yasik','paket','lotok'] },
  { name:'Набор для рагу ЦБ',                 price:235, blank:'13.НАБОР РАГУ',          pkg:['yasik','paket','lotok'] },
  { name:'Набор для бульона ЦБ (хребты)',     price:50,  blank:'14.НАБОР ДЛЯ БУЛЬОНА',   pkg:['yasik','paket','lotok'] },
  { name:'Набор для супа ЦБ (килевая кость)', price:45,  blank:'15.НАБОР ДЛЯ СУПА',      pkg:['yasik','paket'] },
  { name:'Шеи ЦБ',                            price:65,  blank:'16.ШЕИ',                 pkg:['yasik','paket','lotok'] },
  { name:'Шеи без кожи ЦБ',                   price:90,  blank:'17.ШЕИ БЕЗ КОЖИ',        pkg:['yasik','paket'] },
  { name:'Головы ЦБ',                         price:60,  blank:'18.ГОЛОВЫ',              pkg:['yasik','paket','lotok'] },
  { name:'Ноги ЦБ',                           price:50,  blank:'19.НОГИ',                pkg:['yasik','paket'] },
  { name:'Сердце ЦБ',                         price:390, blank:'20.СЕРДЦЕ',              pkg:['yasik','paket','lotok'] },
  { name:'Печень ЦБ',                         price:210, blank:'21.ПЕЧЕНЬ',              pkg:['yasik','paket','lotok'] },
  { name:'Желудок ЦБ',                        price:175, blank:'22.ЖЕЛУДКИ',             pkg:['yasik','paket','lotok'] },
  { name:'Жир-сырец ЦБ',                      price:80,  blank:'23.ЖИР-СЫРЕЦ',           pkg:['yasik','paket'] },
  { name:'Кожа ЦБ',                           price:45,  blank:'24.КОЖА',                pkg:['yasik','paket'] },
];

export const BLANK_ROWS = PRODUCTS.map(p => p.blank);

export const STATUSES = {
  pending:  { label:'В обработке', color:ACC,  bg:'#fef9ec' },
  accepted: { label:'Принята',     color:NAT,  bg:'#f2f7f3' },
  shipped:  { label:'Отгружена',   color:'#4a7da8', bg:'#eef4f9' },
  archive:  { label:'В архиве',    color:ARCH, bg:'#f3eff5' },
};

/* ── SESSION (остаётся в localStorage) ── */
const LS_C = 'lp_client2';
export const getClient  = () => { try { return JSON.parse(localStorage.getItem(LS_C)||'null'); } catch { return null; } };
export const saveClient = c => c ? localStorage.setItem(LS_C, JSON.stringify(c)) : localStorage.removeItem(LS_C);

/* ── ЧЕРНОВИК ЗАКАЗА (сохраняется в localStorage, отдельно для каждого контрагента) ── */
const orderDraftKey = cpId => `lp_order_draft_${cpId ?? 'anon'}`;
export const getOrderDraft = cpId => {
  try { return JSON.parse(localStorage.getItem(orderDraftKey(cpId)) || 'null'); }
  catch { return null; }
};
export const saveOrderDraft = (cpId, draft) => {
  try { localStorage.setItem(orderDraftKey(cpId), JSON.stringify(draft)); } catch {}
};
export const clearOrderDraft = cpId => {
  try { localStorage.removeItem(orderDraftKey(cpId)); } catch {}
};

/* ── ORDERS ── */
const dbToOrder = r => ({
  id: String(r.id), clientId: r.counterparty_id, clientName: r.client_name,
  deliveryAddress: r.delivery_address, deliveryType: r.delivery_type,
  shipmentDate: r.shipment_date, createdAt: r.created_at,
  items: r.items, comment: r.comment || '', status: r.status,
});

export const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getOrders:', error); return []; }
  return (data || []).map(dbToOrder);
};

export const addOrder = async o => {
  const id = Math.floor(100000 + Math.random() * 900000);
  const { error } = await supabase.from('orders').insert({
    id, created_at: o.createdAt, counterparty_id: o.clientId,
    client_name: o.clientName, delivery_address: o.deliveryAddress,
    delivery_type: o.deliveryType, shipment_date: o.shipmentDate,
    items: o.items, comment: o.comment || '', status: o.status || 'pending',
  });
  if (error) throw error;
  return String(id);
};

export const updateOrder = async (id, patch) => {
  const p = {};
  if (patch.status !== undefined)          p.status           = patch.status;
  if (patch.deliveryType !== undefined)    p.delivery_type    = patch.deliveryType;
  if (patch.deliveryAddress !== undefined) p.delivery_address = patch.deliveryAddress;
  if (patch.shipmentDate !== undefined)    p.shipment_date    = patch.shipmentDate;
  if (patch.items !== undefined)           p.items            = patch.items;
  if (patch.comment !== undefined)         p.comment          = patch.comment;
  const { error } = await supabase.from('orders').update(p).eq('id', id);
  if (error) throw error;
};

export const setStatus = (id, st) => updateOrder(id, { status: st });

/* ── COUNTERPARTIES ──
   Таблица закрыта RLS — пароли никогда не уходят в браузер.
   Весь доступ идёт через SECURITY DEFINER функции (см. supabase/security-upgrade.sql).
   Все админские вызовы принимают пароль админа первым аргументом — он сверяется на сервере. */

// Список контрагентов для админки (без паролей).
export const getCounterparties = async adminPwd => {
  const { data, error } = await supabase.rpc('admin_list_counterparties', { p_admin: adminPwd });
  if (error) { console.error('getCounterparties:', error); return []; }
  return data || [];
};

// Вход клиента: возвращает профиль { id, name, address } или null.
export const verifyLogin = async (login, password) => {
  const { data, error } = await supabase.rpc('client_login', { p_login: login, p_password: password });
  if (error) { console.error('verifyLogin:', error); return null; }
  return (data && data[0]) || null;
};

// Профиль контрагента по id (восстановление сессии после перезагрузки).
export const getCounterpartyProfile = async id => {
  const { data, error } = await supabase.rpc('get_counterparty', { p_id: id });
  if (error) { console.error('getCounterpartyProfile:', error); return null; }
  return (data && data[0]) || null;
};

export const createCounterparty = async (adminPwd, cp) => {
  const { data, error } = await supabase.rpc('admin_create_counterparty', {
    p_admin: adminPwd, p_name: cp.name, p_login: cp.login,
    p_password: cp.password, p_address: cp.address || '',
  });
  if (error) throw error;
  return (data && data[0]) || null;
};

export const updateCounterparty = async (adminPwd, cp) => {
  const { error } = await supabase.rpc('admin_update_counterparty', {
    p_admin: adminPwd, p_id: cp.id, p_name: cp.name, p_login: cp.login,
    p_address: cp.address || '', p_password: cp.password || null,
  });
  if (error) throw error;
};

export const resetCounterpartyPassword = async (adminPwd, id, newPassword) => {
  const { error } = await supabase.rpc('admin_reset_password', {
    p_admin: adminPwd, p_id: id, p_new_password: newPassword,
  });
  if (error) throw error;
};

export const deleteCounterparty = async (adminPwd, id) => {
  const { error } = await supabase.rpc('admin_delete_counterparty', { p_admin: adminPwd, p_id: id });
  if (error) throw error;
};

/* ── SETTINGS / BANNER ── */
export const DEFAULT_BANNER = {
  kind: 'promo',
  title: 'Свежее мясо птицы — каждую неделю',
  subtitle: 'Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня',
  badge: 'Ферма Лычкиных',
  bg: '#c94030',
  image: '',
};

export const getBanner = async () => {
  const { data, error } = await supabase.rpc('get_banner');
  if (error) { console.error('getBanner:', error); return DEFAULT_BANNER; }
  return data || DEFAULT_BANNER;
};

export const saveBanner = async (adminPwd, b) => {
  const { error } = await supabase.rpc('admin_save_banner', { p_admin: adminPwd, p_value: b });
  if (error) throw error;
};

export const verifyAdmin = async password => {
  const { data, error } = await supabase.rpc('verify_admin', { p_password: password });
  if (error) { console.error('verifyAdmin:', error); return false; }
  return data === true;
};

export const genId = () =>
  Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase();

/* ── DATE HELPERS ── */
export const RU_MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
export const RU_MONTHS_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
export const RU_WEEK = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
export const RU_WEEK_FULL = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

export const isoDate = d => {
  const z = new Date(d);
  z.setHours(12,0,0,0);
  return z.toISOString().slice(0,10);
};
export const parseISO = s => { const [y,m,d]=s.split('-').map(Number); return new Date(y, m-1, d, 12, 0, 0, 0); };
export const sameDay = (a,b) => isoDate(a) === isoDate(b);
export const isWeekday = d => { const w=d.getDay(); return w!==0 && w!==6; };

export const addWorkDays = (date, n) => {
  const d = new Date(date);
  let added = 0;
  while (added < n) { d.setDate(d.getDate()+1); if (isWeekday(d)) added++; }
  return d;
};

export const firstShipmentFrom = (now=new Date()) => {
  const n = new Date(now);
  const past = n.getHours() > 15 || (n.getHours() === 15 && n.getMinutes() > 0);
  let anchor = new Date(n);
  if (past) anchor.setDate(anchor.getDate()+1);
  while (!isWeekday(anchor)) anchor.setDate(anchor.getDate()+1);
  return addWorkDays(anchor, 2);
};

export const fmtDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}) +
         ' ' + d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
};
export const fmtShort = d => {
  const dd = d instanceof Date ? d : new Date(d);
  return `${String(dd.getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[dd.getMonth()]} ${dd.getFullYear()}`;
};
export const fmtLong = d => {
  const dd = d instanceof Date ? d : new Date(d);
  return `${dd.getDate()} ${RU_MONTHS[dd.getMonth()]}, ${RU_WEEK_FULL[dd.getDay()]}`;
};

/* ── SHARED INPUT STYLES ── */
export const inp = { width:'100%', fontFamily:FB, fontSize:14, color:DRK, background:CRD, border:`1.5px solid ${BRD}`, borderRadius:8, padding:'9px 12px', outline:'none' };
export const lbl = { display:'block', fontFamily:FL, fontWeight:700, fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:FG2, marginBottom:4 };

/* ── LOGOS / BADGES ── */
export function LpLogo({ light }) {
  const t1 = light ? '#fae0dc' : BR;
  const t2 = light ? '#f5bdb6' : BRH;
  const txt = light ? '#f5edd6' : DRK;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <svg width="28" height="28" viewBox="0 0 52 46" fill="none">
        <ellipse cx="28" cy="32" rx="14" ry="10" fill={t1}/>
        <circle cx="36" cy="20" r="10" fill={t1}/>
        <polygon points="45,17 52,20 45,23" fill={ACC}/>
        <circle cx="38" cy="18" r="2.5" fill="white"/>
        <path d="M14,30 Q7,18 26,14 Q22,24 14,30Z" fill={t2}/>
      </svg>
      <span style={{ fontFamily:FD, fontWeight:700, fontSize:17, color:txt, lineHeight:1 }}>Ферма Лычкиных</span>
    </div>
  );
}

export function LpBadge({ status }) {
  const s = STATUSES[status] || STATUSES.pending;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:s.bg, color:s.color, fontFamily:FL, fontWeight:700, fontSize:11, letterSpacing:'.04em', padding:'3px 10px', borderRadius:9999 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, display:'inline-block' }}/>{s.label}
    </span>
  );
}

