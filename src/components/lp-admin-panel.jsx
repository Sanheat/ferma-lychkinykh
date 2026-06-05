import React from 'react';
import ReactDOM from 'react-dom';
import * as XLSX from 'xlsx-js-style';
import {
  CP_F, CP_SHADOW_SM,
  CpIco, CpStatusBadge,
} from './lp-ui';
import {
  getOrders, getCounterparties, setStatus,
  fmtShort, fmtLong, parseISO,
  PKG, STATUSES, PRODUCTS, RU_MONTHS_SHORT,
  DRK, BR, FD, FL,
} from './lp-data';
import { LpOrderEditModal, LpCounterparties } from './lp-admin-bits';
import { LpBannerEditor } from './lp-banner-editor';
import { LpManagerLayout } from './lp-manager-shell';
import { LpHistRangeCalendar } from './lp-client-views';

const { useState: useStateAo, useEffect: useEffectAo, useMemo: useMemoAo, useRef: useRefAo } = React;

/** Расчётный объём заказа в кг: ящик≈14кг, лоток≈0.9кг, пакет = qty кг. */
function orderVolumeKg(o) {
  return o.items.reduce((sum, it) => {
    const q = parseFloat(it.qty) || 0;
    if (it.packaging === 'yasik' || PKG[it.packaging]?.label?.startsWith('Ящик')) return sum + q * 14;
    if (it.packaging === 'lotok' || PKG[it.packaging]?.label === 'Лоток')          return sum + q * 0.9;
    return sum + q;
  }, 0);
}

/* ── Дизайн-токены страницы «Все заявки» (Figma — не интерпретировать) ── */
const MO_BG_HEAD      = '#F9F8F8';
const MO_BORDER_NAV   = '#EAECF0';
const MO_BORDER_ROW   = '#DFDDDD';
const MO_BORDER_INPUT = '#C6C3C3';
const MO_TEXT_PRIMARY = '#191414';
const MO_TEXT_HEAD    = '#676262';
const MO_TEXT_TAB     = '#7E7979';
const MO_TEXT_VALUE   = '#514C4B';
const MO_TEXT_VOLUME  = '#101828';
const MO_BRAND_ACTIVE = '#986338';
const MO_CREAM_100    = '#F5F0DF';
const MO_CREAM_50     = '#FBF9F1';
const MO_NUM_TXT      = '#3C3636';
const MO_PAGI_MUTED   = '#676262';
const MO_PAGI_DISABLE = '#ADAAAA';
const MO_SHADOW_XS    = '0px 1px 2px rgba(16, 24, 40, 0.05)';

const moDate = iso => new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
const moTime = iso => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const MoIco = {
  printer: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  ),
  arrowDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
  ),
};

/* Доступные статусы заявки для смены (ключ, подпись, цвет точки) */
const ORDER_STAT = [
  ['pending',   'В обработке', '#2E90FA'],
  ['accepted',  'Принята',     '#12B76A'],
  ['shipped',   'Отгружена',   '#F79009'],
  ['cancelled', 'Отменена',    '#F04438'],
];

function LpAdminOrders({ adminPwd, onPrint }) {
  const [orders, setOrders] = useStateAo([]);
  const [tab, setTab] = useStateAo('all');
  const [search, setSearch] = useStateAo('');
  const [clientFilter, setClientFilter] = useStateAo('');
  const [period, setPeriod] = useStateAo({ start: null, end: null });
  const [showPeriodCal, setShowPeriodCal] = useStateAo(false);
  const periodRef = useRefAo(null);
  const [page, setPage] = useStateAo(1);
  const [selected, setSelected] = useStateAo(null);
  const [editing, setEditing] = useStateAo(null);
  const [allChecked, setAllChecked] = useStateAo(false);
  const [checked, setChecked] = useStateAo({});

  useEffectAo(() => {
    let alive = true;
    const load = () => getOrders().then(d => { if (alive) setOrders(d); }).catch(console.error);
    load();
    const t = setInterval(load, 5000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  useEffectAo(() => {
    if (!showPeriodCal) return;
    const onDown = e => {
      if (periodRef.current && !periodRef.current.contains(e.target)) setShowPeriodCal(false);
    };
    const onKey = e => { if (e.key === 'Escape') setShowPeriodCal(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showPeriodCal]);

  // Список контрагентов для фильтра — уникальные имена из всех заявок
  const clientOptions = useMemoAo(() => {
    const s = new Set();
    orders.forEach(o => { if (o.clientName) s.add(o.clientName); });
    return Array.from(s).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [orders]);

  const inTab = (o, t) => t === 'all' ? true : t === 'cancelled' ? (o.status === 'cancelled' || o.status === 'archive') : o.status === t;

  const counts = useMemoAo(() => ({
    all:       orders.length,
    pending:   orders.filter(o => inTab(o, 'pending')).length,
    accepted:  orders.filter(o => inTab(o, 'accepted')).length,
    shipped:   orders.filter(o => inTab(o, 'shipped')).length,
    cancelled: orders.filter(o => inTab(o, 'cancelled')).length,
  }), [orders]);

  const filtered = useMemoAo(() => {
    const q = search.trim().toLowerCase();
    const ps = period.start ? new Date(period.start.getFullYear(), period.start.getMonth(), period.start.getDate()).getTime() : null;
    const pe = period.end   ? new Date(period.end.getFullYear(),   period.end.getMonth(),   period.end.getDate(),   23, 59, 59, 999).getTime() : null;
    return orders.filter(o => {
      if (!inTab(o, tab)) return false;
      if (clientFilter && o.clientName !== clientFilter) return false;
      if (ps !== null || pe !== null) {
        const t = parseISO(o.shipmentDate).getTime();
        if (ps !== null && t < ps) return false;
        if (pe !== null && t > pe) return false;
      }
      if (q) {
        const hit = o.clientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) ||
          (o.deliveryAddress || '').toLowerCase().includes(q) ||
          o.items.some(it => it.product.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [orders, tab, search, clientFilter, period]);

  const PAGE_SIZE = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pageNumbers = useMemoAo(() => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (safePage <= 4) return [1, 2, 3, 4, 5, '...', pageCount];
    if (safePage >= pageCount - 3) return [1, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', pageCount];
  }, [pageCount, safePage]);

  const changeStatus = (id, st) => {
    setOrders(p => p.map(o => o.id === id ? { ...o, status: st } : o));
    setSelected(p => p?.id === id ? { ...p, status: st } : p);
    setStatus(id, st).catch(console.error);
  };

  // Заявки под действие: выбранные галочками, иначе — весь текущий раздел (фильтр/вкладка)
  const selectedOrders = useMemoAo(() => orders.filter(o => checked[o.id]), [orders, checked]);
  const hasSelection = selectedOrders.length > 0;
  const targetOrders = hasSelection ? selectedOrders : filtered;

  const bulkStatus = (st) => {
    const ids = selectedOrders.map(o => o.id);
    if (!ids.length) return;
    setOrders(p => p.map(o => ids.includes(o.id) ? { ...o, status: st } : o));
    setSelected(p => p && ids.includes(p.id) ? { ...p, status: st } : p);
    ids.forEach(id => setStatus(id, st).catch(console.error));
  };

  const clearSelection = () => { setChecked({}); setAllChecked(false); };
  const onEditSave = updated => {
    setOrders(p => p.map(o => o.id === updated.id ? updated : o));
    setEditing(null); setSelected(updated);
  };

  const toggleAll = () => {
    const next = !allChecked; setAllChecked(next);
    const map = {}; if (next) pageRows.forEach(o => map[o.id] = true);
    setChecked(map);
  };
  const toggleRow = (id, e) => { e.stopPropagation(); setChecked(p => ({ ...p, [id]: !p[id] })); };

  const exportXLSX = () => {
    // кг одной позиции с учётом тары: ящик≈14кг, лоток≈0.9кг, пакет = qty кг.
    const itemKg = it => {
      const q = parseFloat(it.qty) || 0;
      if (it.packaging === 'yasik' || PKG[it.packaging]?.label?.startsWith('Ящик')) return q * 14;
      if (it.packaging === 'lotok' || PKG[it.packaging]?.label === 'Лоток')          return q * 0.9;
      return q;
    };

    // Столбцы — заявки: над контрагентом дата отгрузки, ещё выше номер заявки.
    // Заявки одного контрагента идут рядом, сортировка по дате отгрузки.
    const cols = targetOrders.map(o => ({
      num: o.id,
      client: o.clientName,
      rawDate: o.shipmentDate || '',
      date: o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '',
      items: o.items,
    })).sort((a, b) =>
      a.client.localeCompare(b.client, 'ru') ||
      a.rawDate.localeCompare(b.rawDate) ||
      String(a.num).localeCompare(String(b.num)));

    // Позиции — строки в порядке референса (каталог PRODUCTS),
    // плюс позиции, которых нет в каталоге (на случай старых заявок).
    const productNames = PRODUCTS.map(p => p.name);
    cols.forEach(c => c.items.forEach(it => { if (!productNames.includes(it.product)) productNames.push(it.product); }));

    // Агрегируем кг: позиция × столбец(заявка).
    const kg = {}; // product -> { colIndex -> kg }
    cols.forEach((c, ci) => c.items.forEach(it => {
      (kg[it.product] ||= {});
      kg[it.product][ci] = (kg[it.product][ci] || 0) + itemKg(it);
    }));

    const round1 = v => Math.round(v * 10) / 10;

    const aoa = [
      ['Номер заявки',           ...cols.map(c => c.num)],
      ['Дата отгрузки',          ...cols.map(c => c.date)],
      ['Наименование продукции', ...cols.map(c => c.client)],
    ];
    productNames.forEach(p => {
      aoa.push([p, ...cols.map((_, ci) => { const v = kg[p]?.[ci]; return v ? round1(v) : ''; })]);
    });

    // Итоговая строка: сумма всех позиций по каждому столбцу (контрагенту).
    // Значения проставляются формулой SUM (ниже), здесь — кешированные числа для предпросмотра.
    const colTotals = cols.map((_, ci) => round1(productNames.reduce((s, p) => s + (kg[p]?.[ci] || 0), 0)));
    aoa.push(['Всего, кг', ...colTotals]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    /* ── Лёгкая стилизация в духе личного кабинета (фирменные тёплые тона) ── */
    const BROWN = '986338', CREAM100 = 'F5F0DF', CREAM50 = 'FBF9F1', ALT = 'FBFAF7';
    const BORDER = 'E4DDD2', TXT = '191414', MUTE = '7E7979', NUM = '3C3636';
    const bd = { style: 'thin', color: { rgb: BORDER } };
    const allBd = { top: bd, bottom: bd, left: bd, right: bd };
    const FONT = 'PT Sans';

    const sNum    = { font: { name: FONT, sz: 10, bold: true,  color: { rgb: BROWN } }, fill: { patternType: 'solid', fgColor: { rgb: CREAM50  } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: allBd };
    const sDate   = { font: { name: FONT, sz: 10, bold: false, color: { rgb: MUTE  } }, fill: { patternType: 'solid', fgColor: { rgb: CREAM50  } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: allBd };
    const sClient = { font: { name: FONT, sz: 11, bold: true,  color: { rgb: 'FFFFFF' } }, fill: { patternType: 'solid', fgColor: { rgb: BROWN } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: allBd };
    const sLabel  = { font: { name: FONT, sz: 10, bold: true,  color: { rgb: BROWN } }, fill: { patternType: 'solid', fgColor: { rgb: CREAM100 } }, alignment: { horizontal: 'right',  vertical: 'center' }, border: allBd };
    const sCorner = { font: { name: FONT, sz: 11, bold: true,  color: { rgb: 'FFFFFF' } }, fill: { patternType: 'solid', fgColor: { rgb: BROWN } }, alignment: { horizontal: 'left',   vertical: 'center', wrapText: true }, border: allBd };
    const sProd   = { font: { name: FONT, sz: 10, bold: true,  color: { rgb: TXT } }, fill: { patternType: 'solid', fgColor: { rgb: CREAM50 } }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: allBd };
    const sData   = { font: { name: FONT, sz: 10, color: { rgb: NUM } }, alignment: { horizontal: 'center', vertical: 'center' }, border: allBd };
    const sDataAlt= { ...sData, fill: { patternType: 'solid', fgColor: { rgb: ALT } } };
    const sTotLbl = { font: { name: FONT, sz: 11, bold: true, color: { rgb: 'FFFFFF' } }, fill: { patternType: 'solid', fgColor: { rgb: BROWN } }, alignment: { horizontal: 'left', vertical: 'center' }, border: allBd };
    const sTot    = { font: { name: FONT, sz: 11, bold: true, color: { rgb: BROWN } }, fill: { patternType: 'solid', fgColor: { rgb: CREAM100 } }, alignment: { horizontal: 'center', vertical: 'center' }, border: allBd };

    const nRows = aoa.length, nCols = 1 + cols.length;
    const totalRow = nRows - 1;
    const firstDataRow = 4, lastDataRow = productNames.length + 3; // Excel-строки (1-based)
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        const cell = ws[ref] || (ws[ref] = { t: 's', v: '' });
        if      (r === 0)        cell.s = c === 0 ? sLabel : sNum;
        else if (r === 1)        cell.s = c === 0 ? sLabel : sDate;
        else if (r === 2)        cell.s = c === 0 ? sCorner : sClient;
        else if (r === totalRow) {
          cell.s = c === 0 ? sTotLbl : sTot;
          if (c > 0) {
            const colL = XLSX.utils.encode_col(c);
            cell.t = 'n';
            cell.f = `SUM(${colL}${firstDataRow}:${colL}${lastDataRow})`;
          }
        }
        else if (c === 0)        cell.s = sProd;
        else                     cell.s = (r % 2 === 1) ? sDataAlt : sData;
      }
    }

    ws['!cols'] = [{ wch: 34 }, ...cols.map(() => ({ wch: 13 }))];
    ws['!rows'] = [{ hpt: 22 }, { hpt: 20 }, { hpt: 30 }, ...productNames.map(() => ({ hpt: 20 })), { hpt: 24 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Заявки');
    XLSX.writeFile(wb, `Заявки_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`);
  };

  const thBase = {
    height: 44, background: MO_BG_HEAD, borderBottom: `1px solid ${MO_BORDER_NAV}`,
    padding: '12px 24px', textAlign: 'left', boxSizing: 'border-box',
    fontFamily: CP_F, fontWeight: 500, fontSize: 12, lineHeight: '18px', color: MO_TEXT_HEAD, whiteSpace: 'nowrap',
  };
  const tdBase = {
    height: 72, borderBottom: `1px solid ${MO_BORDER_ROW}`,
    padding: '16px 24px', boxSizing: 'border-box', verticalAlign: 'middle',
    fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_PRIMARY,
  };
  const supText = { fontFamily: CP_F, fontWeight: 400, fontSize: 14, lineHeight: '20px', color: MO_TEXT_HEAD };

  const Checkbox = ({ on, onClick }) => (
    <span onClick={onClick} style={{
      width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
      border: `1px solid ${on ? MO_BRAND_ACTIVE : '#ADAAAA'}`,
      background: on ? MO_CREAM_50 : '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: MO_BRAND_ACTIVE,
    }}>
      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
    </span>
  );

  const TABS = [
    ['all', 'Все', counts.all],
    ['pending', 'В обработке', counts.pending],
    ['accepted', 'Принятые', counts.accepted],
    ['shipped', 'Отгруженные', counts.shipped],
    ['cancelled', 'Отменённые', counts.cancelled],
  ];

  return (
    <div data-screen-label="Главная — Все заявки" className="mo-orders" style={{
      width: '100%',
      padding: '32px 0 48px', display: 'flex', flexDirection: 'column', gap: 32,
      background: '#fff',
    }}>
      <div className="mo-pad" style={{ display: 'flex', flexDirection: 'column', padding: '0 32px', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 30, lineHeight: '38px', color: MO_TEXT_VOLUME, letterSpacing: '-0.01em' }}>
            Все заявки
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={exportXLSX} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 8, background: '#fff', border: `1px solid ${MO_BORDER_INPUT}`,
              boxShadow: MO_SHADOW_XS, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE,
            }}>
              <span style={{ display: 'flex', color: MO_TEXT_VALUE }}>{MoIco.printer}</span>
              Excel{hasSelection ? ` (${selectedOrders.length})` : ''}
            </button>
            <button type="button" onClick={() => onPrint(targetOrders)} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 8, background: MO_CREAM_100, border: `1px solid ${MO_CREAM_50}`,
              cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: MO_BRAND_ACTIVE,
            }}>
              <span style={{ display: 'flex', color: MO_BRAND_ACTIVE }}>{MoIco.printer}</span>
              Бланки в производство{hasSelection ? ` (${selectedOrders.length})` : ''}
            </button>
          </div>
        </div>

        <div className="mo-tabs" style={{ borderBottom: `1px solid ${MO_BORDER_NAV}`, display: 'flex', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {TABS.map(([key, label, count]) => {
              const on = tab === key;
              return (
                <button key={key} type="button" onClick={() => { setTab(key); setPage(1); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '1px 4px 11px', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: on ? `2px solid ${MO_BRAND_ACTIVE}` : '2px solid transparent',
                    fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px',
                    color: on ? MO_BRAND_ACTIVE : MO_TEXT_TAB, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                  {label}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2px 8px', borderRadius: 16, background: MO_BG_HEAD,
                    fontFamily: CP_F, fontWeight: 500, fontSize: 12, lineHeight: '18px', color: MO_TEXT_VALUE,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mo-pad" style={{ padding: '0 32px' }}>
        <div className="mo-filters" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          {/* Поиск */}
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: `1px solid ${MO_BORDER_INPUT}`, borderRadius: 8,
              padding: '10px 14px', boxShadow: MO_SHADOW_XS,
            }}>
              <span style={{ color: MO_TEXT_TAB, display: 'flex' }}>{CpIco.search}</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Поиск"
                style={{
                  flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: CP_F, fontSize: 16, lineHeight: '24px', color: MO_TEXT_PRIMARY,
                }} />
            </div>
          </div>

          {/* Фильтр по контрагенту */}
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <select value={clientFilter} onChange={e => { setClientFilter(e.target.value); setPage(1); }}
              style={{
                width: '100%', padding: '10px 36px 10px 14px',
                fontFamily: CP_F, fontSize: 16, lineHeight: '24px',
                color: clientFilter ? MO_TEXT_PRIMARY : MO_TEXT_TAB,
                background: `#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237E7979' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>") no-repeat right 14px center`,
                border: `1px solid ${MO_BORDER_INPUT}`, borderRadius: 8, outline: 'none', cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none', boxShadow: MO_SHADOW_XS,
              }}>
              <option value="">Все контрагенты</option>
              {clientOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          {/* Фильтр по дате отгрузки */}
          <div ref={periodRef} style={{ flex: '1 1 280px', minWidth: 0, position: 'relative' }}>
            <button type="button" onClick={() => setShowPeriodCal(s => !s)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                background: '#fff', border: `1px solid ${MO_BORDER_INPUT}`, borderRadius: 8,
                padding: '10px 14px', boxShadow: MO_SHADOW_XS, textAlign: 'left',
                fontFamily: CP_F, fontSize: 16, lineHeight: '24px',
                color: period.start ? MO_TEXT_PRIMARY : MO_TEXT_TAB,
              }}>
              <span style={{ color: period.start ? MO_BRAND_ACTIVE : MO_TEXT_TAB, display: 'flex' }}>{CpIco.calendar}</span>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {period.start && period.end
                  ? `${fmtShort(period.start)} — ${fmtShort(period.end)}`
                  : period.start
                    ? `${fmtShort(period.start)} — …`
                    : 'Период отгрузки'}
              </span>
              {period.start && (
                <span
                  role="button"
                  aria-label="Очистить период"
                  onClick={e => { e.stopPropagation(); setPeriod({ start: null, end: null }); setPage(1); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: 9, color: MO_TEXT_TAB, flexShrink: 0,
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </span>
              )}
            </button>
            {showPeriodCal && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 30 }}>
                <LpHistRangeCalendar
                  start={period.start}
                  end={period.end}
                  onChange={p => { setPeriod(p); setPage(1); }}
                  onClear={() => { setPeriod({ start: null, end: null }); setPage(1); }}
                  onClose={() => setShowPeriodCal(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSelection && (
        <div className="mo-pad" style={{ padding: '0 32px' }}>
          <div className="mo-bulkbar" style={{
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            padding: '12px 16px', borderRadius: 12,
            background: MO_CREAM_50, border: `1px solid ${MO_CREAM_100}`,
          }}>
            <span style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: MO_BRAND_ACTIVE, whiteSpace: 'nowrap' }}>
              Выбрано: {selectedOrders.length}
            </span>
            <span style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE, whiteSpace: 'nowrap' }}>
              Сменить статус:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #ADAAAA', borderRadius: 8, overflow: 'hidden' }}>
              {ORDER_STAT.map(([k, l, dc], i) => (
                <button key={k} type="button" onClick={() => bulkStatus(k)} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '8px 14px', cursor: 'pointer', background: '#fff', border: 'none',
                  borderRight: i < ORDER_STAT.length - 1 ? '1px solid #ADAAAA' : 'none',
                  fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = MO_BG_HEAD}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: dc, flexShrink: 0, display: 'inline-block' }} />
                  {l}
                </button>
              ))}
            </div>
            <button type="button" onClick={clearSelection} style={{
              marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: MO_TEXT_TAB, whiteSpace: 'nowrap',
            }}>
              Снять выделение
            </button>
          </div>
        </div>
      )}

      <div className="mo-pad" style={{ padding: '0 32px' }}>
        <div style={{
          background: '#fff', borderRadius: 12, border: `1px solid ${MO_BORDER_NAV}`,
          boxShadow: CP_SHADOW_SM, overflow: 'hidden', paddingBottom: 20,
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900, tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 110 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 280 }} />
                <col style={{ width: 120 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ ...thBase, width: 110 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                      <Checkbox on={allChecked} onClick={toggleAll} />№
                    </span>
                  </th>
                  <th style={thBase}>Статус</th>
                  <th style={thBase}>Контрагент</th>
                  <th style={thBase}>Создан</th>
                  <th style={thBase}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Отгрузка <span style={{ display: 'flex', color: MO_TEXT_HEAD }}>{MoIco.arrowDown}</span>
                    </span>
                  </th>
                  <th style={thBase}>Адрес/способ</th>
                  <th style={thBase}>Объём</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr><td colSpan={7} style={{ ...tdBase, textAlign: 'center', color: MO_TEXT_TAB, height: 'auto', padding: '48px 24px' }}>
                    Заявок не найдено
                  </td></tr>
                )}
                {pageRows.map(o => {
                  const method = o.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка';
                  return (
                    <tr key={o.id} style={{ cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = MO_BG_HEAD}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      onClick={() => setSelected(o)}>
                      <td style={tdBase}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                          <Checkbox on={!!checked[o.id]} onClick={e => toggleRow(o.id, e)} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.id}</span>
                        </span>
                      </td>
                      <td style={{ ...tdBase, whiteSpace: 'nowrap' }}><CpStatusBadge status={o.status} /></td>
                      <td style={{ ...tdBase, maxWidth: 200 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.clientName}</span>
                      </td>
                      <td style={tdBase}>
                        <div>{moDate(o.createdAt)}</div>
                        <div style={supText}>{moTime(o.createdAt)}</div>
                      </td>
                      <td style={{ ...tdBase, color: MO_TEXT_HEAD, whiteSpace: 'nowrap' }}>
                        {o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '—'}
                      </td>
                      <td style={tdBase}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.deliveryAddress}</div>
                        <div style={supText}>{method}</div>
                      </td>
                      <td style={{ ...tdBase, color: MO_TEXT_VOLUME, whiteSpace: 'nowrap' }}>
                        {Math.round(orderVolumeKg(o))} кг
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div style={{ padding: '20px 20px 0' }}>
              <div className="mo-pagi-desktop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <button type="button" onClick={() => safePage > 1 && setPage(safePage - 1)} disabled={safePage <= 1}
                  style={{
                    background: 'none', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                    cursor: safePage > 1 ? 'pointer' : 'default',
                    color: safePage > 1 ? MO_TEXT_PRIMARY : MO_PAGI_DISABLE,
                    fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px',
                  }}>
                  <span style={{ display: 'inline-flex' }}>{CpIco.arrowLeft}</span>Предыдущая
                </button>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {pageNumbers.map((n, i) => {
                    const active = n === safePage; const isNum = typeof n === 'number';
                    return (
                      <div key={i} onClick={() => isNum && setPage(n)} style={{
                        width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: active ? MO_BG_HEAD : 'transparent',
                        color: active ? MO_NUM_TXT : MO_PAGI_MUTED, cursor: isNum ? 'pointer' : 'default',
                        fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px',
                      }}>{n}</div>
                    );
                  })}
                </div>
                <button type="button" onClick={() => safePage < pageCount && setPage(safePage + 1)} disabled={safePage >= pageCount}
                  style={{
                    background: 'none', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                    cursor: safePage < pageCount ? 'pointer' : 'default',
                    color: safePage < pageCount ? MO_TEXT_PRIMARY : MO_PAGI_DISABLE,
                    fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px',
                  }}>
                  Следующая <span style={{ display: 'inline-flex' }}>{CpIco.arrowRight}</span>
                </button>
              </div>

              <div className="mo-pagi-mobile" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <button type="button" onClick={() => safePage > 1 && setPage(safePage - 1)} disabled={safePage <= 1}
                  aria-label="Предыдущая страница"
                  style={{
                    width: 40, height: 40, flexShrink: 0, borderRadius: 8, background: '#fff',
                    border: `1px solid ${MO_BORDER_INPUT}`, boxShadow: MO_SHADOW_XS,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    cursor: safePage > 1 ? 'pointer' : 'default',
                    color: safePage > 1 ? MO_TEXT_PRIMARY : MO_PAGI_DISABLE,
                  }}>
                  {CpIco.arrowLeft}
                </button>
                <span style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE }}>
                  Страница {safePage} из {pageCount}
                </span>
                <button type="button" onClick={() => safePage < pageCount && setPage(safePage + 1)} disabled={safePage >= pageCount}
                  aria-label="Следующая страница"
                  style={{
                    width: 40, height: 40, flexShrink: 0, borderRadius: 8, background: '#fff',
                    border: `1px solid ${MO_BORDER_INPUT}`, boxShadow: MO_SHADOW_XS,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    cursor: safePage < pageCount ? 'pointer' : 'default',
                    color: safePage < pageCount ? MO_TEXT_PRIMARY : MO_PAGI_DISABLE,
                  }}>
                  {CpIco.arrowRight}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && !editing && (
        <LpAdminOrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onStatus={changeStatus}
          onEdit={() => setEditing(selected)}
          onPrint={() => onPrint([selected])}
        />
      )}
      {editing && <LpOrderEditModal order={editing} adminPwd={adminPwd} onClose={() => setEditing(null)} onSave={onEditSave} />}
    </div>
  );
}

function LpAdminOrderDetail({ order, onClose, onStatus, onEdit, onPrint }) {
  const [isMobile, setIsMobile] = useStateAo(() => window.innerWidth < 768);
  useEffectAo(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const upd = () => setIsMobile(mq.matches);
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  const STAT = ORDER_STAT;
  const isCur = k => order.status === k || (k === 'cancelled' && order.status === 'archive');

  const StatusGroup = () => (
    <div style={{
      display: isMobile ? 'grid' : 'flex',
      gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
      border: '1px solid #ADAAAA',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {STAT.map(([k, l, dc], i) => {
        const cur = isCur(k);
        const isLastCol = isMobile ? i % 2 !== 0 : i === 3;
        const isLastRow = isMobile ? i >= 2 : true;
        return (
          <button key={k} type="button" onClick={() => onStatus(order.id, k)} style={{
            flex: isMobile ? undefined : 1,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: isMobile ? '10px 12px' : '10px 16px',
            cursor: 'pointer',
            background: cur ? MO_BG_HEAD : '#fff',
            border: 'none',
            borderRight: !isLastCol ? '1px solid #ADAAAA' : 'none',
            borderBottom: !isLastRow ? '1px solid #ADAAAA' : 'none',
            fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE,
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: dc, flexShrink: 0, display: 'inline-block',
            }} />
            {l}
          </button>
        );
      })}
    </div>
  );

  const thS = {
    fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_HEAD,
    padding: '10px 16px', background: MO_BG_HEAD,
    borderBottom: `1px solid ${MO_BORDER_NAV}`, textAlign: 'left', whiteSpace: 'nowrap',
  };
  const tdS = {
    fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: MO_TEXT_PRIMARY,
    padding: '14px 16px', borderBottom: `1px solid ${MO_BORDER_ROW}`,
  };
  const ItemsTable = () => (
    <div style={{ border: `1px solid ${MO_BORDER_ROW}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
          <thead>
            <tr>
              <th style={thS}>Продукт</th>
              <th style={thS}>Тара</th>
              <th style={thS}>Количество</th>
              <th style={thS}>Заморозка</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, i) => (
              <tr key={i}>
                <td style={tdS}>{it.product}</td>
                <td style={tdS}>{PKG[it.packaging]?.label || it.packaging}</td>
                <td style={tdS}>{it.qty} {PKG[it.packaging]?.unit || ''}</td>
                <td style={tdS}>{it.frozen ? `Да${it.frozenComment ? ' · ' + it.frozenComment : ''}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isMobile) {
    const fields = [
      ['Контрагент',      order.clientName],
      ['Способ доставки', order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'],
      ['Адрес',           order.deliveryAddress],
      order.shipmentDate ? ['Дата отгрузки', fmtLong(parseISO(order.shipmentDate))] : null,
      ['Объём',           `${Math.round(orderVolumeKg(order))} кг`],
    ].filter(Boolean);

    const closeBtn = (
      <button type="button" onClick={onClose} style={{
        position: 'absolute', top: 12, right: 12,
        width: 44, height: 44, borderRadius: 8, border: 'none', background: 'none',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', color: MO_TEXT_HEAD,
      }}>{CpIco.close}</button>
    );

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(251,248,241,0.7)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        fontFamily: CP_F,
      }}>
        <div style={{
          background: '#fff', borderRadius: '12px 12px 0 0',
          width: '100%', maxHeight: 'calc(100dvh - 64px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0px 20px 24px -4px rgba(16,24,40,0.08)',
          animation: 'cp-sheet-up .28s cubic-bezier(.16,1,.3,1)',
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: '24px 16px 0', position: 'relative' }}>
              <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: MO_TEXT_PRIMARY, paddingRight: 52 }}>Заявка №{order.id}</div>
              <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: MO_TEXT_HEAD, marginTop: 2 }}>Создана {moDate(order.createdAt)} · {moTime(order.createdAt)}</div>
              {closeBtn}
              <div style={{ height: 20 }} />
            </div>
            <div style={{ height: 1, background: MO_BORDER_NAV }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <div style={{ padding: '20px 16px' }}>
              <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: MO_TEXT_PRIMARY, marginBottom: 12 }}>Статус</div>
              <StatusGroup />
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map(([label, value], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4, minHeight: 34 }}>
                  <span style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '24px', color: MO_TEXT_HEAD, flexShrink: 0 }}>{label}</span>
                  <span style={{ flex: 1, borderBottom: '1px dashed #DFDDDD', margin: '0 6px 5px', minWidth: 8 }} />
                  <span style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '24px', color: MO_TEXT_VALUE, textAlign: 'right', maxWidth: '58%' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px' }}><ItemsTable /></div>
            {order.comment && (
              <div style={{ margin: '0 16px 16px', background: MO_BG_HEAD, borderRadius: 8, padding: '12px 14px', fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE }}>
                <b>Комментарий:</b> {order.comment}
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0, background: '#fff', borderTop: `1px solid ${MO_BORDER_NAV}`, padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button type="button" onClick={onPrint} style={{ width: '100%', padding: '12px 18px', borderRadius: 8, background: '#B67E40', border: '1px solid #B67E40', cursor: 'pointer', fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#fff' }}>Печать бланка</button>
              <button type="button" onClick={onEdit} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, background: '#fff', border: `1px solid ${MO_BORDER_INPUT}`, boxShadow: MO_SHADOW_XS, cursor: 'pointer', fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: MO_TEXT_VALUE }}>Редактировать</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lbl = { fontFamily: CP_F, fontWeight: 500, fontSize: 12, lineHeight: '18px', color: MO_TEXT_HEAD, marginBottom: 4 };
  const val = { fontFamily: CP_F, fontWeight: 500, fontSize: 16, lineHeight: '24px', color: MO_TEXT_VALUE };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(52,64,84,0.45)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: CP_F,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12,
        boxShadow: '0px 20px 24px -4px rgba(16,24,40,0.08), 0px 8px 8px -4px rgba(16,24,40,0.03)',
        width: '100%', maxWidth: 688,
        maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        animation: 'cp-card-in .22s ease-out',
      }}>
        <div style={{ flexShrink: 0, padding: '24px 24px 0', position: 'relative' }}>
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: MO_TEXT_PRIMARY }}>Заявка №{order.id}</div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: MO_TEXT_HEAD, marginTop: 2 }}>Создана {moDate(order.createdAt)} · {moTime(order.createdAt)}</div>
          <button type="button" onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 44, height: 44, borderRadius: 8, border: 'none',
            background: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: MO_TEXT_HEAD,
          }}>{CpIco.close}</button>
          <div style={{ height: 20 }} />
          <div style={{ height: 1, background: MO_BORDER_NAV }} />
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: MO_TEXT_PRIMARY, marginBottom: 12 }}>Статус</div>
          <StatusGroup />
        </div>
        <div style={{ padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: 16 }}>
            <div>
              <div style={lbl}>Контрагент</div>
              <div style={val}>{order.clientName}</div>
            </div>
            <div style={{ gridRow: '1 / span 2' }}>
              <div style={lbl}>Адрес</div>
              <div style={val}>{order.deliveryAddress}</div>
            </div>
            <div>
              <div style={lbl}>Способ доставки</div>
              <div style={val}>{order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
            {order.shipmentDate && (
              <div>
                <div style={lbl}>Дата отгрузки</div>
                <div style={val}>{fmtLong(parseISO(order.shipmentDate))}</div>
              </div>
            )}
            <div>
              <div style={lbl}>Объём</div>
              <div style={val}>{Math.round(orderVolumeKg(order))} кг</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}><ItemsTable /></div>
          {order.comment && (
            <div style={{ background: MO_BG_HEAD, borderRadius: 8, padding: '12px 14px', fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: MO_TEXT_VALUE, marginBottom: 8 }}>
              <b>Комментарий:</b> {order.comment}
            </div>
          )}
        </div>
        <div style={{ padding: '32px 24px 24px', display: 'flex', gap: 12 }}>
          <button type="button" onClick={onEdit} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', background: '#fff', border: `1px solid ${MO_BORDER_INPUT}`, boxShadow: MO_SHADOW_XS, fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: MO_TEXT_VALUE }}>Редактировать</button>
          <button type="button" onClick={onPrint} style={{ flex: 1, padding: '10px 18px', borderRadius: 8, cursor: 'pointer', background: '#B67E40', border: '1px solid #B67E40', fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#fff' }}>Печать бланка</button>
        </div>
      </div>
    </div>
  );
}

/* ── PRINT BLANKS PAGE (A4 landscape, 2 бланка на лист) ── */
function LpPrintBlanks({ orders, onClose }) {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[today.getMonth()].toUpperCase()} ${today.getFullYear()}`;

  const buildBlank = (order) => {
    const addrLabel = order.deliveryAddress || '';
    const rows = PRODUCTS.map(p => {
      const items = order.items.filter(it => it.product === p.name);
      let podl='', yashik='', shtuk='', kgTotal=0;
      items.forEach(it => {
        const n = parseFloat(it.qty) || 0;
        // Считаем счётчики по таре, а в КГ — суммарный вес всех видов тары:
        // ящик ≈ 14 кг, лоток ≈ 0.9 кг, пакет уже задан в кг.
        if (it.packaging === 'yasik')      { yashik = (yashik?yashik+'+':'') + it.qty; kgTotal += n * 14;  }
        else if (it.packaging === 'lotok') { podl   = (podl?podl+'+':'')     + it.qty; kgTotal += n * 0.9; }
        else if (it.packaging === 'paket') {                                            kgTotal += n;       }
      });
      const rk = Math.round(kgTotal * 10) / 10;
      const kg = kgTotal ? (Number.isInteger(rk) ? String(rk) : rk.toFixed(1)) : '';
      return { name: p.blank, podl, yashik, shtuk, kg };
    });
    return {
      rows, addr: addrLabel,
      dateStr: order.shipmentDate
        ? `${String(parseISO(order.shipmentDate).getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[parseISO(order.shipmentDate).getMonth()].toUpperCase()} ${parseISO(order.shipmentDate).getFullYear()}`
        : todayStr,
      id: order.id, cpName: order.clientName,
    };
  };

  const blanks = orders.map(buildBlank);
  const pages = [];
  for (let i=0; i<blanks.length; i+=2) pages.push([blanks[i], blanks[i+1]]);

  return ReactDOM.createPortal(
    <div className="lp-print-root" style={{ position:'fixed', inset:0, background:'#666', zIndex:500, overflowY:'auto' }}>
      <style>{`
        @page { size: A4 landscape; margin: 6mm; }
        @media print {
          html, body { background: white !important; }
          /* В печать уходят ТОЛЬКО бланки: всё остальное приложение скрываем */
          body > *:not(.lp-print-root) { display: none !important; }
          .lp-print-root {
            background: white !important;
            position: static !important;
            inset: auto !important;
            overflow: visible !important;
            width: auto !important; height: auto !important;
          }
          .lp-print-toolbar { display: none !important; }
          .lp-blank-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; }
          .lp-blank-page:last-child { page-break-after: auto; }
        }
        .lp-blank-page {
          background: white; width: 285mm; height: 200mm;
          margin: 14px auto; box-shadow: 0 4px 24px rgba(0,0,0,.25);
          padding: 4mm; box-sizing: border-box;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4mm;
        }
        .lp-blank {
          border: 1.2px solid #000; display: flex; flex-direction: column;
          font-family: 'PT Serif', 'Times New Roman', serif;
          color: #000; overflow: hidden;
        }
        .lp-blank-driver-strip {
          border-bottom: 1.2px solid #000;
          display: grid; grid-template-columns: 1fr 1fr; min-height: 14mm;
        }
        .lp-blank-driver-left { border-right: 1.2px solid #000; }
        .lp-blank-driver-label { padding: 1.4mm 2mm; font-weight: 700; font-size: 11pt; font-family: 'PT Serif', serif; }
        .lp-blank-meta {
          padding: 1mm 2mm; font-size: 7.5pt; color:#333;
          border-bottom: 1.2px solid #000;
          display: flex; justify-content: space-between; gap: 4mm;
          font-family: 'PT Sans', Arial, sans-serif;
        }
        .lp-blank-grid { grid-template-columns: 1fr 7mm 7mm 7mm 7mm 11mm; }
        .lp-blank-head, .lp-blank-row {
          display: grid; grid-template-columns: 1fr 7mm 7mm 7mm 7mm 11mm;
          border-bottom: 1px solid #000;
        }
        .lp-blank-head > div, .lp-blank-row > div {
          border-right: 1px solid #000; padding: 0.6mm 1mm;
          font-size: 8pt; line-height: 1.1;
          display: flex; align-items: center;
        }
        .lp-blank-head > div { font-weight: 700; justify-content: center; text-align: center; min-height: 14mm; }
        .lp-blank-head > div:first-child { justify-content: flex-start; padding-left: 2mm; }
        .lp-blank-head > div:last-child, .lp-blank-row > div:last-child { border-right: none; }
        /* Гарантированный вертикальный разделитель между «КГ» и «Накл. №» */
        .lp-blank-head > div.lp-col-kg, .lp-blank-row > div.lp-col-kg { border-right: 1.2px solid #000; }
        .lp-blank-row { min-height: 5.4mm; }
        .lp-blank-row .name { font-weight: 700; font-size: 8.5pt; font-family: 'PT Sans', Arial, sans-serif; letter-spacing: -0.01em; }
        .lp-blank-row .qty { justify-content: center; font-weight: 700; color: #b6231b; font-family: 'PT Sans', Arial, sans-serif; }
        .lp-blank-vert {
          writing-mode: vertical-rl; transform: rotate(180deg);
          text-align: center; font-size: 7pt; line-height: 1; letter-spacing: 0.5px;
          font-family: 'PT Serif', serif;
        }
        .lp-blank-etk {
          padding: 1mm 2mm; font-weight: 700; font-size: 8.5pt;
          border-bottom: 1px solid #000; background: #fafafa;
          font-family: 'PT Sans', Arial, sans-serif;
        }
      `}</style>

      <div className="lp-print-toolbar" style={{ background:DRK, padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:1 }}>
        <div style={{ color:'#fff', fontFamily:FD, fontWeight:700, fontSize:14 }}>🖨 Печать бланков · {blanks.length} шт. (2 на лист)</div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>window.print()} style={{ background:BR, color:'#fff', padding:'8px 18px', borderRadius:6, fontFamily:FL, fontWeight:700, fontSize:12, border:'none' }}>Печать / Сохранить PDF</button>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #5e4426', color:'#c9b299', padding:'8px 18px', borderRadius:6, fontFamily:FL, fontWeight:700, fontSize:12 }}>Закрыть</button>
        </div>
      </div>

      {pages.map((pair, pi) => (
        <div key={pi} className="lp-blank-page">
          {[0,1].map(bi => {
            const b = pair[bi];
            if (!b) return <div key={bi} style={{ visibility:'hidden' }}/>;
            return (
              <div key={bi} className="lp-blank">
                <div className="lp-blank-driver-strip">
                  <div className="lp-blank-driver-left">
                    <div className="lp-blank-driver-label">Водитель:</div>
                  </div>
                  <div className="lp-blank-driver-right"></div>
                </div>
                <div className="lp-blank-meta">
                  <span>Контрагент: <b>{b.cpName}</b> · {b.addr}</span>
                  <span>№{b.id}</span>
                  <span>{b.dateStr}</span>
                </div>
                <div className="lp-blank-etk">ЭТИКЕТКА:</div>
                <div className="lp-blank-head">
                  <div>Наименование товара</div>
                  <div className="lp-blank-vert">П О Д Л</div>
                  <div className="lp-blank-vert">Я Щ И К</div>
                  <div className="lp-blank-vert">Ш Т У К</div>
                  <div className="lp-blank-vert lp-col-kg">К Г</div>
                  <div className="lp-blank-vert">Накл. №</div>
                </div>
                {b.rows.map((r, ri) => (
                  <div key={ri} className="lp-blank-row">
                    <div className="name">{r.name}</div>
                    <div className="qty">{r.podl}</div>
                    <div className="qty">{r.yashik}</div>
                    <div className="qty">{r.shtuk}</div>
                    <div className="qty lp-col-kg">{r.kg}</div>
                    <div></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>,
    document.body
  );
}

/* ── ADMIN PANEL SHELL (новый сайдбар LpManagerLayout) ── */
function LpAdminPanel({ adminPwd, onLogout }) {
  const [view, setView] = useStateAo('orders');
  const [printing, setPrinting] = useStateAo(null);

  return (
    <LpManagerLayout active={view} onNav={setView} onLogout={onLogout}>
      {view === 'orders'         && <LpAdminOrders adminPwd={adminPwd} onPrint={list => setPrinting(list)} />}
      {view === 'counterparties' && <LpCounterparties adminPwd={adminPwd} />}
      {view === 'banner'         && <LpBannerEditor adminPwd={adminPwd} />}
      {printing && <LpPrintBlanks orders={printing} onClose={() => setPrinting(null)} />}
    </LpManagerLayout>
  );
}

export { LpAdminPanel, LpAdminOrders, LpAdminOrderDetail, LpPrintBlanks };
