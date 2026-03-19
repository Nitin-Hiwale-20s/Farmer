// ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setProduct(res.data.product)).catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.info('आधी Login करा'); return; }
    addToCart({ ...product, quantity: qty });
    toast.success(`${product.name} cart मध्ये add झाले!`);
  };

  if (!product) return <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Segoe UI', sans-serif", color: '#6b7280' }}>Loading...</div>;

  return (
    <div style={s.page}>
      <Link to="/shop" style={s.back}>← Shop</Link>
      <div style={s.layout}>
        <div style={s.imgArea}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            : <div style={s.imgPlaceholder}>🥦</div>}
        </div>
        <div style={s.info}>
          {product.isOrganic && <span style={s.organicBadge}>🌿 Organic</span>}
          <h1 style={s.name}>{product.name}</h1>
          {product.nameMarathi && <p style={s.nameMr}>{product.nameMarathi}</p>}
          <p style={s.price}>₹{product.price} <span style={s.unit}>per {product.unit}</span></p>
          {product.description && <p style={s.desc}>{product.description}</p>}
          <div style={s.farmerCard}>
            <div style={s.farmerIcon}>👨‍🌾</div>
            <div>
              <div style={s.farmerName}>{product.farmer?.farmName || product.farmer?.name}</div>
              <div style={s.farmerId}>ID: {product.farmer?.farmerId}</div>
              <div style={s.farmerLoc}>📍 {product.farmer?.farmLocation?.village}, {product.farmer?.farmLocation?.district}</div>
            </div>
          </div>
          <div style={s.meta}>
            <div style={s.metaItem}><span style={s.metaLabel}>Category:</span> {product.category}</div>
            <div style={s.metaItem}><span style={s.metaLabel}>Available:</span> {product.availableQty} {product.unit}</div>
            {product.harvestDate && <div style={s.metaItem}><span style={s.metaLabel}>Harvest:</span> {new Date(product.harvestDate).toLocaleDateString('mr-IN')}</div>}
          </div>
          <div style={s.addSection}>
            <div style={s.qtyControl}>
              <button style={s.qBtn} onClick={() => setQty(Math.max(product.minOrderQty || 0.5, qty - 0.5))}>-</button>
              <span style={s.qVal}>{qty} {product.unit}</span>
              <button style={s.qBtn} onClick={() => setQty(Math.min(product.availableQty, qty + 0.5))}>+</button>
            </div>
            <button style={s.addBtn} onClick={handleAddToCart}>🛒 Cart मध्ये Add करा — ₹{(product.price * qty).toFixed(0)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '1000px', margin: '0 auto' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  imgArea: { height: '350px', borderRadius: '16px', background: '#f0fdf4', overflow: 'hidden' },
  imgPlaceholder: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' },
  info: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  organicBadge: { background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, width: 'fit-content' },
  name: { fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 },
  nameMr: { color: '#6b7280', margin: 0 },
  price: { fontSize: '2rem', fontWeight: 800, color: '#15803d', margin: 0 },
  unit: { fontSize: '1rem', fontWeight: 400, color: '#6b7280' },
  desc: { color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' },
  farmerCard: { display: 'flex', gap: '0.75rem', background: '#f0fdf4', borderRadius: '12px', padding: '0.75rem 1rem', alignItems: 'center' },
  farmerIcon: { fontSize: '1.5rem' },
  farmerName: { fontWeight: 700, color: '#15803d' },
  farmerId: { fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' },
  farmerLoc: { fontSize: '0.78rem', color: '#6b7280' },
  meta: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  metaItem: { fontSize: '0.85rem', color: '#374151' },
  metaLabel: { fontWeight: 700 },
  addSection: { display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '0.5rem 0.75rem', borderRadius: '10px' },
  qBtn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: '#374151' },
  qVal: { fontWeight: 700, minWidth: '70px', textAlign: 'center' },
  addBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
};

export default ProductDetail;
