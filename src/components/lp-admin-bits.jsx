import React from 'react';
import {
  CP_F, CP_FD, CP_CREAM, CP_BEIGE_500, CP_GRAY_900,
  CP_TEXT_PRIMARY, CP_TEXT_TERTIARY, CP_TEXT_MUTED,
  CP_BORDER_INPUT, CP_SHADOW_XS, CP_SHADOW_MOD, CP_ERROR,
  CpIco, CpIconBtn, CpInput,
} from './lp-ui';
import {
  DRK, CRD, FG3, ALT, FD, FB, BRD, BR, lbl, inp,
  genId, PKG, PRODUCTS, STATUSES,
  getCounterparties, createCounterparty, updateCounterparty, deleteCounterparty,
  resetCounterpartyPassword,
  verifyAdmin, parseISO, isoDate, fmtLong, updateOrder,
} from './lp-data';
import { LpCalendar } from './lp-form-bits';

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

function LpAdminLogin({ onLogin, onBack }) {
  const [pw, setPw] = useStateA('');
  const [err, setErr] = useStateA(false);
  const [showPw, setShowPw] = useStateA(false);
  const [busy, setBusy] = useStateA(false);

  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const ok = await verifyAdmin(pw);
      if (ok) onLogin(pw);
      else setErr(true);
    } catch (e2) {
      console.error('verifyAdmin:', e2);
      setErr(true);
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    width:'100%', boxSizing:'border-box',
    padding:'10px 14px', height:44,
    fontFamily:CP_F, fontSize:16, lineHeight:'20px',
    color:CP_TEXT_PRIMARY,
    background:'#fff',
    border:`1px solid ${err ? CP_ERROR : CP_BORDER_INPUT}`, borderRadius:8,
    outline:'none', boxShadow:CP_SHADOW_XS,
  };

  return (
    <div className="cp-mlogin-root" style={{
      minHeight:'100vh', background:CP_CREAM, fontFamily:CP_F,
      display:'flex', alignItems:'stretch',
    }}>
      <style>{`
        .cp-mlogin-root .cp-mlogin-input::placeholder { color:#9AA0A6; }
        .cp-mlogin-root .cp-mlogin-input:focus {
          border-color:${CP_BEIGE_500};
          box-shadow:${CP_SHADOW_XS}, 0 0 0 4px rgba(196,145,76,0.18);
        }
        .cp-mlogin-root .cp-mlogin-submit:hover { background:#A37640; }
        .cp-mlogin-root .cp-mlogin-link:hover { text-decoration:underline; }
        @media (max-width: 1024px) {
          .cp-mlogin-root .cp-mlogin-photo { display:none !important; }
          .cp-mlogin-root .cp-mlogin-pane  { flex:1 !important; }
        }
        @media (max-width: 480px) {
          .cp-mlogin-root .cp-mlogin-pane  { padding:24px 16px !important; }
          .cp-mlogin-root .cp-mlogin-title { font-size:24px !important; line-height:32px !important; }
        }
      `}</style>

      {/* LEFT — form pane */}
      <div className="cp-mlogin-pane" style={{
        flex:1, minWidth:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px 32px',
      }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <h1 className="cp-mlogin-title" style={{
            fontFamily:CP_FD, fontWeight:700, fontSize:30, lineHeight:'38px',
            color:CP_GRAY_900, letterSpacing:'-0.01em', margin:'0 0 32px',
          }}>Вход в личный кабинет менеджера</h1>

          <form onSubmit={submit} noValidate>
            <div style={{ marginBottom:24 }}>
              <label htmlFor="cp-mlogin-pw" style={{
                display:'block', marginBottom:6,
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
                color:CP_TEXT_PRIMARY,
              }}>Пароль</label>
              <div style={{ position:'relative' }}>
                <input
                  id="cp-mlogin-pw"
                  className="cp-mlogin-input"
                  type="text"
                  value={pw}
                  onChange={e=>{ setPw(e.target.value); setErr(false); }}
                  placeholder="••••••••"
                  autoFocus
                  required
                  autoComplete="current-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  style={{ ...inputStyle, paddingRight:44, ...(showPw ? {} : { WebkitTextSecurity:'disc', textSecurity:'disc' }) }}
                />
                <button
                  type="button"
                  aria-label={showPw ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position:'absolute', right:0, top:0, bottom:0,
                    width:44, display:'flex', alignItems:'center', justifyContent:'center',
                    background:'none', border:'none', cursor:'pointer',
                    color: showPw ? CP_BEIGE_500 : CP_TEXT_TERTIARY,
                    padding:0, transition:'color .15s',
                  }}>
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {err && (
              <div style={{
                fontFamily:CP_F, fontSize:13, lineHeight:'18px',
                color:CP_ERROR, marginBottom:12,
              }}>Неверный пароль</div>
            )}

            <button
              type="submit"
              className="cp-mlogin-submit"
              disabled={busy}
              style={{
                width:'100%', height:44, padding:'10px 16px',
                background: busy ? '#d4a870' : '#B68B4A', border:'1px solid #B68B4A', borderRadius:8,
                fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                color:'#fff', cursor: busy ? 'not-allowed' : 'pointer',
                boxShadow:CP_SHADOW_XS,
                transition:'background .15s ease',
              }}>
              {busy ? 'Проверка…' : 'Войти'}
            </button>
          </form>

          <div style={{
            marginTop:20, textAlign:'center',
            fontFamily:CP_F, fontSize:14, lineHeight:'20px',
            color:CP_TEXT_MUTED,
          }}>
            <span
              className="cp-mlogin-link"
              onClick={onBack}
              style={{
                color:'#B68B4A', fontWeight:600,
                cursor:'pointer', textDecoration:'none',
              }}>
              ← К форме заказа
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — photo */}
      <div className="cp-mlogin-photo" style={{
        flex:1, minWidth:0,
        display:'flex', alignSelf:'stretch',
      }}>
        <img
          src="/assets/login-chick.png"
          alt=""
          style={{
            width:'100%', height:'100%',
            borderRadius:'80px 0 0 80px',
            objectFit:'cover',
            display:'block',
          }}
        />
      </div>
    </div>
  );
}

function LpAdminLineItem({ item, idx, total, onChange, onRemove, isMobile }) {
  const prod = PRODUCTS.find(p => p.name === item.product);
  const availPkg = prod ? prod.pkg : ['yasik', 'paket', 'lotok'];

  const setProduct = name => {
    const p = PRODUCTS.find(x => x.name === name);
    const newPkg = p && !p.pkg.includes(item.packaging) ? p.pkg[0] : item.packaging;
    const newQty = PKG[newPkg].type === 'counter' ? String(PKG[newPkg].step || 1) : '';
    onChange(idx, { ...item, product: name, packaging: newPkg, qty: newQty });
  };
  const setPkg = pkgId => {
    const newQty = PKG[pkgId].type === 'counter' ? String(PKG[pkgId].step || 1) : '';
    onChange(idx, { ...item, packaging: pkgId, qty: newQty });
  };

  const pkg  = PKG[item.packaging];
  const step = pkg.step || 1;
  let count  = parseInt(item.qty || String(step), 10) || step;
  if (step > 1 && count % step !== 0) count = Math.max(step, Math.round(count / step) * step);
  const decQty = () => onChange(idx, { ...item, qty: String(Math.max(step, count - step)) });
  const incQty = () => onChange(idx, { ...item, qty: String(count + step) });

  const BDR  = '#C6C3C3';
  const BDR2 = '#ADAAAA';
  const TPR  = '#191414';
  const TSC  = '#514C4B';
  const TMT  = '#676262';
  const SHX  = '0px 1px 2px rgba(16,24,40,0.05)';
  const F    = CP_F;

  const dropSt = {
    width: '100%', boxSizing: 'border-box',
    border: `1px solid ${BDR}`, borderRadius: 8,
    padding: '8px 14px', paddingRight: 36, background: '#fff',
    boxShadow: SHX, outline: 'none', cursor: 'pointer',
    fontFamily: F, fontSize: 16, fontWeight: 500,
    lineHeight: '24px', color: TPR,
    appearance: 'none', WebkitAppearance: 'none',
  };

  const IcoChev = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
  const IcoTrash = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
  const IcoHelp = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>
    </svg>
  );

  const toggleFrozen = () => onChange(idx, { ...item, frozen: !item.frozen, frozenComment: !item.frozen ? item.frozenComment : '' });

  // Поля позиции — переиспользуются и в мобильной (стопкой), и в десктопной (одной строкой) раскладке
  const productField = (
    <div style={{ position: 'relative', ...(isMobile ? {} : { flex: 1, minWidth: 0 }) }}>
      <select value={item.product} onChange={e => setProduct(e.target.value)} style={dropSt}>
        <option value="">— Выберите позицию —</option>
        {PRODUCTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: TMT, pointerEvents: 'none', display: 'flex' }}>{IcoChev}</span>
    </div>
  );

  const pkgField = (
    <div style={{ position: 'relative', ...(isMobile ? {} : { flex: 1, minWidth: 0 }) }}>
      <select value={item.packaging} onChange={e => setPkg(e.target.value)} style={dropSt}>
        {availPkg.map(pid => <option key={pid} value={pid}>{PKG[pid].label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: TMT, pointerEvents: 'none', display: 'flex' }}>{IcoChev}</span>
    </div>
  );

  // Поле количества во всех вариантах тары — одного фиксированного размера (QTY_W×QTY_H),
  // чтобы кг-поле не отличалось от счётчика и не съезжало на разных брейкпоинтах.
  const QTY_W = 124, QTY_H = 42;
  const qtyField = pkg.type === 'kg' ? (
    <input type="number" min="0.1" step="0.1" placeholder="кг"
      value={item.qty} onChange={e => onChange(idx, { ...item, qty: e.target.value })}
      style={{ width: QTY_W, height: QTY_H, boxSizing: 'border-box', flexShrink: 0, border: `1px solid ${BDR2}`, borderRadius: 8, padding: '0 14px', textAlign: 'center', boxShadow: SHX, outline: 'none', fontFamily: F, fontSize: 14, fontWeight: 600, color: TSC, background: '#fff' }}
    />
  ) : (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', width: QTY_W, height: QTY_H, boxSizing: 'border-box', flexShrink: 0, border: `1px solid ${BDR2}`, borderRadius: 8, overflow: 'hidden' }}>
      <button type="button" onClick={decQty} style={{ width: 40, flexShrink: 0, background: '#fff', border: 'none', borderRight: `1px solid ${BDR2}`, cursor: 'pointer', fontFamily: F, fontWeight: 600, fontSize: 16, color: TSC }}>−</button>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${BDR2}`, background: '#fff', fontFamily: F, fontWeight: 600, fontSize: 14, color: TSC }}>{count}</div>
      <button type="button" onClick={incQty} style={{ width: 40, flexShrink: 0, background: '#fff', border: 'none', cursor: 'pointer', fontFamily: F, fontWeight: 600, fontSize: 16, color: TSC }}>+</button>
    </div>
  );

  const trashBtn = total > 1 ? (
    <button type="button" onClick={() => onRemove(idx)} style={{ border: `1px solid ${BDR}`, borderRadius: 8, background: '#fff', padding: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: TMT, flexShrink: 0 }}>
      {IcoTrash}
    </button>
  ) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {isMobile ? (
        <>
          {productField}
          {pkgField}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            {qtyField}
            {trashBtn}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {productField}
          {pkgField}
          {qtyField}
          {trashBtn}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div onClick={toggleFrozen} style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 6, border: `1px solid ${item.frozen ? '#B67E40' : '#D0D5DD'}`, background: item.frozen ? '#B67E40' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.frozen && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        </div>
        <span onClick={toggleFrozen} style={{ fontFamily: F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: TSC, cursor: 'pointer' }}>Замороженное</span>
        <span style={{ color: TMT, display: 'flex', cursor: 'help' }} title="По умолчанию — охлаждённое">{IcoHelp}</span>
      </div>

      {item.frozen && (
        <input type="text" placeholder="Комментарий к заморозке (опционально)" value={item.frozenComment || ''}
          onChange={e => onChange(idx, { ...item, frozenComment: e.target.value })}
          style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BDR}`, borderRadius: 8, padding: '8px 14px', background: '#fff', boxShadow: SHX, outline: 'none', fontFamily: F, fontSize: 14, color: TPR }}
        />
      )}
    </div>
  );
}

function LpOrderEditModal({ order, adminPwd, onClose, onSave }) {
  const [draft, setDraft] = useStateA(() => ({
    ...order,
    items: order.items.map(it => ({ ...it, uid: genId() })),
  }));
  const [showCal, setShowCal] = useStateA(false);
  const [isMobile, setIsMobile] = useStateA(() => window.innerWidth < 768);
  const [cps, setCps] = useStateA([]);
  const [busy, setBusy] = useStateA(false);

  useEffectA(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const upd = () => setIsMobile(mq.matches);
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  useEffectA(() => { getCounterparties(adminPwd).then(setCps).catch(console.error); }, [adminPwd]);

  if (!order) return null;

  const cp = cps.find(c => c.id === draft.clientId) || cps.find(c => c.name === draft.clientName);
  const cpAddress = cp?.address || draft.deliveryAddress || '';

  const setItem   = (i, ni) => setDraft(d => ({ ...d, items: d.items.map((it, j) => j === i ? ni : it) }));
  const addItem   = () => setDraft(d => ({ ...d, items: [...d.items, { uid: genId(), product: '', packaging: 'yasik', qty: '1', frozen: false, frozenComment: '' }] }));
  const removeItem = i => setDraft(d => ({ ...d, items: d.items.filter((_, j) => j !== i) }));

  const save = async () => {
    if (busy) return;
    if (draft.items.length === 0) { alert('Минимум одна позиция'); return; }
    if (draft.items.some(it => !it.product || !it.qty)) { alert('Заполните все позиции'); return; }
    const patch = {
      deliveryAddress: cpAddress,
      deliveryType:    draft.deliveryType,
      shipmentDate:    draft.shipmentDate,
      items:           draft.items.map(({ uid, ...it }) => it),
      comment:         draft.comment,
      status:          draft.status,
    };
    setBusy(true);
    try {
      await updateOrder(order.id, patch);
      onSave({ ...order, ...patch });
    } catch (e) {
      console.error('updateOrder:', e);
      alert('Не удалось сохранить изменения');
    } finally {
      setBusy(false);
    }
  };

  const BDR  = '#C6C3C3';
  const BDV  = '#EAECF0';
  const TPR  = '#191414';
  const TSC  = '#514C4B';
  const TMT  = '#676262';
  const TT2  = '#7E7979';
  const BGCR = '#F9F8F8';
  const BRD2 = '#B67E40';
  const SHX  = '0px 1px 2px rgba(16,24,40,0.05)';

  const fldLbl = {
    display: 'block', fontFamily: CP_F, fontWeight: 500,
    fontSize: 14, lineHeight: '20px', color: TSC, marginBottom: 6,
  };
  const inpSt = {
    width: '100%', boxSizing: 'border-box',
    border: `1px solid ${BDR}`, borderRadius: 8,
    padding: '8px 14px', background: '#fff',
    boxShadow: SHX, outline: 'none',
    fontFamily: CP_F, fontSize: 16, fontWeight: 500,
    lineHeight: '24px', color: TPR,
    appearance: 'none', WebkitAppearance: 'none',
  };

  const IcoCalendar = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
  const IcoChevron = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
  const IcoX = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );

  const subtitle = (() => {
    const d = new Date(order.createdAt);
    const dt = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const tm = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${order.clientName} · создана ${dt} ${tm}`;
  })();

  const closeBtn = (
    <button type="button" onClick={onClose} style={{
      position: 'absolute', top: 12, right: 12,
      width: 44, height: 44, borderRadius: 8,
      border: 'none', background: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', color: TMT,
    }}>{IcoX}</button>
  );

  const formBody = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div>
          <label style={fldLbl}>Адрес доставки</label>
          <div style={{ ...inpSt, display: 'flex', alignItems: 'center', background: BGCR, minHeight: 44 }}>
            {cpAddress || <span style={{ color: TT2 }}>— не указан —</span>}
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: TMT, marginTop: 6 }}>
            Управляется в разделе «Контрагенты»
          </div>
        </div>
        <div>
          <label style={fldLbl}>Способ получения</label>
          <div style={{ position: 'relative' }}>
            <select
              value={draft.deliveryType || 'delivery'}
              onChange={e => setDraft(d => ({ ...d, deliveryType: e.target.value }))}
              style={{ ...inpSt, paddingRight: 36, cursor: 'pointer' }}>
              <option value="delivery">Доставка</option>
              <option value="pickup">Самовывоз</option>
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: TMT, pointerEvents: 'none', display: 'flex' }}>
              {IcoChevron}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <label style={fldLbl}>Дата отгрузки</label>
          <button type="button" onClick={() => setShowCal(s => !s)} style={{
            ...inpSt, textAlign: 'left', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', minHeight: 44,
          }}>
            <span>{draft.shipmentDate ? fmtLong(parseISO(draft.shipmentDate)) : '— не указана —'}</span>
            <span style={{ color: TMT, display: 'flex', flexShrink: 0 }}>{IcoCalendar}</span>
          </button>
          {showCal && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20 }}>
              <LpCalendar
                value={draft.shipmentDate || isoDate(new Date())}
                onChange={d => { setDraft(p => ({ ...p, shipmentDate: d })); setShowCal(false); }}
              />
            </div>
          )}
        </div>
        <div>
          <label style={fldLbl}>Статус</label>
          <div style={{ position: 'relative' }}>
            <select
              value={draft.status}
              onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}
              style={{ ...inpSt, paddingRight: 36, cursor: 'pointer' }}>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: TMT, pointerEvents: 'none', display: 'flex' }}>
              {IcoChevron}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: TPR, marginBottom: 12 }}>
          Позиции
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {draft.items.map((it, i) => (
            <LpAdminLineItem key={it.uid} item={it} idx={i} total={draft.items.length} onChange={setItem} onRemove={removeItem} isMobile={isMobile} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <button type="button" onClick={addItem} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 8,
            background: '#F5F0DF', border: '1px solid #FBF9F1',
            fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px',
            color: '#986338', cursor: 'pointer', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Добавить позицию
          </button>
          <div style={{ flex: 1, height: 1, background: '#DFDDDD' }} />
        </div>
      </div>

      <div>
        <label style={fldLbl}>Комментарий</label>
        <textarea
          value={draft.comment || ''}
          onChange={e => setDraft(d => ({ ...d, comment: e.target.value }))}
          style={{ ...inpSt, resize: 'vertical', minHeight: 72, display: 'block' }}
        />
      </div>
    </div>
  );

  const actions = (full) => (
    <>
      <button type="button" onClick={onClose} style={{
        flex: full ? undefined : 1, width: full ? '100%' : undefined,
        padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
        background: '#fff', border: `1px solid ${BDR}`, boxShadow: SHX,
        fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: TSC,
      }}>Отмена</button>
      <button type="button" onClick={save} disabled={busy} style={{
        flex: full ? undefined : 1, width: full ? '100%' : undefined,
        padding: '12px 18px', borderRadius: 8, cursor: busy ? 'default' : 'pointer',
        background: BRD2, border: `1px solid ${BRD2}`, opacity: busy ? 0.7 : 1,
        fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#fff',
      }}>{busy ? 'Сохранение…' : 'Сохранить'}</button>
    </>
  );

  if (isMobile) {
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
              <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: TPR, paddingRight: 52 }}>
                Редактирование заявки
              </div>
              <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: TMT, marginTop: 2 }}>
                {subtitle}
              </div>
              {closeBtn}
              <div style={{ height: 20 }} />
            </div>
            <div style={{ height: 1, background: BDV }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '20px 16px' }}>
            {formBody}
          </div>
          <div style={{ flexShrink: 0, background: '#fff', borderTop: `1px solid ${BDV}`, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 12 }}>
              {actions(true)}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: TPR }}>
            Редактирование заявки
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: TMT, marginTop: 2 }}>
            {subtitle}
          </div>
          {closeBtn}
          <div style={{ height: 20 }} />
          <div style={{ height: 1, background: BDV }} />
        </div>
        <div style={{ padding: '20px 24px' }}>
          {formBody}
        </div>
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
          {actions(false)}
        </div>
      </div>
    </div>
  );
}

function CpPagination({ page, total, onChange }) {
  const pages = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else { pages.push(1, 2, 3, '…', total - 2, total - 1, total); }

  const isFirst = page === 1;
  const isLast  = page === total;

  const icoLeft = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
  const icoRight = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );

  const navBtn = (disabled, onClick, children) => (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'none', border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px',
        color: disabled ? '#ADAAAA' : '#676262',
        padding: 0, overflow: 'hidden',
      }}>
      {children}
    </button>
  );

  return (
    <div style={{ padding: '0 24px' }}>
      <div className="cp-cp-pagi-desktop" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, paddingTop: 20,
      }}>
        {navBtn(isFirst, () => onChange(Math.max(1, page - 1)), <>{icoLeft} Предыдущая</>)}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {pages.map((p, i) =>
            p === '…'
              ? (
                <span key={'e' + i} style={{
                  width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#676262',
                }}>...</span>
              )
              : (
                <button key={p} onClick={() => onChange(p)} style={{
                  width: 40, height: 40, borderRadius: 20, flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px',
                  color:      p === page ? '#3C3636' : '#676262',
                  background: p === page ? '#F9F8F8' : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}>{p}</button>
              )
          )}
        </div>

        {navBtn(isLast, () => onChange(Math.min(total, page + 1)), <>Следующая {icoRight}</>)}
      </div>

      <div className="cp-cp-pagi-mobile" style={{
        display: 'none', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, paddingTop: 20,
      }}>
        <button type="button"
          onClick={() => !isFirst && onChange(Math.max(1, page - 1))}
          disabled={isFirst}
          aria-label="Предыдущая страница"
          style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: 8,
            background: '#fff', border: '1px solid #C6C3C3',
            boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: isFirst ? 'default' : 'pointer',
            color: isFirst ? '#ADAAAA' : '#191414',
          }}>
          {icoLeft}
        </button>
        <span style={{
          fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#514C4B',
        }}>
          Страница {page} из {total}
        </span>
        <button type="button"
          onClick={() => !isLast && onChange(Math.min(total, page + 1))}
          disabled={isLast}
          aria-label="Следующая страница"
          style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: 8,
            background: '#fff', border: '1px solid #C6C3C3',
            boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: isLast ? 'default' : 'pointer',
            color: isLast ? '#ADAAAA' : '#191414',
          }}>
          {icoRight}
        </button>
      </div>
    </div>
  );
}

function LpCounterparties({ adminPwd }) {
  const [list, setList]       = useStateA([]);
  const [loading, setLoading] = useStateA(true);
  const [editing, setEditing] = useStateA(null);
  const [query, setQuery]     = useStateA('');
  const [page, setPage]       = useStateA(1);
  const [busy, setBusy]       = useStateA(false);
  const PAGE_SIZE = 8;

  const reload = () => getCounterparties(adminPwd).then(setList).catch(console.error).finally(() => setLoading(false));
  useEffectA(() => { reload(); }, []);

  const startNew  = () => setEditing({ id: null, name: '', login: '', password: '', address: '' });
  const startEdit = c => setEditing({ ...c, password: '' });

  const save = async () => {
    if (busy) return;
    const isNew = editing.id == null || !list.find(c => c.id === editing.id);
    if (!editing.name.trim() || !editing.login.trim() || (isNew && !editing.password.trim())) {
      alert(isNew ? 'Заполните название, логин и пароль' : 'Заполните название и логин'); return;
    }
    const cleaned = {
      ...editing,
      name: editing.name.trim(),
      login: editing.login.trim(),
      address: (editing.address || '').trim(),
      password: (editing.password || '').trim(),
    };
    setBusy(true);
    try {
      if (isNew) {
        await createCounterparty(adminPwd, cleaned);
      } else {
        await updateCounterparty(adminPwd, cleaned);
      }
      await reload();
      setEditing(null);
    } catch (e) {
      console.error('save counterparty:', e);
      alert('Не удалось сохранить контрагента');
    } finally {
      setBusy(false);
    }
  };

  const remove = async id => {
    if (!confirm('Удалить контрагента?')) return;
    try {
      await deleteCounterparty(adminPwd, id);
      await reload();
    } catch (e) {
      console.error('delete counterparty:', e);
      alert('Не удалось удалить контрагента');
    }
  };

  const resetPwd = async c => {
    const np = prompt(`Новый пароль для «${c.name}»:`);
    if (np == null) return;
    if (!np.trim()) { alert('Пароль не может быть пустым'); return; }
    try {
      await resetCounterpartyPassword(adminPwd, c.id, np.trim());
      alert('Пароль обновлён');
    } catch (e) {
      console.error('reset password:', e);
      alert('Не удалось обновить пароль');
    }
  };

  const filtered = useMemoA(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.login.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    );
  }, [list, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const thS = {
    fontFamily: CP_F, fontWeight: 500, fontSize: 12, lineHeight: '18px',
    color: '#676262',
    padding: '12px 24px',
    textAlign: 'left',
    background: '#F9F8F8',
    borderBottom: '1px solid #fff',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  };
  const tdS = {
    fontFamily: CP_F, fontSize: 14, lineHeight: '20px', fontWeight: 500,
    color: '#191414',
    padding: '16px 24px',
    borderBottom: '1px solid #DFDDDD',
    verticalAlign: 'middle',
    height: 72,
    boxSizing: 'border-box',
  };
  const tdAddr = { ...tdS, color: '#676262', fontWeight: 400 };

  return (
    <div
      className="cp-cp-page"
      style={{
        display: 'flex', flexDirection: 'column', flex: 1,
        minHeight: '100%', background: '#fff', fontFamily: CP_F,
        padding: '32px 0 48px', gap: 32,
      }}>

      <div className="mo-pad">
        <div className="cp-cp-header" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="cp-cp-title-h" style={{
              fontFamily: CP_F, fontWeight: 600, fontSize: 30, lineHeight: '38px',
              color: '#101828', margin: 0,
            }}>
              Контрагенты
            </div>
            <div style={{ fontFamily: CP_F, fontSize: 16, lineHeight: '24px', color: '#676262' }}>
              Логины, пароли и точки доставки клиентов · одна точка на контрагента
            </div>
          </div>

          <button
            className="cp-cp-add-btn-full"
            onClick={startNew}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexShrink: 0,
              background: '#B67E40', border: '1px solid #B67E40',
              borderRadius: 8, padding: '10px 16px',
              fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: '#fff',
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#986338'; e.currentTarget.style.borderColor = '#986338'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#B67E40'; e.currentTarget.style.borderColor = '#B67E40'; }}>
            {CpIco.userPlus}
            Добавить контрагента
          </button>
        </div>
      </div>

      <div className="mo-pad">
        <div className="cp-cp-search-filters" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 20,
        }}>
          <div className="cp-cp-search-wrap" style={{ width: 343, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #C6C3C3', borderRadius: 8,
              padding: '10px 14px',
              boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
            }}>
              <span style={{ color: '#7E7979', display: 'flex', flexShrink: 0 }}>{CpIco.search}</span>
              <input
                type="text"
                placeholder="Поиск"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: CP_F, fontSize: 16, lineHeight: '24px', color: '#191414',
                  minWidth: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mo-pad">
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #EAECF0',
          boxShadow: '0 1px 3px rgba(16,24,40,0.10), 0 1px 2px rgba(16,24,40,0.06)',
          overflow: 'hidden',
        }}>
          <div className="cp-cp-tscroll" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={thS}>Контрагент</th>
                  <th style={thS}>Логин</th>
                  <th style={thS}>Пароль</th>
                  <th style={{ ...thS, color: '#676262' }}>Точка доставки</th>
                  <th style={{ ...thS, width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{
                      ...tdS, textAlign: 'center', color: '#7E7979',
                      fontWeight: 400, padding: '48px 24px',
                    }}>
                      {loading ? 'Загрузка…' : query ? 'Ничего не найдено' : 'Нет контрагентов — добавьте первого'}
                    </td>
                  </tr>
                )}
                {pageRows.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...tdS, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </div>
                    </td>
                    <td style={{ ...tdS, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.login}
                      </div>
                    </td>
                    <td style={{ ...tdS, whiteSpace: 'nowrap', maxWidth: 260 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          flexShrink: 0, display: 'inline-block',
                          letterSpacing: '0.12em', color: '#ADAAAA',
                        }}>
                          ••••••••
                        </span>
                        <button type="button" onClick={() => resetPwd(c)} style={{
                          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                          fontFamily: CP_F, fontWeight: 500, fontSize: 13, lineHeight: '18px',
                          color: '#B67E40', whiteSpace: 'nowrap', transition: 'color .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#986338'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#B67E40'; }}>
                          Сбросить
                        </button>
                      </div>
                    </td>
                    <td style={{ ...tdAddr, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.address || <span style={{ color: '#ADAAAA' }}>— не указана —</span>}
                      </div>
                    </td>
                    <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CpIconBtn title="Редактировать" onClick={() => startEdit(c)} style={{ width: 28, height: 28 }}>
                          {CpIco.edit}
                        </CpIconBtn>
                        <CpIconBtn title="Удалить" danger onClick={() => remove(c.id)} style={{ width: 28, height: 28 }}>
                          {CpIco.trash}
                        </CpIconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && <CpPagination page={safePage} total={totalPages} onChange={setPage} />}
        </div>
      </div>

      {editing && <CpEditModal editing={editing} setEditing={setEditing} list={list} onSave={save} busy={busy} />}
    </div>
  );
}

function CpEditModal({ editing, setEditing, list, onSave, busy }) {
  const isNew = editing.id == null || !list.find(c => c.id === editing.id);
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 768);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const upd = () => setIsMobile(mq.matches);
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  const fieldLbl = { display: 'block', fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#514C4B', marginBottom: 6 };
  const BDR  = '#C6C3C3';
  const BDV  = '#EAECF0';
  const TPR  = '#191414';
  const TMT  = '#676262';
  const TSC  = '#514C4B';
  const BRD2 = '#B67E40';
  const SHX  = '0px 1px 2px rgba(16,24,40,0.05)';

  const genPassword = () => {
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const digits = '23456789';
    const all = lower + upper + digits;
    const pick = src => src[Math.floor(Math.random() * src.length)];
    let pwd = pick(lower) + pick(upper) + pick(digits);
    for (let i = 3; i < 10; i++) pwd += pick(all);
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    setEditing(p => ({ ...p, password: pwd }));
  };

  const IcoX = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );

  const IcoDice = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <circle cx="8"  cy="8"  r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="8"  r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="8"  cy="16" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  );

  const closeBtn = (
    <button type="button" onClick={() => setEditing(null)} style={{
      position: 'absolute', top: 12, right: 12,
      width: 44, height: 44, borderRadius: 8,
      border: 'none', background: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: TMT,
    }}>{IcoX}</button>
  );

  const formBody = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={fieldLbl}>Название</label>
        <CpInput value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} placeholder="ИП Иванов И.И." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div>
          <label style={fieldLbl}>Логин</label>
          <CpInput value={editing.login} onChange={e => setEditing(p => ({ ...p, login: e.target.value.replace(/\s/g, '') }))} placeholder="ivanov" />
        </div>
        <div>
          <label style={fieldLbl}>
            {isNew ? 'Пароль' : 'Новый пароль'}
            {!isNew && <span style={{ color: '#7E7979', fontWeight: 400 }}> · пусто = не менять</span>}
          </label>
          <CpInput value={editing.password} onChange={e => setEditing(p => ({ ...p, password: e.target.value }))} placeholder={isNew ? '••••••••' : 'оставьте пустым'} />
          <button type="button" onClick={genPassword} style={{
            marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: CP_F, fontWeight: 500, fontSize: 13, lineHeight: '18px',
            color: BRD2, transition: 'color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#986338'; }}
          onMouseLeave={e => { e.currentTarget.style.color = BRD2; }}>
            {IcoDice}
            Сгенерировать
          </button>
        </div>
      </div>

      <div>
        <label style={fieldLbl}>
          Точка доставки <span style={{ color: '#7E7979', fontWeight: 400 }}>· один адрес на контрагента</span>
        </label>
        <CpInput value={editing.address || ''} onChange={e => setEditing(p => ({ ...p, address: e.target.value }))} placeholder="г. Москва, ул., д." />
      </div>
    </div>
  );

  const actions = (full) => (
    <>
      <button type="button" onClick={() => setEditing(null)} style={{
        flex: full ? undefined : 1, width: full ? '100%' : undefined,
        height: 44, padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
        background: '#fff', border: `1px solid ${BDR}`, boxShadow: SHX,
        fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: TSC,
      }}>Отмена</button>
      <button type="button" onClick={onSave} disabled={busy} style={{
        flex: full ? undefined : 1, width: full ? '100%' : undefined,
        height: 44, padding: '10px 18px', borderRadius: 8, cursor: busy ? 'default' : 'pointer',
        background: BRD2, border: `1px solid ${BRD2}`, opacity: busy ? 0.7 : 1,
        fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#fff',
      }}>{busy ? 'Сохранение…' : 'Сохранить'}</button>
    </>
  );

  if (isMobile) {
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
              <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: TPR, paddingRight: 52 }}>
                {isNew ? 'Новый контрагент' : 'Редактирование'}
              </div>
              <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: TMT, marginTop: 2 }}>
                Логин, пароль и точка доставки клиента
              </div>
              {closeBtn}
              <div style={{ height: 20 }} />
            </div>
            <div style={{ height: 1, background: BDV }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '20px 16px' }}>
            {formBody}
          </div>
          <div style={{ flexShrink: 0, background: '#fff', borderTop: `1px solid ${BDV}`, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 12 }}>
              {actions(true)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(52,64,84,0.45)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        fontFamily: CP_F,
      }}
      onClick={e => e.target === e.currentTarget && setEditing(null)}>
      <div style={{
        background: '#fff', borderRadius: 12, boxShadow: CP_SHADOW_MOD,
        width: '100%', maxWidth: 544, maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        animation: 'cp-card-in .22s ease-out',
      }}>
        <div style={{ flexShrink: 0, padding: '24px 24px 0', position: 'relative' }}>
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: TPR, paddingRight: 52 }}>
            {isNew ? 'Новый контрагент' : 'Редактирование'}
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: TMT, marginTop: 4 }}>
            Логин, пароль и точка доставки клиента
          </div>
          {closeBtn}
          <div style={{ height: 20 }} />
          <div style={{ height: 1, background: BDV }} />
        </div>
        <div style={{ padding: '20px 24px 0' }}>
          {formBody}
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '32px 24px 24px', marginTop: 'auto' }}>
          {actions(false)}
        </div>
      </div>
    </div>
  );
}

export { LpAdminLogin, LpAdminLineItem, LpOrderEditModal, LpCounterparties, CpPagination, CpEditModal };
