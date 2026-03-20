import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const CATEGORIES_MR = ['सर्व', 'भाजीपाला', 'फळे', 'धान्य', 'कडधान्य', 'मसाले', 'इतर'];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('सर्व');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, theme } = useTheme();
  const c = theme.colors;

  useEffect(() => { fetchProducts(); }, [category, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'सर्व') params.category = category;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
    } catch { toast.error('Products load झाले नाहीत'); }
    finally { setLoading(false); }
  };

  const handleAddToCart = (product) => {
    if (!user) { toast.info('आधी Login करा'); return; }
    if (user.role !== 'buyer') { toast.info('फक्त buyers cart वापरू शकतात'); return; }
    addToCart(product);
    toast.success(`${product.name} cart मध्ये add झाले! 🛒`);
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      {/* Search Bar */}
      <div style={{ background: c.cardBg, borderBottom: `1px solid ${c.border}`, padding: '0.75rem 1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
          <input style={{ flex: 1, padding: '0.65rem 1rem', border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '0.95rem', background: c.input, color: c.inputText, outline: 'none' }}
            placeholder={t.shop.search} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()} />
          <button style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }} onClick={fetchProducts}>🔍</button>
          <button style={{ background: c.hover, color: c.text, border: `1px solid ${c.border}`, padding: '0.65rem 1rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            🔽 Filter
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', gap: '1.5rem' }}>
        {/* Sidebar - Desktop always visible, Mobile toggle */}
        <div style={{ width: '200px', flexShrink: 0, display: sidebarOpen || window.innerWidth > 768 ? 'block' : 'none' }}>
          <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.2rem', border: `1px solid ${c.border}`, position: 'sticky', top: '80px' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: c.subText, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Category</p>
            {CATEGORIES_MR.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setSidebarOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', padding: '0.55rem 0.8rem', borderRadius: '8px', marginBottom: '0.3rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.88rem', transition: 'all 0.2s', background: category === cat ? '#16a34a' : c.hover, color: category === cat ? '#fff' : c.text }}>
                {cat}
              </button>
            ))}
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: c.subText, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1.2rem 0 0.75rem' }}>{t.shop.sort}</p>
            {[['', t.shop.latest], ['price_low', t.shop.priceLow], ['price_high', t.shop.priceHigh], ['rating', '⭐ Rating']].map(([val, label]) => (
              <button key={val} onClick={() => setSort(val)}
                style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', padding: '0.55rem 0.8rem', borderRadius: '8px', marginBottom: '0.3rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.88rem', background: sort === val ? '#0ea5e9' : c.hover, color: sort === val ? '#fff' : c.text }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: c.text }}>
              {category === 'सर्व' ? t.shop.title : category} <span style={{ color: c.subText, fontWeight: 400 }}>({products.length})</span>
            </h2>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: c.subText }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
              {t.common.loading}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: c.subText }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <p>{t.shop.noProducts}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
              {products.map(product => <ProductCard key={product._id} product={product} onAdd={handleAddToCart} t={t} c={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAdd, t, c }) => {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ background: c.cardBg, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${c.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
      <Link to={`/product/${product._id}`}>
        <div style={{ height: '140px', background: c.sectionBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '3rem' }}>🥦</span>}
        </div>
      </Link>
      <div style={{ padding: '0.85rem' }}>
        {product.isOrganic && <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '20px', fontWeight: 700 }}>🌿 Organic</span>}
        <Link to={`/product/${product._id}`} style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: c.text, margin: '0.3rem 0 0.1rem', textDecoration: 'none' }}>{product.name}</Link>
        <p style={{ fontSize: '0.72rem', color: '#16a34a', marginBottom: '0.3rem' }}>👨‍🌾 {product.farmer?.farmName || product.farmer?.name}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>₹{product.price}<span style={{ fontSize: '0.72rem', fontWeight: 400, color: c.subText }}>/{product.unit}</span></span>
          <span style={{ fontSize: '0.68rem', color: c.subText }}>{product.availableQty} {product.unit}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: c.hover, borderRadius: '7px', padding: '0.2rem 0.4rem' }}>
            <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: c.text, fontSize: '1rem', lineHeight: 1 }}>-</button>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.text, minWidth: '35px', textAlign: 'center' }}>{qty}{product.unit}</span>
            <button onClick={() => setQty(Math.min(product.availableQty, qty + 0.5))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: c.text, fontSize: '1rem', lineHeight: 1 }}>+</button>
          </div>
          <button style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.45rem 0.4rem', borderRadius: '7px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
            onClick={() => onAdd({ ...product, quantity: qty })}>🛒 {t.shop.addCart}</button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
