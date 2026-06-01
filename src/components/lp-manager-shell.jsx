import React from 'react';
import {
  CP_F, CP_CREAM, CP_CREAM_HOV, CP_CREAM_ACT,
  CP_BORDER_NAV, CP_GRAY_900, CP_GRAY_700, CP_GRAY_500, CP_GRAY_50,
  CP_TEXT_PRIMARY, CP_TEXT_TERTIARY,
  CpIco, CpStamp,
} from './lp-ui';

/* Иконки навигации панели менеджера (самодостаточные, чтобы не зависеть от набора CpIco). */
const MgrIco = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21.0005V13.0005C15 12.7353 14.8946 12.4809 14.7071 12.2934C14.5196 12.1058 14.2652 12.0005 14 12.0005H10C9.73478 12.0005 9.48043 12.1058 9.29289 12.2934C9.10536 12.4809 9 12.7353 9 13.0005V21.0005M3 10.0005C2.99993 9.70955 3.06333 9.4221 3.18579 9.1582C3.30824 8.89429 3.4868 8.66028 3.709 8.47248L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47248C20.5132 8.66028 20.6918 8.89429 20.8142 9.1582C20.9367 9.4221 21.0001 9.70955 21 10.0005V19.0005C21 19.5309 20.7893 20.0396 20.4142 20.4147C20.0391 20.7898 19.5304 21.0005 19 21.0005H5C4.46957 21.0005 3.96086 20.7898 3.58579 20.4147C3.21071 20.0396 3 19.5309 3 19.0005V10.0005Z" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  banner: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.27209 20.7279L10.8686 14.1314C11.2646 13.7354 11.4627 13.5373 11.691 13.4632C11.8918 13.3979 12.1082 13.3979 12.309 13.4632C12.5373 13.5373 12.7354 13.7354 13.1314 14.1314L19.6839 20.6839M14 15L16.8686 12.1314C17.2646 11.7354 17.4627 11.5373 17.691 11.4632C17.8918 11.3979 18.1082 11.3979 18.309 11.4632C18.5373 11.5373 18.7354 11.7354 19.1314 12.1314L22 15M10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9ZM6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27976 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z" />
    </svg>
  ),
};

const MGR_ACCOUNT = {
  name: 'ИП Иванов',
  address: 'г. Краснодар, ул. Северная 16/2 стр 1',
};

function LpManagerSidebar({ active, onNav, onLogout, mobileOpen, onClose }) {
  const items = [
    { key: 'orders',         label: 'Главная',     icon: MgrIco.home },
    { key: 'counterparties', label: 'Контрагенты', icon: MgrIco.users },
    { key: 'banner',         label: 'Баннер',      icon: MgrIco.banner },
  ];

  return (
    <aside className={`sidebar-navigation${mobileOpen ? ' is-mobile-open' : ''}`} style={{
      width: 312, flexShrink: 0, minHeight: '100vh',
      background: CP_CREAM, borderRight: `1px solid ${CP_BORDER_NAV}`,
      display: 'flex', flexDirection: 'column', alignItems: 'stretch',
      padding: '32px 16px', gap: 24, fontFamily: CP_F,
      position: 'sticky', top: 0, alignSelf: 'flex-start',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Новый логотип — виден ≥1025px через CSS .cp-logo-new */}
          <img
            className="cp-logo-new"
            src="/assets/logo-lychkiny.svg"
            alt="Крестьянское фермерское хозяйство семьи Лычкиных"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          {/* Штамп-фолбэк */}
          <div className="cp-logo-old" style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <CpStamp size={170} />
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Закрыть меню"
          className="cp-drawer-close"
          style={{
            display: 'none', padding: 8, background: 'transparent', border: 'none', borderRadius: 8,
            color: CP_TEXT_PRIMARY, cursor: 'pointer', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
          {CpIco.close}
        </button>
      </div>

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
                transition: 'background .15s',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = CP_CREAM_HOV; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ color: on ? CP_GRAY_900 : CP_GRAY_700, display: 'flex' }}>{it.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <button onClick={() => alert('Поддержка: +7 (000) 000-00-00 · ferma@lichkiny.ru')}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: CP_GRAY_900, fontFamily: CP_F, fontWeight: 500, fontSize: 16, lineHeight: '24px',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = CP_CREAM_HOV; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
        <span style={{ color: CP_GRAY_700, display: 'flex' }}>{CpIco.help}</span>
        <span>Поддержка</span>
      </button>

      <div style={{
        borderTop: `1px solid ${CP_BORDER_NAV}`, padding: '24px 0 0 8px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CP_F, fontWeight: 600, fontSize: 14, lineHeight: '20px', color: CP_TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {MGR_ACCOUNT.name}
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: CP_TEXT_TERTIARY, marginTop: 2 }}>
            {MGR_ACCOUNT.address}
          </div>
        </div>
        <button type="button" onClick={onLogout} title="Выйти"
          style={{
            borderRadius: 8, padding: 8, background: 'transparent', border: 'none', cursor: 'pointer',
            color: CP_GRAY_500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = CP_GRAY_50; e.currentTarget.style.color = CP_GRAY_700; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CP_GRAY_500; }}>
          {CpIco.logout}
        </button>
      </div>
    </aside>
  );
}

function LpManagerLayout({ active, onNav, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);
  const handleNav = (k) => { setMobileOpen(false); onNav(k); };

  return (
    <div className={`cp-layout${mobileOpen ? ' is-mobile-open' : ''}`}
      style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: CP_F }}>

      <header className="cp-mobile-header" style={{
        display: 'none', alignItems: 'center', gap: 12, padding: '16px',
        background: CP_CREAM, position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ flexShrink: 0 }}><CpStamp size={56} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CP_F, fontWeight: 500, fontSize: 24, lineHeight: '32px', color: CP_TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Ферма Лычкиных
          </div>
          <div style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: CP_TEXT_TERTIARY }}>Панель менеджера</div>
        </div>
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Открыть меню"
          style={{
            padding: 8, background: 'transparent', border: 'none', borderRadius: 8,
            color: CP_TEXT_PRIMARY, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
          {CpIco.menu}
        </button>
      </header>

      <div className="cp-drawer-backdrop" onClick={closeDrawer} aria-hidden="true"
        style={{
          display: 'none', position: 'fixed', inset: 0, zIndex: 55,
          background: 'rgba(16,24,40,0.35)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        }} />

      <LpManagerSidebar active={active} onNav={handleNav} onLogout={onLogout}
        mobileOpen={mobileOpen} onClose={closeDrawer} />

      <main className="main" style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        background: '#fff',
      }}>
        {children}
      </main>
    </div>
  );
}

export { LpManagerLayout, LpManagerSidebar };
