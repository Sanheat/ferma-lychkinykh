// ClientView.jsx — Order form + client order history

const { useState, useEffect } = React;

/* ── TOKENS ── */
const T = {
  brand:'#c94030', brandHover:'#a8331f', accent:'#e8a838',
  nature:'#7a9e7e', dark:'#3d2b1f', fg2:'#6b5245', fg3:'#9a8070',
  bg:'#fdfaf4', alt:'#f5edd6', card:'#fff', border:'#e8d9c4',
  display:"'PT Serif', Georgia, serif",
  body:"'PT Sans', Arial, sans-serif",
  label:"'Nunito', sans-serif",
};

/* ── SHARED COMPONENTS ── */
function Logo() {
  return (
    <svg width="160" height="38" viewBox="0 0 185 44" fill="none">
      <ellipse cx="22" cy="28" rx="14" ry="9" fill={T.brand}/>
      <circle cx="33" cy="20" r="8" fill={T.brand}/>
      <polygon points="40,18 47,21 40,24" fill={T.accent}/>
      <circle cx="35" cy="18" r="1.8" fill="white"/>
      <path d="M11,26 Q5,14 20,11 Q16,22 11,26Z" fill="#a8331f"/>
      <path d="M9,30 Q1,24 6,36Z" fill="#a8331f"/>
      <text x="54" y="22" fontFamily="PT Serif,serif" fontSize="16" fontWeight="700" fill={T.dark}>Лычкины</text>
      <text x="54" y="40" fontFamily="PT Serif,serif" fontSize="16" fontWeight="700" fill={T.brand}>птички</text>
    </svg>
  );
}

function Badge({ status }) {
  const s = window.STATUSES[status] || window.STATUSES.pending;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:s.bg, color:s.color,
      fontFamily:T.label, fontWeight:700, fontSize:11, letterSpacing:'.04em',
      padding:'3px 10px', borderRadius:9999 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, display:'inline-block' }}/>
      {s.label}
    </span>
  );
}

/* ── CLIENT LOGIN ── */
function ClientLogin({ onLogin }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const s = {
    wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:24 },
    card: { background:T.card, borderRadius:16, boxShadow:'0 8px 32px rgba(61,43,31,.12)', padding:'40px 36px', width:'100%', maxWidth:420 },
    h2: { fontFamily:T.display, fontSize:24, fontWeight:700, color:T.dark, marginBottom:6, lineHeight:1.2 },
    sub: { fontFamily:T.body, fontSize:14, color:T.fg2, marginBottom:28 },
    lbl: { display:'block', fontFamily:T.label, fontWeight:700, fontSize:11, letterSpacing:'.06em', textTransform:'uppercase', color:T.fg2, marginBottom:5 },
    inp: { width:'100%', fontFamily:T.body, fontSize:15, color:T.dark, background:'white', border:`1.5px solid ${T.border}`, borderRadius:8, padding:'10px 13px', outline:'none', marginBottom:16 },
    btn: { width:'100%', background:T.brand, color:'white', padding:'13px', borderRadius:8, fontFamily:T.label, fontWeight:700, fontSize:15, letterSpacing:'.04em', border:'none', cursor:'pointer', marginTop:4 },
  };
  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={{ marginBottom:24 }}><Logo/></div>
        <div style={s.h2}>Система заявок</div>
        <div style={s.sub}>Введите данные вашей организации для входа</div>
        <form onSubmit={e => { e.preventDefault(); if(name.trim()&&address.trim()) { const c={name:name.trim(),address:address.trim()}; window.saveClient(c); onLogin(c); }}}>
          <label style={s.lbl}>Наименование ИП / ООО</label>
          <input style={s.inp} value={name} onChange={e=>setName(e.target.value)} placeholder="ИП Иванов И.И." required/>
          <label style={s.lbl}>Адрес доставки</label>
          <input style={s.inp} value={address} onChange={e=>setAddress(e.target.value)} placeholder="г. Москва, ул. Примерная, д.1" required/>
          <button type="submit" style={s.btn}>Войти и оформить заказ</button>
        </form>
        <div style={{ marginTop:20, textAlign:'center', fontFamily:T.body, fontSize:12, color:T.fg3 }}>
          Для доступа к панели менеджера: нажмите{' '}
          <span style={{ color:T.brand, cursor:'pointer', textDecoration:'underline' }} onClick={()=>window.__goAdmin&&window.__goAdmin()}>здесь</span>
        </div>
      </div>
    </div>
  );
}

/* ── ORDER FORM ── */
function OrderForm({ client, onSubmit }) {
  const emptyItem = () => ({ id: window.genId(), product:'', state:'Охлаждённое', packaging:'paket', weight:'' });
  const [items, setItems] = useState([emptyItem()]);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const setItem = (idx, key, val) => setItems(prev => prev.map((it,i) => i===idx ? {...it,[key]:val} : it));
  const addItem = () => setItems(prev => [...prev, emptyItem()]);
  const removeItem = idx => setItems(prev => prev.filter((_,i) => i!==idx));

  const groups = [...new Set(window.PRODUCTS.map(p => p.group))];

  const s = {
    section: { background:T.bg, minHeight:'100vh', paddingBottom:60 },
    header: { background:T.card, borderBottom:`1px solid ${T.border}`, padding:'0 24px', position:'sticky', top:0, zIndex:10 },
    headerInner: { maxWidth:900, margin:'0 auto', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' },
    main: { maxWidth:900, margin:'0 auto', padding:'32px 24px' },
    h1: { fontFamily:T.display, fontSize:22, fontWeight:700, color:T.dark, marginBottom:4 },
    meta: { fontFamily:T.body, fontSize:13, color:T.fg2, marginBottom:24 },
    card: { background:T.card, borderRadius:12, boxShadow:'0 2px 8px rgba(61,43,31,.08)', marginBottom:12, padding:'18px 20px' },
    itemRow: { display:'grid', gridTemplateColumns:'2fr 140px 130px 90px 32px', gap:10, alignItems:'end' },
    lbl: { display:'block', fontFamily:T.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T.fg2, marginBottom:4 },
    sel: { width:'100%', fontFamily:T.body, fontSize:13, color:T.dark, background:'white', border:`1.5px solid ${T.border}`, borderRadius:7, padding:'8px 10px', outline:'none' },
    inp: { width:'100%', fontFamily:T.body, fontSize:13, color:T.dark, background:'white', border:`1.5px solid ${T.border}`, borderRadius:7, padding:'8px 10px', outline:'none' },
    addBtn: { background:'none', border:`1.5px dashed ${T.border}`, borderRadius:8, padding:'10px', width:'100%', fontFamily:T.label, fontWeight:700, fontSize:13, color:T.fg2, cursor:'pointer', marginTop:4 },
    submitBtn: { background:T.brand, color:'white', padding:'14px 32px', borderRadius:8, fontFamily:T.label, fontWeight:700, fontSize:15, letterSpacing:'.04em', border:'none', cursor:'pointer', marginTop:20 },
    removeBtn: { background:'none', border:'none', color:T.fg3, fontSize:18, cursor:'pointer', padding:'0 0 4px', lineHeight:1, alignSelf:'flex-end' },
    note: { fontFamily:T.body, fontSize:12, color:T.fg3, marginTop:8 },
    histLink: { fontFamily:T.label, fontWeight:700, fontSize:12, letterSpacing:'.04em', color:T.brand, cursor:'pointer', textDecoration:'none', background:'none', border:'none' },
  };

  if (success) return (
    <div style={s.section}>
      <div style={s.header}><div style={s.headerInner}><Logo/></div></div>
      <div style={{ ...s.main, textAlign:'center', paddingTop:80 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
        <div style={{ fontFamily:T.display, fontSize:28, fontWeight:700, color:T.dark, marginBottom:10 }}>Заявка принята!</div>
        <div style={{ fontFamily:T.body, fontSize:16, color:T.fg2, marginBottom:32 }}>Мы свяжемся с вами для подтверждения.</div>
        <button style={s.submitBtn} onClick={()=>{ setSuccess(false); setItems([emptyItem()]); setComment(''); }}>Новый заказ</button>
        <button style={{ ...s.submitBtn, background:'none', color:T.brand, border:`2px solid ${T.brand}`, marginLeft:12 }} onClick={()=>onSubmit('history')}>История заказов</button>
      </div>
    </div>
  );

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div style={s.headerInner}>
          <Logo/>
          <button style={s.histLink} onClick={()=>onSubmit('history')}>История заказов →</button>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.h1}>Новая заявка</div>
        <div style={s.meta}>{client.name} · {client.address}</div>
        <div style={{ fontFamily:T.label, fontWeight:700, fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:T.fg3, marginBottom:10 }}>Позиции заказа</div>
        {items.map((item, idx) => (
          <div key={item.id} style={s.card}>
            <div style={s.itemRow}>
              <div>
                <label style={s.lbl}>Продукт</label>
                <select style={s.sel} value={item.product} onChange={e=>setItem(idx,'product',e.target.value)} required>
                  <option value="">— Выберите позицию —</option>
                  {groups.map(g => (
                    <optgroup key={g} label={g}>
                      {window.PRODUCTS.filter(p=>p.group===g).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label style={s.lbl}>Состояние</label>
                <select style={s.sel} value={item.state} onChange={e=>setItem(idx,'state',e.target.value)}>
                  {window.STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label style={s.lbl}>Тара / фасовка</label>
                <select style={s.sel} value={item.packaging} onChange={e=>setItem(idx,'packaging',e.target.value)}>
                  {window.PACKAGING.map(p => <option key={p.id} value={p.id}>{p.label} ({p.note})</option>)}
                </select>
              </div>
              <div>
                <label style={s.lbl}>Кол-во / кг</label>
                <input style={s.inp} type="number" min="0.1" step="0.1" placeholder="кг" value={item.weight} onChange={e=>setItem(idx,'weight',e.target.value)} required/>
              </div>
              {items.length > 1
                ? <button style={s.removeBtn} onClick={()=>removeItem(idx)} title="Удалить">×</button>
                : <div/>}
            </div>
          </div>
        ))}
        <button style={s.addBtn} onClick={addItem}>+ Добавить позицию</button>
        <div style={{ marginTop:20 }}>
          <div style={{ ...s.lbl, marginBottom:6 }}>Комментарий к заказу</div>
          <textarea style={{ ...s.inp, width:'100%', resize:'vertical', minHeight:72, borderRadius:8 }} placeholder="Особые пожелания, удобное время доставки..." value={comment} onChange={e=>setComment(e.target.value)}/>
        </div>
        <div style={s.note}>⚠ Заказы на ближайшую поставку принимаются до 15:00. Минимальная сумма заказа — 8 000 ₽.</div>
        <button style={s.submitBtn} onClick={() => {
          if (items.some(it => !it.product || !it.weight)) { alert('Заполните все позиции'); return; }
          const order = {
            id: window.genId(),
            clientName: client.name,
            deliveryAddress: client.address,
            createdAt: new Date().toISOString(),
            items: items.map(it => ({
              product: it.product,
              state: it.state,
              packaging: window.PACKAGING.find(p=>p.id===it.packaging)?.label || it.packaging,
              weight: it.weight,
            })),
            comment,
            status: 'pending',
          };
          window.addOrder(order);
          setSuccess(true);
        }}>Отправить заявку</button>
      </div>
    </div>
  );
}

/* ── ORDER HISTORY ── */
function OrderHistory({ client, onBack }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const all = window.getOrders();
    setOrders(all.filter(o => o.clientName === client.name));
  }, []);

  const s = {
    section: { background:T.bg, minHeight:'100vh', paddingBottom:60 },
    header: { background:T.card, borderBottom:`1px solid ${T.border}`, padding:'0 24px', position:'sticky', top:0, zIndex:10 },
    headerInner: { maxWidth:900, margin:'0 auto', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' },
    main: { maxWidth:900, margin:'0 auto', padding:'32px 24px' },
    h1: { fontFamily:T.display, fontSize:22, fontWeight:700, color:T.dark, marginBottom:4 },
    meta: { fontFamily:T.body, fontSize:13, color:T.fg2, marginBottom:24 },
    card: { background:T.card, borderRadius:12, boxShadow:'0 2px 8px rgba(61,43,31,.08)', marginBottom:12, overflow:'hidden' },
    cardHead: { padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${T.border}` },
    orderId: { fontFamily:T.label, fontWeight:700, fontSize:12, letterSpacing:'.05em', color:T.fg3 },
    orderDate: { fontFamily:T.body, fontSize:12, color:T.fg3 },
    table: { width:'100%', borderCollapse:'collapse' },
    th: { fontFamily:T.label, fontWeight:700, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:T.fg3, padding:'8px 20px', textAlign:'left', background:T.alt, borderBottom:`1px solid ${T.border}` },
    td: { fontFamily:T.body, fontSize:13, color:T.dark, padding:'9px 20px', borderBottom:`1px solid ${T.border}` },
    backBtn: { fontFamily:T.label, fontWeight:700, fontSize:12, letterSpacing:'.04em', color:T.brand, cursor:'pointer', background:'none', border:'none' },
    empty: { textAlign:'center', padding:'60px 0', fontFamily:T.body, fontSize:16, color:T.fg3 },
  };

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div style={s.headerInner}>
          <Logo/>
          <button style={s.backBtn} onClick={onBack}>← Новый заказ</button>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.h1}>История заказов</div>
        <div style={s.meta}>{client.name}</div>
        {orders.length === 0
          ? <div style={s.empty}>Заказов пока нет</div>
          : orders.map(order => (
            <div key={order.id} style={s.card}>
              <div style={s.cardHead}>
                <div>
                  <span style={s.orderId}>№ {order.id}</span>
                  <span style={{ ...s.orderDate, marginLeft:16 }}>{window.formatDate(order.createdAt)}</span>
                </div>
                <Badge status={order.status}/>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Продукт</th>
                    <th style={s.th}>Состояние</th>
                    <th style={s.th}>Тара</th>
                    <th style={s.th}>Кол-во / кг</th>
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
              {order.comment && <div style={{ padding:'10px 20px', fontFamily:T.body, fontSize:12, color:T.fg2, background:T.alt }}>💬 {order.comment}</div>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ── CLIENT APP ── */
function ClientApp({ onGoAdmin }) {
  const [client, setClient] = useState(() => window.getClient());
  const [view, setView] = useState('form'); // 'form' | 'history'

  window.__goAdmin = onGoAdmin;

  if (!client) return <ClientLogin onLogin={c => setClient(c)}/>;
  if (view === 'history') return <OrderHistory client={client} onBack={() => setView('form')}/>;
  return <OrderForm client={client} onSubmit={v => setView(v === 'history' ? 'history' : 'form')}/>;
}

Object.assign(window, { ClientApp, Badge });
