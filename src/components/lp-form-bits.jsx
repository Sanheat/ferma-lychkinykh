import React from 'react';
import {
  CRD, BRD, FG2, FG3, FD, FB, FL, DRK, BR, NAT, PKG, PRODUCTS,
  parseISO, isWeekday, sameDay, isoDate, RU_MONTHS, fmtLong, inp, lbl,
} from './lp-data';

const { useState: useStateC } = React;

/* ── CALENDAR WIDGET ── */
export function LpCalendar({ value, minDate, onChange }) {
  const sel = value ? parseISO(value) : null;
  const [view, setView] = useStateC(() => {
    const base = sel || minDate || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const goPrev = () => setView(new Date(view.getFullYear(), view.getMonth()-1, 1));
  const goNext = () => setView(new Date(view.getFullYear(), view.getMonth()+1, 1));

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // monday-first
  const daysInMonth = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
  const cells = [];
  for (let i=0; i<offset; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const min = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null;
  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <div style={{ background:CRD, border:`1.5px solid ${BRD}`, borderRadius:12, padding:14, width:300, fontFamily:FB }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <button type="button" onClick={goPrev} style={{ background:'none', border:'none', fontSize:18, color:FG2, padding:'4px 8px' }}>‹</button>
        <div style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:DRK }}>
          {RU_MONTHS[view.getMonth()][0].toUpperCase()+RU_MONTHS[view.getMonth()].slice(1)} {view.getFullYear()}
        </div>
        <button type="button" onClick={goNext} style={{ background:'none', border:'none', fontSize:18, color:FG2, padding:'4px 8px' }}>›</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w=>(
          <div key={w} style={{ fontFamily:FL, fontWeight:700, fontSize:10, letterSpacing:'.05em', color:FG3, textAlign:'center', padding:'4px 0' }}>{w}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} style={{ height:32 }}/>;
          const dis = !isWeekday(c) || (min && c < min);
          const isSel = sel && sameDay(c, sel);
          const isToday = sameDay(c, today);
          return (
            <button
              key={i} type="button" disabled={dis}
              onClick={()=>onChange(isoDate(c))}
              style={{
                height:32, borderRadius:8, border:'none', cursor: dis?'not-allowed':'pointer',
                fontFamily:FB, fontSize:13, fontWeight: isSel?700:500,
                background: isSel ? BR : (isToday ? '#fef0ed' : 'transparent'),
                color: dis ? '#d4c5b3' : (isSel ? 'white' : DRK),
                opacity: dis ? .5 : 1,
              }}
            >{c.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ── DEADLINE BANNER (compact) ── */
export function LpDeadlineHint({ shipDate }) {
  const ship = parseISO(shipDate);
  return (
    <div style={{ background:'#f2f7f3', border:`1.5px solid ${NAT}`, borderRadius:10, padding:'10px 14px', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
      <div style={{ fontFamily:FL, fontWeight:700, fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:'#384e3e' }}>Отгрузка</div>
      <div style={{ fontFamily:FD, fontWeight:700, fontSize:15, color:DRK }}>{fmtLong(ship)}</div>
      <div style={{ flex:1 }}/>
      <div style={{ fontFamily:FB, fontSize:11, color:FG3 }}>
        Заявки до 15:00 → отгрузка через 2 рабочих дня
      </div>
    </div>
  );
}

/* ── QUANTITY FIELD ── */
export function LpQtyField({ pkgId, value, onChange }) {
  const p = PKG[pkgId];
  if (p.type === 'kg') {
    return (
      <input
        style={{ ...inp, fontSize:13, padding:'8px 10px', textAlign:'center' }}
        type="number" min="0.1" step="0.1" placeholder="кг"
        value={value} onChange={e=>onChange(e.target.value)}
      />
    );
  }
  const step = p.step || 1;
  let count = parseInt(value||String(step), 10) || step;
  if (step > 1 && count % step !== 0) count = Math.max(step, Math.round(count/step)*step);

  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, border:`1.5px solid ${BRD}`, borderRadius:8, overflow:'hidden', background:CRD, height:38 }}>
      <button type="button" onClick={()=>onChange(String(Math.max(step, count-step)))}
        style={{ width:34, flexShrink:0, background:'none', border:'none', borderRight:`1px solid ${BRD}`, fontFamily:FL, fontWeight:800, fontSize:16, color:FG2, height:'100%' }}>−</button>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:4, fontFamily:FB, fontSize:13, color:DRK, fontWeight:700 }}>
        {count}<span style={{ fontFamily:FL, fontSize:10, fontWeight:700, color:FG3 }}>{p.unit}</span>
        {step > 1 && <span style={{ fontFamily:FL, fontSize:9, color:FG3, marginLeft:2 }}>×{step}</span>}
      </div>
      <button type="button" onClick={()=>onChange(String(count+step))}
        style={{ width:34, flexShrink:0, background:'none', border:'none', borderLeft:`1px solid ${BRD}`, fontFamily:FL, fontWeight:800, fontSize:16, color:BR, height:'100%' }}>+</button>
    </div>
  );
}

/* ── LINE ITEM ROW ── */
export function LpLineItem({ item, idx, total, onChange, onRemove }) {
  const prod = PRODUCTS.find(p=>p.name===item.product);
  const availPkg = prod ? prod.pkg : ['yasik','paket','lotok'];

  const setProduct = name => {
    const p = PRODUCTS.find(x=>x.name===name);
    const newPkg = p && !p.pkg.includes(item.packaging) ? p.pkg[0] : item.packaging;
    const newQty = PKG[newPkg].type==='counter' ? String(PKG[newPkg].step||1) : '';
    onChange(idx, { ...item, product:name, packaging:newPkg, qty:newQty });
  };
  const setPkg = pkgId => {
    const newQty = PKG[pkgId].type==='counter' ? String(PKG[pkgId].step||1) : '';
    onChange(idx, { ...item, packaging:pkgId, qty:newQty });
  };
  const sel = { ...inp, fontSize:13, padding:'8px 10px' };

  return (
    <div style={{ background:CRD, borderRadius:12, boxShadow:`0 2px 8px rgba(61,43,31,.07)`, marginBottom:10, padding:'14px 16px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 150px 130px 28px', gap:10, alignItems:'end' }}>
        <div>
          <label style={lbl}>Продукт</label>
          <select style={sel} value={item.product} onChange={e=>setProduct(e.target.value)}>
            <option value="">— Выберите позицию —</option>
            {PRODUCTS.map(p=>(<option key={p.name} value={p.name}>{p.name}</option>))}
          </select>
        </div>
        <div>
          <label style={lbl}>Тара</label>
          <select style={sel} value={item.packaging} onChange={e=>setPkg(e.target.value)}>
            {availPkg.map(pid=>(<option key={pid} value={pid}>{PKG[pid].label} ({PKG[pid].note})</option>))}
          </select>
        </div>
        <div>
          <label style={lbl}>{PKG[item.packaging].type==='kg' ? 'Кол-во, кг' : 'Количество'}</label>
          <LpQtyField pkgId={item.packaging} value={item.qty} onChange={v=>onChange(idx,{...item,qty:v})}/>
        </div>
        {total>1
          ? <button type="button" onClick={()=>onRemove(idx)} style={{ background:'none', border:'none', color:FG3, fontSize:20, lineHeight:1, paddingBottom:6 }}>×</button>
          : <div/>}
      </div>
      <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontFamily:FB, fontSize:12, color:FG2, cursor:'pointer' }}>
          <input type="checkbox" checked={!!item.frozen} onChange={e=>onChange(idx,{...item, frozen:e.target.checked, frozenComment: e.target.checked ? item.frozenComment : ''})} style={{ accentColor:BR, width:16, height:16, flexShrink:0 }}/>
          <span style={{ fontWeight:700, color: item.frozen ? '#4a7da8' : FG2 }}>Замороженное</span>
          <span style={{ color:FG3, fontSize:11 }}>(по умолчанию — охлаждённое)</span>
        </label>
        {item.frozen && (
          <input
            style={{ ...inp, fontSize:12, padding:'6px 10px' }}
            placeholder="Комментарий к заморозке (опционально)"
            value={item.frozenComment||''}
            onChange={e=>onChange(idx,{...item, frozenComment:e.target.value})}
          />
        )}
      </div>
    </div>
  );
}
