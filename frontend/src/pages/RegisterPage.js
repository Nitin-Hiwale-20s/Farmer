import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
      const payload = {
        name: form.name, email: form.email,
        password: form.password, phone: form.phone, role: form.role
      };
      if (form.role === 'farmer') {
        payload.farmName = form.farmName;
        payload.farmLocation = {
          village: form.village, taluka: form.taluka,
          district: form.district, state: form.state, pincode: form.pincode
        };
      }
      if (form.role === 'delivery') {
        payload.vehicleNumber = form.vehicleNumber;
        payload.assignedArea = form.assignedArea;
      }
      const user = await register(payload);
      toast.success(`🎉 Registration यशस्वी! Welcome, ${user.name}!`);
      const redirects = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', buyer: '/shop' };
      navigate(redirects[user.role] || '/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.back}>← मुख्य पृष्ठ</Link>
        <div style={s.logo}>🌾</div>
        <h1 style={s.title}>FarmConnect Join करा</h1>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div>
            <p style={s.subtitle}>तुम्ही कोण आहात ते निवडा</p>
            <div style={s.roleGrid}>
              {roles.map(r => (
                <div key={r.id} onClick={() => f('role', r.id)}
                  style={{ ...s.roleCard, border: form.role === r.id ? '2px solid #16a34a' : '2px solid #e5e7eb', background: form.role === r.id ? '#f0fdf4' : '#fff' }}>
                  <div style={s.roleIcon}>{r.icon}</div>
                  <div style={s.roleLabel}>{r.label}</div>
                  <div style={s.roleDesc}>{r.desc}</div>
                  {form.role === r.id && <div style={s.roleCheck}>✓</div>}
                </div>
              ))}
            </div>
            <button style={s.btn} onClick={() => setStep(2)}>पुढे →</button>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <form onSubmit={form.role === 'farmer' ? (e) => { e.preventDefault(); setStep(3); } : handleSubmit}>
            <p style={s.subtitle}>तुमची माहिती भरा</p>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>पूर्ण नाव *</label>
                <input style={s.input} placeholder="तुमचे नाव" value={form.name} onChange={e => f('name', e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone *</label>
                <input style={s.input} placeholder="9876543210" value={form.phone} onChange={e => f('phone', e.target.value)} required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Email *</label>
              <input style={s.input} type="email" placeholder="your@email.com" value={form.email} onChange={e => f('email', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password *</label>
              <input style={s.input} type="password" placeholder="Min 6 characters" value={form.password} onChange={e => f('password', e.target.value)} required minLength={6} />
            </div>
            {form.role === 'delivery' && (
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Vehicle Number</label>
                  <input style={s.input} placeholder="MH-XX-XXXX" value={form.vehicleNumber} onChange={e => f('vehicleNumber', e.target.value)} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Area</label>
                  <input style={s.input} placeholder="तुमचा Area" value={form.assignedArea} onChange={e => f('assignedArea', e.target.value)} />
                </div>
              </div>
            )}
            <div style={s.btnRow}>
              <button type="button" style={s.btnSecondary} onClick={() => setStep(1)}>← मागे</button>
              <button style={s.btn} type="submit" disabled={loading}>
                {form.role === 'farmer' ? 'पुढे →' : (loading ? 'Loading...' : 'Register करा')}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Farmer Farm Details */}
        {step === 3 && form.role === 'farmer' && (
          <form onSubmit={handleSubmit}>
            <p style={s.subtitle}>तुमच्या शेताची माहिती</p>
            <div style={s.field}>
              <label style={s.label}>शेताचे नाव *</label>
              <input style={s.input} placeholder="उदा. रामराव पाटील फार्म" value={form.farmName} onChange={e => f('farmName', e.target.value)} required />
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>गाव *</label>
                <input style={s.input} placeholder="गावाचे नाव" value={form.village} onChange={e => f('village', e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>तालुका</label>
                <input style={s.input} placeholder="तालुका" value={form.taluka} onChange={e => f('taluka', e.target.value)} />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>जिल्हा *</label>
                <input style={s.input} placeholder="जिल्हा" value={form.district} onChange={e => f('district', e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Pincode</label>
                <input style={s.input} placeholder="416XXX" value={form.pincode} onChange={e => f('pincode', e.target.value)} />
              </div>
            </div>
            <div style={s.btnRow}>
              <button type="button" style={s.btnSecondary} onClick={() => setStep(2)}>← मागे</button>
              <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Loading...' : '🌾 Register करा'}</button>
            </div>
          </form>
        )}

        <p style={s.switchText}>आधीच account आहे? <Link to="/login" style={s.switchLink}>Login करा</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  logo: { fontSize: '3rem', textAlign: 'center', margin: '1rem 0' },
  title: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.3rem' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  roleCard: { borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' },
  roleIcon: { fontSize: '2rem', marginBottom: '0.3rem' },
  roleLabel: { fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' },
  roleDesc: { fontSize: '0.72rem', color: '#6b7280' },
  roleCheck: { position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#16a34a', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.7rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  btn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', flex: 1 },
  btnSecondary: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', flex: 1 },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  switchText: { textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' },
  switchLink: { color: '#16a34a', fontWeight: 600, textDecoration: 'none' },
};

export default RegisterPage;
