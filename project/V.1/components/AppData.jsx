// AppData.jsx — shared data, products, localStorage helpers
// Expose everything to window for cross-script access

const PRODUCTS = [
  { id: 'tuscha-1',  name: 'Тушка куриная 1 кат.',      group: 'Тушка' },
  { id: 'tuscha-2',  name: 'Тушка куриная 2 кат.',      group: 'Тушка' },
  { id: 'okorochok', name: 'Окорочок куриный',           group: 'Части' },
  { id: 'bedro',     name: 'Бедро куриное',              group: 'Части' },
  { id: 'golen',     name: 'Голень куриная',             group: 'Части' },
  { id: 'krilo',     name: 'Крыло куриное',              group: 'Части' },
  { id: 'file',      name: 'Филе куриное',               group: 'Части' },
  { id: 'grudka',    name: 'Грудка куриная (на кости)',  group: 'Части' },
  { id: 'sup',       name: 'Суповой набор',              group: 'Субпродукты' },
  { id: 'sheya',     name: 'Шея куриная',                group: 'Субпродукты' },
  { id: 'lapka',     name: 'Лапка куриная',              group: 'Субпродукты' },
  { id: 'serdce',    name: 'Сердечко куриное',           group: 'Субпродукты' },
  { id: 'pechen',    name: 'Печень куриная',             group: 'Субпродукты' },
  { id: 'jelydok',   name: 'Желудок куриный',            group: 'Субпродукты' },
];

const PACKAGING = [
  { id: 'yasik',  label: 'Ящик монолит',  note: '≈14 кг' },
  { id: 'paket',  label: 'Пакет',         note: 'Любой вес' },
  { id: 'lotok',  label: 'Лоток',         note: '0.8–1 кг' },
];

const STATES = ['Охлаждённое', 'Замороженное'];

const STATUSES = {
  pending:  { label: 'В обработке', color: '#e8a838', bg: '#fef9ec' },
  accepted: { label: 'Принята',     color: '#7a9e7e', bg: '#f2f7f3' },
};

const ADMIN_PASSWORD = 'лычкины2024';
const LS_ORDERS = 'lp_orders';
const LS_CLIENT = 'lp_client';

function getOrders() {
  try { return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]'); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
}
function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}
function updateOrderStatus(id, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) { orders[idx].status = status; saveOrders(orders); }
}
function getClient() {
  try { return JSON.parse(localStorage.getItem(LS_CLIENT) || 'null'); }
  catch { return null; }
}
function saveClient(client) {
  localStorage.setItem(LS_CLIENT, JSON.stringify(client));
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase();
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' })
    + ' ' + d.toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' });
}

Object.assign(window, {
  PRODUCTS, PACKAGING, STATES, STATUSES,
  ADMIN_PASSWORD, getOrders, saveOrders, addOrder,
  updateOrderStatus, getClient, saveClient, genId, formatDate,
});
