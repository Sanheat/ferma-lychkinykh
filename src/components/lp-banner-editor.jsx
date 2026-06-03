import React from 'react';
import {
  CP_F, CP_TEXT_PRIMARY, CP_TEXT_SECONDARY, CP_TEXT_TERTIARY, CP_TEXT_MUTED,
  CP_BEIGE_COD_50, CP_BEIGE_600, CP_CREAM, CP_BANNER_RED,
  CP_BORDER_INPUT, CP_BORDER_LIGHT, CP_BORDER_CONTROL,
  CP_SHADOW_XS, CP_SHADOW_SM,
  CP_GRAY_900, CpIco,
} from './lp-ui';
import { getBanner, saveBanner } from './lp-data';

const BANNER_BG_COLORS = [
  '#C94030',
  '#B67E40',
  '#2D5A27',
  '#1A3A5C',
  '#6B3A2A',
  '#4A6741',
  '#191414',
];

function BnrLabel({ children }) {
  return (
    <div style={{
      fontFamily: CP_F, fontWeight: 600,
      fontSize: 16, lineHeight: '24px', color: CP_TEXT_PRIMARY,
    }}>
      {children}
    </div>
  );
}

function BnrField({ label, value, onChange, max }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontFamily: CP_F, fontWeight: 500, fontSize: 14,
          lineHeight: '20px', color: CP_TEXT_SECONDARY,
        }}>
          {label}
        </div>
        <div style={{
          boxShadow: CP_SHADOW_XS, borderRadius: 8, background: '#fff',
          border: `1px solid ${CP_BORDER_INPUT}`,
          display: 'flex', alignItems: 'center', padding: '8px 14px',
        }}>
          <input
            type="text"
            value={value}
            maxLength={max}
            onChange={e => onChange(e.target.value)}
            style={{
              flex: 1, fontFamily: CP_F, fontWeight: 500,
              fontSize: 16, lineHeight: '24px', color: CP_TEXT_PRIMARY,
              border: 'none', outline: 'none', background: 'transparent', width: '100%',
            }}
          />
        </div>
      </div>
      <div style={{
        fontFamily: CP_F, fontSize: 14, lineHeight: '20px',
        color: CP_TEXT_MUTED, textAlign: 'right',
      }}>
        Символов {value.length} из {max}
      </div>
    </div>
  );
}

function BnrUploadIco() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function LpBannerEditor({ adminPwd }) {
  const { useState, useEffect } = React;

  const [bannerHidden, setBannerHidden] = useState(false);
  const [bgTab,   setBgTab]   = useState('color');
  const [bgColor, setBgColor] = useState(BANNER_BG_COLORS[0]);
  const [title,   setTitle]   = useState('');
  const [desc,    setDesc]    = useState('');
  const [badge,   setBadge]   = useState('');
  const [tipOn,   setTipOn]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [savedAt, setSavedAt] = useState(0);

  /* Загрузка текущего баннера из Supabase (settings.banner) */
  useEffect(() => {
    let alive = true;
    getBanner().then(b => {
      if (!alive || !b) return;
      setTitle(b.title || '');
      setDesc(b.subtitle || '');
      setBadge(b.badge || '');
      if (b.bg && BANNER_BG_COLORS.includes(b.bg)) setBgColor(b.bg);
      else if (b.bg) setBgColor(b.bg);
      setBgTab(b.image ? 'image' : 'color');
      setBannerHidden(!!b.hidden);
    });
    return () => { alive = false; };
  }, []);

  /* Ширина окна для адаптива */
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const is768  = w >= 768;
  const is1024 = w >= 1024;

  const cp = is1024 ? '0 32px' : is768 ? '0 24px' : '0 16px';

  const TITLE_MAX = 55;
  const DESC_MAX  = 130;
  const BADGE_MAX = 40;

  const activeBannerBg = bgTab === 'color' ? bgColor : CP_BANNER_RED;

  const handleReset = () => {
    setTitle('Свежее мясо птицы — каждую неделю');
    setDesc('Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня');
    setBadge('Ферма Лычкиных');
    setBgColor(BANNER_BG_COLORS[0]);
    setBgTab('color');
    setBannerHidden(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBanner(adminPwd, {
        kind: 'promo',
        title,
        subtitle: desc,
        badge,
        bg: bgColor,
        image: '',
        hidden: bannerHidden,
      });
      setSavedAt(Date.now());
    } catch (e) {
      console.error('saveBanner:', e);
      alert('Не удалось сохранить баннер');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-screen-label="Баннер"
      style={{
        display: 'flex', flexDirection: 'column',
        padding: '32px 0 48px', gap: 32, fontFamily: CP_F,
      }}
    >

      <div style={{ padding: cp }}>
        <div style={{
          display: 'flex',
          flexDirection: is768 ? 'row' : 'column',
          alignItems: is768 ? 'flex-start' : 'stretch',
          gap: 20,
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{
              fontFamily: CP_F, fontWeight: 600, fontSize: 30,
              lineHeight: '38px', color: CP_GRAY_900,
            }}>
              Баннер
            </div>
            <div style={{ fontFamily: CP_F, fontSize: 16, lineHeight: '24px', color: CP_TEXT_MUTED }}>
              <p style={{ margin: 0, marginBottom: is768 ? 0 : 4 }}>
                Настройте изображение, заголовок и описание баннера.
              </p>
              <p style={{ margin: 0 }}>
                Клиенты увидят изменения автоматически после повторного входа
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBannerHidden(v => !v)}
            style={{
              flexShrink: 0, alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 8,
              background: '#F5F0DF', border: '1px solid #FBF9F1',
              cursor: 'pointer', fontFamily: CP_F, fontWeight: 600,
              fontSize: 14, lineHeight: '20px', color: '#986338',
              transition: 'background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EFE8D1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F5F0DF'; }}
          >
            {bannerHidden ? 'Показывать баннер' : 'Скрывать баннер'}
            <span style={{ display: 'flex', color: '#986338' }}>
              {bannerHidden ? CpIco.eye : CpIco.eyeOff}
            </span>
          </button>
        </div>
      </div>

      <div style={{ padding: cp, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BnrLabel>Предпросмотр</BnrLabel>

        <div style={{
          width: '100%',
          ...(is1024 ? { height: 266 } : {}),
          borderRadius: 20,
          background: bannerHidden ? CP_BORDER_LIGHT : activeBannerBg,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          padding: 20, boxSizing: 'border-box',
          gap: is1024 ? 128 : 32,
          maxWidth: '100%',
          transition: 'background .25s',
          position: 'relative', overflow: 'hidden',
        }}>
          {bannerHidden ? (
            <div style={{
              width: '100%', padding: '24px 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: CP_F, fontSize: 14, color: CP_TEXT_MUTED,
            }}>
              Баннер скрыт
            </div>
          ) : (
            <>
              <div style={{
                borderRadius: 16, background: '#F9F8F8',
                display: 'inline-flex', alignItems: 'center',
                padding: '4px 12px', flexShrink: 0,
                fontFamily: CP_F, fontWeight: 500,
                fontSize: 14, lineHeight: '20px', color: CP_TEXT_SECONDARY,
              }}>
                {badge || 'Бейдж'}
              </div>

              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  fontFamily: CP_F, fontWeight: 600,
                  fontSize: 30, lineHeight: '38px', color: '#fff',
                }}>
                  {title || 'Заголовок баннера'}
                </div>
                <div style={{
                  fontFamily: CP_F, fontWeight: 500,
                  fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.88)',
                }}>
                  {desc || 'Описание баннера'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: cp }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <BnrLabel>Фон</BnrLabel>

            <div style={{
              display: 'inline-flex', borderRadius: 8,
              background: CP_BEIGE_COD_50, padding: 6, gap: 8,
            }}>
              {[{ id: 'color', label: 'Цвет' }, { id: 'image', label: 'Изображение' }].map(({ id, label }) => {
                const on = bgTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setBgTab(id)}
                    style={{
                      borderRadius: 6, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '10px 14px', border: 'none', cursor: 'pointer',
                      fontFamily: CP_F, fontWeight: 600,
                      fontSize: 16, lineHeight: '24px',
                      transition: 'background .15s, box-shadow .15s',
                      ...(on
                        ? { background: '#fff', color: CP_TEXT_SECONDARY, boxShadow: CP_SHADOW_SM }
                        : { background: 'transparent', color: CP_TEXT_TERTIARY }),
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {bgTab === 'color' && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                {BANNER_BG_COLORS.map(color => {
                  const sel = bgColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => setBgColor(color)}
                      style={{
                        width: 40, height: 40,
                        borderRadius: 24,
                        background: color,
                        border: 'none',
                        padding: 0,
                        flexShrink: 0,
                        cursor: 'pointer',
                        boxShadow: sel
                          ? `0 0 0 2px #fff, 0 0 0 4px ${color}`
                          : CP_SHADOW_XS,
                        transition: 'box-shadow .15s',
                        objectFit: 'cover',
                      }}
                      onMouseEnter={e => {
                        if (!sel) e.currentTarget.style.boxShadow = `0 0 0 2px #fff, 0 0 0 4px ${color}`;
                      }}
                      onMouseLeave={e => {
                        if (!sel) e.currentTarget.style.boxShadow = CP_SHADOW_XS;
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {bgTab === 'image' && (
            <div style={{ alignSelf: 'stretch', minHeight: 126 }}>
              <div style={{
                minHeight: 126, borderRadius: 12, background: '#fff',
                border: `1px solid ${CP_BORDER_LIGHT}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '16px 24px', boxSizing: 'border-box',
              }}>
                <div style={{
                  width: '100%', display: 'flex',
                  flexDirection: 'column', alignItems: 'center',
                  gap: 12, maxWidth: '100%',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 28, flexShrink: 0,
                    background: CP_CREAM, border: `1px solid ${CP_BORDER_LIGHT}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: CP_TEXT_TERTIARY,
                  }}>
                    <BnrUploadIco />
                  </div>
                  <div style={{
                    alignSelf: 'stretch', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'center', gap: 4,
                    }}>
                      <span style={{
                        fontFamily: CP_F, fontWeight: 600,
                        fontSize: 14, lineHeight: '20px', color: '#986338',
                      }}>
                        Загрузка изображений появится позже
                      </span>
                    </div>
                    <div style={{
                      fontFamily: CP_F, fontSize: 12,
                      lineHeight: '18px', color: CP_TEXT_MUTED, textAlign: 'center',
                    }}>
                      Пока используйте цветной фон · PNG/JPG 1064×266 px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: cp }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontFamily: CP_F, fontWeight: 600,
              fontSize: 16, lineHeight: '24px', color: CP_TEXT_PRIMARY,
            }}>
              Текст
            </div>

            <div
              style={{
                width: 16, height: 16,
                position: 'relative', display: 'flex', flexShrink: 0,
                cursor: 'help',
              }}
              onMouseEnter={() => setTipOn(true)}
              onMouseLeave={() => setTipOn(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={CP_TEXT_TERTIARY} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>

              {tipOn && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#191414',
                  borderRadius: 8,
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                  fontFamily: CP_F,
                  fontWeight: 600,
                  fontSize: 12,
                  lineHeight: '18px',
                  color: '#fff',
                  boxShadow: '0px 12px 16px -4px rgba(16,24,40,0.08), 0px 4px 6px -2px rgba(16,24,40,0.03)',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}>
                  На баннере отображаются только заполненные поля
                  <div style={{
                    position: 'absolute',
                    top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #191414',
                  }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'stretch' }}>
            <BnrField label="Заголовок" value={title} onChange={setTitle} max={TITLE_MAX} />
            <BnrField label="Описание"  value={desc}  onChange={setDesc}  max={DESC_MAX}  />
            <BnrField label="Бейдж"     value={badge} onChange={setBadge} max={BADGE_MAX} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                boxShadow: CP_SHADOW_XS, borderRadius: 8,
                background: CP_BEIGE_600, border: `1px solid ${CP_BEIGE_600}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 18px', cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.7 : 1,
                fontFamily: CP_F, fontWeight: 600,
                fontSize: 16, lineHeight: '24px', color: '#fff',
                transition: 'background .15s, border-color .15s',
              }}
              onMouseEnter={e => {
                if (saving) return;
                e.currentTarget.style.background = '#986338';
                e.currentTarget.style.borderColor = '#986338';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = CP_BEIGE_600;
                e.currentTarget.style.borderColor = CP_BEIGE_600;
              }}
            >
              {saving ? 'Сохранение…' : 'Сохранить изменения'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                boxShadow: CP_SHADOW_XS, borderRadius: 8,
                background: '#fff', border: `1px solid ${CP_BORDER_INPUT}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 16px', cursor: 'pointer',
                fontFamily: CP_F, fontWeight: 600,
                fontSize: 16, lineHeight: '24px', color: CP_TEXT_SECONDARY,
                transition: 'background .15s, border-color .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = CP_BEIGE_COD_50;
                e.currentTarget.style.borderColor = CP_BORDER_CONTROL;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = CP_BORDER_INPUT;
              }}
            >
              Сбросить
            </button>
            {savedAt > 0 && !saving && (
              <span style={{ fontFamily: CP_F, fontSize: 14, lineHeight: '20px', color: '#027A48' }}>
                Сохранено ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LpBannerEditor };
