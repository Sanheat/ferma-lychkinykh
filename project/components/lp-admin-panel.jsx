/* ── ADMIN: ORDERS LIST + FILTERS ── */
const { useState: useStateAo, useEffect: useEffectAo, useMemo: useMemoAo } = React;

/** total volume (kg approx) for a given order: yasik≈14kg, lotok≈0.9kg, paket=qty kg */
function orderVolumeKg(o) {
  return o.items.reduce((sum, it) => {
    const q = parseFloat(it.qty) || 0;
    if (it.packaging === 'yasik' || PKG[it.packaging]?.label?.startsWith('Ящик')) return sum + q*14;
    if (it.packaging === 'lotok' || PKG[it.packaging]?.label === 'Лоток')          return sum + q*0.9;
    return sum + q; // paket / kg
  }, 0);
}

function LpAdminOrders({ onPrint }) {
  const [orders, setOrders] = useStateAo(getOrders);
  const [tab, setTab] = useStateAo('pending'); // pending | accepted | shipped | archive
  const [search, setSearch] = useStateAo('');
  const [cpFilter, setCpFilter] = useStateAo('');
  const [volMin, setVolMin] = useStateAo('');
  const [volMax, setVolMax] = useStateAo('');
  const [dateFrom, setDateFrom] = useStateAo('');
  const [dateTo, setDateTo] = useStateAo('');
  const [selected, setSelected] = useStateAo(null);
  const [editing, setEditing] = useStateAo(null);

  useEffectAo(() => { const t=setInterval(()=>setOrders(getOrders()), 5000); return () => clearInterval(t); }, []);

  const cps = getCounterparties();

  const counts = useMemoAo(() => ({
    pending:  orders.filter(o => o.status==='pending').length,
    accepted: orders.filter(o => o.status==='accepted').length,
    shipped:  orders.filter(o => o.status==='shipped').length,
    archive:  orders.filter(o => o.status==='archive').length,
  }), [orders]);

  const filtered = useMemoAo(() => {
    return orders.filter(o => {
      if (tab === 'pending'  && o.status!=='pending')  return false;
      if (tab === 'accepted' && o.status!=='accepted') return false;
      if (tab === 'shipped'  && o.status!=='shipped')  return false;
      if (tab === 'archive'  && o.status!=='archive')  return false;
      if (cpFilter && o.clientId !== cpFilter && o.clientName !== cpFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hit = o.clientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) ||
                    o.deliveryAddress?.toLowerCase().includes(q) ||
                    o.items.some(it=>it.product.toLowerCase().includes(q));
        if (!hit) return false;
      }
      const v = orderVolumeKg(o);
      if (volMin && v < parseFloat(volMin)) return false;
      if (volMax && v > parseFloat(volMax)) return false;
      if (dateFrom && o.shipmentDate && o.shipmentDate < dateFrom) return false;
      if (dateTo   && o.shipmentDate && o.shipmentDate > dateTo)   return false;
      return true;
    });
  }, [orders, tab, cpFilter, search, volMin, volMax, dateFrom, dateTo]);

  const changeStatus = (id, st) => {
    setStatus(id, st);
    setOrders(p => p.map(o => o.id===id ? {...o, status:st} : o));
    setSelected(p => p?.id===id ? {...p, status:st} : p);
  };

  const onEditSave = updated => {
    setOrders(p => p.map(o => o.id===updated.id ? updated : o));
    setEditing(null);
    setSelected(updated);
  };

  const exportXLSX = () => {
    if (!window.XLSX) return alert('Excel недоступен');
    const rows = [];
    filtered.forEach(o => o.items.forEach(it => rows.push({
      'Номер': o.id,
      'Дата создания': fmtDate(o.createdAt),
      'Дата отгрузки': o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '',
      'Способ': o.deliveryType==='pickup' ? 'Самовывоз' : 'Доставка',
      'Контрагент': o.clientName,
      'Адрес': o.deliveryAddress,
      'Продукт': it.product,
      'Заморозка': it.frozen ? 'да' : '',
      'Тара': PKG[it.packaging]?.label || it.packaging,
      'Кол-во': it.qty,
      'Ед.': PKG[it.packaging]?.unit || '',
      'Объём, кг (расч.)': orderVolumeKg(o).toFixed(1),
      'Комментарий': o.comment || '',
      'Статус': STATUSES[o.status]?.label || o.status,
    })));
    const ws = window.XLSX.utils.json_to_sheet(rows);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'Заявки');
    window.XLSX.writeFile(wb, `Заявки_${new Date().toLocaleDateString('ru-RU').replace(/\./g,'-')}.xlsx`);
  };

  const thS = { fontFamily:FL, fontWeight:700, fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:FG3, padding:'10px 14px', textAlign:'left', background:ALT, borderBottom:`1px solid ${BRD}` };
  const tdS = { fontFamily:FB, fontSize:13, color:DRK, padding:'11px 14px', borderBottom:`1px solid ${BRD}` };
  const tabBtn = a => ({ fontFamily:FL, fontWeight:700, fontSize:12, letterSpacing:'.04em', padding:'8px 16px', borderRadius:9999, border:`1.5px solid ${a?BR:BRD}`, background:a?BR:'transparent', color:a?'white':DRK, cursor:'pointer' });

  return (
    <div style={{ maxWidth:1300, margin:'0 auto', padding:'20px 24px' }}>
      {/* Filters bar — grouped + responsive */}
      <div style={{ background:CRD, borderRadius:12, padding:'14px 16px', boxShadow:`0 2px 8px rgba(61,43,31,.07)`, marginBottom:14 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:10 }}>
          <button style={tabBtn(tab==='pending')}  onClick={()=>setTab('pending')}>В обработке ({counts.pending})</button>
          <button style={tabBtn(tab==='accepted')} onClick={()=>setTab('accepted')}>Принятые ({counts.accepted})</button>
          <button style={tabBtn(tab==='shipped')}  onClick={()=>setTab('shipped')}>Отгруженные ({counts.shipped})</button>
          <button style={tabBtn(tab==='archive')}  onClick={()=>setTab('archive')}>В архиве ({counts.archive})</button>
          <div style={{ flex:1 }}/>
          <button onClick={()=>onPrint(filtered)} style={{ background:DRK, color:'white', padding:'8px 16px', borderRadius:7, fontFamily:FL, fontWeight:700, fontSize:12, letterSpacing:'.04em', border:'none', whiteSpace:'nowrap' }}>🖨 Бланки в производство</button>
          <button onClick={exportXLSX} style={{ background:'#1D6F42', color:'white', padding:'8px 16px', borderRadius:7, fontFamily:FL, fontWeight:700, fontSize:12, letterSpacing:'.04em', border:'none', whiteSpace:'nowrap' }}>↓ Excel</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'minmax(200px, 1.4fr) minmax(180px, 1.2fr) minmax(180px, 1fr) minmax(220px, 1.2fr)', gap:10, alignItems:'end' }}>
          <div>
            <div style={lbl}>Поиск</div>
            <input style={{...inp, padding:'8px 12px', fontSize:13}} placeholder="🔍 Номер, адрес, продукт…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div>
            <div style={lbl}>Контрагент</div>
            <select style={{...inp, padding:'8px 10px', fontSize:13}} value={cpFilter} onChange={e=>setCpFilter(e.target.value)}>
              <option value="">Все контрагенты</option>
              {cps.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <div style={lbl}>Объём, кг</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <input style={{...inp, padding:'8px 10px', fontSize:13, width:'100%'}} placeholder="от" type="number" value={volMin} onChange={e=>setVolMin(e.target.value)}/>
              <span style={{ color:FG3 }}>–</span>
              <input style={{...inp, padding:'8px 10px', fontSize:13, width:'100%'}} placeholder="до" type="number" value={volMax} onChange={e=>setVolMax(e.target.value)}/>
            </div>
          </div>
          <div>
            <div style={lbl}>Дата отгрузки</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <input type="date" style={{...inp, padding:'8px 10px', fontSize:13, width:'100%'}} value={dateFrom} onChange={e=>setDateFrom(e.target.value)} title="С даты"/>
              <span style={{ color:FG3 }}>–</span>
              <input type="date" style={{...inp, padding:'8px 10px', fontSize:13, width:'100%'}} value={dateTo} onChange={e=>setDateTo(e.target.value)} title="По дату"/>
              {(dateFrom || dateTo) && (
                <button onClick={()=>{ setDateFrom(''); setDateTo(''); }} title="Сбросить даты"
                  style={{ background:'none', border:'none', color:FG3, fontSize:18, lineHeight:1, padding:'0 4px', cursor:'pointer' }}>×</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          ['В обработке', orders.filter(o=>o.status==='pending').length, ACC],
          ['Принятые',     orders.filter(o=>o.status==='accepted').length, NAT],
          ['Отгруженные',  counts.shipped, '#4a7da8'],
          ['В архиве',     counts.archive, ARCH],
        ].map(([l,n,c])=>(
          <div key={l} style={{ background:CRD, borderRadius:10, padding:'12px 16px', boxShadow:`0 2px 8px rgba(61,43,31,.07)`, borderLeft:`3px solid ${c}` }}>
            <div style={{ fontFamily:FD, fontSize:24, fontWeight:700, color:DRK }}>{n}</div>
            <div style={{ fontFamily:FB, fontSize:12, color:FG3 }}>{l}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign:'center', padding:'60px 0', fontFamily:FB, fontSize:15, color:FG3 }}>Заявок не найдено</div>
        : <div style={{ background:CRD, borderRadius:12, boxShadow:`0 2px 8px rgba(61,43,31,.07)`, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                <th style={thS}>№</th>
                <th style={thS}>Создан</th>
                <th style={thS}>Отгрузка</th>
                <th style={thS}>Контрагент</th>
                <th style={thS}>Адрес / способ</th>
                <th style={thS}>Позиции</th>
                <th style={thS}>Объём</th>
                <th style={thS}>Статус</th>
              </tr></thead>
              <tbody>{filtered.map(o => {
                const isNew = Date.now()-new Date(o.createdAt).getTime()<10*60*1000 && o.status==='pending';
                return (
                  <tr key={o.id} style={{ cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#fef9f8'}
                    onMouseLeave={e=>e.currentTarget.style.background=CRD}
                    onClick={()=>setSelected(o)}>
                    <td style={tdS}>{isNew && <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:BR, marginRight:5 }}/>}<span style={{ fontFamily:FL, fontWeight:700, fontSize:11, color:FG3 }}>{o.id}</span></td>
                    <td style={{...tdS, fontSize:11, color:FG2}}>{fmtDate(o.createdAt)}</td>
                    <td style={{...tdS, fontWeight:700}}>{o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '—'}</td>
                    <td style={{...tdS, fontWeight:700}}>{o.clientName}</td>
                    <td style={{...tdS, fontSize:12, color:FG2}}>
                      <div>{o.deliveryAddress}</div>
                      <div style={{ fontFamily:FL, fontSize:10, color:FG3, textTransform:'uppercase', letterSpacing:'.05em', marginTop:2 }}>
                        {o.deliveryType === 'pickup' ? 'самовывоз' : 'доставка'}
                      </div>
                    </td>
                    <td style={{...tdS, color:FG2, fontSize:12}}>{o.items.length} поз. · {o.items.map(i=>i.product).join(', ').slice(0,40)}{o.items.map(i=>i.product).join(', ').length>40?'…':''}</td>
                    <td style={tdS}><span style={{ fontFamily:FD, fontWeight:700 }}>{Math.round(orderVolumeKg(o))}</span> <span style={{ fontFamily:FB, fontSize:11, color:FG3 }}>кг</span></td>
                    <td style={tdS}><LpBadge status={o.status}/></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
      }

      {/* Detail / status modal */}
      {selected && !editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(61,43,31,.5)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={e=>e.target===e.currentTarget && setSelected(null)}>
          <div style={{ background:CRD, borderRadius:16, boxShadow:'0 16px 48px rgba(61,43,31,.2)', width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${BRD}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontFamily:FD, fontSize:18, fontWeight:700, color:DRK }}>Заявка № {selected.id}</div>
                <div style={{ fontFamily:FB, fontSize:12, color:FG3, marginTop:3 }}>создана {fmtDate(selected.createdAt)}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', fontSize:22, color:FG3 }}>×</button>
            </div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div><div style={{...lbl, marginBottom:3}}>Контрагент</div><div style={{ fontFamily:FB, fontSize:14, color:DRK }}>{selected.clientName}</div></div>
                <div><div style={{...lbl, marginBottom:3}}>Способ</div><div style={{ fontFamily:FB, fontSize:14, color:DRK }}>{selected.deliveryType==='pickup'?'Самовывоз':'Доставка'}</div></div>
                <div style={{ gridColumn:'1 / span 2' }}><div style={{...lbl, marginBottom:3}}>Адрес</div><div style={{ fontFamily:FB, fontSize:14, color:DRK }}>{selected.deliveryAddress}</div></div>
                {selected.shipmentDate && <div><div style={{...lbl, marginBottom:3}}>Дата отгрузки</div><div style={{ fontFamily:FB, fontSize:14, color:DRK, fontWeight:700 }}>{fmtLong(parseISO(selected.shipmentDate))}</div></div>}
                <div><div style={{...lbl, marginBottom:3}}>Объём (расч.)</div><div style={{ fontFamily:FB, fontSize:14, color:DRK, fontWeight:700 }}>{Math.round(orderVolumeKg(selected))} кг</div></div>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:14 }}>
                <thead><tr><th style={thS}>Продукт</th><th style={thS}>Тара</th><th style={thS}>Кол-во</th><th style={thS}>Заморозка</th></tr></thead>
                <tbody>{selected.items.map((it,i)=>(
                  <tr key={i}>
                    <td style={tdS}>{it.product}</td>
                    <td style={tdS}>{PKG[it.packaging]?.label || it.packaging}</td>
                    <td style={tdS}>{it.qty} {PKG[it.packaging]?.unit||it.unit||''}</td>
                    <td style={tdS}>{it.frozen ? <span style={{ color:'#4a7da8' }}>❄ {it.frozenComment||'да'}</span> : <span style={{ color:FG3 }}>—</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
              {selected.comment && <div style={{ background:ALT, borderRadius:8, padding:'10px 14px', fontFamily:FB, fontSize:13, color:FG2, marginBottom:14 }}>💬 {selected.comment}</div>}

              <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                <button onClick={()=>setEditing(selected)} style={{ background:DRK, color:'#fff', padding:'9px 18px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:12, border:'none' }}>✎ Редактировать</button>
                <button onClick={()=>onPrint([selected])} style={{ background:'none', border:`1.5px solid ${BRD}`, color:DRK, padding:'9px 18px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:12 }}>🖨 Печать бланка</button>
              </div>

              <div style={{ ...lbl, marginBottom:8 }}>Статус</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {Object.entries(STATUSES).map(([k,v]) => (
                  <button key={k} onClick={()=>changeStatus(selected.id, k)}
                    style={{
                      flex:'1 1 calc(50% - 4px)', padding:'10px',
                      borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:12,
                      border:`2px solid ${v.color}`,
                      background: selected.status===k ? v.color : 'transparent',
                      color: selected.status===k ? 'white' : v.color, cursor:'pointer',
                    }}>{v.label}{selected.status===k?' ✓':''}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && <LpOrderEditModal order={editing} onClose={()=>setEditing(null)} onSave={onEditSave}/>}
    </div>
  );
}

/* ── PRINT BLANKS PAGE ── */
function LpPrintBlanks({ orders, onClose }) {
  // Group by counterparty (one бланк per counterparty per address actually — one per order)
  const byPair = orders;

  // Build the print sheet (2 forms per page, A4 landscape)
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[today.getMonth()].toUpperCase()} ${today.getFullYear()}`;

  const buildBlank = (order, idx) => {
    const cp = getCounterparties().find(c=>c.id===order.clientId);
    const addrLabel = cp?.address || order.deliveryAddress || '';
    // Map products → qty per row of the бланк
    const rows = PRODUCTS.map(p => {
      const items = order.items.filter(it => it.product === p.name);
      let podl='', yashik='', shtuk='', kg='';
      items.forEach(it => {
        const q = it.qty;
        if (it.packaging === 'yasik') yashik = (yashik?yashik+'+':'') + q;
        else if (it.packaging === 'lotok') podl = (podl?podl+'+':'') + q;
        else if (it.packaging === 'paket') kg = (kg?kg+'+':'') + q;
      });
      return { name: p.blank, podl, yashik, shtuk, kg };
    });
    return { rows, addr: addrLabel, dateStr: order.shipmentDate ? `${String(parseISO(order.shipmentDate).getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[parseISO(order.shipmentDate).getMonth()].toUpperCase()} ${parseISO(order.shipmentDate).getFullYear()}` : todayStr, id: order.id, cpName: order.clientName };
  };

  const blanks = byPair.map(buildBlank);
  // Pair them up two per page
  const pages = [];
  for (let i=0; i<blanks.length; i+=2) pages.push([blanks[i], blanks[i+1]]);

  return (
    <div className="lp-print-root" style={{ position:'fixed', inset:0, background:'#666', zIndex:500, overflowY:'auto' }}>
      <style>{`
        @page { size: A4 landscape; margin: 6mm; }
        @media print {
          html, body { background: white !important; }
          .lp-print-root { background: white !important; position: static !important; }
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
        /* DRIVER STRIP — matches the reference photo */
        .lp-blank-driver-strip { border-bottom: 1.2px solid #000; }
        .lp-blank-driver-row {
          display: grid; grid-template-columns: 1fr;
          border-bottom: 1.2px solid #000;
        }
        .lp-blank-driver-row:last-child { border-bottom: none; }
        .lp-blank-driver-label {
          padding: 1.4mm 2mm; font-weight: 700; font-size: 11pt;
          font-family: 'PT Serif', serif;
        }
        .lp-blank-driver-write {
          display: grid; grid-template-columns: 1fr 1fr;
          height: 7mm;
        }
        .lp-blank-driver-write > div:first-child { border-right: 1.2px solid #000; }
        /* META row */
        .lp-blank-meta {
          padding: 1mm 2mm; font-size: 7.5pt; color:#333;
          border-bottom: 1.2px solid #000;
          display: flex; justify-content: space-between; gap: 4mm;
          font-family: 'PT Sans', Arial, sans-serif;
        }
        /* TABLE: name | подл | ящик | штук | кг | накл№ */
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
                {/* Driver strip — label + two empty handwriting cells, like the reference */}
                <div className="lp-blank-driver-strip">
                  <div className="lp-blank-driver-label">Водитель:</div>
                  <div className="lp-blank-driver-write">
                    <div></div>
                    <div></div>
                  </div>
                </div>

                <div className="lp-blank-meta">
                  <span>Контрагент: <b>{b.cpName}</b> · {b.addr}</span>
                  <span>№{b.id}</span>
                  <span>{b.dateStr}</span>
                </div>

                {/* Этикетка row */}
                <div className="lp-blank-etk">ЭТИКЕТКА:</div>

                {/* Header */}
                <div className="lp-blank-head">
                  <div>Наименование товара</div>
                  <div className="lp-blank-vert">П О Д Л</div>
                  <div className="lp-blank-vert">Я Щ И К</div>
                  <div className="lp-blank-vert">Ш Т У К</div>
                  <div className="lp-blank-vert">К Г</div>
                  <div className="lp-blank-vert">Накл. №</div>
                </div>

                {/* Product rows */}
                {b.rows.map((r, ri) => (
                  <div key={ri} className="lp-blank-row">
                    <div className="name">{r.name}</div>
                    <div className="qty">{r.podl}</div>
                    <div className="qty">{r.yashik}</div>
                    <div className="qty">{r.shtuk}</div>
                    <div className="qty">{r.kg}</div>
                    <div></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── ADMIN PANEL SHELL ── */
function LpAdminPanel({ onLogout }) {
  const [view, setView] = useStateAo('orders'); // orders | counterparties | banner
  const [printing, setPrinting] = useStateAo(null);

  const navBtn = a => ({ background: a ? '#5e4426' : 'transparent', color: a ? '#fff' : '#c9b299', border:'none', padding:'6px 14px', borderRadius:6, fontFamily:FL, fontWeight:700, fontSize:12, cursor:'pointer' });

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:BG }}>
      <div style={{ background:DRK, padding:'0 24px', flexShrink:0 }}>
        <div style={{ maxWidth:1300, margin:'0 auto', height:54, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <LpLogo light/>
            <div style={{ display:'flex', gap:4, marginLeft:14 }}>
              <button style={navBtn(view==='orders')}        onClick={()=>setView('orders')}>Заявки</button>
              <button style={navBtn(view==='counterparties')} onClick={()=>setView('counterparties')}>Контрагенты</button>
              <button style={navBtn(view==='banner')}        onClick={()=>setView('banner')}>Баннер</button>
            </div>
          </div>
          <button onClick={onLogout} style={{ background:'none', border:`1px solid #5e4426`, borderRadius:6, padding:'5px 14px', fontFamily:FL, fontWeight:700, fontSize:11, color:'#9a8070' }}>Выйти</button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
        {view==='orders'         && <LpAdminOrders onPrint={list => setPrinting(list)} />}
        {view==='counterparties' && <LpCounterparties/>}
        {view==='banner'         && <LpBannerEditor/>}
      </div>

      {printing && <LpPrintBlanks orders={printing} onClose={()=>setPrinting(null)}/>}
    </div>
  );
}

Object.assign(window, { LpAdminPanel });
