import React from 'react';

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

/* ── STORAGE ── */
const LS_O = 'lp_orders4';
const LS_C = 'lp_client2';
const LS_CP = 'lp_counterparties2';
const LS_BANNER = 'lp_banner';

export const getOrders   = () => { try { return JSON.parse(localStorage.getItem(LS_O)||'[]'); } catch { return []; } };
export const saveOrders  = o => localStorage.setItem(LS_O, JSON.stringify(o));
export const addOrder    = o => { const a=getOrders(); a.unshift(o); saveOrders(a); };
export const updateOrder = (id, patch) => {
  const a = getOrders();
  const i = a.findIndex(o=>o.id===id);
  if (i>-1) { a[i] = { ...a[i], ...patch }; saveOrders(a); }
};
export const setStatus = (id, st) => updateOrder(id, { status: st });

export const getClient = () => { try { return JSON.parse(localStorage.getItem(LS_C)||'null'); } catch { return null; } };
export const saveClient = c => c ? localStorage.setItem(LS_C, JSON.stringify(c)) : localStorage.removeItem(LS_C);

const migrateCp = c => {
  if (c.addresses && !c.address) {
    const first = c.addresses[0] || {};
    return { id:c.id, name:c.name, login:c.login, password:c.password, address: first.address || '' };
  }
  return { id:c.id, name:c.name, login:c.login, password:c.password, address: c.address || '' };
};

const DEFAULT_CP = [
  { id:'cp1', name:'ИП Соколова А.В.',   login:'sokolova', password:'sok-2026',     address:'г. Москва, ул. Садовая, д. 12' },
  { id:'cp2', name:'ООО Продукты Плюс',  login:'plus',     password:'plus-prod-26', address:'г. Москва, пр-т Мира, д. 45' },
  { id:'cp3', name:'ИП Краснов П.И.',    login:'krasnov',  password:'kr-2026',      address:'г. Подольск, ул. Ленина, д. 3' },
  { id:'cp4', name:'ООО Мясной Двор',    login:'dvor',     password:'dvor-26',      address:'г. Химки, Ленинградское ш., 16' },
];

export const getCounterparties = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_CP)||'null');
    if (!raw) return DEFAULT_CP;
    return raw.map(migrateCp);
  } catch { return DEFAULT_CP; }
};
export const saveCounterparties = list => localStorage.setItem(LS_CP, JSON.stringify(list.map(migrateCp)));

const DEFAULT_BANNER = {
  kind: 'promo',
  title: 'Свежее мясо птицы — каждую неделю',
  subtitle: 'Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня',
  badge: 'Ферма Лычкиных',
  bg: '#c94030',
  image: '',
};

export const getBanner = () => {
  try { return JSON.parse(localStorage.getItem(LS_BANNER)||'null') || DEFAULT_BANNER; }
  catch { return DEFAULT_BANNER; }
};
export const saveBanner = b => localStorage.setItem(LS_BANNER, JSON.stringify(b));

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

/* ── SEED DEMO ── */
(function seed(){
  if (getOrders().length > 0) return;
  const cp = getCounterparties();
  const t = Date.now();
  saveOrders([
    { id:'DEMO01', clientId:cp[0].id, clientName:cp[0].name,
      deliveryAddress:cp[0].address, deliveryType:'delivery',
      shipmentDate: isoDate(firstShipmentFrom()),
      createdAt: new Date(t-2*3600*1000).toISOString(),
      items:[
        { product:'Филе грудки ЦБ', packaging:'yasik', qty:'2',  frozen:false, frozenComment:'' },
        { product:'Бедро ЦБ',       packaging:'paket', qty:'14', frozen:false, frozenComment:'' },
      ],
      comment:'Доставить до 12:00', status:'pending' },
    { id:'DEMO02', clientId:cp[1].id, clientName:cp[1].name,
      deliveryAddress:cp[1].address, deliveryType:'delivery',
      shipmentDate: isoDate(firstShipmentFrom()),
      createdAt: new Date(t-5*3600*1000).toISOString(),
      items:[
        { product:'Тушка ЦБ 1 сорт', packaging:'yasik', qty:'3',  frozen:true,  frozenComment:'Можно заморозку, не успели охладить' },
        { product:'Голень ЦБ',       packaging:'lotok', qty:'20', frozen:false, frozenComment:'' },
        { product:'Печень ЦБ',       packaging:'paket', qty:'5',  frozen:false, frozenComment:'' },
      ],
      comment:'', status:'accepted' },
    { id:'DEMO03', clientId:cp[1].id, clientName:cp[1].name,
      deliveryAddress:cp[1].address, deliveryType:'pickup',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(),1)),
      createdAt: new Date(t-25*60*1000).toISOString(),
      items:[
        { product:'Окорочка ЦБ', packaging:'paket', qty:'20', frozen:false, frozenComment:'' },
        { product:'Крылья ЦБ',   packaging:'paket', qty:'10', frozen:false, frozenComment:'' },
      ],
      comment:'Самовывоз, заберём после 11:00', status:'pending' },
    { id:'DEMO04', clientId:cp[2].id, clientName:cp[2].name,
      deliveryAddress:cp[2].address, deliveryType:'delivery',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(),-2)),
      createdAt: new Date(t-3*86400*1000).toISOString(),
      items:[
        { product:'Сердце ЦБ',  packaging:'paket', qty:'4',  frozen:false, frozenComment:'' },
        { product:'Печень ЦБ',  packaging:'paket', qty:'10', frozen:false, frozenComment:'' },
        { product:'Желудок ЦБ', packaging:'paket', qty:'7',  frozen:false, frozenComment:'' },
      ],
      comment:'', status:'shipped' },
    { id:'DEMO05', clientId:cp[3].id, clientName:cp[3].name,
      deliveryAddress:cp[3].address, deliveryType:'delivery',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(),-5)),
      createdAt: new Date(t-7*86400*1000).toISOString(),
      items:[
        { product:'Тушка ЦБ 1 сорт', packaging:'yasik', qty:'5', frozen:false, frozenComment:'' },
      ],
      comment:'', status:'archive' },
  ]);
})();
