import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const { t, theme, isDark } = useTheme();
  const c = theme.colors;

  return (
    <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: isDark ? 'linear-gradient(135deg,#0a1628,#0f2d1a,#0a1628)' : 'linear-gradient(135deg,#052e16,#14532d,#166534)', minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1.5rem', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#86efac', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.88rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            {t.home.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            {t.home.title1}<br />
            <span style={{ color: '#4ade80' }}>{t.home.title2}</span><br />
            {t.home.title3}
          </h1>
          <p style={{ color: '#d1fae5', fontSize: 'clamp(0.9rem,2vw,1.1rem)', lineHeight: 1.7, marginBottom: '2rem' }}>{t.home.sub}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/shop" style={{ background: '#16a34a', color: '#fff', padding: '0.85rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>{t.home.btn1} →</Link>
            <Link to="/register?role=farmer" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.85rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}>{t.home.btn2}</Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', background: 'rgba(255,255,255,0.1)', padding: '1.2rem 2rem', borderRadius: '16px', width: 'fit-content', margin: '3rem auto 0', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['500+', t.home.stats[0]], ['50+', t.home.stats[1]], ['10K+', t.home.stats[2]]].map(([num, label], i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 800, color: '#4ade80' }}>{num}</span>
                <span style={{ color: '#d1fae5', fontSize: '0.82rem', textAlign: 'center' }}>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: 'clamp(2rem,5vw,5rem) 1.5rem', background: c.bg }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: c.text }}>{t.home.howTitle}</h2>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', color: c.subText }}>{t.home.howSub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[{ icon: '👨‍🌾', num: '01' }, { icon: '🛒', num: '02' }, { icon: '📦', num: '03' }, { icon: '🚴', num: '04' }].map((step, i) => (
            <div key={i} style={{ borderRadius: '16px', padding: '1.5rem', textAlign: 'center', background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: c.green, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{step.num}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{step.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem', color: c.text }}>{t.home.steps[i].title}</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: c.subText }}>{t.home.steps[i].desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: 'clamp(2rem,5vw,5rem) 1.5rem', background: isDark ? '#1e293b' : '#f0fdf4' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '2rem', color: c.text }}>FarmConnect चे फायदे</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1.2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[['💰','शेतकऱ्याला जास्त पैसे','दलाल नसल्याने पूर्ण किंमत मिळते'],['🌿','ताजा माल','शेतातून थेट घरी'],['📱','Real-time Tracking','Order live track करा'],['⭐','Reviews & Ratings','Quality guarantee'],['🔒','Verified Farmers','Admin verified शेतकरी'],['🚚','Fast Delivery','2 दिवसात delivery']].map(([icon,title,desc],i) => (
            <div key={i} style={{ borderRadius: '14px', padding: '1.3rem', background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.9rem', color: c.text }}>{title}</h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: c.subText }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section style={{ padding: 'clamp(2rem,5vw,5rem) 1.5rem', background: c.bg }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '2rem', color: c.text }}>{t.home.rolesTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {[{ icon: '👨‍🌾', color: '#16a34a', link: '/register?role=farmer' }, { icon: '🏠', color: '#0ea5e9', link: '/register?role=buyer' }, { icon: '🚴', color: '#f97316', link: '/register?role=delivery' }].map((r, i) => (
            <div key={i} style={{ borderRadius: '16px', padding: '2rem', textAlign: 'center', background: c.cardBg, border: `1px solid ${c.border}`, borderTop: `4px solid ${r.color}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{r.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: c.text }}>{t.home.roles[i].title}</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.88rem', color: c.subText }}>{t.home.roles[i].desc}</p>
              <Link to={r.link} style={{ display: 'inline-block', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', background: r.color }}>{t.home.roles[i].btn}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1.5rem', background: isDark ? '#0f172a' : '#111827', borderTop: `1px solid ${isDark ? '#1e293b' : '#1f2937'}` }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🌾</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>FarmConnect</span>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>शेतकरी ते ग्राहक — दलाल नाही, फसवणूक नाही</p>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>© 2024 FarmConnect. Made with ❤️ for Maharashtra Farmers</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
