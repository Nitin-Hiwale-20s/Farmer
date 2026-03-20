import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const { t, theme } = useTheme();
  const c = theme.colors;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🌾`);
      const redirects = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', buyer: '/shop' };
      navigate(redirects[user.role] || '/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ background: c.cardBg, borderRadius: '20px', padding: 'clamp(1.5rem,4vw,2.5rem)', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: `1px solid ${c.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌾</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: c.text, marginBottom: '0.3rem' }}>{t.auth.loginTitle}</h1>
            <p style={{ color: c.subText, fontSize: '0.9rem' }}>FarmConnect मध्ये प्रवेश करा</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: c.text, marginBottom: '0.3rem' }}>{t.auth.email}</label>
              <input style={{ width: '100%', padding: '0.75rem', border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '1rem', background: c.input, color: c.inputText, outline: 'none', boxSizing: 'border-box' }}
                type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: c.text, marginBottom: '0.3rem' }}>{t.auth.password}</label>
              <div style={{ position: 'relative' }}>
                <input style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '1rem', background: c.input, color: c.inputText, outline: 'none', boxSizing: 'border-box' }}
                  type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
              type="submit" disabled={loading}>{loading ? '...' : t.auth.loginBtn}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: c.subText, fontSize: '0.9rem' }}>
            {t.auth.noAccount} <Link to="/register" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>{t.nav.register}</Link>
          </p>
          <div style={{ marginTop: '1.5rem', background: theme.isDark ? '#334155' : '#f9fafb', borderRadius: '10px', padding: '1rem', border: `1px solid ${c.border}` }}>
            <p style={{ fontWeight: 600, fontSize: '0.78rem', color: c.subText, marginBottom: '0.4rem' }}>Demo accounts:</p>
            <p style={{ fontSize: '0.75rem', color: c.subText, marginBottom: '0.2rem' }}>Admin: admin@farm.com / admin123</p>
            <p style={{ fontSize: '0.75rem', color: c.subText }}>Farmer: farmer@farm.com / farmer123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
