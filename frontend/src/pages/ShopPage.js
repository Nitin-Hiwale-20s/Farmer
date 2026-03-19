import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CATEGORIES = ['सर्व', 'भाजीपाला', 'फळे', 'धान्य', 'कडधान्य', 'मसाले', 'इतर'];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('सर्व');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const { addToCart, cartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'सर्व') params.category = category;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Products load झाले नाहीत');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) { toast.info('आधी Login करा'); return; }
    if (user.role !== 'buyer') { toast.info('फक्त buyers cart वापरू शकतात'); return; }
    addToCart(product);
    toast.success(`${product.name} cart मध्ये add झाले! 🛒`);
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <Link to="/" style={s.logo}>🌾 FarmConnect</Link>
          <div style={s.searchBar}>
            <input style={s.searchInput} placeholder="भाजीपाला शोधा..." value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProducts()} />
            <button style={s.searchBtn} onClick={fetchProducts}>🔍</button>
          </div>
          <div style={s.headerRight}>
            {user ? (
              <>
                <Link to={user.role === 'farmer' ? '/farmer' : user.role === 'admin' ? '/admin' : user.role === 'delivery' ? '/delivery' : '/orders'} style={s.dashLink}>Dashboard</Link>
                {user.role === 'buyer' && <Link to="/cart" style={s.cartBtn}>🛒 {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}</Link>}
              </>
            ) : (
              <Link to="/login" style={s.loginBtn}>Login</Link>
            )}
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <h3 style={s.sidebarTitle}>Category</h3>
          {CATEGORIES.map(cat => (
            <button key={cat} style={{ ...s.catBtn, background: category === cat ? '#16a34a' : '#f3f4f6', color: category === cat ? '#fff' : '#374151' }}
              onClick={() => setCategory(cat)}>{cat}</button>
          ))}
          <h3 style={{ ...s.sidebarTitle, marginTop: '1.5rem' }}>Sort करा</h3>
          {[['', 'Latest'], ['price_low', 'कमी किंमत'], ['price_high', 'जास्त किंमत'], ['rating', 'Rating']].map(([val, label]) => (
            <button key={val} style={{ ...s.catBtn, background: sort === val ? '#0ea5e9' : '#f3f4f6', color: sort === val ? '#fff' : '#374151' }}
              onClick={() => setSort(val)}>{label}</button>
          ))}
        </div>

        {/* Products */}
        <div style={s.main}>
          <div style={s.topBar}>
            <h2 style={s.heading}>{category === 'सर्व' ? 'सर्व भाजीपाला' : category} <span style={s.count}>({products.length})</span></h2>
          </div>
          {loading ? (
            <div style={s.loading}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: '3rem' }}>🌱</div>
              <p>Products सापडले नाहीत</p>
            </div>
          ) : (
            <div style={s.grid}>
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  return (
    <div style={s.card}>
      <Link to={`/product/${product._id}`} style={s.cardImgLink}>
        <div style={s.cardImg}>
          {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={s.cardImgPlaceholder}>🥦</div>}
        </div>
      </Link>
      <div style={s.cardBody}>
        {product.isOrganic && <span style={s.organicBadge}>🌿 Organic</span>}
        <Link to={`/product/${product._id}`} style={s.cardName}>{product.name}</Link>
        {product.nameMarathi && <p style={s.cardNameMr}>{product.nameMarathi}</p>}
        <p style={s.cardFarmer}>👨‍🌾 {product.farmer?.farmName || product.farmer?.name} · {product.farmer?.farmerId}</p>
        <p style={s.cardLocation}>📍 {product.farmer?.farmLocation?.district}</p>
        <div style={s.cardPriceRow}>
          <span style={s.cardPrice}>₹{product.price}<span style={s.cardUnit}>/{product.unit}</span></span>
          <span style={s.cardStock}>{product.availableQty} {product.unit} available</span>
        </div>
        {product.rating > 0 && <div style={s.rating}>{'⭐'.repeat(Math.round(product.rating))} ({product.totalReviews})</div>}
        <div style={s.cardActions}>
          <div style={s.qtyControl}>
            <button style={s.qtyBtn} onClick={() => setQty(Math.max(0.5, qty - 0.5))}>-</button>
            <span style={s.qtyVal}>{qty} {product.unit}</span>
            <button style={s.qtyBtn} onClick={() => setQty(Math.min(product.availableQty, qty + 0.5))}>+</button>
          </div>
          <button style={s.addBtn} onClick={() => onAddToCart({ ...product, quantity: qty })}>Cart +</button>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', fontFamily: "'Segoe UI', sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  logo: { fontSize: '1.3rem', fontWeight: 700, color: '#15803d', textDecoration: 'none', whiteSpace: 'nowrap' },
  searchBar: { flex: 1, display: 'flex', gap: '0.5rem' },
  searchInput: { flex: 1, padding: '0.6rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  searchBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  dashLink: { color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' },
  cartBtn: { position: 'relative', background: '#f0fdf4', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.2rem', textDecoration: 'none' },
  cartBadge: { position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginBtn: { background: '#16a34a', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 },
  content: { maxWidth: '1400px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' },
  sidebar: { width: '200px', flexShrink: 0 },
  sidebarTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' },
  catBtn: { display: 'block', width: '100%', textAlign: 'left', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '0.4rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s' },
  main: { flex: 1 },
  topBar: { marginBottom: '1.5rem' },
  heading: { fontSize: '1.4rem', fontWeight: 700, color: '#111827' },
  count: { color: '#6b7280', fontWeight: 400 },
  loading: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardImgLink: { textDecoration: 'none' },
  cardImg: { height: '160px', background: '#f0fdf4', overflow: 'hidden' },
  cardImgPlaceholder: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' },
  cardBody: { padding: '1rem' },
  organicBadge: { background: '#dcfce7', color: '#166534', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 },
  cardName: { display: 'block', fontWeight: 700, fontSize: '1rem', color: '#111827', textDecoration: 'none', marginTop: '0.4rem' },
  cardNameMr: { color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' },
  cardFarmer: { fontSize: '0.78rem', color: '#16a34a', margin: '0.3rem 0 0' },
  cardLocation: { fontSize: '0.78rem', color: '#9ca3af', margin: '0.2rem 0' },
  cardPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' },
  cardPrice: { fontSize: '1.15rem', fontWeight: 800, color: '#15803d' },
  cardUnit: { fontSize: '0.8rem', fontWeight: 400, color: '#6b7280' },
  cardStock: { fontSize: '0.75rem', color: '#6b7280' },
  rating: { fontSize: '0.78rem', marginBottom: '0.5rem', color: '#6b7280' },
  cardActions: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f3f4f6', borderRadius: '8px', padding: '0.2rem 0.5rem' },
  qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#374151', padding: '0 0.2rem' },
  qtyVal: { fontSize: '0.8rem', fontWeight: 600, minWidth: '50px', textAlign: 'center' },
  addBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' },
};

export default ShopPage;
