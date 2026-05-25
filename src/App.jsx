import React, { useState, useEffect } from 'react';
import { getClient, saveClient, getCounterparties } from './components/lp-data';
import { LpClientLogin, LpOrderForm, LpOrderHistory, Lp404 } from './components/lp-client-views';
import { LpAdminLogin } from './components/lp-admin-bits';
import { LpAdminPanel } from './components/lp-admin-panel';

function App() {
  const initialMode = () => {
    const h = window.location.hash;
    if (h === '#admin') return 'admin';
    if (h === '#404')   return '404';
    return 'client';
  };
  const [mode, setMode] = useState(initialMode);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [client, setClient] = useState(() => {
    const saved = getClient();
    if (!saved) return null;
    return getCounterparties().find(c => c.id === saved.id) || null;
  });
  const [view, setView] = useState('form');

  useEffect(() => {
    const onHash = () => setMode(initialMode());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goAdmin  = () => { window.location.hash = '#admin'; setMode('admin'); };
  const goClient = () => { window.location.hash = ''; setMode('client'); setAdminAuthed(false); };
  const logout   = () => { saveClient(null); setClient(null); setView('form'); };

  if (mode === '404') {
    return <Lp404 onBack={() => { window.history.back(); }} onHome={goClient} />;
  }
  if (mode === 'admin') {
    if (!adminAuthed) return <LpAdminLogin onLogin={() => setAdminAuthed(true)} onBack={goClient} />;
    return <LpAdminPanel onLogout={goClient} />;
  }
  if (!client) return <LpClientLogin onLogin={c => setClient(c)} onAdmin={goAdmin} />;
  if (view === 'history') return <LpOrderHistory counterparty={client} onBack={() => setView('form')} onLogout={logout} />;
  return <LpOrderForm counterparty={client} onHistory={() => setView('history')} onLogout={logout} />;
}

export default App;
