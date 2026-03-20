import { useTheme } from '../../context/ThemeContext';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', nameMarathi: '', category: 'भाजीपाला', description: '',
    price: '', unit: 'kg', availableQty: '', minOrderQty: '0.5', maxOrderQty: '50',
    isOrganic: false, harvestDate: ''
  });

  const categories = ['भाजीपाला', 'फळे', 'धान्य', 'कडधान्य', 'मसाले', 'इतर'];
  const units = ['kg', 'gram', 'piece', 'dozen', 'bundle'];

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/products', {
        ...form,
        price: Number(form.price),
        availableQty: Number(form.availableQty),
        minOrderQty: Number(form.minOrderQty),
        maxOrderQty: Number(form.maxOrderQty),
      });
      toast.success('🌱 Product add झाले! Admin approval नंतर live होईल.');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Product add failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/farmer/products" style={s.back}>← Products</Link>
        <h1 style={s.title}>नवीन Product Add करा</h1>
        <p style={s.sub}>तुमचा भाजीपाला / फळ list करा</p>
      </div>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Basic माहिती</h2>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Product नाव (English) *</label>
              <input style={s.input} placeholder="e.g. Tomato" value={form.name} onChange={e => f('name', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Product नाव (मराठी)</label>
              <input style={s.input} placeholder="उदा. टोमॅटो" value={form.nameMarathi} onChange={e => f('nameMarathi', e.target.value)} />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Category *</label>
            <select style={s.input} value={form.category} onChange={e => f('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea style={{ ...s.input, height: '100px', resize: 'vertical' }} placeholder="तुमच्या product बद्दल सांगा..." value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
          <div style={s.organicCheck}>
            <input type="checkbox" id="organic" checked={form.isOrganic} onChange={e => f('isOrganic', e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="organic" style={s.organicLabel}>🌿 हे Organic आहे (Chemical free)</label>
          </div>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>किंमत आणि Quantity</h2>
          <div style={s.grid3}>
            <div style={s.field}>
              <label style={s.label}>किंमत (₹) *</label>
              <input style={s.input} type="number" placeholder="40" value={form.price} onChange={e => f('price', e.target.value)} required min="1" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Unit *</label>
              <select style={s.input} value={form.unit} onChange={e => f('unit', e.target.value)}>
                {units.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Available Qty *</label>
              <input style={s.input} type="number" placeholder="100" value={form.availableQty} onChange={e => f('availableQty', e.target.value)} required min="0.5" />
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Min Order Qty</label>
              <input style={s.input} type="number" step="0.5" value={form.minOrderQty} onChange={e => f('minOrderQty', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Max Order Qty</label>
              <input style={s.input} type="number" value={form.maxOrderQty} onChange={e => f('maxOrderQty', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>इतर माहिती</h2>
          <div style={s.field}>
            <label style={s.label}>Harvest Date</label>
            <input style={s.input} type="date" value={form.harvestDate} onChange={e => f('harvestDate', e.target.value)} />
          </div>
          <div style={s.noteBox}>
            <p style={s.noteText}>📋 Note: Product submit केल्यावर Admin review करेल. Approved झाल्यावर ते buyers ला दिसेल.</p>
          </div>
        </div>

        <div style={s.btnRow}>
          <Link to="/farmer/products" style={s.cancelBtn}>रद्द करा</Link>
          <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Submitting...' : '🌱 Product Add करा'}
          </button>
        </div>
      </form>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif" },
  header: { maxWidth: '800px', margin: '0 auto 2rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' },
  sub: { color: '#6b7280' },
  form: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#111827' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.75rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  organicCheck: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '10px', cursor: 'pointer' },
  organicLabel: { cursor: 'pointer', fontWeight: 600, color: '#166534' },
  noteBox: { background: '#fef9c3', borderRadius: '10px', padding: '1rem', border: '1px solid #fde68a' },
  noteText: { color: '#92400e', fontSize: '0.85rem' },
  btnRow: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  cancelBtn: { background: '#f3f4f6', color: '#374151', padding: '0.85rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 },
  submitBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
};

export default AddProduct;
