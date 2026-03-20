import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products/farmer/my-products');
      setProducts(res.data.products);
    } catch { toast.error('Products load failed'); }
    finally { setLoading(false); }
  };

  const toggleAvailability = async (id, current) => {
    try {
      await axios.put(`/api/products/${id}`, { isAvailable: !current });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, isAvailable: !current } : p));
      toast.success('Status update झाला');
    } catch { toast.error('Update failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('हे product delete करायचे आहे का?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product delete झाले');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <Link to="/farmer" style={s.back}>← Dashboard</Link>
          <h1 style={s.title}>माझे Products</h1>
        </div>
        <Link to="/farmer/products/add" style={s.addBtn}>+ नवीन Product Add करा</Link>
      </div>
      {loading ? <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>Loading...</p>
        : products.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '4rem' }}>🌱</div>
            <h3>अजून कोणते products नाहीत</h3>
            <Link to="/farmer/products/add" style={s.addBtnEmpty}>पहिला Product Add करा</Link>
          </div>
        ) : (
          <div style={s.grid}>
            {products.map(product => (
              <div key={product._id} style={s.card}>
                <div style={s.cardImg}>
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2.5rem' }}>🥦</span>}
                  <div style={{ ...s.statusDot, background: product.isAvailable ? '#10b981' : '#ef4444' }}></div>
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardTop}>
                    <h3 style={s.cardName}>{product.name}</h3>
                    {product.nameMarathi && <span style={s.nameMr}>{product.nameMarathi}</span>}
                  </div>
                  <div style={s.badges}>
                    {product.isOrganic && <span style={s.organicBadge}>🌿 Organic</span>}
                    <span style={{ ...s.approvalBadge, background: product.isApproved ? '#dcfce7' : '#fef9c3', color: product.isApproved ? '#166534' : '#92400e' }}>
                      {product.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                    </span>
                  </div>
                  <div style={s.priceRow}>
                    <span style={s.price}>₹{product.price}/{product.unit}</span>
                    <span style={s.qty}>{product.availableQty} {product.unit} available</span>
                  </div>
                  <div style={s.stats}>
                    <span>👁 {product.views} views</span>
                    <span>🛒 {product.totalSold} sold</span>
                  </div>
                  <div style={s.actions}>
                    <button
                      style={{ ...s.actionBtn, background: product.isAvailable ? '#fee2e2' : '#dcfce7', color: product.isAvailable ? '#ef4444' : '#16a34a' }}
                      onClick={() => toggleAvailability(product._id, product.isAvailable)}>
                      {product.isAvailable ? 'Unavailable करा' : 'Available करा'}
                    </button>
                    <button style={{ ...s.actionBtn, background: '#fee2e2', color: '#ef4444' }} onClick={() => deleteProduct(product._id)}>Delete</button>
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
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827' },
  addBtn: { background: '#16a34a', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 },
  empty: { textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#6b7280' },
  addBtnEmpty: { background: '#16a34a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 },
  grid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardImg: { height: '160px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  statusDot: { position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #fff' },
  cardBody: { padding: '1rem' },
  cardTop: { marginBottom: '0.5rem' },
  cardName: { fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.2rem' },
  nameMr: { fontSize: '0.8rem', color: '#6b7280' },
  badges: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
  organicBadge: { background: '#dcfce7', color: '#166534', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 },
  approvalBadge: { fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' },
  price: { fontSize: '1.1rem', fontWeight: 800, color: '#15803d' },
  qty: { fontSize: '0.78rem', color: '#6b7280' },
  stats: { display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.75rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  actionBtn: { flex: 1, border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' },
};

export default FarmerProducts;
