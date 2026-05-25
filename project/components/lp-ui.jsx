/* ───────────────────────────────────────────────────────────
   Shared UI primitives — Untitled-UI style (Inter + gray + purple)
   Сделано по макетам Figma (.fig)
   Загружается после lp-data.jsx, до остальных view-файлов.
   ─────────────────────────────────────────────────────────── */

/* Tokens */
const CP_F = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const CP_FD = "'Inter Display', 'Inter', system-ui, sans-serif";
const CP_PURPLE = '#7F56D9';
const CP_PURPLE_HOV = '#6941C6';
const CP_PURPLE_RING = 'rgba(127,86,217,0.24)';
const CP_PURPLE_BG = '#F9F5FF';
const CP_PURPLE_TXT = '#5925DC';
const CP_GRAY_900 = '#101828';
const CP_GRAY_800 = '#1D2939';
const CP_GRAY_700 = '#344054';
const CP_GRAY_600 = '#475467';
const CP_GRAY_500 = '#667085';
const CP_GRAY_400 = '#98A2B3';
const CP_GRAY_300 = '#D0D5DD';
const CP_GRAY_200 = '#EAECF0';
const CP_GRAY_100 = '#F2F4F7';
const CP_GRAY_50 = '#F9FAFB';
const CP_TEXT_MUTED = '#676262'; /* подзаголовки */
const CP_TEXT_VALUE = '#514C4B'; /* подписи в деталях */
const CP_ERROR = '#B42318';
const CP_ERROR_BG = '#FEF3F2';
const CP_SUCCESS = '#039855';
const CP_SUCCESS_BG = '#ECFDF3';
const CP_INFO_BG = '#EFF8FF';
const CP_INFO = '#175CD3';
const CP_WARN_BG = '#FFFAEB';
const CP_WARN = '#B54708';
const CP_BANNER_RED = '#C94030'; /* Figma: баннер */
const CP_CREAM = '#FBF9F1'; /* Figma: --bg-beige-50, фон сайдбара */
const CP_CREAM_HOV = '#F5F0DF';
const CP_CREAM_ACT = '#F5F0DF'; /* Figma: --bg-beige-100, активный nav-item */
/* Figma — точные значения, не интерпретировать */
const CP_BORDER_INPUT = '#C6C3C3';
const CP_BORDER_CONTROL = '#ADAAAA';
const CP_BORDER_LIGHT = '#DFDDDD';
const CP_BORDER_DIVIDER = '#ECECEC';
const CP_BORDER_NAV = '#EAECF0';
const CP_BEIGE_300 = '#DDC594';
const CP_BEIGE_500 = '#C4914C';
const CP_BEIGE_600 = '#B67E40';
const CP_TEXT_PRIMARY = '#191414';
const CP_TEXT_SECONDARY = '#514C4B';
const CP_TEXT_TERTIARY = '#7E7979';
const CP_TEXT_ALERT = '#C9953A';
const CP_BEIGE_COD_50 = '#F9F8F8';
const CP_SHADOW_CARD = '0 1px 1.5px rgba(16,24,40,0.10), 0 1px 1px rgba(16,24,40,0.06)';
const CP_SHADOW_XS = '0 1px 2px 0 rgba(16,24,40,0.05)';
const CP_SHADOW_SM = '0 1px 2px 0 rgba(16,24,40,0.06), 0 1px 3px 0 rgba(16,24,40,0.10)';
const CP_SHADOW_MD = '0 4px 8px -2px rgba(16,24,40,0.06), 0 2px 4px -2px rgba(16,24,40,0.04)';
const CP_SHADOW_MOD = '0 8px 8px -4px rgba(16,24,40,0.03), 0 20px 24px -4px rgba(16,24,40,0.08)';

/* Icons — 24×24 stroke, Untitled-UI / Lucide style */
const CpIco = {
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  filter: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4" /></svg>,
  userPlus: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>,
  edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>,
  trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>,
  eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  eyeOff: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a18.55 18.55 0 0 1-2.16 3.19M9.88 9.88a3 3 0 1 0 4.24 4.24M2 2l20 20" /></svg>,
  copy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  arrowLeft: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
  arrowRight: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  chevDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
  chevUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
  minus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>,
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>,
  history: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>,
  help: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.13626 9.13628L4.92893 4.92896M4.92893 19.0711L9.16797 14.8321M14.8611 14.8638L19.0684 19.0711M19.0684 4.92896L14.8287 9.16862" /><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>,
  pin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="3" /></svg>,
  check: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  truck: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>,
  package: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.27 6.96 8.73 5.04 8.73-5.04" /><path d="M12 22V12" /></svg>,
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
};

/* Buttons */
function CpButton({ kind = 'primary', size = 'md', icon, iconRight, children, style, ...rest }) {
  const padding = size === 'lg' ? '12px 20px' : size === 'sm' ? '8px 14px' : '10px 16px';
  const fs = size === 'lg' ? 16 : 14;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: CP_F, fontWeight: 600, fontSize: fs, lineHeight: '20px',
    padding, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
    border: '1px solid transparent', transition: 'background .15s, border-color .15s, color .15s, box-shadow .15s',
    boxShadow: CP_SHADOW_XS
  };
  const variants = {
    primary: { background: CP_PURPLE, color: '#fff', borderColor: CP_PURPLE },
    secondary: { background: '#fff', color: CP_GRAY_700, borderColor: CP_GRAY_300 },
    tertiary: { background: 'transparent', color: CP_GRAY_600, borderColor: 'transparent', boxShadow: 'none' },
    purpleSoft: { background: CP_PURPLE_BG, color: CP_PURPLE, borderColor: 'transparent', boxShadow: 'none' },
    danger: { background: '#fff', color: CP_ERROR, borderColor: CP_GRAY_300 },
    dangerSolid: { background: CP_ERROR, color: '#fff', borderColor: CP_ERROR },
    /* Figma ghost: \u0444\u043e\u043d #FBF9F1, \u0442\u0435\u043a\u0441\u0442 #DDC594, \u0440\u0430\u043c\u043a\u0430 #FBF9F1 */
    ghost: { background: CP_CREAM, color: CP_BEIGE_300, borderColor: CP_CREAM, boxShadow: 'none' }
  };
  return (
    <button {...rest} style={{ ...base, ...variants[kind], ...style }}>
      {icon}{children}{iconRight}
    </button>);

}

function CpIconBtn({ children, title, danger, active, style, ...rest }) {
  return (
    <button {...rest} title={title}
    style={{
      width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: active ? CP_GRAY_50 : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer',
      color: CP_GRAY_500, transition: 'background .15s, color .15s',
      ...style
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = CP_GRAY_50;e.currentTarget.style.color = danger ? CP_ERROR : CP_GRAY_700;}}
    onMouseLeave={(e) => {e.currentTarget.style.background = active ? CP_GRAY_50 : 'transparent';e.currentTarget.style.color = CP_GRAY_500;}}>
      {children}
    </button>);

}

function CpInput({ icon, iconRight, error, style, ...rest }) {
  const ring = error ? '#FDA29B' : CP_PURPLE_RING;
  const focusColor = error ? CP_ERROR : CP_PURPLE;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: CP_GRAY_500, display: 'flex', pointerEvents: 'none' }}>{icon}</span>}
      <input {...rest} style={{
        width: '100%', height: 44,
        padding: icon ? '10px 14px 10px 42px' : iconRight ? '10px 42px 10px 14px' : '10px 14px',
        fontFamily: CP_F, fontSize: 16, lineHeight: '24px', color: CP_GRAY_900,
        background: '#fff', border: `1px solid ${error ? '#FDA29B' : CP_GRAY_300}`, borderRadius: 8,
        outline: 'none', boxShadow: CP_SHADOW_XS, transition: 'border-color .15s, box-shadow .15s',
        ...style
      }}
      onFocus={(e) => {e.target.style.borderColor = focusColor;e.target.style.boxShadow = `${CP_SHADOW_XS}, 0 0 0 4px ${ring}`;}}
      onBlur={(e) => {e.target.style.borderColor = error ? '#FDA29B' : CP_GRAY_300;e.target.style.boxShadow = CP_SHADOW_XS;}} />
      
      {iconRight && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: CP_GRAY_500, display: 'flex' }}>{iconRight}</span>}
    </div>);

}

/* Status badge (Untitled-UI style — pill with dot)
   Цвета точек/текста/фона зафиксированы по Figma — НЕ интерпретировать. */
function CpStatusBadge({ status }) {
  const map = {
    pending:   { label: 'В обработке', color: '#175CD3', bg: '#EFF8FF', dot: '#2E90FA' },
    accepted:  { label: 'Принят',      color: '#027A48', bg: '#ECFDF3', dot: '#12B76A' },
    shipped:   { label: 'Отгружен',    color: '#B54708', bg: '#FFFAEB', dot: '#F79009' },
    archive:   { label: 'В архиве',    color: CP_GRAY_600, bg: CP_GRAY_100, dot: CP_GRAY_400 },
    cancelled: { label: 'Отменён',     color: '#B42318', bg: '#FEF3F2', dot: '#F04438' }
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.color,
      fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px',
      padding: '2px 10px 2px 8px', borderRadius: 16,
      mixBlendMode: 'multiply'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>);

}

/* Лычкины СЕМЬИ stamp seal — official logo asset */
function CpStamp({ size = 204 }) {
  return (
    <img
      src="assets/lychkiny-stamp.svg"
      alt="Крестьянское фермерское хозяйство семьи Лычкиных"
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size }}
      data-comment-anchor="387ab6f405-svg-181-5" />);

}

/* Sidebar navigation — used on every authenticated client screen.
   В адаптиве ≤1024px ведёт себя как drawer (off-canvas слева), управляется
   пропами mobileOpen / onClose. CSS-классы .is-mobile-open / .is-mobile-closed
   переключаются в CpLayout — само позиционирование делает @media в Order System.html. */
function CpSidebar({ active, onNav, counterparty, onLogout, ordersCount, mobileOpen, onClose }) {
  const items = [
  { key: 'form', label: 'Главная', icon: CpIco.home, badge: ordersCount > 0 ? String(ordersCount) : null },
  { key: 'history', label: 'История заказов', icon: CpIco.history, badge: null }];

  return (
    <aside className={`sidebar-navigation${mobileOpen ? ' is-mobile-open' : ''}`} style={{
      width: 312, flexShrink: 0, minHeight: '100vh',
      background: CP_CREAM, borderRight: `1px solid ${CP_GRAY_200}`,
      display: 'flex', flexDirection: 'column', alignItems: 'stretch',
      padding: '32px 16px', gap: 24, fontFamily: CP_F,
      position: 'sticky', top: 0, alignSelf: 'flex-start'
    }}>
      {/* Header */}
      <div style={{ padding: '0 8px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 24, lineHeight: '32px', color: CP_TEXT_PRIMARY }}>
            Ферма Лычкиных
          </div>
          <div style={{ fontFamily: CP_F, fontWeight: 400, fontSize: 14, lineHeight: '20px', color: CP_TEXT_TERTIARY, marginTop: 4 }}>
            Личный кабинет
          </div>
        </div>
        {/* Close — виден только в режиме drawer (≤1024px); скрыт CSS на desktop */}
        <button type="button" onClick={onClose} aria-label="Закрыть меню"
          className="cp-drawer-close"
          style={{
            display: 'none',
            padding: 8, background: 'transparent', border: 'none', borderRadius: 8,
            color: CP_TEXT_PRIMARY, cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
          {CpIco.close}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it) => {
          const on = active === it.key;
          return (
            <button key={it.key} onClick={() => onNav(it.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px', width: '100%', borderRadius: 6,
              background: on ? CP_CREAM_ACT : 'transparent',
              border: 'none', cursor: 'pointer',
              color: CP_TEXT_PRIMARY, fontFamily: CP_F, fontWeight: 600, fontSize: 16, lineHeight: '24px',
              transition: 'background .15s'
            }}
            onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = CP_CREAM_HOV;}}
            onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = 'transparent';}}>
              <span style={{ color: on ? CP_GRAY_900 : CP_GRAY_700, display: 'flex' }}>{it.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
              {it.badge &&
              <span className="badge" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: 22, minWidth: 22, padding: '2px 8px',
                background: '#F2F4F7', color: '#344054',
                borderRadius: 16,
                fontFamily: CP_F, fontSize: 12, fontWeight: 500, lineHeight: '18px'
              }}>{it.badge}</span>
              }
            </button>);

        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Stamp */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
        <CpStamp size={170} />
      </div>

      <div style={{ flex: 1 }} />

      {/* Support link */}
      <button onClick={() => alert('Поддержка: +7 (000) 000-00-00 · ferma@lichkiny.ru')}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 6,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: CP_GRAY_900, fontFamily: CP_F, fontWeight: 500, fontSize: 16, lineHeight: '24px',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {e.currentTarget.style.background = CP_CREAM_HOV;}}
      onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';}}>
        <span style={{ color: CP_GRAY_700, display: 'flex' }}>{CpIco.help}</span>
        <span>Поддержка</span>
      </button>

      {/* Account card */}
      <div style={{
        border: `1px solid ${CP_GRAY_200}`, borderRadius: 8, padding: '16px 12px',
        display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(255,255,255,0.4)'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: CP_GRAY_700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {counterparty?.name || 'Гость'}
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: CP_GRAY_600, marginTop: 2 }}>
            {counterparty?.address || '—'}
          </div>
        </div>
        <CpIconBtn title="Выйти" onClick={onLogout}>{CpIco.logout}</CpIconBtn>
      </div>
    </aside>);

}

/* Generic page-content wrapper to the right of sidebar.
   В адаптиве ≤1024px добавляется верхний бар + drawer-логика для боковой навигации. */
function CpLayout({ active, onNav, counterparty, onLogout, ordersCount, children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    // блокируем фоновый скролл, пока drawer открыт
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);
  const handleNav = (k) => { setMobileOpen(false); onNav(k); };

  return (
    <div className={`cp-layout${mobileOpen ? ' is-mobile-open' : ''}`}
      style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: CP_F }}>

      {/* Mobile top header — виден только ≤1024px (через CSS .cp-mobile-header в Order System.html) */}
      <header className="cp-mobile-header" style={{
        display: 'none',
        alignItems: 'center', gap: 12,
        padding: '16px',
        background: CP_CREAM,
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ flexShrink: 0 }}>
          <CpStamp size={56} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 24, lineHeight: '32px', color: CP_TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Ферма Лычкиных
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: CP_TEXT_TERTIARY }}>
            Личный кабинет
          </div>
        </div>
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Открыть меню"
          style={{
            padding: 8, background: 'transparent', border: 'none', borderRadius: 8,
            color: CP_TEXT_PRIMARY, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
          {CpIco.menu}
        </button>
      </header>

      {/* Backdrop — отображается через CSS только когда .is-mobile-open */}
      <div className="cp-drawer-backdrop" onClick={closeDrawer} aria-hidden="true"
        style={{
          display: 'none',
          position: 'fixed', inset: 0, zIndex: 55,
          background: 'rgba(16,24,40,0.35)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }} />

      <CpSidebar active={active} onNav={handleNav}
        counterparty={counterparty} onLogout={onLogout} ordersCount={ordersCount}
        mobileOpen={mobileOpen} onClose={closeDrawer} />

      <main className="main" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>);

}

/* Field label */
const cpLbl = { display: 'block', fontFamily: CP_F, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: CP_GRAY_700, marginBottom: 6 };

Object.assign(window, {
  CP_F, CP_FD,
  CP_PURPLE, CP_PURPLE_HOV, CP_PURPLE_RING, CP_PURPLE_BG, CP_PURPLE_TXT,
  CP_GRAY_900, CP_GRAY_800, CP_GRAY_700, CP_GRAY_600, CP_GRAY_500,
  CP_GRAY_400, CP_GRAY_300, CP_GRAY_200, CP_GRAY_100, CP_GRAY_50,
  CP_TEXT_MUTED, CP_TEXT_VALUE, CP_ERROR, CP_ERROR_BG,
  CP_SUCCESS, CP_SUCCESS_BG, CP_INFO, CP_INFO_BG, CP_WARN, CP_WARN_BG,
  CP_BANNER_RED, CP_CREAM, CP_CREAM_HOV, CP_CREAM_ACT,
  CP_SHADOW_XS, CP_SHADOW_SM, CP_SHADOW_MD, CP_SHADOW_MOD, CP_SHADOW_CARD,
  CP_BORDER_INPUT, CP_BORDER_CONTROL, CP_BORDER_LIGHT, CP_BORDER_DIVIDER, CP_BORDER_NAV,
  CP_BEIGE_300, CP_BEIGE_500, CP_BEIGE_600, CP_BEIGE_COD_50,
  CP_TEXT_PRIMARY, CP_TEXT_SECONDARY, CP_TEXT_TERTIARY, CP_TEXT_ALERT,
  CpIco, CpButton, CpIconBtn, CpInput, CpStatusBadge, CpStamp, CpSidebar, CpLayout, cpLbl
});