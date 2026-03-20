import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme, language, changeLanguage, t, theme, LANGUAGES } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const c = theme.colors;

  const getDashLink = () => {
    if (!user) return '/login';
    return { farmer: '/farmer', admin: '/admin', delivery: '/delivery', buyer: '/shop' }[user.role] || '/shop';
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav style={{ ...s.nav, background: c.navBg, borderBottom: `1px solid ${c.border}`, color: c.text }}>
        <div style={s.inner}>
          {/* Logo */}
          <Link to="/" style={{ ...s.logo, color: c.green }}>
            <span style={s.logoIcon}>🌾</span>
            <span style={s.logoText}>FarmConnect</span>
          </Link>

          {/* Desktop Links */}
          <div style={s.desktopLinks}>
            <Link to="/shop" style={{ ...s.navLink, color: c.text }}>{t.nav.shop}</Link>

            {/* Language Selector */}
            <div style={s.langWrapper}>
              <button onClick={() => setLangOpen(!langOpen)}
                style={{ ...s.langBtn, background: c.hover, color: c.text, border: `1px solid ${c.border}` }}>
                {LANGUAGES[language].flag} {LANGUAGES[language].label} ▾
              </button>
              {langOpen && (
                <div style={{ ...s.langDropdown, background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)' }}>
                  {Object.values(LANGUAGES).map(lang => (
                    <button key={lang.code} onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                      style={{ ...s.langOption, background: language === lang.code ? c.hover : 'transparent', color: c.text }}>
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={toggleTheme} style={{ ...s.themeBtn, background: c.hover, border: `1px solid ${c.border}` }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link to="/cart" style={s.cartBtn}>
                    🛒 {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
                  </Link>
                )}
                <Link to={getDashLink()} style={{ ...s.dashBtn, background: c.green, color: '#fff' }}>
                  {t.nav.dashboard}
                </Link>
                <button onClick={handleLogout} style={{ ...s.logoutBtn, color: c.subText, border: `1px solid ${c.border}` }}>
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ ...s.navLink, color: c.text }}>{t.nav.login}</Link>
                <Link to="/register" style={{ ...s.registerBtn, background: c.green }}>{t.nav.register}</Link>
              </>
            )}
          </div>

          {/* Mobile Right */}
          <div style={s.mobileRight}>
            <button onClick={toggleTheme} style={{ ...s.themeBtn, background: c.hover, border: `1px solid ${c.border}` }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user?.role === 'buyer' && (
              <Link to="/cart" style={s.cartBtn}>
                🛒 {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ ...s.hamburger, color: c.text, border: `1px solid ${c.border}`, background: c.hover }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ ...s.mobileMenu, background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
          <Link to="/shop" style={{ ...s.mobileLink, color: c.text, borderBottom: `1px solid ${c.border}` }} onClick={() => setMenuOpen(false)}>
            🥦 {t.nav.shop}
          </Link>

          {/* Mobile Language */}
          <div style={{ ...s.mobileLangSection, borderBottom: `1px solid ${c.border}` }}>
            <p style={{ ...s.mobileLangTitle, color: c.subText }}>🌐 Language</p>
            <div style={s.mobileLangBtns}>
              {Object.values(LANGUAGES).map(lang => (
                <button key={lang.code} onClick={() => { changeLanguage(lang.code); setMenuOpen(false); }}
                  style={{ ...s.mobileLangBtn, background: language === lang.code ? c.green : c.hover, color: language === lang.code ? '#fff' : c.text }}>
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          {user ? (
            <>
              <Link to={getDashLink()} style={{ ...s.mobileLink, color: c.green, borderBottom: `1px solid ${c.border}` }} onClick={() => setMenuOpen(false)}>
                📊 {t.nav.dashboard}
              </Link>
              <button onClick={handleLogout} style={{ ...s.mobileLogout, color: '#ef4444' }}>
                🚪 {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...s.mobileLink, color: c.text, borderBottom: `1px solid ${c.border}` }} onClick={() => setMenuOpen(false)}>
                🔑 {t.nav.login}
              </Link>
              <Link to="/register" style={{ ...s.mobileLink, color: c.green }} onClick={() => setMenuOpen(false)}>
                ✨ {t.nav.register}
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

const s = {
  nav: { position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  inner: { maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: 800 },
  logoIcon: { fontSize: '1.5rem' },
  logoText: { fontSize: '1.2rem', fontWeight: 800 },
  desktopLinks: { display: 'flex', alignItems: 'center', gap: '0.75rem', '@media(max-width:768px)': { display: 'none' } },
  navLink: { textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' },
  langWrapper: { position: 'relative' },
  langBtn: { padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'none' },
  langDropdown: { position: 'absolute', top: '110%', right: 0, borderRadius: '12px', overflow: 'hidden', minWidth: '140px', zIndex: 100 },
  langOption: { display: 'block', width: '100%', padding: '0.6rem 1rem', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem', fontWeight: 500 },
  themeBtn: { width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { position: 'relative', background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', textDecoration: 'none', padding: '0.2rem' },
  cartBadge: { position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  dashBtn: { padding: '0.45rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' },
  logoutBtn: { padding: '0.45rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', background: 'transparent' },
  registerBtn: { padding: '0.45rem 1rem', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' },
  mobileRight: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  hamburger: { width: '38px', height: '38px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  mobileMenu: { padding: '0.5rem 0' },
  mobileLink: { display: 'block', padding: '0.9rem 1.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' },
  mobileLangSection: { padding: '0.75rem 1.5rem' },
  mobileLangTitle: { fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  mobileLangBtns: { display: 'flex', gap: '0.5rem' },
  mobileLangBtn: { padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' },
  mobileLogout: { display: 'block', width: '100%', padding: '0.9rem 1.5rem', background: 'none', border: 'none', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
};

export default Navbar;
