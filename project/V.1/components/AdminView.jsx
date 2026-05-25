// AdminView.jsx — Manager panel with order list, status updates, Excel export

const { useState, useEffect, useCallback } = React;

const T2 = {
  brand:'#c94030', accent:'#e8a838', nature:'#7a9e7e',
  dark:'#3d2b1f', fg2:'#6b5245', fg3:'#9a8070',
  bg:'#fdfaf4', alt:'#f5edd6', card:'#fff', border:'#e8d9c4',
  display:"'PT Serif', Georgia, serif",
  body:"'PT Sans', Arial, sans-serif",
  label:"'Nunito', sans-serif",
};

/* ── ADMIN LOGIN ── */
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const s = {
    wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:T2.dark, padding:24 },
    card: { background:T2.card, borderRadius:16, boxShadow:'0 16px 48px rgba(0,0,0,.25)', padding:'40px 36px', width:'100%', maxWidth:380 },
    h2: { fontFamily:T2.display, fontSize:22, fontWeight:700, color:T2.dark, marginBottom:6 },
    sub: { fontFamily:T2.body, fontSize:13, color:T2.fg2, marginBottom:28 },
    lbl: { display:'block', fontFamily:T2.label, fontWeight:700, fontSize:11, letterSpacing:'.06em', textTransform:'uppercase', color:T2.fg2, marginBottom:5 },
    inp: { width:'100%', fontFamily:T2.body, fontSize:15, color:T2.dark, background:'white', border:`1.5px solid ${err?T2.brand:T2.border}`, borderRadius:8, padding:'10px 13px', outline:'none', marginBottom:4 },
    err: { fontFamily:T2.body, fontSize:12, color:T2.brand, marginBottom:12 },
    btn: { width:'100%', background:T2.dark, color:'#fdfaf4', padding:'13px', borderRadius:8, fontFamily:T2.label, fontWeight:700, fontSize:15, letterSpacing:'.04em', border:'none', cursor:'pointer', marginTop:8 },
    badge: { display:'inline-block', background:T2.alt, color:T2.fg2, fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', padding:'4px 10px', borderRadius:9999, marginBottom:20 },
  };
  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.badge}>ПАНЕЛЬ МЕНЕДЖЕРА</div>
        <div style={s.h2}>Вход для сотрудников</div>
        <div style={s.sub}>Лычкины птички · Система заявок</div>
        <form onSubmit={e => {
          e.preventDefault();
          if (pw === window.ADMIN_PASSWORD) { onLogin(); }
          else { setErr(true); }
        }}>
          <label style={s.lbl}>Пароль</label>
          <input style={s.inp} type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} placeholder="Введите пароль" required/>
          {err && <div style={s.err}>Неверный пароль</div>}
          <button type="submit" style={s.btn}>Войти</button>
        </form>
      </div>
    </div>
  );
}

/* ── EXCEL EXPORT ── */
function exportToExcel(orders, filter) {
  // SheetJS must be loaded
  if (!window.XLSX) { alert('Excel-экспорт недоступен — библиотека не загружена'); return; }
  const XLSX = window.XLSX;
  const rows = [];
  const toExport = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  toExport.forEach(order => {
    order.items.forEach(item => {
      rows.push({
        'Номер заявки': order.id,
        'Дата и время': window.formatDate(order.createdAt),
        'Клиент': order.clientName,
        'Адрес доставки': order.deliveryAddress,
        'Продукт': item.product,
        'Состояние': item.state,
        'Тара / фасовка': item.packaging,
        'Кол-во / кг': item.weight,
        'Комментарий': order.comment || '',
        'Статус': window.STATUSES[order.status]?.label || order.status,
      });
    });
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  // Column widths
  ws['!cols'] = [14,18,22,28,22,14,16,10,30,14].map(w=>({wch:w}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Заявки');
  const date = new Date().toLocaleDateString('ru-RU').replace(/\./g,'-');
  XLSX.writeFile(wb, `Заявки_Лычкины_${date}.xlsx`);
}

/* ── ORDER DETAIL MODAL ── */
function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(61,43,31,.5)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
    modal: { background:T2.card, borderRadius:16, boxShadow:'0 16px 48px rgba(61,43,31,.2)', width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto' },
    head: { padding:'20px 24px', borderBottom:`1px solid ${T2.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' },
    title: { fontFamily:T2.display, fontSize:18, fontWeight:700, color:T2.dark },
    close: { background:'none', border:'none', fontSize:22, color:T2.fg3, cursor:'pointer', lineHeight:1 },
    body: { padding:'20px 24px' },
    row: { display:'flex', gap:8, marginBottom:16 },
    metaLabel: { fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T2.fg3, marginBottom:3 },
    metaVal: { fontFamily:T2.body, fontSize:14, color:T2.dark },
    table: { width:'100%', borderCollapse:'collapse', marginBottom:16 },
    th: { fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T2.fg3, padding:'8px 12px', textAlign:'left', background:T2.alt, borderBottom:`1px solid ${T2.border}` },
    td: { fontFamily:T2.body, fontSize:13, color:T2.dark, padding:'9px 12px', borderBottom:`1px solid ${T2.border}` },
    statusRow: { display:'flex', gap:10, marginTop:20 },
    statusBtn: (active, color) => ({ flex:1, padding:'10px', borderRadius:8, fontFamily:T2.label, fontWeight:700, fontSize:13, letterSpacing:'.04em', border:`2px solid ${color}`, background:active?color:'transparent', color:active?'white':color, cursor:'pointer' }),
  };

  return (
    <div style={s.overlay} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={s.modal}>
        <div style={s.head}>
          <div>
            <div style={s.title}>Заявка № {order.id}</div>
            <div style={{ fontFamily:T2.body, fontSize:12, color:T2.fg3, marginTop:3 }}>{window.formatDate(order.createdAt)}</div>
          </div>
          <button style={s.close} onClick={onClose}>×</button>
        </div>
        <div style={s.body}>
          <div style={s.row}>
            <div style={{ flex:1 }}>
              <div style={s.metaLabel}>Клиент</div>
              <div style={s.metaVal}>{order.clientName}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={s.metaLabel}>Адрес доставки</div>
              <div style={s.metaVal}>{order.deliveryAddress}</div>
            </div>
          </div>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Продукт</th>
                <th style={s.th}>Состояние</th>
                <th style={s.th}>Тара</th>
                <th style={s.th}>Кол-во</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it,i) => (
                <tr key={i}>
                  <td style={s.td}>{it.product}</td>
                  <td style={s.td}>{it.state}</td>
                  <td style={s.td}>{it.packaging}</td>
                  <td style={s.td}>{it.weight} кг</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.comment && (
            <div style={{ background:T2.alt, borderRadius:8, padding:'10px 14px', fontFamily:T2.body, fontSize:13, color:T2.fg2, marginBottom:16 }}>
              <span style={{ fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T2.fg3 }}>Комментарий: </span>
              {order.comment}
            </div>
          )}
          <div style={{ fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T2.fg3, marginBottom:8 }}>Изменить статус</div>
          <div style={s.statusRow}>
            <button style={s.statusBtn(order.status==='pending', T2.accent)} onClick={()=>onStatusChange(order.id,'pending')}>В обработке</button>
            <button style={s.statusBtn(order.status==='accepted', T2.nature)} onClick={()=>onStatusChange(order.id,'accepted')}>Принята</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN PANEL ── */
function AdminPanel({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [newCount, setNewCount] = useState(0);

  const reload = useCallback(() => {
    const all = window.getOrders();
    setOrders(all);
    // count orders in last 10min as "new"
    const cutoff = Date.now() - 10 * 60 * 1000;
    setNewCount(all.filter(o => new Date(o.createdAt).getTime() > cutoff && o.status==='pending').length);
  }, []);

  useEffect(() => { reload(); const t = setInterval(reload, 5000); return () => clearInterval(t); }, [reload]);

  const changeStatus = (id, status) => {
    window.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id===id ? {...o, status} : o));
    if (selected?.id === id) setSelected(prev => ({...prev, status}));
  };

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.clientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) ||
             o.items.some(it => it.product.toLowerCase().includes(q));
    }
    return true;
  });

  const s = {
    layout: { display:'flex', flexDirection:'column', minHeight:'100vh', background:T2.bg },
    topbar: { background:T2.dark, padding:'0 24px', flexShrink:0 },
    topInner: { maxWidth:1200, margin:'0 auto', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' },
    topTitle: { fontFamily:T2.display, fontSize:16, fontWeight:700, color:'#f5edd6' },
    topRight: { display:'flex', alignItems:'center', gap:16 },
    logoutBtn: { background:'none', border:`1px solid #5e4426`, borderRadius:6, padding:'6px 14px', fontFamily:T2.label, fontWeight:700, fontSize:12, color:'#9a8070', cursor:'pointer', letterSpacing:'.04em' },
    toolbar: { background:T2.card, borderBottom:`1px solid ${T2.border}`, padding:'0 24px' },
    toolInner: { maxWidth:1200, margin:'0 auto', height:56, display:'flex', alignItems:'center', gap:16 },
    searchWrap: { flex:1, maxWidth:320, position:'relative' },
    searchInp: { width:'100%', fontFamily:T2.body, fontSize:14, color:T2.dark, background:T2.alt, border:`1.5px solid ${T2.border}`, borderRadius:8, padding:'8px 12px 8px 36px', outline:'none' },
    searchIcon: { position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:T2.fg3 },
    filterBtn: (active) => ({ fontFamily:T2.label, fontWeight:700, fontSize:12, letterSpacing:'.04em', padding:'6px 14px', borderRadius:9999, border:`1.5px solid ${active?T2.brand:T2.border}`, background:active?T2.brand:'transparent', color:active?'white':T2.dark, cursor:'pointer' }),
    excelBtn: { background:'#1D6F42', color:'white', padding:'7px 16px', borderRadius:7, fontFamily:T2.label, fontWeight:700, fontSize:12, letterSpacing:'.04em', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6 },
    main: { flex:1, maxWidth:1200, width:'100%', margin:'0 auto', padding:'24px 24px' },
    statsRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 },
    statCard: (color) => ({ background:T2.card, borderRadius:10, padding:'14px 18px', boxShadow:'0 2px 8px rgba(61,43,31,.07)', borderLeft:`3px solid ${color}` }),
    statNum: { fontFamily:T2.display, fontSize:26, fontWeight:700, color:T2.dark },
    statLabel: { fontFamily:T2.body, fontSize:12, color:T2.fg3, marginTop:2 },
    table: { width:'100%', borderCollapse:'collapse', background:T2.card, borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(61,43,31,.07)' },
    th: { fontFamily:T2.label, fontWeight:700, fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:T2.fg3, padding:'10px 16px', textAlign:'left', background:T2.alt, borderBottom:`1px solid ${T2.border}` },
    tr: (hover) => ({ cursor:'pointer', background:hover?'#fef9f8':T2.card, transition:'background 120ms' }),
    td: { fontFamily:T2.body, fontSize:13, color:T2.dark, padding:'11px 16px', borderBottom:`1px solid ${T2.border}` },
    newDot: { width:7, height:7, borderRadius:'50%', background:T2.brand, display:'inline-block', marginRight:6 },
    empty: { textAlign:'center', padding:'60px 0', fontFamily:T2.body, fontSize:15, color:T2.fg3 },
  };

  const pendingCount = orders.filter(o=>o.status==='pending').length;
  const acceptedCount = orders.filter(o=>o.status==='accepted').length;

  return (
    <div style={s.layout}>
      <div style={s.topbar}>
        <div style={s.topInner}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={s.topTitle}>Панель менеджера · Лычкины птички</span>
            {newCount > 0 && (
              <span style={{ background:T2.brand, color:'white', fontFamily:T2.label, fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:9999 }}>
                {newCount} новых
              </span>
            )}
          </div>
          <div style={s.topRight}>
            <button style={s.logoutBtn} onClick={onLogout}>Выйти</button>
          </div>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.toolInner}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input style={s.searchInp} placeholder="Поиск по клиенту, продукту..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <button style={s.filterBtn(filter==='all')} onClick={()=>setFilter('all')}>Все ({orders.length})</button>
          <button style={s.filterBtn(filter==='pending')} onClick={()=>setFilter('pending')}>В обработке ({pendingCount})</button>
          <button style={s.filterBtn(filter==='accepted')} onClick={()=>setFilter('accepted')}>Принятые ({acceptedCount})</button>
          <div style={{ flex:1 }}/>
          <button style={s.excelBtn} onClick={()=>exportToExcel(orders, filter)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Скачать Excel
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto' }}>
        <div style={s.main}>
          <div style={s.statsRow}>
            <div style={s.statCard(T2.accent)}><div style={s.statNum}>{pendingCount}</div><div style={s.statLabel}>В обработке</div></div>
            <div style={s.statCard(T2.nature)}><div style={s.statNum}>{acceptedCount}</div><div style={s.statLabel}>Принятые</div></div>
            <div style={s.statCard(T2.fg3)}><div style={s.statNum}>{orders.length}</div><div style={s.statLabel}>Всего заявок</div></div>
          </div>

          {filtered.length === 0
            ? <div style={s.empty}>Заявок не найдено</div>
            : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>№ Заявки</th>
                    <th style={s.th}>Дата и время</th>
                    <th style={s.th}>Клиент</th>
                    <th style={s.th}>Адрес</th>
                    <th style={s.th}>Позиции</th>
                    <th style={s.th}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => {
                    const isNew = Date.now() - new Date(order.createdAt).getTime() < 10*60*1000 && order.status==='pending';
                    return (
                      <tr key={order.id} style={s.tr(false)} onClick={()=>setSelected(order)}
                        onMouseEnter={e=>e.currentTarget.style.background='#fef9f8'}
                        onMouseLeave={e=>e.currentTarget.style.background=T2.card}>
                        <td style={s.td}>
                          {isNew && <span style={s.newDot}/>}
                          <span style={{ fontFamily:T2.label, fontWeight:700, fontSize:12, color:T2.fg3 }}>{order.id}</span>
                        </td>
                        <td style={s.td}>{window.formatDate(order.createdAt)}</td>
                        <td style={{ ...s.td, fontWeight:700 }}>{order.clientName}</td>
                        <td style={{ ...s.td, color:T2.fg2, fontSize:12 }}>{order.deliveryAddress}</td>
                        <td style={s.td}>{order.items.length} поз. · {order.items.map(i=>i.product).join(', ').slice(0,40)}{order.items.map(i=>i.product).join(', ').length>40?'…':''}</td>
                        <td style={s.td}><window.Badge status={order.status}/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </div>
      </div>

      <OrderModal
        order={selected}
        onClose={()=>setSelected(null)}
        onStatusChange={(id, status) => { changeStatus(id, status); }}
      />
    </div>
  );
}

function AdminApp({ onBack }) {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)}/>;
  return <AdminPanel onLogout={() => setAuthed(false)}/>;
}

Object.assign(window, { AdminApp });
