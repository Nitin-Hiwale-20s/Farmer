import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: searchParams.get('role') || 'buyer',
    name: '', email: '', password: '', phone: '',
    farmName: '', village: '', taluka: '', district: '', state: 'Maharashtra', pincode: '',
    vehicleNumber: '', assignedArea: ''
  });
  const { register } = useAuth();
  const { t, theme } = useTheme();
  const c = theme.colors;
  const navigate = useNavigate();

  const roles = [
    { id: 'buyer', icon: '🏠', label: 'ग्राहक', desc: 'भाजीपाला खरेदी करायचा आहे' },
    { id: 'farmer', icon: '👨‍🌾', label: 'शेतकरी', desc: 'माझा भाजीपाला विकायचा आहे' },
    { id: 'delivery', icon: '🚴', label: 'Delivery Boy', desc: 'Delivery करायची आहे' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role };
      if (form.role === 'farmer') { payload.farmName = form.farmName; payload.farmLocation = { village: form.village, taluka: form.taluka, district: form.district, state: form.state, pincode: form.pincode }; }
      if (form.role === 'delivery') { payload.vehicleNumber = form.vehicleNumber; payload.assignedArea = form.assignedArea; }
      const user = await register(payload);
      toast.success(`🎉 Registration यशस्वी! Welcome, ${user.name}!`);
      const redirects = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', buyer: '/shop' };
      navigate(redirects[user.role] || '/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const inputStyle = { width: '100%', padding: '0.72rem', border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '0.95rem', background: c.input, color: c.inputText, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: c.text, marginBottom: '0.3rem' };
  const fieldStyle = { marginBottom: '0.75rem' };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ background: c.cardBg, borderRadius: '20px', padding: 'clamp(1.5rem,4vw,2.5rem)', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: `1px solid ${c.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌾</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: c.text, marginBottom: '0.3rem' }}>{t.auth.registerTitle}</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              {[1, 2, form.role === 'farmer' ? 3 : null].filter(Boolean).map(s => (
                <div key={s} style={{ width: '32px', height: '4px', borderRadius: '2px', background: step >= s ? '#16a34a' : c.border, transition: 'background 0.3s' }}></div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div>
              <p style={{ textAlign: 'center', color: c.subText, marginBottom: '1.2rem', fontSize: '0.9rem' }}>{t.auth.selectRole}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {roles.map(r => (
                  <div key={r.id} onClick={() => f('role', r.id)}
                    style={{ borderRadius: '12px', padding: '1rem 0.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', border: form.role === r.id ? '2px solid #16a34a' : `2px solid ${c.border}`, background: form.role === r.id ? (theme.isDark ? '#1a3a2a' : '#f0fdf4') : c.cardBg }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{r.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: c.text, marginBottom: '0.2rem' }}>{r.label}</div>
                    <div style={{ fontSize: '0.65rem', color: c.subText, lineHeight: 1.3 }}>{r.desc}</div>
                    {form.role === r.id && <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: '#16a34a', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setStep(2)}>पुढे →</button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={form.role === 'farmer' ? (e) => { e.preventDefault(); setStep(3); } : handleSubmit}>
              <p style={{ textAlign: 'center', color: c.subText, marginBottom: '1.2rem', fontSize: '0.9rem' }}>तुमची माहिती भरा</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={fieldStyle}><label style={labelStyle}>{t.auth.name} *</label><input style={inputStyle} placeholder="तुमचे नाव" value={form.name} onChange={e => f('name', e.target.value)} required /></div>
                <div style={fieldStyle}><label style={labelStyle}>{t.auth.phone} *</label><input style={inputStyle} placeholder="9876543210" value={form.phone} onChange={e => f('phone', e.target.value)} required /></div>
              </div>
              <div style={fieldStyle}><label style={labelStyle}>{t.auth.email} *</label><input style={inputStyle} type="email" placeholder="your@email.com" value={form.email} onChange={e => f('email', e.target.value)} required /></div>
              <div style={fieldStyle}><label style={labelStyle}>{t.auth.password} *</label><input style={inputStyle} type="password" placeholder="Min 6 characters" value={form.password} onChange={e => f('password', e.target.value)} required minLength={6} /></div>
              {form.role === 'delivery' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={fieldStyle}><label style={labelStyle}>Vehicle Number</label><input style={inputStyle} placeholder="MH-XX-XXXX" value={form.vehicleNumber} onChange={e => f('vehicleNumber', e.target.value)} /></div>
                  <div style={fieldStyle}><label style={labelStyle}>Area</label><input style={inputStyle} placeholder="तुमचा Area" value={form.assignedArea} onChange={e => f('assignedArea', e.target.value)} /></div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" style={{ flex: 1, background: c.hover, color: c.text, border: `1px solid ${c.border}`, padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setStep(1)}>← मागे</button>
                <button style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
                  {form.role === 'farmer' ? 'पुढे →' : (loading ? '...' : t.auth.registerBtn)}
                </button>
              </div>
            </form>
          )}

          {step === 3 && form.role === 'farmer' && (
            <form onSubmit={handleSubmit}>
              <p style={{ textAlign: 'center', color: c.subText, marginBottom: '1.2rem', fontSize: '0.9rem' }}>तुमच्या शेताची माहिती</p>
              <div style={fieldStyle}><label style={labelStyle}>{t.auth.farmName} *</label><input style={inputStyle} placeholder="उदा. रामराव पाटील फार्म" value={form.farmName} onChange={e => f('farmName', e.target.value)} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={fieldStyle}><label style={labelStyle}>{t.auth.village} *</label><input style={inputStyle} placeholder="गावाचे नाव" value={form.village} onChange={e => f('village', e.target.value)} required /></div>
                <div style={fieldStyle}><label style={labelStyle}>तालुका</label><input style={inputStyle} placeholder="तालुका" value={form.taluka} onChange={e => f('taluka', e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={fieldStyle}><label style={labelStyle}>{t.auth.district} *</label><input style={inputStyle} placeholder="जिल्हा" value={form.district} onChange={e => f('district', e.target.value)} required /></div>
                <div style={fieldStyle}><label style={labelStyle}>Pincode</label><input style={inputStyle} placeholder="416XXX" value={form.pincode} onChange={e => f('pincode', e.target.value)} /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" style={{ flex: 1, background: c.hover, color: c.text, border: `1px solid ${c.border}`, padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setStep(2)}>← मागे</button>
                <button style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>{loading ? '...' : '🌾 Register करा'}</button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: c.subText, fontSize: '0.9rem' }}>
            {t.auth.hasAccount} <Link to="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>{t.nav.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
