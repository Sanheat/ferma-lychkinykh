import React from 'react';
import {
  verifyLogin, saveClient, getBanner, DEFAULT_BANNER, addOrder, getOrders, genId,
  isoDate, firstShipmentFrom, parseISO, sameDay, fmtLong, fmtShort, fmtDate,
  RU_MONTHS, PKG, PRODUCTS,
  getOrderDraft, saveOrderDraft, clearOrderDraft,
} from './lp-data';
import {
  CP_F, CP_FD, CP_CREAM, CP_CREAM_ACT, CP_BEIGE_300, CP_BEIGE_500, CP_BEIGE_600,
  CP_BEIGE_COD_50, CP_GRAY_200, CP_GRAY_900,
  CP_TEXT_PRIMARY, CP_TEXT_SECONDARY, CP_TEXT_TERTIARY, CP_TEXT_MUTED, CP_TEXT_ALERT,
  CP_BORDER_INPUT, CP_BORDER_CONTROL, CP_BORDER_LIGHT, CP_BORDER_DIVIDER,
  CP_SHADOW_XS, CP_SHADOW_MD, CP_SHADOW_CARD, CP_SHADOW_MOD,
  CP_ERROR, CP_BANNER_RED,
  CpIco, CpLayout, CpStatusBadge,
} from './lp-ui';
import { LpCalendar } from './lp-form-bits';

const { useState: useStateCl, useEffect: useEffectCl, useMemo: useMemoCl, useRef: useRefCl } = React;

/* ─────────────  LOGIN  ───────────── */
function LpClientLogin({ onLogin, onAdmin }) {
  const [login, setLogin] = useStateCl('');
  const [pw, setPw] = useStateCl('');
  const [err, setErr] = useStateCl('');
  const [showPw, setShowPw] = useStateCl(false);
  const [loading, setLoading] = useStateCl(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const found = await verifyLogin(login.trim(), pw);
      if (!found) { setErr('Неверный логин или пароль'); return; }
      saveClient({ id: found.id });
      onLogin(found);
    } catch {
      setErr('Ошибка соединения, попробуйте снова');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', boxSizing:'border-box',
    padding:'10px 14px', height:44,
    fontFamily:CP_F, fontSize:16, lineHeight:'20px',
    color:CP_TEXT_PRIMARY,
    background:'#fff',
    border:`1px solid ${CP_BORDER_INPUT}`, borderRadius:8,
    outline:'none', boxShadow:CP_SHADOW_XS,
  };

  return (
    <div className="cp-login-root" style={{
      minHeight:'100vh', background:CP_CREAM, fontFamily:CP_F,
      display:'flex', alignItems:'stretch',
    }}>
      <style>{`
        .cp-login-root .cp-login-input::placeholder { color:#9AA0A6; }
        .cp-login-root .cp-login-input:focus {
          border-color:${CP_BEIGE_500};
          box-shadow:${CP_SHADOW_XS}, 0 0 0 4px rgba(196,145,76,0.18);
        }
        .cp-login-root .cp-login-submit:hover { background:#A37640; }
        .cp-login-root .cp-login-link:hover { text-decoration:underline; }
        @media (max-width: 1024px) {
          .cp-login-root .cp-login-photo { display:none !important; }
          .cp-login-root .cp-login-pane   { flex:1 !important; }
        }
        @media (max-width: 480px) {
          .cp-login-root .cp-login-pane   { padding:24px 16px !important; }
          .cp-login-root .cp-login-title  { font-size:24px !important; line-height:32px !important; }
        }
      `}</style>

      {/* LEFT — form pane */}
      <div className="cp-login-pane" style={{
        flex:1, minWidth:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px 32px',
      }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <h1 className="cp-login-title" style={{
            fontFamily:CP_FD, fontWeight:700, fontSize:30, lineHeight:'38px',
            color:CP_GRAY_900, letterSpacing:'-0.01em', margin:'0 0 8px',
          }}>Вход личный кабинет</h1>
          <p style={{
            fontFamily:CP_F, fontSize:14, lineHeight:'20px',
            color:CP_TEXT_MUTED, margin:'0 0 32px',
          }}>
            Введите логин и пароль, которые вам предоставил{' '}
            <span
              onClick={onAdmin}
              style={{ color:'inherit', textDecoration:'none', cursor:'pointer' }}>
              менеджер
            </span>
          </p>

          <form onSubmit={submit} noValidate>
            <div style={{ marginBottom:20 }}>
              <label htmlFor="cp-login-login" style={{
                display:'block', marginBottom:6,
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
                color:CP_TEXT_PRIMARY,
              }}>Логин</label>
              <input
                id="cp-login-login"
                className="cp-login-input"
                type="text"
                value={login}
                onChange={e=>{ setLogin(e.target.value); setErr(''); }}
                placeholder="Ваш логин"
                autoFocus
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom:24 }}>
              <label htmlFor="cp-login-pw" style={{
                display:'block', marginBottom:6,
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
                color:CP_TEXT_PRIMARY,
              }}>Пароль</label>
              <div style={{ position:'relative' }}>
                <input
                  id="cp-login-pw"
                  className="cp-login-input"
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e=>{ setPw(e.target.value); setErr(''); }}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight:44 }}
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
              <div style={{ marginTop:8, fontFamily:CP_F, fontSize:13, lineHeight:'18px', color:CP_TEXT_MUTED }}>
                Забыл пароль?{' '}
                <a
                  href="mailto:lichkina.valera@yandex.ru"
                  style={{ color:'#B68B4A', fontWeight:600, textDecoration:'none' }}
                  className="cp-login-link">
                  Обратиться в поддержку
                </a>
              </div>
            </div>

            {err && (
              <div style={{
                fontFamily:CP_F, fontSize:13, lineHeight:'18px',
                color:CP_ERROR, marginBottom:12,
              }}>{err}</div>
            )}

            <button
              type="submit"
              className="cp-login-submit"
              disabled={loading}
              style={{
                width:'100%', height:44, padding:'10px 16px',
                background: loading ? '#d4a870' : '#B68B4A', border:'1px solid #B68B4A', borderRadius:8,
                fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                color:'#fff', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow:CP_SHADOW_XS,
                transition:'background .15s ease',
              }}>
              {loading ? 'Вход…' : 'Войти'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT — photo (border-radius:80px 0 0 80px) */}
      <div className="cp-login-photo" style={{
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

/* ─────────────  BANNER (client read-only)  ───────────── */
function LpClientBanner({ banner }) {
  if (banner.hidden) return null;
  const hasImage = !!banner.image;
  const bg = hasImage ? '#000' : (banner.bg || CP_BANNER_RED);
  return (
    <div style={{
      borderRadius:20, overflow:'hidden', position:'relative',
      background: bg, color:'#fff', height:240, marginBottom:32,
    }}>
      {hasImage && (
        <img src={banner.image} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.75 }}/>
      )}
      <div style={{ position:'relative', padding:20, display:'flex', flexDirection:'column', height:'100%', justifyContent:'space-between' }}>
        <div style={{
          display:'inline-block', alignSelf:'flex-start',
          background:CP_BEIGE_COD_50, color:CP_TEXT_SECONDARY,
          padding:'4px 12px', borderRadius:16,
          fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
        }}>{banner.badge}</div>
        <div>
          <div style={{
            fontFamily:CP_FD, fontWeight:600, fontSize:30, lineHeight:'38px',
            color:'#fff', marginBottom:6,
            textShadow: hasImage ? '0 2px 12px rgba(0,0,0,.35)' : 'none',
          }}>{banner.title}</div>
          <div style={{ fontSize:14, fontWeight:500, lineHeight:'20px', color:'#fff', opacity:.95 }}>{banner.subtitle}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────  ORDER FORM  ───────────── */
function LpOrderForm({ counterparty, onHistory, onLogout }) {
  const [banner, setBanner] = useStateCl(DEFAULT_BANNER);
  useEffectCl(() => { getBanner().then(b => b && setBanner(b)); }, []);

  const mkItem = () => ({ uid:genId(), product:'', packaging:'', qty:'1', frozen:false, frozenComment:'' });

  // Восстанавливаем черновик заказа из localStorage (отдельно для каждого контрагента)
  const draft = useMemoCl(() => getOrderDraft(counterparty.id), [counterparty.id]);
  const defaultShipDate = isoDate(firstShipmentFrom());
  // shipDate из черновика берём только если он не «протух» (не раньше ближайшей доступной даты)
  const draftShipDate = draft?.shipDate && draft.shipDate >= defaultShipDate ? draft.shipDate : defaultShipDate;

  const [shipDate, setShipDate] = useStateCl(draftShipDate);
  const [deliveryType, setDeliveryType] = useStateCl(draft?.deliveryType ?? null);
  const [items, setItems] = useStateCl(
    Array.isArray(draft?.items) && draft.items.length ? draft.items : [mkItem()]
  );
  const [comment, setComment] = useStateCl(draft?.comment ?? '');
  const [showCal, setShowCal] = useStateCl(false);
  const [done, setDone] = useStateCl(null);
  const [submitting, setSubmitting] = useStateCl(false);
  const [myOrdersCount, setMyOrdersCount] = useStateCl(0);

  // Автосохранение черновика при любом изменении параметров заказа
  useEffectCl(() => {
    if (done) return; // после успешной отправки черновик не сохраняем
    saveOrderDraft(counterparty.id, { shipDate, deliveryType, items, comment });
  }, [counterparty.id, shipDate, deliveryType, items, comment, done]);

  useEffectCl(() => {
    getOrders().then(all =>
      setMyOrdersCount(all.filter(o => (o.clientId === counterparty.id || o.clientName === counterparty.name) && o.status === 'pending').length)
    );
  }, [counterparty, done]);

  const minDate = firstShipmentFrom();
  const addr = counterparty.address || '';
  const handleChange = (idx, ni) => setItems(p=>p.map((it,i)=>i===idx?ni:it));
  const handleRemove = idx => setItems(p=>p.filter((_,i)=>i!==idx));

  const submit = async () => {
    if (!deliveryType) { alert('Выберите способ получения'); return; }
    if (items.some(it => !it.product || !it.packaging || !it.qty || Number(it.qty) <= 0)) {
      alert('Заполните все позиции');
      return;
    }
    setSubmitting(true);
    try {
      const id = await addOrder({
        clientId: counterparty.id, clientName: counterparty.name,
        deliveryAddress: addr,
        deliveryType, shipmentDate: shipDate,
        createdAt: new Date().toISOString(),
        items: items.map(it => ({
          product: it.product, packaging: it.packaging, qty: it.qty,
          frozen: !!it.frozen, frozenComment: it.frozenComment || '',
        })),
        comment, status: 'pending',
      });
      clearOrderDraft(counterparty.id);
      setDone({ id, address: addr, shipmentDate: shipDate });
    } catch {
      alert('Ошибка при отправке заявки. Попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    clearOrderDraft(counterparty.id);
    setItems([mkItem()]); setComment(''); setDone(null);
    setDeliveryType(null); setShipDate(isoDate(firstShipmentFrom()));
  };

  const filledCount = items.filter(it => it.product && Number(it.qty) > 0).length;
  const deliveryLabel = deliveryType === 'pickup' ? 'Самовывоз' : deliveryType === 'delivery' ? 'Доставка' : 'Не выбрано';

  const allItemsValid = items.length > 0 &&
    items.every(it => it.product && it.packaging && Number(it.qty) > 0);
  const submitValid = !!deliveryType && allItemsValid && !submitting;

  return (
    <CpLayout active="form" onNav={k=> k==='history' && onHistory()} counterparty={counterparty} onLogout={onLogout} ordersCount={myOrdersCount}>
      <div data-screen-label="01 Новая заявка" style={{
        width:'100%', maxWidth:1148, margin:'0 auto',
        padding:'32px 0 48px',
        display:'flex', flexDirection:'column', gap:32,
        borderRadius:'40px 0 0 0', background:'#fff',
      }}>
        {!banner.hidden && (
          <div className="cp-banner-wrap" style={{ padding:'0 32px' }}>
            <LpClientBanner banner={banner}/>
          </div>
        )}

        <div className="cp-form-container" style={{ display:'flex', alignItems:'flex-start', padding:'0 32px', gap:32 }}>

          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', alignItems:'flex-start', gap:20 }}>
            <h1 style={{
              fontFamily:CP_F, fontWeight:600, fontSize:30, lineHeight:'38px',
              color:CP_GRAY_900, letterSpacing:'-0.01em',
            }}>Новая заявка</h1>

            <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', gap:16 }}>
              {items.map((it, idx) => (
                <React.Fragment key={it.uid}>
                  <LpClientLineItem item={it} idx={idx} total={items.length}
                    onChange={handleChange} onRemove={handleRemove}/>
                  {idx < items.length - 1 && <div className="cp-pos-divider" />}
                </React.Fragment>
              ))}
            </div>

            <div className="content-divider" style={{ width:760, maxWidth:'100%', display:'flex', alignItems:'center', gap:8 }}>
              <button type="button"
                onClick={()=> allItemsValid && setItems(p=>[...p, mkItem()])}
                disabled={!allItemsValid}
                className={`cp-add-pos-btn ${allItemsValid ? 'is-active' : 'is-disabled'}`}
                style={{
                  padding:'10px 16px',
                  background:CP_CREAM, border:`1px solid ${CP_CREAM}`, borderRadius:8,
                  display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                  fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                  color:CP_BEIGE_300, whiteSpace:'nowrap',
                  transition: 'background .15s ease, border-color .15s ease, color .15s ease',
                }}>
                <span style={{ width:20, height:20, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{CpIco.plus}</span>
                Добавить позицию
              </button>
              <div style={{ height:1, flex:1, background:CP_BORDER_LIGHT }}/>
            </div>

            <div className="content-parent" style={{ width:760, maxWidth:'100%', alignSelf:'stretch', display:'flex', alignItems:'flex-start', gap:32 }}>
              <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{
                  fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:CP_TEXT_PRIMARY,
                }}>Способ получения</div>
                <div style={{
                  alignSelf:'stretch', display:'flex', borderRadius:8, overflow:'hidden',
                  border:`1px solid ${CP_BORDER_CONTROL}`, background:'#fff',
                }}>
                  {[['delivery','Доставка'], ['pickup','Самовывоз']].map(([v, l], i) => {
                    const on = deliveryType === v;
                    return (
                      <button key={v} type="button" onClick={()=>setDeliveryType(v)}
                        style={{
                          flex:1, padding:'12px 16px',
                          border:'none', borderRight: i === 0 ? `1px solid ${CP_BORDER_CONTROL}` : 'none',
                          background: on ? CP_CREAM_ACT : '#fff',
                          color: on ? CP_TEXT_PRIMARY : CP_TEXT_SECONDARY,
                          fontFamily:CP_F, fontWeight: on ? 600 : 500, fontSize:14, lineHeight:'20px',
                          cursor:'pointer',
                        }}>{l}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:8, position:'relative' }}>
                <div style={{
                  fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:CP_TEXT_PRIMARY,
                }}>Дата отгрузки</div>
                <button type="button" onClick={()=>setShowCal(s=>!s)}
                  style={{
                    alignSelf:'stretch', padding:'10px 14px',
                    display:'flex', alignItems:'center', gap:8,
                    background:'#fff', border:`1px solid ${CP_BORDER_INPUT}`, borderRadius:8,
                    fontFamily:CP_F, fontSize:16, lineHeight:'24px', color:CP_TEXT_TERTIARY, cursor:'pointer',
                    boxShadow:CP_SHADOW_XS,
                  }}>
                  <span style={{ color:CP_TEXT_TERTIARY, display:'flex' }}>{CpIco.calendar}</span>
                  <span>{fmtLong(parseISO(shipDate))}</span>
                </button>
                {showCal && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, zIndex:30, boxShadow:CP_SHADOW_MD, borderRadius:12, overflow:'hidden' }}>
                    <LpCalendar value={shipDate} minDate={minDate} onChange={d=>{ setShipDate(d); setShowCal(false); }}/>
                  </div>
                )}
              </div>
            </div>

            <div className="content13" style={{ width:760, maxWidth:'100%', display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:CP_TEXT_PRIMARY,
              }}>Комментарий к заказу</div>
              <textarea
                value={comment}
                onChange={e=>setComment(e.target.value)}
                placeholder="Особые пожелания, удобное время доставки..."
                style={{
                  width:'100%', height:180, padding:'12px 14px',
                  fontFamily:CP_F, fontSize:16, lineHeight:'24px', color:CP_TEXT_PRIMARY,
                  background:'#fff', border:`1px solid ${CP_BORDER_CONTROL}`, borderRadius:8,
                  outline:'none', boxShadow:CP_SHADOW_XS, resize:'vertical',
                }}
                onFocus={e=>{ e.target.style.borderColor = CP_BEIGE_500; e.target.style.boxShadow = `${CP_SHADOW_XS}, 0 0 0 4px rgba(196,145,76,0.18)`; }}
                onBlur ={e=>{ e.target.style.borderColor = CP_BORDER_CONTROL; e.target.style.boxShadow = CP_SHADOW_XS; }}
              />
            </div>
          </div>

          <aside className="cp-order-summary" style={{ width:292, flexShrink:0, paddingTop:58, position:'sticky', top:32, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{
              alignSelf:'stretch',
              background:'#fff', border:`1px solid ${CP_BORDER_LIGHT}`, borderRadius:12,
              boxShadow:CP_SHADOW_CARD, overflow:'hidden',
            }}>
              <div style={{
                padding:20, display:'flex', flexDirection:'column', alignItems:'center', gap:24,
                background:'#fff', borderRadius:8,
              }}>
                <button type="button" onClick={submit} disabled={!submitValid}
                  className={`cp-submit-btn ${submitValid ? 'is-active' : 'is-disabled'}`}
                  style={{
                    alignSelf:'stretch', padding:'10px 16px',
                    background: submitValid ? CP_BEIGE_600 : CP_CREAM,
                    border:`1px solid ${submitValid ? CP_BEIGE_600 : CP_CREAM}`,
                    borderRadius:8,
                    fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                    color: submitValid ? '#fff' : CP_BEIGE_300,
                    cursor: submitValid ? 'pointer' : 'not-allowed',
                    textAlign:'center',
                    boxShadow: submitValid ? CP_SHADOW_XS : 'none',
                    transition: 'background .15s ease, border-color .15s ease, color .15s ease',
                  }}>
                  {submitting ? 'Отправка…' : 'Оформить заявку'}
                </button>

                <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{
                    fontFamily:CP_FD, fontWeight:500, fontSize:16, lineHeight:'24px',
                    letterSpacing:'0.15px', color:CP_TEXT_SECONDARY,
                  }}>Итог заказа</div>

                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      ['Продукты',       String(filledCount), true],
                      ['Тип доставки',   deliveryLabel,        true],
                      ['Дата отгрузки',  fmtShort(parseISO(shipDate)), false],
                    ].map(([k,v,sep]) => (
                      <div key={k} style={{
                        alignSelf:'stretch', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20,
                        paddingBottom: sep ? 8 : 0,
                        borderBottom: sep ? `1px solid ${CP_BORDER_DIVIDER}` : 'none',
                        fontFamily:CP_F, fontSize:14, lineHeight:'20px',
                      }}>
                        <span style={{ fontWeight:400, color:CP_TEXT_MUTED }}>{k}</span>
                        <span style={{ fontWeight:500, color:CP_TEXT_SECONDARY, textAlign:'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              alignSelf:'stretch',
              padding:16, gap:12,
              borderRadius:12, background:CP_CREAM, border:`1px solid ${CP_BEIGE_500}`,
              display:'flex', flexDirection:'column', alignItems:'flex-start',
              color:CP_TEXT_ALERT,
            }}>
              <span style={{ display:'inline-flex', color:CP_TEXT_ALERT, flexShrink:0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0001 13.3333V9.99999M10.0001 6.66666H10.0084M18.3334 9.99999C18.3334 14.6024 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6024 1.66675 9.99999C1.66675 5.39762 5.39771 1.66666 10.0001 1.66666C14.6025 1.66666 18.3334 5.39762 18.3334 9.99999Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div style={{
                fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px', color:CP_TEXT_ALERT,
              }}>Заявки принимаются до 15:00 — отгрузка через 2 рабочих дня</div>
            </div>
          </aside>
        </div>
      </div>

      {done && <LpOrderConfirmed done={done} onReset={reset} onHistory={onHistory}/>}
    </CpLayout>
  );
}

/* Confirmation modal */
function LpOrderConfirmed({ done, onReset, onHistory }) {
  return (
    <div className="cp-confirm-overlay" style={{
      position:'fixed', inset:0, zIndex:300,
      background:'rgba(52,64,84,0.45)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
      display:'flex', fontFamily:CP_F,
    }}>
      <div className="cp-confirm-card" style={{ background:'#fff', boxShadow:CP_SHADOW_MOD }}>
        <div style={{ borderRadius:12, overflow:'hidden', marginBottom:20 }}>
          <img src="/assets/truck-illustration.png" alt=""
            style={{ display:'block', width:'100%', height:'auto' }}/>
        </div>

        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ fontFamily:CP_FD, fontWeight:700, fontSize:18, lineHeight:'26px', color:CP_GRAY_900, marginBottom:4 }}>
            Заявка №{done.id} принята
          </div>
          <div style={{ fontSize:14, lineHeight:'20px', color:CP_TEXT_MUTED }}>
            Отгрузка — {fmtLong(parseISO(done.shipmentDate))}
          </div>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button type="button" onClick={onHistory}
            className="cp-confirm-btn cp-confirm-btn--history">История</button>
          <button type="button" onClick={onReset}
            className="cp-confirm-btn cp-confirm-btn--new">Новый заказ</button>
        </div>
      </div>
    </div>
  );
}

/* Позиция заказа */
function LpClientLineItem({ item, idx, total, onChange, onRemove }) {
  const pkg = PKG[item.packaging] || {};
  const isKg = pkg.type === 'kg';
  const step = pkg.step || 1;

  const productOptions = PRODUCTS.map(p => p.name);

  // Счётная тара (ящик, лоток): шаг кнопками. Весовая (пакет) — нативное поле ниже.
  const dec = () => {
    const cur = parseInt(item.qty||String(step), 10) || step;
    onChange(idx, { ...item, qty: String(Math.max(step, cur - step)) });
  };
  const inc = () => {
    const cur = parseInt(item.qty||String(step), 10) || step;
    onChange(idx, { ...item, qty: String(cur + step) });
  };

  // Привести введённое вручную значение к допустимому: счётная тара — кратно шагу
  const normalizeQty = () => {
    const n = parseInt(item.qty||'0', 10) || 0;
    const snapped = Math.max(step, Math.round(n / step) * step);
    onChange(idx, { ...item, qty: String(snapped) });
  };

  const buildSelectStyle = active => ({
    width:'100%', padding:'10px 36px 10px 14px',
    fontFamily:CP_F, fontSize:16, lineHeight:'24px',
    fontWeight: active ? 500 : 400,
    color: active ? CP_TEXT_PRIMARY : CP_TEXT_TERTIARY,
    background:`#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237E7979' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>") no-repeat right 14px center`,
    border:`1px solid ${CP_BORDER_INPUT}`, borderRadius:8, outline:'none', cursor:'pointer',
    appearance:'none', WebkitAppearance:'none', boxShadow:CP_SHADOW_XS,
  });

  return (
    <div className="cp-order-pos-item" style={{ alignSelf:'stretch', display:'flex', flexDirection:'column' }}>
      <div className="frame-parent" style={{ alignSelf:'stretch', display:'flex', alignItems:'center', gap:16 }}>
        <div className="input-dropdown-parent" style={{
          flex:1, minWidth:0, display:'flex', flexDirection:'row', alignItems:'center', gap:12,
        }}>
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
            <select value={item.product} onChange={e=>onChange(idx, { ...item, product:e.target.value })}
              style={buildSelectStyle(!!item.product)}>
              <option value="" disabled hidden>Продукт</option>
              {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="input-dropdown-group" style={{
            flex:1, minWidth:0, display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
              <select value={item.packaging} onChange={e=>onChange(idx, { ...item, packaging:e.target.value, qty: PKG[e.target.value]?.step ? String(PKG[e.target.value].step) : '1' })}
                style={buildSelectStyle(!!item.packaging)}>
                <option value="" disabled hidden>Тара</option>
                {Object.entries(PKG).map(([k,v]) => {
                  const note = v.note ? v.note.replace(/^≈\s*/, '') : '';
                  return <option key={k} value={k}>{v.label}{note ? `  —  ${note}` : ''}</option>;
                })}
              </select>
            </div>
            {isKg ? (
              <input
                type="number" min="0.1" step="0.1" placeholder="кг"
                value={item.qty}
                onChange={e=>onChange(idx, { ...item, qty: e.target.value })}
                style={{
                  width:96, boxSizing:'border-box', height:48,
                  padding:'12px 14px',
                  border:`1px solid ${CP_BORDER_CONTROL}`, borderRadius:8,
                  background:'#fff', outline:'none', textAlign:'center',
                  fontFamily:CP_F, fontSize:14, lineHeight:'20px',
                  fontWeight:600, color:CP_TEXT_SECONDARY, flexShrink:0,
                }}
              />
            ) : (
            <div style={{
              display:'flex', alignItems:'flex-start',
              border:`1px solid ${CP_BORDER_CONTROL}`, borderRadius:8, overflow:'hidden',
              background:'#fff', flexShrink:0,
            }}>
              <button type="button" onClick={dec}
                style={{
                  padding:12, border:'none', borderRight:`1px solid ${CP_BORDER_CONTROL}`,
                  background:'#fff', color:CP_TEXT_SECONDARY, cursor:'pointer',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}>
                {CpIco.minus}
              </button>
              <div style={{
                padding:'12px 16px', borderRight:`1px solid ${CP_BORDER_CONTROL}`,
                background:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center',
              }}>
                <input
                  type="text" value={item.qty}
                  onChange={e=>{
                    const v = e.target.value.replace(',', '.').replace(/[^0-9.]/g,'');
                    onChange(idx, { ...item, qty: v });
                  }}
                  onBlur={normalizeQty}
                  style={{
                    width:30, padding:0, border:'none', outline:'none',
                    textAlign:'center', background:'transparent',
                    fontFamily:CP_F, fontSize:14, lineHeight:'20px',
                    fontWeight:600, color:CP_TEXT_SECONDARY,
                  }}
                />
              </div>
              <button type="button" onClick={inc}
                style={{
                  padding:12, border:'none',
                  background:'#fff', color:CP_TEXT_SECONDARY, cursor:'pointer',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}>
                {CpIco.plus}
              </button>
            </div>
            )}
          </div>
        </div>
        <button type="button" onClick={()=>onRemove(idx)} title="Удалить"
          style={{
            padding:8, background:'#fff',
            border:`1px solid ${CP_BORDER_INPUT}`, borderRadius:8,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            color:CP_TEXT_SECONDARY, cursor: total > 1 ? 'pointer' : 'default',
            opacity: total > 1 ? 1 : 0, pointerEvents: total > 1 ? 'auto' : 'none',
            flexShrink:0, alignSelf:'center',
          }}>
          {CpIco.trash}
        </button>
      </div>

      <div style={{ alignSelf:'stretch', display:'flex', alignItems:'center', justifyContent:'flex-start' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8 }}>
          <label style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none' }}>
            <span style={{
              width:20, height:20, borderRadius:6,
              border:`1px solid ${item.frozen ? CP_BEIGE_600 : CP_BORDER_CONTROL}`,
              background: item.frozen ? CP_CREAM : '#fff',
              display:'inline-flex', alignItems:'center', justifyContent:'center', color:CP_BEIGE_600,
              flexShrink:0,
            }}>
              {item.frozen && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              )}
            </span>
            <input type="checkbox" checked={item.frozen} onChange={e=>onChange(idx, { ...item, frozen:e.target.checked })} style={{ display:'none' }}/>
            <span style={{ fontFamily:CP_F, fontSize:16, lineHeight:'24px', fontWeight:500, color:CP_TEXT_PRIMARY }}>Замороженное</span>
          </label>
          <span className="cp-frozen-help"
            style={{
              position:'relative', width:16, height:16,
              color:CP_TEXT_TERTIARY, display:'inline-flex',
              alignItems:'center', justifyContent:'center', cursor:'help', flexShrink:0,
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            <span className="cp-frozen-tip" role="tooltip">По умолчанию идёт охлаждённая продукция</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* Календарь-диапазон для фильтра «Период» */
function LpHistRangeCalendar({ start, end, onChange, onClear, onClose }) {
  const initialBase = start || new Date();
  const [view, setView] = useStateCl(() => new Date(initialBase.getFullYear(), initialBase.getMonth(), 1));
  const [hover, setHover] = useStateCl(null);

  const goPrev = () => setView(new Date(view.getFullYear(), view.getMonth()-1, 1));
  const goNext = () => setView(new Date(view.getFullYear(), view.getMonth()+1, 1));

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
  const cells = [];
  for (let i=0; i<offset; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const handleClick = d => {
    if (!start || (start && end)) {
      onChange({ start: d, end: null });
    } else {
      if (d.getTime() < start.getTime()) onChange({ start: d, end: start });
      else                                onChange({ start, end: d });
      onClose && onClose();
    }
  };

  const sd = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
  const ed = end   ? new Date(end.getFullYear(),   end.getMonth(),   end.getDate())   : null;
  const hd = hover ? new Date(hover.getFullYear(), hover.getMonth(), hover.getDate()) : null;
  const previewEnd = (sd && !ed && hd && hd >= sd) ? hd : null;
  const previewStart = (sd && !ed && hd && hd < sd) ? hd : null;
  const rangeFrom = previewStart || sd;
  const rangeTo   = ed || previewEnd || sd;

  const monthLabel = `${RU_MONTHS[view.getMonth()][0].toUpperCase()}${RU_MONTHS[view.getMonth()].slice(1)} ${view.getFullYear()}`;

  return (
    <div style={{
      background:'#fff', border:`1px solid ${CP_BORDER_LIGHT}`, borderRadius:12,
      padding:16, width:300, fontFamily:CP_F, boxShadow:CP_SHADOW_MD,
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <button type="button" onClick={goPrev}
          style={{ background:'none', border:'none', padding:6, borderRadius:6, color:CP_TEXT_SECONDARY, cursor:'pointer', display:'inline-flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px', color:CP_TEXT_PRIMARY }}>{monthLabel}</div>
        <button type="button" onClick={goNext}
          style={{ background:'none', border:'none', padding:6, borderRadius:6, color:CP_TEXT_SECONDARY, cursor:'pointer', display:'inline-flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:0, marginBottom:4 }}>
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w=>(
          <div key={w} style={{ fontFamily:CP_F, fontWeight:500, fontSize:12, color:CP_TEXT_TERTIARY, textAlign:'center', padding:'6px 0' }}>{w}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:0 }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} style={{ height:36 }}/>;
          const isStart = sd && sameDay(c, sd);
          const isEnd   = (ed && sameDay(c, ed)) || (previewEnd && sameDay(c, previewEnd));
          const inRange = rangeFrom && rangeTo && c >= rangeFrom && c <= rangeTo;
          const isEndpoint = isStart || isEnd;
          return (
            <div key={i} style={{
              height:36, display:'flex', alignItems:'center', justifyContent:'center',
              background: inRange && !isEndpoint ? CP_CREAM_ACT : 'transparent',
              borderTopLeftRadius:    (inRange && (isStart || (rangeFrom && sameDay(c, rangeFrom)))) ? 18 : 0,
              borderBottomLeftRadius: (inRange && (isStart || (rangeFrom && sameDay(c, rangeFrom)))) ? 18 : 0,
              borderTopRightRadius:   (inRange && (isEnd   || (rangeTo   && sameDay(c, rangeTo))))   ? 18 : 0,
              borderBottomRightRadius:(inRange && (isEnd   || (rangeTo   && sameDay(c, rangeTo))))   ? 18 : 0,
            }}>
              <button type="button"
                onClick={()=>handleClick(c)}
                onMouseEnter={()=>setHover(c)}
                onMouseLeave={()=>setHover(h => sameDay(h||new Date(0), c) ? null : h)}
                style={{
                  width:36, height:36, borderRadius:18, border:'none',
                  background: isEndpoint ? CP_BEIGE_600 : 'transparent',
                  color: isEndpoint ? '#fff' : CP_TEXT_PRIMARY,
                  fontFamily:CP_F, fontWeight: isEndpoint ? 600 : 500, fontSize:14,
                  cursor:'pointer',
                }}>{c.getDate()}</button>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, paddingTop:12, borderTop:`1px solid ${CP_BORDER_DIVIDER}` }}>
        <button type="button" onClick={onClear}
          style={{
            background:'none', border:'none', padding:0, cursor:'pointer',
            fontFamily:CP_F, fontWeight:600, fontSize:14, color:CP_TEXT_SECONDARY,
          }}>Сбросить</button>
        <button type="button" onClick={onClose}
          style={{
            background:'#fff', border:`1px solid ${CP_GRAY_200}`, borderRadius:8,
            padding:'6px 14px', cursor:'pointer',
            fontFamily:CP_F, fontWeight:600, fontSize:14, color:CP_TEXT_PRIMARY,
            boxShadow:CP_SHADOW_XS,
          }}>Готово</button>
      </div>
    </div>
  );
}

/* ─────────────  ORDER HISTORY  ───────────── */
function LpOrderHistory({ counterparty, onBack, onLogout }) {
  const [allOrders, setAllOrders] = useStateCl([]);
  useEffectCl(() => {
    getOrders().then(all =>
      setAllOrders(all.filter(o => o.clientId === counterparty.id || o.clientName === counterparty.name))
    );
  }, [counterparty]);

  const [query, setQuery] = useStateCl('');
  const [productFilter, setProductFilter] = useStateCl('');
  const [period, setPeriod] = useStateCl({ start:null, end:null });
  const [showPeriodCal, setShowPeriodCal] = useStateCl(false);
  const periodRef = useRefCl(null);
  const [expanded, setExpanded] = useStateCl(new Set());
  const [currentPage, setCurrentPage] = useStateCl(1);

  useEffectCl(() => {
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
  const PAGE_SIZE = 5;

  const productOptions = useMemoCl(()=>{
    const s = new Set();
    allOrders.forEach(o => o.items.forEach(it => s.add(it.product)));
    return [...s].sort();
  }, [allOrders]);

  const filtered = useMemoCl(()=>{
    const q = query.trim().toLowerCase();
    const ps = period.start ? new Date(period.start.getFullYear(), period.start.getMonth(), period.start.getDate()).getTime() : null;
    const pe = period.end   ? new Date(period.end.getFullYear(),   period.end.getMonth(),   period.end.getDate(),   23,59,59,999).getTime() : null;
    return allOrders.filter(o => {
      if (q && !o.id.toLowerCase().includes(q)) return false;
      if (productFilter && !o.items.some(it => it.product === productFilter)) return false;
      if (ps || pe) {
        const t = parseISO(o.shipmentDate).getTime();
        if (ps !== null && t < ps) return false;
        if (pe !== null && t > pe) return false;
      }
      return true;
    });
  }, [allOrders, query, productFilter, period]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const pageNumbers = useMemoCl(() => {
    if (pageCount <= 7) return Array.from({length: pageCount}, (_, i) => i + 1);
    const p = safePage;
    if (p <= 4) return [1, 2, 3, 4, 5, '...', pageCount];
    if (p >= pageCount - 3) return [1, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    return [1, '...', p - 1, p, p + 1, '...', pageCount];
  }, [pageCount, safePage]);

  const myOrdersCount = allOrders.filter(o => o.status === 'pending').length;

  const toggleExpand = id => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => { setQuery(''); setProductFilter(''); setPeriod({ start:null, end:null }); };
  const anyFilterActive = !!(query || productFilter || period.start || period.end);

  const HIST_BG_FILTER       = '#F9F8F8';
  const HIST_BORDER_CARD     = 'rgba(120, 120, 120, 0.2)';
  const HIST_BORDER_INPUT    = '#C6C3C3';
  const HIST_BORDER_TABLE    = '#EAECF0';
  const HIST_BORDER_HEADER   = '#DFDDDD';
  const HIST_BORDER_DIVIDER  = '#DFDDDD';
  const HIST_TEXT_PRIMARY    = '#191414';
  const HIST_TEXT_SECONDARY  = '#514C4B';
  const HIST_TEXT_TERTIARY   = '#7E7979';
  const HIST_TEXT_MUTED      = '#676262';
  const HIST_TEXT_LIGHT      = '#ADAAAA';
  const HIST_TEXT_DISABLED   = '#D0D5DD';
  const HIST_NUM_TXT         = '#3C3636';
  const HIST_DETAIL_COLOR    = '#B67E40';
  const HIST_SHADOW_INPUT    = '0px 1px 2px rgba(16, 24, 40, 0.05)';

  const cellBgFor = (rowIdx) => rowIdx % 2 === 0 ? '#FFFFFF' : HIST_BG_FILTER;

  return (
    <CpLayout active="history" onNav={k=> k==='form' && onBack()} counterparty={counterparty} onLogout={onLogout || onBack} ordersCount={myOrdersCount}>
      <div className="cp-hist-page" style={{ width:'100%', maxWidth:1148, margin:'0 auto', padding:'32px 32px 48px', display:'flex', flexDirection:'column', gap:32 }}>

        <h1 className="cp-hist-title" style={{
          fontFamily:CP_FD, fontWeight:600, fontSize:30, lineHeight:'38px',
          color:CP_GRAY_900, letterSpacing:'-0.01em',
        }}>История заказов</h1>

        <div className="cp-hist-filters" style={{
          background:HIST_BG_FILTER, borderRadius:12, padding:20,
          display:'flex', alignItems:'flex-end', gap:12, flexWrap:'wrap',
        }}>
          <div className="cp-hist-filter" style={{ flex:'1 1 160px', minWidth:0, display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_SECONDARY }}>Поиск по номеру заказа</div>
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:'#fff', border:`1px solid ${HIST_BORDER_INPUT}`, borderRadius:8,
              padding:'10px 14px', boxShadow:HIST_SHADOW_INPUT,
            }}>
              <span style={{ color:HIST_TEXT_TERTIARY, display:'flex' }}>{CpIco.search}</span>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск"
                style={{
                  flex:1, border:'none', outline:'none', background:'transparent',
                  fontFamily:CP_F, fontSize:16, lineHeight:'24px', color:HIST_TEXT_PRIMARY,
                }}/>
            </div>
          </div>

          <div className="cp-hist-filter" ref={periodRef} style={{ flex:'1 1 160px', minWidth:0, display:'flex', flexDirection:'column', gap:6, position:'relative' }}>
            <div style={{ fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_SECONDARY }}>Период</div>
            <button type="button"
              onClick={()=>setShowPeriodCal(s=>!s)}
              className={`cp-period-trigger ${period.start ? 'is-active' : ''}`}
              style={{
                display:'flex', alignItems:'center', gap:8, cursor:'pointer',
                background:'#fff', border:`1px solid ${HIST_BORDER_INPUT}`, borderRadius:8,
                padding:'10px 14px', boxShadow:HIST_SHADOW_INPUT,
                fontFamily:CP_F, fontSize:16, lineHeight:'24px',
                textAlign:'left',
                color: period.start ? HIST_TEXT_PRIMARY : HIST_TEXT_LIGHT,
              }}>
              <span style={{ color: period.start ? HIST_DETAIL_COLOR : HIST_TEXT_LIGHT, display:'flex' }}>{CpIco.calendar}</span>
              <span style={{ flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {period.start && period.end
                  ? `${fmtShort(period.start)} — ${fmtShort(period.end)}`
                  : period.start
                    ? `${fmtShort(period.start)} — …`
                    : 'Выбрать период'}
              </span>
              {period.start && (
                <span
                  role="button"
                  aria-label="Очистить период"
                  onClick={e=>{ e.stopPropagation(); setPeriod({ start:null, end:null }); }}
                  style={{
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:18, height:18, borderRadius:9,
                    color:HIST_TEXT_TERTIARY, flexShrink:0,
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
              )}
            </button>
            {showPeriodCal && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:30 }}>
                <LpHistRangeCalendar
                  start={period.start}
                  end={period.end}
                  onChange={setPeriod}
                  onClear={()=>{ setPeriod({ start:null, end:null }); }}
                  onClose={()=>setShowPeriodCal(false)}
                />
              </div>
            )}
          </div>

          <div className="cp-hist-filter" style={{ flex:'1 1 160px', minWidth:0, display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_SECONDARY }}>Продукты</div>
            <div style={{ position:'relative' }}>
              <select value={productFilter} onChange={e=>setProductFilter(e.target.value)}
                style={{
                  width:'100%', padding:'10px 36px 10px 14px',
                  fontFamily:CP_F, fontSize:16, lineHeight:'24px',
                  color: productFilter ? HIST_TEXT_PRIMARY : HIST_TEXT_TERTIARY,
                  background:`#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237E7979' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>") no-repeat right 14px center`,
                  border:`1px solid ${HIST_BORDER_INPUT}`, borderRadius:8, outline:'none', cursor:'pointer',
                  appearance:'none', WebkitAppearance:'none', boxShadow:HIST_SHADOW_INPUT,
                }}>
                <option value="">Все</option>
                {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <button type="button" onClick={clearFilters} className="cp-hist-clear"
            style={{
              background:'#fff', border:`1px solid ${CP_GRAY_200}`, borderRadius:8,
              padding:'10px 18px', boxShadow:HIST_SHADOW_INPUT,
              flex:'0 0 auto',
              fontFamily:CP_F, fontWeight:600, fontSize:16, lineHeight:'24px',
              color: anyFilterActive ? HIST_TEXT_PRIMARY : HIST_TEXT_DISABLED,
              cursor: anyFilterActive ? 'pointer' : 'default',
            }}>Очистить</button>
        </div>

        <div className="cp-hist-orders" style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {filtered.length === 0 && (
            <div style={{
              background:'#fff', border:`1px solid ${HIST_BORDER_CARD}`, borderRadius:16,
              padding:'48px 24px', textAlign:'center', color:HIST_TEXT_TERTIARY, fontFamily:CP_F, fontSize:16,
            }}>
              Заказов не найдено
            </div>
          )}
          {pageItems.map(order => {
            const open = expanded.has(order.id);
            const deliveryLabel = order.deliveryType === 'pickup' ? 'самовывоз' : 'доставка';
            return (
              <div key={order.id} style={{
                background:'#fff', border:`1px solid ${HIST_BORDER_CARD}`, borderRadius:16,
                overflow:'hidden',
              }}>
                <div style={{ padding:16, display:'flex', flexDirection:'column', gap:15 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 }}>
                      <div style={{ fontFamily:CP_F, fontWeight:500, fontSize:16, lineHeight:'24px', color:HIST_TEXT_PRIMARY }}>
                        № {order.id}
                      </div>
                      <CpStatusBadge status={order.status}/>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_SECONDARY }}>
                      <span>Создан {fmtDate(order.createdAt)}</span>
                      <span>·</span>
                      <span>отгрузка {fmtShort(parseISO(order.shipmentDate))}</span>
                      <span>·</span>
                      <span>{deliveryLabel}</span>
                    </div>
                  </div>
                  <button type="button" onClick={()=>toggleExpand(order.id)}
                    style={{
                      alignSelf:'flex-start', background:'none', border:'none', cursor:'pointer',
                      color:HIST_DETAIL_COLOR, fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                      padding:0, display:'inline-flex', alignItems:'center', gap:8,
                    }}>
                    Подробнее
                    <span style={{ display:'inline-flex' }}>{open ? CpIco.chevUp : CpIco.chevDown}</span>
                  </button>
                </div>

                {open && (
                  <div className="cp-hist-expand" style={{
                    margin:'0 0 16px',
                    background:'#fff',
                    borderTop:`1px solid ${HIST_BORDER_TABLE}`,
                    borderBottom:`1px solid ${HIST_BORDER_TABLE}`,
                    overflow:'hidden',
                  }}>
                    <div className="cp-hist-table" style={{ display:'flex', alignItems:'flex-start', width:'100%' }}>
                      {['Продукты','Тара','Количество','Заморозка'].map((h, colIdx) => (
                        <div key={h} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
                          <div style={{
                            height:44, background:HIST_BG_FILTER,
                            borderBottom:`1px solid ${HIST_BORDER_HEADER}`,
                            display:'flex', alignItems:'center', padding:'0 16px',
                            fontFamily:CP_F, fontWeight:500, fontSize:12, lineHeight:'18px', color:HIST_TEXT_MUTED,
                          }}>{h}</div>
                          {order.items.map((it, i) => {
                            const pkgLabel = PKG[it.packaging]?.label || it.packaging;
                            const unit = PKG[it.packaging]?.unit || '';
                            const value = colIdx === 0 ? it.product
                                        : colIdx === 1 ? pkgLabel
                                        : colIdx === 2 ? `${it.qty} ${unit}`.trim()
                                        : (it.frozen ? (it.frozenComment ? `Да · ${it.frozenComment}` : 'Да') : 'Нет');
                            return (
                              <div key={i} className="cp-hist-cell" style={{
                                background: cellBgFor(i),
                                borderBottom:`1px solid ${i % 2 === 0 ? HIST_BORDER_TABLE : HIST_BORDER_DIVIDER}`,
                                display:'flex', alignItems:'center', padding:'16px',
                                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_PRIMARY,
                                minWidth:0,
                              }}>
                                <span style={{ minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block', width:'100%' }}>{value}</span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    {order.comment && (
                      <div style={{
                        padding:'16px 24px', background:HIST_BG_FILTER,
                        fontFamily:CP_F, fontSize:14, lineHeight:'20px', color:HIST_TEXT_PRIMARY,
                        borderTop:`1px solid ${HIST_BORDER_TABLE}`,
                      }}>
                        <b style={{ color:HIST_TEXT_PRIMARY }}>Комментарий:</b> {order.comment}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length > 0 && pageCount > 1 && (
          <div className="cp-hist-pagination" style={{
            borderTop:`1px solid ${HIST_BORDER_DIVIDER}`,
            paddingTop:20,
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:20,
            fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_MUTED,
          }}>
            <button type="button" className="cp-hist-pagi-prev"
              onClick={()=> safePage > 1 && setCurrentPage(safePage - 1)}
              disabled={safePage <= 1}
              style={{
                background:'none', border:'none', padding:0,
                cursor: safePage > 1 ? 'pointer' : 'default',
                display:'inline-flex', alignItems:'center', gap:8,
                color: safePage > 1 ? HIST_TEXT_PRIMARY : HIST_TEXT_LIGHT,
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
              }}>
              <span style={{ display:'inline-flex' }}>{CpIco.arrowLeft}</span>
              <span className="cp-hist-pagi-label">Предыдущая</span>
            </button>

            <div className="cp-hist-pagi-numbers" style={{ display:'flex', alignItems:'flex-start', gap:2 }}>
              {pageNumbers.map((n, i) => {
                const active = n === safePage;
                const isNum = typeof n === 'number';
                return (
                  <div key={i}
                    onClick={()=> isNum && setCurrentPage(n)}
                    style={{
                      width:40, height:40, borderRadius:20,
                      background: active ? HIST_BG_FILTER : 'transparent',
                      color: active ? HIST_NUM_TXT : HIST_TEXT_MUTED,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor: isNum ? 'pointer' : 'default',
                      fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
                    }}>{n}</div>
                );
              })}
            </div>

            <div className="cp-hist-pagi-info" style={{
              display:'none', fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_PRIMARY,
            }}>Страница {safePage} из {pageCount}</div>

            <button type="button" className="cp-hist-pagi-next"
              onClick={()=> safePage < pageCount && setCurrentPage(safePage + 1)}
              disabled={safePage >= pageCount}
              style={{
                background:'none', border:'none', padding:0,
                cursor: safePage < pageCount ? 'pointer' : 'default',
                display:'inline-flex', alignItems:'center', gap:8,
                color: safePage < pageCount ? HIST_TEXT_PRIMARY : HIST_TEXT_LIGHT,
                fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
              }}>
              <span className="cp-hist-pagi-label">Следующая</span>
              <span style={{ display:'inline-flex' }}>{CpIco.arrowRight}</span>
            </button>
          </div>
        )}
      </div>
    </CpLayout>
  );
}

/* ─────────────  404  ───────────── */
function Lp404({ onBack, onHome }) {
  return (
    <div className="lp404-section" style={{
      width:'100%', minHeight:'100vh', position:'relative',
      backgroundColor:'#fbf9f1',
      display:'flex', flexDirection:'column', alignItems:'flex-start',
      padding:'64px 0px', boxSizing:'border-box', gap:64,
      textAlign:'left', fontSize:16, color:'#191414', fontFamily:CP_F,
    }}>
      <style>{`
        @media (min-width:480px) and (max-width:1024px) {
          .lp404-actions { flex-direction:row !important; align-items:center !important; }
          .lp404-actions .lp404-btn { align-self:auto !important; flex:0 0 auto !important; }
          .lp404-actions .lp404-btn-back { order:1 !important; }
          .lp404-actions .lp404-btn-home { order:2 !important; }
          .lp404-illustration { justify-content:center !important; }
        }
        @media (min-width:1025px) {
          .lp404-section {
            flex-direction:row !important; align-items:center !important;
            justify-content:center !important; gap:64px !important;
            padding:96px 64px !important;
          }
          .lp404-content-wrap {
            flex:0 1 560px !important; align-self:center !important; padding:0 !important;
          }
          .lp404-illustration {
            flex:0 1 560px !important; align-self:center !important;
            padding:0 !important; justify-content:center !important; align-items:center !important;
          }
          .lp404-illustration img { height:360px !important; }
          .lp404-h1 { font-size:48px !important; line-height:60px !important; }
          .lp404-support { font-size:20px !important; line-height:30px !important; }
          .lp404-actions { flex-direction:row !important; align-items:center !important; }
          .lp404-actions .lp404-btn { align-self:auto !important; flex:0 0 auto !important; }
          .lp404-actions .lp404-btn-back { order:1 !important; }
          .lp404-actions .lp404-btn-home { order:2 !important; }
        }
      `}</style>
      <div className="lp404-content-wrap" style={{ alignSelf:'stretch', display:'flex', alignItems:'flex-start', padding:'0px 16px' }}>
        <div style={{
          alignSelf:'stretch', flex:1, display:'flex', flexDirection:'column',
          alignItems:'flex-start', gap:32,
        }}>
          <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:16 }}>
            <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:12 }}>
              <div className="lp404-sub" style={{ alignSelf:'stretch', position:'relative', lineHeight:'24px', fontWeight:600 }}>404</div>
              <h1 className="lp404-h1" style={{
                alignSelf:'stretch', position:'relative', margin:0,
                fontSize:36, letterSpacing:'-0.02em', lineHeight:'44px', fontWeight:600,
                fontFamily:CP_F, color:'#191414',
              }}>Что-то не так...</h1>
            </div>
            <div className="lp404-support" style={{ alignSelf:'stretch', position:'relative', fontSize:18, lineHeight:'28px', color:'#676262' }}>
              Страница, которую вы ищете, не найдена
            </div>
          </div>

          <div className="lp404-actions" style={{
            alignSelf:'stretch', display:'flex', flexDirection:'column',
            alignItems:'flex-start', gap:12, color:'#fff',
          }}>
            <button type="button" onClick={onHome} className="lp404-btn lp404-btn-home" style={{
              alignSelf:'stretch', boxShadow:'0px 1px 2px rgba(16, 24, 40, 0.05)',
              borderRadius:8, backgroundColor:'#b67e40', border:'1px solid #b67e40',
              overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
              padding:'10px 18px', cursor:'pointer', fontFamily:CP_F,
            }}>
              <div style={{ position:'relative', lineHeight:'24px', fontWeight:600, color:'#fff', whiteSpace:'nowrap' }}>На главную</div>
            </button>
            <button type="button" onClick={onBack} className="lp404-btn lp404-btn-back" style={{
              alignSelf:'stretch', borderRadius:8, backgroundColor:'#f5f0df',
              border:'1px solid #fbf9f1', overflow:'hidden', display:'flex',
              alignItems:'center', justifyContent:'center', padding:'10px 18px', gap:8,
              color:'#986338', cursor:'pointer', fontFamily:CP_F,
            }}>
              <span style={{ height:20, width:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </span>
              <div style={{ position:'relative', lineHeight:'24px', fontWeight:600, whiteSpace:'nowrap' }}>Назад</div>
            </button>
          </div>
        </div>
      </div>

      <div className="lp404-illustration" style={{ alignSelf:'stretch', display:'flex', alignItems:'flex-start', padding:'0px 16px' }}>
        <img src="/assets/404-chicks.png" alt="" style={{
          height:280, flex:1, position:'relative', maxWidth:'100%',
          overflow:'hidden', objectFit:'contain', mixBlendMode:'darken',
        }}/>
      </div>
    </div>
  );
}

export { LpClientLogin, LpClientBanner, LpOrderForm, LpOrderConfirmed, LpClientLineItem, LpHistRangeCalendar, LpOrderHistory, Lp404 };
