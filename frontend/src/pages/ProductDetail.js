import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  useEffect(() => { axios.get(`/api/products/${id}`).then(res => setProduct(res.data.product)).catch(() => {}); }, [id]);

  const handleAdd = () => {
    if (!user) { toast.info('आधी Login करा'); return; }
    addToCart({ ...product, quantity: qty });
    toast.success(`${product.name} cart मध्ये add झाले!`);
  };

  if (!product) return <div style={{ minHeight: '100vh', background: c.bg }}><Navbar /><div style={{ textAlign: 'center', padding: '4rem', color: c.subText }}>Loading...</div></div>;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Link to="/shop" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' }}>← Shop</Link>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', background: c.cardBg, borderRadius: '20px', padding: 'clamp(1rem,3vw,2rem)', marginTop: '1rem', border: `1px solid ${c.border}` }}>
          <div style={{ height: 'clamp(200px,40vw,350px)', borderRadius: '14px', background: c.sectionBg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '5rem' }}>🥦</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {product.isOrganic && <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, width: 'fit-content' }}>🌿 Organic</span>}
            <h1 style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 800, color: c.text }}>{product.name}</h1>
            {product.nameMarathi && <p style={{ color: c.subText }}>{product.nameMarathi}</p>}
            <p style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 800, color: '#15803d' }}>₹{product.price} <span style={{ fontSize: '1rem', fontWeight: 400, color: c.subText }}>per {product.unit}</span></p>
            {product.description && <p style={{ color: c.subText, lineHeight: 1.6, fontSize: '0.9rem' }}>{product.description}</p>}
            <div style={{ background: c.sectionBg, borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍🌾</span>
              <div>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>{product.farmer?.farmName || product.farmer?.name}</div>
                <div style={{ fontSize: '0.75rem', color: c.subText, fontFamily: 'monospace' }}>{product.farmer?.farmerId}</div>
                <div style={{ fontSize: '0.78rem', color: c.subText }}>📍 {product.farmer?.farmLocation?.village}, {product.farmer?.farmLocation?.district}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: c.subText, flexWrap: 'wrap' }}>
              <span><strong style={{ color: c.text }}>Category:</strong> {product.category}</span>
              <span><strong style={{ color: c.text }}>Available:</strong> {product.availableQty} {product.unit}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: c.hover, padding: '0.5rem 0.75rem', borderRadius: '10px' }}>
                <button onClick={() => setQty(Math.max(product.minOrderQty || 0.5, qty - 0.5))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: c.text }}>-</button>
                <span style={{ fontWeight: 700, minWidth: '70px', textAlign: 'center', color: c.text }}>{qty} {product.unit}</span>
                <button onClick={() => setQty(Math.min(product.availableQty, qty + 0.5))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: c.text }}>+</button>
              </div>
              <button style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }} onClick={handleAdd}>
                🛒 Cart — ₹{(product.price * qty).toFixed(0)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;