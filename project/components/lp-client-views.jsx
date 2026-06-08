/* ───────────────────────────────────────────────────────────
   Клиентские экраны — переписаны по дизайну из .fig
   Untitled-UI (gray + purple) + warm сайдбар бренда Лычкиных
   Логика заказов и стейт неизменны — только визуал.
   ─────────────────────────────────────────────────────────── */
const { useState: useStateCl, useEffect: useEffectCl, useMemo: useMemoCl } = React;

/* ─────────────  LOGIN  ─────────────
   Двухколоночный layout по Figma:
   • Левая колонка — форма на CP_CREAM, центрирована, контент 304px
   • Правая колонка — фото (chick) с border-radius: 80px 0 0 80px
   • ≤960px — только форма, фото скрыто
*/
function LpClientLogin({ onLogin, onAdmin }) {
  const [login, setLogin] = useStateCl('');
  const [pw, setPw] = useStateCl('');
  const [err, setErr] = useStateCl('');

  const submit = e => {
    e.preventDefault();
    const cps = getCounterparties();
    const found = cps.find(c => c.login === login.trim() && c.password === pw);
    if (!found) { setErr('Неверный логин или пароль'); return; }
    saveClient({ id: found.id });
    onLogin(found);
  };

  const inputStyle = {
    width:'100%', boxSizing:'border-box',
    padding:'10px 14px', height:44,
    fontFamily:CP_F, fontSize:14, lineHeight:'20px',
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
          }}>Вход в личный кабинет</h1>
          <p style={{
            fontFamily:CP_F, fontSize:14, lineHeight:'20px',
            color:CP_TEXT_MUTED, margin:'0 0 32px',
          }}>
            Введите логин и пароль, которые вам предоставил менеджер
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
              <input
                id="cp-login-pw"
                className="cp-login-input"
                type="password"
                value={pw}
                onChange={e=>{ setPw(e.target.value); setErr(''); }}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
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
              style={{
                width:'100%', height:44, padding:'10px 16px',
                background:'#B68B4A', border:'1px solid #B68B4A', borderRadius:8,
                fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                color:'#fff', cursor:'pointer',
                boxShadow:CP_SHADOW_XS,
                transition:'background .15s ease',
              }}>
              Войти
            </button>
          </form>

          <div style={{
            marginTop:20, textAlign:'center',
            fontFamily:CP_F, fontSize:14, lineHeight:'20px',
            color:CP_TEXT_MUTED,
          }}>
            Для сотрудников{' '}
            <span
              className="cp-login-link"
              onClick={onAdmin}
              style={{
                color:'#B68B4A', fontWeight:600,
                cursor:'pointer', textDecoration:'none',
              }}>
              Панель менеджера
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — photo (border-radius:80px 0 0 80px), full-bleed без отступов */}
      <div className="cp-login-photo" style={{
        flex:1, minWidth:0,
        display:'flex', alignSelf:'stretch',
      }}>
        <img
          src="assets/login-chick.png"
          alt=""
          className="section-icon"
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

/* ─────────────  ORDER FORM  ─────────────
   Layout: 1148px main, banner 1084 (32px gutters),
   main column flex:1 + 292px sidebar, gap 32; внутренний контент колонки 760px.
   Все значения по Figma — без интерпретации.
   ─────────────────────────────────────────  */
function LpOrderForm({ counterparty, onHistory, onLogout }) {
  const banner = getBanner();

  const mkItem = () => ({ uid:genId(), product:'', packaging:'yasik', qty:'1', frozen:false, frozenComment:'' });
  const [shipDate, setShipDate] = useStateCl(() => isoDate(firstShipmentFrom()));
  const [deliveryType, setDeliveryType] = useStateCl(null); /* «Не выбрано» до клика */
  const [items, setItems] = useStateCl([mkItem()]);
  const [comment, setComment] = useStateCl('');
  const [showCal, setShowCal] = useStateCl(false);
  const [done, setDone] = useStateCl(null);

  const minDate = firstShipmentFrom();
  const addr = counterparty.address || '';
  const handleChange = (idx, ni) => setItems(p=>p.map((it,i)=>i===idx?ni:it));
  const handleRemove = idx => setItems(p=>p.filter((_,i)=>i!==idx));

  const submit = () => {
    if (!deliveryType) { alert('Выберите способ получения'); return; }
    if (items.some(it => !it.product || !it.qty || Number(it.qty) <= 0)) {
      alert('Заполните все позиции');
      return;
    }
    const id = genId();
    addOrder({
      id, clientId: counterparty.id, clientName: counterparty.name,
      deliveryAddress: addr,
      deliveryType, shipmentDate: shipDate,
      createdAt: new Date().toISOString(),
      items: items.map(it => ({
        product: it.product, packaging: it.packaging, qty: it.qty,
        frozen: !!it.frozen, frozenComment: it.frozenComment || '',
      })),
      comment, status: 'pending',
    });
    setDone({ id, address: addr, shipmentDate: shipDate });
  };

  const reset = () => {
    setItems([mkItem()]); setComment(''); setDone(null);
    setDeliveryType(null); setShipDate(isoDate(firstShipmentFrom()));
  };

  const myOrdersCount = useMemoCl(() =>
    getOrders().filter(o => o.clientId === counterparty.id || o.clientName === counterparty.name).length
  , [counterparty, done]);

  /* Итог: считаем только заполненные позиции — как в макете (0, 1, 2…) */
  const filledCount = items.filter(it => it.product && Number(it.qty) > 0).length;
  const deliveryLabel = deliveryType === 'pickup' ? 'Самовывоз' : deliveryType === 'delivery' ? 'Доставка' : 'Не выбрано';

  return (
    <CpLayout active="form" onNav={k=> k==='history' && onHistory()} counterparty={counterparty} onLogout={onLogout} ordersCount={myOrdersCount}>
      <div data-screen-label="01 Новая заявка" style={{
        width:'100%', maxWidth:1148, margin:'0 auto',
        padding:'32px 0 48px',
        display:'flex', flexDirection:'column', gap:32,
        borderRadius:'40px 0 0 0', background:'#fff',
      }}>
        {/* BANNER — внутри 32px паддинга; ≤640px — 16px (см. @media в Order System.html) */}
        <div className="cp-banner-wrap" style={{ padding:'0 32px' }}>
          <LpClientBanner banner={banner}/>
        </div>

        {/* CONTAINER — форма + правая колонка; ≤640px — стек по вертикали */}
        <div className="cp-form-container" style={{ display:'flex', alignItems:'flex-start', padding:'0 32px', gap:32 }}>

          {/* MAIN COLUMN — flex:1, внутренний контент 760px */}
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', alignItems:'flex-start', gap:20 }}>
            <h1 style={{
              fontFamily:CP_F, fontWeight:600, fontSize:30, lineHeight:'38px',
              color:CP_GRAY_900, letterSpacing:'-0.01em',
            }}>Новая заявка</h1>

            {/* Позиции заказа — gap 32 (.order-position-item-parent) */}
            <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', gap:32 }}>
              {items.map((it, idx) => (
                <LpClientLineItem key={it.uid} item={it} idx={idx} total={items.length}
                  onChange={handleChange} onRemove={handleRemove}/>
              ))}
            </div>

            {/* «Добавить позицию» + divider (.content-divider width 760) */}
            <div className="content-divider" style={{ width:760, maxWidth:'100%', display:'flex', alignItems:'center', gap:8 }}>
              <button type="button" onClick={()=>setItems(p=>[...p, mkItem()])}
                style={{
                  padding:'10px 16px',
                  background:CP_CREAM, border:`1px solid ${CP_CREAM}`, borderRadius:8,
                  display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                  fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                  color:CP_BEIGE_300, cursor:'pointer', whiteSpace:'nowrap',
                }}>
                <span style={{ width:20, height:20, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{CpIco.plus}</span>
                Добавить позицию
              </button>
              <div style={{ height:1, flex:1, background:CP_BORDER_LIGHT }}/>
            </div>

            {/* Доставка + дата (.content-parent width 760, gap 32; при ≤1280 — width:auto, остаётся горизонтальной по Figma) */}
            <div className="content-parent" style={{ width:760, maxWidth:'100%', alignSelf:'stretch', display:'flex', alignItems:'flex-start', gap:32 }}>
              {/* Способ получения */}
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

              {/* Дата отгрузки */}
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

            {/* Комментарий (.content13 width 760) */}
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

          {/* RIGHT COLUMN — 292px, отступ сверху 58px от верха контейнера; ≤640px — full-width под формой */}
          <aside className="cp-order-summary" style={{ width:292, flexShrink:0, paddingTop:58, position:'sticky', top:32, display:'flex', flexDirection:'column', gap:12 }}>
            {/* Карточка-итог */}
            <div style={{
              alignSelf:'stretch',
              background:'#fff', border:`1px solid ${CP_BORDER_LIGHT}`, borderRadius:12,
              boxShadow:CP_SHADOW_CARD, overflow:'hidden',
            }}>
              <div style={{
                padding:20, display:'flex', flexDirection:'column', alignItems:'center', gap:24,
                background:'#fff', borderRadius:8,
              }}>
                {/* «Оформить заявку» — ghost cream */}
                <button type="button" onClick={submit}
                  style={{
                    alignSelf:'stretch', padding:'10px 16px',
                    background:CP_CREAM, border:`1px solid ${CP_CREAM}`, borderRadius:8,
                    fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                    color:CP_BEIGE_300, cursor:'pointer', textAlign:'center',
                  }}>
                  Оформить заявку
                </button>

                {/* Итог заказа */}
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

            {/* Alert: 15:00 cutoff (.alert) */}
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

/* Confirmation modal (Untitled-UI success modal) */
function LpOrderConfirmed({ done, onReset, onHistory }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:300,
      background:'rgba(52,64,84,0.40)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:CP_F,
    }}>
      <div style={{
        background:'#fff', borderRadius:12, boxShadow:CP_SHADOW_MOD,
        width:'100%', maxWidth:480, padding:24,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div style={{
            width:48, height:48, borderRadius:'50%',
            background:CP_SUCCESS_BG, border:'8px solid #D1FADF',
            color:CP_SUCCESS, display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>{CpIco.check}</div>
        </div>
        <div style={{ fontFamily:CP_FD, fontWeight:700, fontSize:18, lineHeight:'28px', color:CP_GRAY_900, marginBottom:8 }}>
          Заявка №{done.id} принята
        </div>
        <div style={{ fontSize:14, lineHeight:'20px', color:CP_TEXT_MUTED, marginBottom:24 }}>
          {done.address ? <>Адрес: {done.address}<br/></> : null}
          Отгрузка — <b style={{ color:CP_GRAY_700 }}>{fmtLong(parseISO(done.shipmentDate))}</b>. Менеджер свяжется с вами, когда заявка будет подтверждена.
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <CpButton kind="secondary" onClick={onHistory} style={{ flex:1, height:44 }}>В историю</CpButton>
          <CpButton kind="primary"   onClick={onReset}   style={{ flex:1, height:44 }}>Новая заявка</CpButton>
        </div>
      </div>
    </div>
  );
}

/* Позиция заказа — без карточки, в один ряд по Figma:
   [Продукт] [Тара] [− qty +] [🗑]
   + второй ряд: [✓] Замороженное  (?)
*/
function LpClientLineItem({ item, idx, total, onChange, onRemove }) {
  const pkg = PKG[item.packaging] || {};
  const unit = pkg.unit || '';
  const isKg = pkg.type === 'kg';
  const step = pkg.step || 1;

  const productOptions = PRODUCTS.map(p => p.name);

  const dec = () => {
    if (isKg) {
      const v = Math.max(0.1, (parseFloat(item.qty||'0') - 0.5));
      onChange(idx, { ...item, qty: String(+v.toFixed(1)) });
    } else {
      const cur = parseInt(item.qty||String(step), 10) || step;
      onChange(idx, { ...item, qty: String(Math.max(step, cur - step)) });
    }
  };
  const inc = () => {
    if (isKg) {
      const v = (parseFloat(item.qty||'0') + 0.5);
      onChange(idx, { ...item, qty: String(+v.toFixed(1)) });
    } else {
      const cur = parseInt(item.qty||String(step), 10) || step;
      onChange(idx, { ...item, qty: String(cur + step) });
    }
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
    <div style={{ alignSelf:'stretch', display:'flex', flexDirection:'column', gap:16 }}>
      {/* Row 1: Продукт / Тара / qty stepper / delete
         ≤1280px: Продукт сверху, (Тара + stepper) снизу — за счёт .input-dropdown-parent
                  (см. @media в Order System.html). Delete остаётся справа, центрирован.   */}
      <div className="frame-parent" style={{ alignSelf:'stretch', display:'flex', alignItems:'center', gap:16 }}>
        <div className="input-dropdown-parent" style={{
          flex:1, minWidth:0, display:'flex', flexDirection:'row', alignItems:'center', gap:12,
        }}>
          {/* Продукт */}
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
            <select value={item.product} onChange={e=>onChange(idx, { ...item, product:e.target.value })}
              style={buildSelectStyle(!!item.product)}>
              <option value="">Продукт</option>
              {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {/* Тара + Stepper (.input-dropdown-group) */}
          <div className="input-dropdown-group" style={{
            flex:1, minWidth:0, display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
              <select value={item.packaging} onChange={e=>onChange(idx, { ...item, packaging:e.target.value, qty: PKG[e.target.value]?.step ? String(PKG[e.target.value].step) : '1' })}
                style={buildSelectStyle(!!item.packaging)}>
                <option value="">Тара</option>
                {Object.entries(PKG).map(([k,v]) => <option key={k} value={k}>{v.label}{v.hint ? ` ${v.hint}`:''}</option>)}
              </select>
            </div>
            {/* Stepper (.button-group) */}
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
          </div>
        </div>
        {/* Delete — прячется при 1 позиции (opacity:0 как в Figma .button3) */}
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

      {/* Row 2: Чекбокс «Замороженное» + help */}
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
          <span title="Замороженные позиции могут отгружаться дольше"
            style={{ width:16, height:16, color:CP_TEXT_TERTIARY, display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'help', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </span>
        </div>
        {item.frozen && (
          <input
            type="text"
            value={item.frozenComment}
            onChange={e=>onChange(idx, { ...item, frozenComment:e.target.value })}
            placeholder="Комментарий (необязательно)"
            style={{
              flex:'0 1 360px', height:32, padding:'4px 12px', marginLeft:12,
              fontFamily:CP_F, fontSize:13, color:CP_TEXT_SECONDARY,
              border:`1px solid ${CP_BORDER_INPUT}`, borderRadius:6, outline:'none', background:'#fff',
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ─────────────  ORDER HISTORY  ───────────── */
function LpOrderHistory({ counterparty, onBack, onLogout }) {
  const allOrders = useMemoCl(()=> getOrders().filter(o => o.clientId === counterparty.id || o.clientName === counterparty.name), [counterparty]);
  const [query, setQuery] = useStateCl('');
  const [productFilter, setProductFilter] = useStateCl('');
  const [expanded, setExpanded] = useStateCl(new Set([allOrders[1]?.id].filter(Boolean)));

  const productOptions = useMemoCl(()=>{
    const s = new Set();
    allOrders.forEach(o => o.items.forEach(it => s.add(it.product)));
    return [...s].sort();
  }, [allOrders]);

  const filtered = useMemoCl(()=>{
    const q = query.trim().toLowerCase();
    return allOrders.filter(o => {
      if (q && !o.id.toLowerCase().includes(q)) return false;
      if (productFilter && !o.items.some(it => it.product === productFilter)) return false;
      return true;
    });
  }, [allOrders, query, productFilter]);

  const myOrdersCount = allOrders.length;

  const toggleExpand = id => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => { setQuery(''); setProductFilter(''); };

  /* ── Точные токены страницы (Figma): не интерпретировать ── */
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

  /* ── Подложка ячеек в таблице: чередуем по СТРОКЕ (1,3 — серая; 2,4 — белая)
       — точно как в Figma (table-cell / table-cell2) ── */
  const cellBgFor = (rowIdx) => rowIdx % 2 === 0 ? '#FFFFFF' : HIST_BG_FILTER;

  return (
    <CpLayout active="history" onNav={k=> k==='form' && onBack()} counterparty={counterparty} onLogout={onLogout || onBack} ordersCount={myOrdersCount}>
      <div className="cp-hist-page" style={{ width:'100%', maxWidth:1148, margin:'0 auto', padding:'32px 32px 48px', display:'flex', flexDirection:'column', gap:32 }}>

        {/* Page title */}
        <h1 className="cp-hist-title" style={{
          fontFamily:CP_FD, fontWeight:600, fontSize:30, lineHeight:'38px',
          color:CP_GRAY_900, letterSpacing:'-0.01em',
        }}>История заказов</h1>

        {/* Filter row — Figma: bg #F9F8F8, radius 12, padding 20, gap 12, без border/shadow.
             Адаптив 1280: четыре элемента остаются в одной строке — flex-basis 0 → распределяются поровну. */}
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

          <div className="cp-hist-filter" style={{ flex:'1 1 160px', minWidth:0, display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_SECONDARY }}>Период</div>
            <div style={{
              display:'flex', alignItems:'center', gap:8, cursor:'pointer',
              background:'#fff', border:`1px solid ${HIST_BORDER_INPUT}`, borderRadius:8,
              padding:'10px 14px', boxShadow:HIST_SHADOW_INPUT,
            }}>
              <span style={{ color:HIST_TEXT_TERTIARY, display:'flex' }}>{CpIco.calendar}</span>
              <span style={{ flex:1, fontFamily:CP_F, fontSize:16, lineHeight:'24px', color:HIST_TEXT_TERTIARY }}>Выбрать период</span>
            </div>
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
              color: (query || productFilter) ? HIST_TEXT_PRIMARY : HIST_TEXT_DISABLED,
              cursor: (query || productFilter) ? 'pointer' : 'default',
            }}>Очистить</button>
        </div>

        {/* Orders list */}
        <div className="cp-hist-orders" style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {filtered.length === 0 && (
            <div style={{
              background:'#fff', border:`1px solid ${HIST_BORDER_CARD}`, borderRadius:16,
              padding:'48px 24px', textAlign:'center', color:HIST_TEXT_TERTIARY, fontFamily:CP_F, fontSize:16,
            }}>
              Заказов не найдено
            </div>
          )}
          {filtered.map(order => {
            const open = expanded.has(order.id);
            const deliveryLabel = order.deliveryType === 'pickup' ? 'самовывоз' : 'доставка';
            return (
              <div key={order.id} style={{
                background:'#fff', border:`1px solid ${HIST_BORDER_CARD}`, borderRadius:16,
                overflow:'hidden',
              }}>
                {/* Шапка карточки */}
                <div style={{ padding:16, display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20 }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1, minWidth:0 }}>
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
                      <button type="button" onClick={()=>toggleExpand(order.id)}
                        style={{
                          alignSelf:'flex-start', background:'none', border:'none', cursor:'pointer',
                          color:HIST_DETAIL_COLOR, fontFamily:CP_F, fontWeight:600, fontSize:14, lineHeight:'20px',
                          padding:0, display:'inline-flex', alignItems:'center', gap:8, marginTop:0,
                        }}>
                        Подробнее
                        <span style={{ display:'inline-flex' }}>{open ? CpIco.chevUp : CpIco.chevDown}</span>
                      </button>
                    </div>
                  </div>
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
                          {/* Header */}
                          <div style={{
                            height:44, background:HIST_BG_FILTER,
                            borderBottom:`1px solid ${HIST_BORDER_HEADER}`,
                            display:'flex', alignItems:'center', padding:'16px 24px',
                            fontFamily:CP_F, fontWeight:500, fontSize:12, lineHeight:'18px', color:HIST_TEXT_MUTED,
                          }}>{h}</div>
                          {/* Rows (zebra по строке) */}
                          {order.items.map((it, i) => {
                            const pkgLabel = PKG[it.packaging]?.label || it.packaging;
                            const unit = PKG[it.packaging]?.unit || '';
                            const value = colIdx === 0 ? it.product
                                        : colIdx === 1 ? pkgLabel
                                        : colIdx === 2 ? `${it.qty} ${unit}`.trim()
                                        : (it.frozen ? (it.frozenComment ? `Да · ${it.frozenComment}` : 'Да') : 'Нет');
                            return (
                              <div key={i} className="cp-hist-cell" style={{
                                height:72,
                                background: cellBgFor(i),
                                borderBottom:`1px solid ${i % 2 === 0 ? HIST_BORDER_TABLE : HIST_BORDER_DIVIDER}`,
                                display:'flex', alignItems:'center', padding:'16px 24px',
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

        {/* Pagination — Figma */}
        {filtered.length > 0 && (
          <div className="cp-hist-pagination" style={{
            borderTop:`1px solid ${HIST_BORDER_DIVIDER}`,
            paddingTop:20,
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:20,
            fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_MUTED,
          }}>
            <button type="button" className="cp-hist-pagi-prev"
              style={{
                background:'none', border:'none', padding:0, cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:8,
                color:HIST_TEXT_LIGHT, fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
              }}>
              <span style={{ display:'inline-flex' }}>{CpIco.arrowLeft}</span>
              <span className="cp-hist-pagi-label">Предыдущая</span>
            </button>

            <div className="cp-hist-pagi-numbers" style={{ display:'flex', alignItems:'flex-start', gap:2 }}>
              {[1,2,3,'...',8,9,10].map((n, i) => {
                const active = n === 1;
                return (
                  <div key={i} style={{
                    width:40, height:40, borderRadius:20,
                    background: active ? HIST_BG_FILTER : 'transparent',
                    color: active ? HIST_NUM_TXT : HIST_TEXT_MUTED,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: typeof n === 'number' ? 'pointer' : 'default',
                    fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
                  }}>{n}</div>
                );
              })}
            </div>

            <div className="cp-hist-pagi-info" style={{
              display:'none', fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px', color:HIST_TEXT_PRIMARY,
            }}>Страница 1 из 10</div>

            <button type="button" className="cp-hist-pagi-next"
              style={{
                background:'none', border:'none', padding:0, cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:8,
                color:HIST_TEXT_PRIMARY, fontFamily:CP_F, fontWeight:500, fontSize:14, lineHeight:'20px',
              }}>
              <span className="cp-hist-pagi-label">Следущая</span>
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
    <div style={{
      minHeight:'100vh', background:CP_CREAM, fontFamily:CP_F,
      display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px 32px',
    }}>
      <div style={{ maxWidth:720, margin:'0 auto', width:'100%' }}>
        <div style={{ fontFamily:CP_F, fontWeight:600, fontSize:14, letterSpacing:'0.02em', color:CP_GRAY_700, marginBottom:16 }}>404</div>
        <h1 style={{
          fontFamily:CP_FD, fontWeight:700, fontSize:72, lineHeight:'80px',
          color:'#0E1B2C', letterSpacing:'-0.02em', marginBottom:24,
        }}>Что-то не так…</h1>
        <p style={{ fontSize:18, lineHeight:'28px', color:CP_GRAY_600, marginBottom:40 }}>
          Страница, которую вы ищете, не найдена
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <CpButton kind="purpleSoft" icon={CpIco.arrowLeft} onClick={onBack}>Назад</CpButton>
          <CpButton kind="primary" onClick={onHome}>На главную</CpButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LpClientLogin, LpClientBanner, LpOrderForm, LpOrderHistory, LpOrderConfirmed, Lp404 });
