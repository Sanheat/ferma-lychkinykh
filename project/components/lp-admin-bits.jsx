/* ── ADMIN: ORDER EDIT MODAL ── */
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

function LpAdminLogin({ onLogin, onBack }) {
  const [pw, setPw] = useStateA('');
  const [err, setErr] = useStateA(false);
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:DRK, padding:24 }}>
      <div style={{ background:CRD, borderRadius:16, boxShadow:'0 16px 48px rgba(0,0,0,.25)', padding:'40px 36px', width:'100%', maxWidth:360 }}>
        <div style={{ fontFamily:FL, fontWeight:700, fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', color:FG3, background:ALT, display:'inline-block', padding:'4px 10px', borderRadius:9999, marginBottom:18 }}>ПАНЕЛЬ МЕНЕДЖЕРА</div>
        <div style={{ fontFamily:FD, fontSize:22, fontWeight:700, color:DRK, marginBottom:6 }}>Вход для сотрудников</div>
        <div style={{ fontFamily:FB, fontSize:13, color:FG2, marginBottom:26 }}>Ферма Лычкиных · Система заявок</div>
        <form onSubmit={e=>{ e.preventDefault(); pw==='лычкины2024' ? onLogin() : setErr(true); }}>
          <div style={{ marginBottom: err?4:16 }}>
            <label style={lbl}>Пароль</label>
            <input style={{...inp, borderColor: err ? BR : BRD}} type="password" value={pw} onChange={e=>{setPw(e.target.value); setErr(false);}} required/>
          </div>
          {err && <div style={{ fontFamily:FB, fontSize:12, color:BR, marginBottom:12 }}>Неверный пароль</div>}
          <button type="submit" style={{ width:'100%', background:DRK, color:'#fdfaf4', padding:'13px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:15, border:'none', marginTop:4 }}>Войти</button>
        </form>
        <div style={{ marginTop:16, textAlign:'center' }}>
          <span style={{ fontFamily:FB, fontSize:12, color:FG3, cursor:'pointer', textDecoration:'underline' }} onClick={onBack}>← К форме заказа</span>
        </div>
      </div>
    </div>
  );
}

function LpOrderEditModal({ order, onClose, onSave }) {
  const [draft, setDraft] = useStateA(() => ({
    ...order,
    items: order.items.map(it => ({ ...it, uid: genId() })),
  }));
  const [showCal, setShowCal] = useStateA(false);

  if (!order) return null;
  const cps = getCounterparties();
  const cp = cps.find(c => c.id === draft.clientId) || cps.find(c => c.name === draft.clientName);
  const cpAddress = cp?.address || draft.deliveryAddress || '';

  const setItem = (i, ni) => setDraft(d => ({ ...d, items: d.items.map((it,j)=> j===i?ni:it) }));
  const addItem = () => setDraft(d => ({ ...d, items: [...d.items, { uid:genId(), product:'', packaging:'yasik', qty:'1', frozen:false, frozenComment:'' }] }));
  const removeItem = i => setDraft(d => ({ ...d, items: d.items.filter((_,j)=>j!==i) }));

  const save = () => {
    if (draft.items.length === 0) { alert('Минимум одна позиция'); return; }
    if (draft.items.some(it=>!it.product||!it.qty)) { alert('Заполните все позиции'); return; }
    const patch = {
      deliveryAddress: cpAddress,
      deliveryType: draft.deliveryType,
      shipmentDate: draft.shipmentDate,
      items: draft.items.map(({ uid, ...it }) => it),
      comment: draft.comment,
      status: draft.status,
    };
    updateOrder(order.id, patch);
    onSave({ ...order, ...patch });
  };

  const sel = { ...inp, fontSize:13, padding:'8px 10px' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(61,43,31,.5)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={e=>e.target===e.currentTarget && onClose()}>
      <div style={{ background:CRD, borderRadius:16, boxShadow:'0 16px 48px rgba(61,43,31,.2)', width:'100%', maxWidth:760, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'18px 22px', borderBottom:`1px solid ${BRD}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'sticky', top:0, background:CRD, zIndex:1 }}>
          <div>
            <div style={{ fontFamily:FD, fontSize:18, fontWeight:700, color:DRK }}>Редактирование заявки № {order.id}</div>
            <div style={{ fontFamily:FB, fontSize:12, color:FG3, marginTop:3 }}>{order.clientName} · создана {fmtDate(order.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:FG3, lineHeight:1 }}>×</button>
        </div>

        <div style={{ padding:'18px 22px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Адрес доставки <span style={{ textTransform:'none', color:FG3, fontSize:10, letterSpacing:0, fontWeight:400 }}>· управляется в разделе «Контрагенты»</span></label>
              <div style={{ ...sel, background:ALT, color:DRK, fontWeight:700, display:'flex', alignItems:'center', minHeight:36 }}>
                {cpAddress || <span style={{ color:FG3, fontWeight:400 }}>— не указан —</span>}
              </div>
            </div>
            <div>
              <label style={lbl}>Способ получения</label>
              <select style={sel} value={draft.deliveryType||'delivery'} onChange={e=>setDraft(d=>({...d, deliveryType:e.target.value}))}>
                <option value="delivery">Доставка</option>
                <option value="pickup">Самовывоз</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div style={{ position:'relative' }}>
              <label style={lbl}>Дата отгрузки</label>
              <button type="button" onClick={()=>setShowCal(s=>!s)}
                style={{ ...sel, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:700 }}>{draft.shipmentDate ? fmtLong(parseISO(draft.shipmentDate)) : '— не указана —'}</span>
                <span style={{ color:FG3, fontSize:12 }}>📅</span>
              </button>
              {showCal && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:20 }}>
                  <LpCalendar value={draft.shipmentDate || isoDate(new Date())} onChange={d=>{ setDraft(p=>({...p, shipmentDate:d})); setShowCal(false); }}/>
                </div>
              )}
            </div>
            <div>
              <label style={lbl}>Статус</label>
              <select style={sel} value={draft.status} onChange={e=>setDraft(d=>({...d, status:e.target.value}))}>
                {Object.entries(STATUSES).map(([k,v])=> <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...lbl, marginBottom:8 }}>Позиции</div>
          {draft.items.map((it, i) => (
            <LpLineItem key={it.uid} item={it} idx={i} total={draft.items.length} onChange={setItem} onRemove={removeItem}/>
          ))}
          <button type="button" onClick={addItem}
            style={{ background:'none', border:`1.5px dashed ${BRD}`, borderRadius:8, padding:'10px', width:'100%', fontFamily:FL, fontWeight:700, fontSize:13, color:FG2, marginBottom:14 }}>
            + Добавить позицию
          </button>

          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Комментарий</label>
            <textarea style={{...inp, resize:'vertical', minHeight:60}} value={draft.comment||''} onChange={e=>setDraft(d=>({...d, comment:e.target.value}))}/>
          </div>

          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ background:'none', border:`1.5px solid ${BRD}`, color:DRK, padding:'10px 20px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:13 }}>Отмена</button>
            <button onClick={save} style={{ background:BR, color:'#fff', padding:'10px 24px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:13, border:'none' }}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN: COUNTERPARTIES TAB ──
   Restyled to match Figma "Контрагенты" screen (Untitled UI / gray + purple).
   Logic and state are unchanged — only visual layer.
   UI primitives (CpButton, CpInput, CpIconBtn, CpIco, CP_* tokens) live in lp-ui.jsx.
   ──────────────────────────────────────────────── */

function CpPagination({ page, total, onChange }) {
  // simple page-number renderer matching figma: 1 2 3 … 8 9 10
  const pages = [];
  if (total <= 7) { for (let i=1;i<=total;i++) pages.push(i); }
  else {
    pages.push(1,2,3,'…',total-2,total-1,total);
  }
  const btn = (active) => ({
    width:40, height:40, display:'inline-flex', alignItems:'center', justifyContent:'center',
    fontFamily:CP_F, fontWeight:500, fontSize:14, color: active ? CP_GRAY_700 : CP_GRAY_500,
    background: active ? CP_GRAY_50 : 'transparent', borderRadius:8, border:'none', cursor:'pointer',
  });
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'12px 20px', borderTop:`1px solid ${CP_GRAY_200}` }}>
      <CpButton kind="secondary" icon={CpIco.arrowLeft} onClick={()=>onChange(Math.max(1,page-1))} style={{ padding:'8px 14px' }}>Предыдущая</CpButton>
      <div style={{ display:'flex', gap:2 }}>
        {pages.map((p,i)=>(
          p==='…'
            ? <span key={'e'+i} style={{ ...btn(false), cursor:'default' }}>…</span>
            : <button key={p} style={btn(p===page)} onClick={()=>onChange(p)}>{p}</button>
        ))}
      </div>
      <CpButton kind="secondary" onClick={()=>onChange(Math.min(total,page+1))} style={{ padding:'8px 14px' }}>Следующая {CpIco.arrowRight}</CpButton>
    </div>
  );
}

function LpCounterparties() {
  const [list, setList] = useStateA(getCounterparties);
  const [editing, setEditing] = useStateA(null);
  const [reveal, setReveal] = useStateA({});
  const [query, setQuery] = useStateA('');
  const [page, setPage] = useStateA(1);
  const PAGE_SIZE = 8;

  const persist = next => { setList(next); saveCounterparties(next); };

  const startNew = () => setEditing({ id:'cp_'+genId(), name:'', login:'', password:'', address:'' });
  const startEdit = c => setEditing({ ...c });
  const save = () => {
    if (!editing.name.trim() || !editing.login.trim() || !editing.password.trim()) { alert('Заполните название, логин и пароль'); return; }
    const cleaned = { ...editing, address: (editing.address||'').trim() };
    const next = list.find(c=>c.id===cleaned.id) ? list.map(c=>c.id===cleaned.id?cleaned:c) : [...list, cleaned];
    persist(next); setEditing(null);
  };
  const remove = id => { if (!confirm('Удалить контрагента?')) return; persist(list.filter(c=>c.id!==id)); };
  const copyPwd = c => { navigator.clipboard.writeText(c.password); };

  const filtered = useMemoA(()=>{
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.login.toLowerCase().includes(q) ||
      (c.address||'').toLowerCase().includes(q)
    );
  }, [list, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);

  // table cells
  const thS = {
    fontFamily:CP_F, fontWeight:500, fontSize:12, lineHeight:'18px',
    color:CP_GRAY_500, padding:'12px 24px', textAlign:'left',
    background:CP_GRAY_50, borderBottom:`1px solid ${CP_GRAY_200}`, whiteSpace:'nowrap',
  };
  const tdS = {
    fontFamily:CP_F, fontSize:14, lineHeight:'20px', color:CP_GRAY_600,
    padding:'16px 24px', borderBottom:`1px solid ${CP_GRAY_200}`, verticalAlign:'middle',
  };

  return (
    <div style={{ background:'#fff', minHeight:'100%', fontFamily:CP_F }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 32px 48px' }}>

        {/* Page header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24, flexWrap:'wrap' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:0, flex:'1 1 320px' }}>
            <h1 style={{ fontFamily:CP_FD, fontWeight:700, fontSize:30, lineHeight:'38px', color:CP_GRAY_900, letterSpacing:'-0.02em' }}>
              Контрагенты
            </h1>
            <div style={{ fontFamily:CP_F, fontSize:16, lineHeight:'24px', color:CP_TEXT_MUTED }}>
              Логины, пароли и точки доставки клиентов · одна точка на контрагента
            </div>
          </div>
          <div style={{ flexShrink:0 }}>
            <CpButton kind="primary" icon={CpIco.userPlus} onClick={startNew}>
              Добавить контрагента
            </CpButton>
          </div>
        </div>

        {/* Search & filter row */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <div style={{ flex:'1 1 320px', maxWidth:380 }}>
            <CpInput
              icon={CpIco.search}
              placeholder="Поиск"
              value={query}
              onChange={e=>{ setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ flex:'1 1 auto' }}/>
          <CpButton kind="secondary" icon={CpIco.calendar} onClick={()=>{}} style={{ height:44, color:CP_GRAY_700 }}>
            Выберите период
          </CpButton>
          <CpButton kind="secondary" icon={CpIco.filter} onClick={()=>{}} style={{ height:44, color:CP_GRAY_700 }}>
            Фильтр
          </CpButton>
        </div>

        {/* Table card */}
        <div style={{
          background:'#fff', borderRadius:12,
          border:`1px solid ${CP_GRAY_200}`, boxShadow:CP_SHADOW_SM, overflow:'hidden',
        }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:840 }}>
              <thead>
                <tr>
                  <th style={thS}>Контрагент</th>
                  <th style={thS}>Логин</th>
                  <th style={thS}>Пароль</th>
                  <th style={thS}>Точка доставки</th>
                  <th style={{ ...thS, width:88, textAlign:'right' }}>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ ...tdS, textAlign:'center', color:CP_GRAY_500, padding:'48px 24px' }}>
                      {query ? 'Ничего не найдено' : 'Нет контрагентов — добавьте первого'}
                    </td>
                  </tr>
                )}
                {pageRows.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...tdS, color:CP_GRAY_900, fontWeight:500 }}>{c.name}</td>
                    <td style={tdS}>{c.login}</td>
                    <td style={{ ...tdS, whiteSpace:'nowrap' }}>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontFamily:CP_F, fontVariantNumeric:'tabular-nums', letterSpacing: reveal[c.id] ? 0 : '0.12em' }}>
                          {reveal[c.id] ? c.password : '••••••••'}
                        </span>
                        <CpIconBtn title="Копировать пароль" onClick={()=>copyPwd(c)} style={{ width:28, height:28 }}>
                          {CpIco.copy}
                        </CpIconBtn>
                        <CpIconBtn title={reveal[c.id]?'Скрыть пароль':'Показать пароль'}
                          onClick={()=>setReveal(r=>({...r, [c.id]:!r[c.id]}))} style={{ width:28, height:28 }}>
                          {reveal[c.id] ? CpIco.eyeOff : CpIco.eye}
                        </CpIconBtn>
                      </div>
                    </td>
                    <td style={tdS}>{c.address || <span style={{ color:CP_GRAY_400 }}>— не указана —</span>}</td>
                    <td style={{ ...tdS, textAlign:'right', whiteSpace:'nowrap' }}>
                      <div style={{ display:'inline-flex', gap:2, justifyContent:'flex-end' }}>
                        <CpIconBtn title="Редактировать" onClick={()=>startEdit(c)}>{CpIco.edit}</CpIconBtn>
                        <CpIconBtn title="Удалить" danger onClick={()=>remove(c.id)}>{CpIco.trash}</CpIconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CpPagination page={safePage} total={totalPages} onChange={setPage}/>
        </div>
      </div>

      {editing && <CpEditModal editing={editing} setEditing={setEditing} list={list} onSave={save}/>}
    </div>
  );
}

function CpEditModal({ editing, setEditing, list, onSave }) {
  const isNew = !list.find(c=>c.id===editing.id);
  const fieldLbl = { display:'block', fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:CP_GRAY_700, marginBottom:6 };

  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:300,
        background:'rgba(52,64,84,0.40)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        fontFamily:CP_F,
      }}
      onClick={e=>e.target===e.currentTarget && setEditing(null)}>
      <div style={{
        background:'#fff', borderRadius:12, boxShadow:CP_SHADOW_MOD,
        width:'100%', maxWidth:544, maxHeight:'90vh', overflowY:'auto',
        display:'flex', flexDirection:'column',
      }}>
        {/* Modal header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'24px 24px 0' }}>
          <div>
            <div style={{ fontFamily:CP_FD, fontWeight:700, fontSize:18, lineHeight:'28px', color:CP_GRAY_900 }}>
              {isNew ? 'Новый контрагент' : 'Редактирование'}
            </div>
            <div style={{ fontFamily:CP_F, fontSize:14, lineHeight:'20px', color:CP_TEXT_MUTED, marginTop:4 }}>
              Логин, пароль и точка доставки клиента
            </div>
          </div>
          <CpIconBtn title="Закрыть" onClick={()=>setEditing(null)}>{CpIco.close}</CpIconBtn>
        </div>

        {/* Form */}
        <div style={{ padding:'20px 24px 0', display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={fieldLbl}>Название</label>
            <CpInput value={editing.name} onChange={e=>setEditing(p=>({...p, name:e.target.value}))} placeholder="ИП Иванов И.И."/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={fieldLbl}>Логин</label>
              <CpInput value={editing.login} onChange={e=>setEditing(p=>({...p, login:e.target.value.replace(/\s/g,'')}))} placeholder="ivanov"/>
            </div>
            <div>
              <label style={fieldLbl}>Пароль</label>
              <CpInput value={editing.password} onChange={e=>setEditing(p=>({...p, password:e.target.value}))} placeholder="••••••••"/>
            </div>
          </div>
          <div>
            <label style={fieldLbl}>
              Точка доставки <span style={{ color:CP_GRAY_500, fontWeight:400 }}>· один адрес на контрагента</span>
            </label>
            <CpInput value={editing.address||''} onChange={e=>setEditing(p=>({...p, address:e.target.value}))} placeholder="г. Москва, ул., д."/>
          </div>
        </div>

        {/* Modal actions */}
        <div style={{ display:'flex', gap:12, padding:'32px 24px 24px', marginTop:'auto' }}>
          <CpButton kind="secondary" onClick={()=>setEditing(null)} style={{ flex:1, height:44 }}>
            Отмена
          </CpButton>
          <CpButton kind="primary" onClick={onSave} style={{ flex:1, height:44 }}>
            Сохранить
          </CpButton>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN: BANNER EDITOR ── */
function LpBannerEditor() {
  const [b, setB] = useStateA(getBanner);
  const fileRef = React.useRef();
  const set = (k, v) => { const next = { ...b, [k]: v }; setB(next); saveBanner(next); };
  const onFile = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => set('image', ev.target.result);
    reader.readAsDataURL(f);
  };
  const swatches = ['#c94030','#e8a838','#7a9e7e','#3d2b1f','#4a7da8'];
  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'20px 24px' }}>
      <div style={{ fontFamily:FD, fontSize:20, fontWeight:700, color:DRK, marginBottom:4 }}>Баннер на главной клиента</div>
      <div style={{ fontFamily:FB, fontSize:13, color:FG2, marginBottom:16 }}>Меняйте картинку и текст — клиенты увидят новый баннер сразу при следующем входе</div>

      <div style={{ marginBottom:16 }}><LpClientBanner banner={b}/></div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, background:CRD, borderRadius:12, padding:18, boxShadow:`0 2px 8px rgba(61,43,31,.07)` }}>
        <div>
          <label style={lbl}>Заголовок</label>
          <input style={inp} value={b.title} onChange={e=>set('title', e.target.value)}/>
        </div>
        <div>
          <label style={lbl}>Подпись над заголовком</label>
          <input style={inp} value={b.badge} onChange={e=>set('badge', e.target.value)}/>
        </div>
        <div style={{ gridColumn:'1 / span 2' }}>
          <label style={lbl}>Описание</label>
          <input style={inp} value={b.subtitle} onChange={e=>set('subtitle', e.target.value)}/>
        </div>
        <div>
          <label style={lbl}>Цвет фона (если без картинки)</label>
          <div style={{ display:'flex', gap:6, marginTop:4 }}>
            {swatches.map(s => (
              <button key={s} onClick={()=>set('bg', s)}
                style={{ width:30, height:30, borderRadius:'50%', border: b.bg===s ? `3px solid ${DRK}` : `1px solid ${BRD}`, background:s, cursor:'pointer' }}/>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Изображение</label>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button type="button" onClick={()=>fileRef.current.click()} style={{ background:DRK, color:'#fff', padding:'9px 14px', borderRadius:8, fontFamily:FL, fontWeight:700, fontSize:12, border:'none' }}>Загрузить файл</button>
            {b.image && <button onClick={()=>set('image','')} style={{ background:'none', border:'none', color:BR, fontFamily:FL, fontWeight:700, fontSize:12 }}>Убрать</button>}
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display:'none' }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LpAdminLogin, LpOrderEditModal, LpCounterparties, LpBannerEditor });
