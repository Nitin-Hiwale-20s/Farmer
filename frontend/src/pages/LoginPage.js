import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.backLink}>← मुख्य पृष्ठ</Link>
        <div style={s.logo}>🌾</div>
        <h1 style={s.title}>FarmConnect मध्ये Login करा</h1>
        <p style={s.subtitle}>तुमच्या account मध्ये प्रवेश करा</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login करा'}
          </button>
        </form>
        <p style={s.switchText}>
          Account नाही? <Link to="/register" style={s.switchLink}>Register करा</Link>
        </p>
        <div style={s.demo}>
          <p style={s.demoTitle}>Demo accounts:</p>
          <p style={s.demoItem}>Admin: admin@farm.com / admin123</p>
          <p style={s.demoItem}>Farmer: farmer@farm.com / farmer123</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  backLink: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  logo: { fontSize: '3rem', textAlign: 'center', margin: '1rem 0' },
  title: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.3rem' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.75rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
  btn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' },
  switchText: { textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' },
  switchLink: { color: '#16a34a', fontWeight: 600, textDecoration: 'none' },
  demo: { marginTop: '1.5rem', background: '#f9fafb', borderRadius: '10px', padding: '1rem' },
  demoTitle: { fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.5rem' },
  demoItem: { fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.2rem' },
};

export default LoginPage;
