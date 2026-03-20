import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = filter === 'pending' ? '/api/admin/products/pending' : '/api/products?limit=100';
      const res = await axios.get(url);
      setProducts(res.data.products);
    } catch { toast.error('Load failed'); }
    finally { setLoading(false); }
  };

  const approve = async (id) => {
    try {
      await axios.put(`/api/admin/products/${id}/approve`);
      setProducts(prev => filter === 'pending' ? prev.filter(p => p._id !== id) : prev.map(p => p._id === id ? { ...p, isApproved: true } : p));
      toast.success('✅ Product approved!');
    } catch { toast.error('Approve failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Product delete करायचे आहे का?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted!');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/admin" style={s.back}>← Dashboard</Link>
        <h1 style={s.title}>Products Management</h1>
      </div>
      <div style={s.tabs}>
        {[['pending', '⏳ Pending Approval'], ['all', '🥦 सर्व Products']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ ...s.tab, background: filter === val ? '#111827' : '#f3f4f6', color: filter === val ? '#fff' : '#374151' }}>
            {label}
          </button>
        ))}
      </div>
      {loading ? <p style={s.loading}>Loading...</p> : products.length === 0 ? (
        <div style={s.empty}><div style={{ fontSize: '3rem' }}>✅</div><p>कोणते pending products नाहीत</p></div>
      ) : (
        <div style={s.grid}>
          {products.map(p => (
            <div key={p._id} style={s.card}>
              <div style={s.cardImg}>
                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '2.5rem' }}>🥦</span>}
              </div>
              <div style={s.cardBody}>
                <div style={s.cardName}>{p.name} {p.nameMarathi && `(${p.nameMarathi})`}</div>
                <div style={s.meta}>
                  <span>{p.category}</span>
                  <span>₹{p.price}/{p.unit}</span>
                  <span>{p.availableQty} {p.unit}</span>
                </div>
                <div style={s.farmerInfo}>
                  <span>👨‍🌾 {p.farmer?.name}</span>
                  <span style={s.farmerId}>{p.farmer?.farmerId}</span>
                </div>
                {p.isOrganic && <span style={s.organicBadge}>🌿 Organic</span>}
                <span style={{ ...s.approvalBadge, background: p.isApproved ? '#dcfce7' : '#fef9c3', color: p.isApproved ? '#166534' : '#92400e' }}>
                  {p.isApproved ? '✓ Approved' : '⏳ Pending'}
                </span>
                <div style={s.actions}>
                  {!p.isApproved && <button style={s.approveBtn} onClick={() => approve(p._id)}>✓ Approve</button>}
                  <button style={s.deleteBtn} onClick={() => deleteProduct(p._id)}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '1300px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.3rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  loading: { textAlign: 'center', color: '#6b7280', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardImg: { height: '150px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardBody: { padding: '1rem' },
  cardName: { fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#111827' },
  meta: { display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem', flexWrap: 'wrap' },
  farmerInfo: { display: 'flex', gap: '0.5rem', fontSize: '0.78rem', marginBottom: '0.4rem', alignItems: 'center' },
  farmerId: { background: '#f0fdf4', color: '#16a34a', padding: '1px 8px', borderRadius: '20px', fontFamily: 'monospace', fontSize: '0.72rem' },
  organicBadge: { background: '#dcfce7', color: '#166534', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600, marginRight: '0.4rem' },
  approvalBadge: { fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  approveBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' },
  deleteBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' },
};

export default AdminProducts;
