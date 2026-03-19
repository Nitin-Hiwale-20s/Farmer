import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    const links = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', buyer: '/shop' };
    return links[user.role] || '/shop';
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🌾</span>
          <span style={styles.logoText}>FarmConnect</span>
          <span style={styles.logoSub}>शेतकरी ते घर</span>
        </div>
        <div style={styles.navLinks}>
          <Link to="/shop" style={styles.navLink}>भाजीपाला</Link>
          {user ? (
            <Link to={getDashboardLink()} style={styles.navBtn}>माझे Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.navBtn}>Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🌱 दलाल नाही • थेट शेतकऱ्याकडून</div>
          <h1 style={styles.heroTitle}>
            ताजा भाजीपाला<br />
            <span style={styles.heroHighlight}>थेट शेतातून</span><br />
            तुमच्या दारापर्यंत
          </h1>
          <p style={styles.heroSub}>
            शेतकरी आणि ग्राहक यांच्यात दलाल नको.<br />
            FarmConnect वर शेतकरी स्वतः भाव ठरवतो.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/shop" style={styles.heroBtnPrimary}>भाजीपाला खरेदी करा →</Link>
            <Link to="/register?role=farmer" style={styles.heroBtnSecondary}>शेतकरी म्हणून जोडा</Link>
          </div>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.stat}><span style={styles.statNum}>500+</span><span style={styles.statLabel}>शेतकरी</span></div>
          <div style={styles.statDivider}></div>
          <div style={styles.stat}><span style={styles.statNum}>50+</span><span style={styles.statLabel}>भाजीपाल्याचे प्रकार</span></div>
          <div style={styles.statDivider}></div>
          <div style={styles.stat}><span style={styles.statNum}>10K+</span><span style={styles.statLabel}>ग्राहक</span></div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>हे कसे काम करते?</h2>
        <p style={styles.sectionSub}>Simple आणि transparent process</p>
        <div style={styles.stepsGrid}>
          {[
            { icon: '👨‍🌾', num: '01', title: 'शेतकरी Register करतो', desc: 'Farmer ID मिळतो, भाजीपाला list करतो, किंमत स्वतः ठरवतो' },
            { icon: '🛒', num: '02', title: 'ग्राहक Order करतो', desc: 'थेट शेतकऱ्याकडून खरेदी, दलाल नाही, fresh माल' },
            { icon: '📦', num: '03', title: 'शेतकरी Pack करतो', desc: 'Order confirm करून pack करतो' },
            { icon: '🚴', num: '04', title: 'Delivery Boy पोहोचवतो', desc: 'घरापर्यंत delivery, real-time tracking' },
          ].map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{step.num}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ ...styles.section, background: '#f0fdf4' }}>
        <h2 style={styles.sectionTitle}>FarmConnect चे फायदे</h2>
        <div style={styles.benefitsGrid}>
          {[
            { icon: '💰', title: 'शेतकऱ्याला जास्त पैसे', desc: 'दलाल नसल्याने शेतकऱ्याला पूर्ण किंमत मिळते' },
            { icon: '🌿', title: 'ग्राहकाला ताजा माल', desc: 'शेतातून थेट घरी, कोणते chemicals नाही' },
            { icon: '📱', title: 'Real-time Tracking', desc: 'Order कुठे आहे ते live बघता येते' },
            { icon: '⭐', title: 'Reviews & Ratings', desc: 'शेतकऱ्याला rate करा, quality guarantee' },
            { icon: '🔒', title: 'Verified Farmers', desc: 'Admin verified शेतकरीच platform वर' },
            { icon: '🚚', title: 'Fast Delivery', desc: '2 दिवसात घरापर्यंत delivery' },
          ].map((b, i) => (
            <div key={i} style={styles.benefitCard}>
              <div style={styles.benefitIcon}>{b.icon}</div>
              <h3 style={styles.benefitTitle}>{b.title}</h3>
              <p style={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles CTA */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>आपण कोण आहात?</h2>
        <div style={styles.rolesGrid}>
          {[
            { icon: '👨‍🌾', role: 'farmer', title: 'शेतकरी', desc: 'भाजीपाला list करा, थेट विका, जास्त कमवा', link: '/register?role=farmer', color: '#16a34a', btnText: 'Farmer म्हणून Join करा' },
            { icon: '🏠', role: 'buyer', title: 'ग्राहक', desc: 'ताजा भाजीपाला खरेदी करा, घरी मागवा', link: '/register?role=buyer', color: '#0ea5e9', btnText: 'खरेदी सुरू करा' },
            { icon: '🚴', role: 'delivery', title: 'Delivery Boy', desc: 'Part-time काम करा, extra कमाई करा', link: '/register?role=delivery', color: '#f97316', btnText: 'Delivery Partner बना' },
          ].map((r, i) => (
            <div key={i} style={{ ...styles.roleCard, borderTop: `4px solid ${r.color}` }}>
              <div style={styles.roleIcon}>{r.icon}</div>
              <h3 style={styles.roleTitle}>{r.title}</h3>
              <p style={styles.roleDesc}>{r.desc}</p>
              <Link to={r.link} style={{ ...styles.roleBtn, background: r.color }}>{r.btnText}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={{ fontSize: '2rem' }}>🌾</span>
            <span style={styles.footerLogoText}>FarmConnect</span>
          </div>
          <p style={styles.footerTagline}>शेतकरी ते ग्राहक — दलाल नाही, फसवणूक नाही</p>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>© 2024 FarmConnect. Made with ❤️ for Maharashtra Farmers</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", color: '#1f2937', minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: { fontSize: '1.8rem' },
  logoText: { fontSize: '1.4rem', fontWeight: 700, color: '#15803d' },
  logoSub: { fontSize: '0.75rem', color: '#6b7280', background: '#f0fdf4', padding: '2px 8px', borderRadius: '20px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  navLink: { color: '#374151', textDecoration: 'none', fontWeight: 500 },
  navBtn: { background: '#16a34a', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 },
  hero: { position: 'relative', background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 2rem', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 },
  heroContent: { position: 'relative', maxWidth: '700px' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#86efac', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' },
  heroHighlight: { color: '#4ade80' },
  heroSub: { color: '#d1fae5', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' },
  heroBtns: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  heroBtnPrimary: { background: '#16a34a', color: '#fff', padding: '0.9rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem' },
  heroBtnSecondary: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.9rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' },
  heroStats: { position: 'relative', display: 'flex', gap: '2rem', marginTop: '4rem', background: 'rgba(255,255,255,0.1)', padding: '1.5rem 2rem', borderRadius: '16px', width: 'fit-content', backdropFilter: 'blur(10px)' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '2rem', fontWeight: 800, color: '#4ade80' },
  statLabel: { color: '#d1fae5', fontSize: '0.85rem' },
  statDivider: { width: '1px', background: 'rgba(255,255,255,0.2)' },
  section: { padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: '#111827' },
  sectionSub: { textAlign: 'center', color: '#6b7280', marginBottom: '3rem' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' },
  stepCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' },
  stepNum: { fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', letterSpacing: '0.1em', marginBottom: '0.5rem' },
  stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  stepTitle: { fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' },
  stepDesc: { color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 },
  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
  benefitCard: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 5px rgba(0,0,0,0.06)' },
  benefitIcon: { fontSize: '2rem', marginBottom: '0.75rem' },
  benefitTitle: { fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem' },
  benefitDesc: { color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6 },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' },
  roleCard: { background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' },
  roleIcon: { fontSize: '3rem', marginBottom: '1rem' },
  roleTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' },
  roleDesc: { color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.9rem' },
  roleBtn: { display: 'inline-block', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  footer: { background: '#111827', padding: '3rem 2rem' },
  footerContent: { textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' },
  footerLogoText: { fontSize: '1.5rem', fontWeight: 700, color: '#fff' },
  footerTagline: { color: '#9ca3af', marginBottom: '1rem' },
};

export default LandingPage;
