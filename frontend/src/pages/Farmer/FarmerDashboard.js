import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, completedOrders: 0, totalEarnings: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([axios.get('/api/products/farmer/my-products'), axios.get('/api/orders/farmer-orders')]);
      const orders = oRes.data.orders || [];
      setStats({ products: pRes.data.products.length, pendingOrders: orders.filter(o => ['pending','confirmed','packed'].includes(o.status)).length, completedOrders: orders.filter(o => o.status === 'delivered').length, totalEarnings: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.items.filter(i => i.farmer === user._id || i.farmer?._id === user._id).reduce((ss, i) => ss + i.totalPrice, 0), 0) });
      setRecentOrders(orders.slice(0, 5));
    } catch { toast.error('Data load failed'); }
    finally { setLoading(false); }
  };

  const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };
  const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', picked_up: 'Picked Up', in_transit: 'Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

  const sidebarBg = isDark ? '#0f172a' : 'linear-gradient(180deg,#052e16,#14532d)';
  const navLinks = [{ to: '/farmer', icon: '📊', label: 'Dashboard' }, { to: '/farmer/products', icon: '🥦', label: 'माझे Products' }, { to: '/farmer/products/add', icon: '➕', label: 'Product Add करा' }, { to: '/farmer/orders', icon: '📦', label: 'Orders' }];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: c.bg }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: sidebarBg, color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.5rem' }}>🌾 FarmConnect</div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>👨‍🌾</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.72rem', color: '#4ade80', fontFamily: 'monospace', marginBottom: '0.2rem' }}>{user?.farmerId}</div>
          <div style={{ fontSize: '0.78rem', color: '#d1fae5' }}>{user?.farmName}</div>
          {user?.isVerified && <div style={{ background: '#16a34a', color: '#fff', fontSize: '0.68rem', padding: '2px 10px', borderRadius: '20px', marginTop: '0.4rem', display: 'inline-block' }}>✓ Verified</div>}
        </div>
        <nav style={{ flex: 1 }}>
          {navLinks.map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', borderRadius: '10px', color: '#d1fae5', textDecoration: 'none', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fca5a5', border: 'none', padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }} onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 'clamp(1rem,3vw,2rem)', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1 style={{ fontSize: 'clamp(1.3rem,3vw,1.6rem)', fontWeight: 700, color: c.text, marginBottom: '0.2rem' }}>नमस्ते, {user?.name?.split(' ')[0]}! 🙏</h1><p style={{ color: c.subText, fontSize: '0.9rem' }}>तुमचे FarmConnect Dashboard</p></div>
          <Link to="/farmer/products/add" style={{ background: '#16a34a', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>+ नवीन Product</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[{ icon: '🥦', label: 'माझे Products', value: stats.products, color: '#16a34a' }, { icon: '⏳', label: 'Pending Orders', value: stats.pendingOrders, color: '#f59e0b' }, { icon: '✅', label: 'Delivered', value: stats.completedOrders, color: '#10b981' }, { icon: '💰', label: 'एकूण कमाई', value: `₹${stats.totalEarnings.toFixed(0)}`, color: '#8b5cf6' }].map((stat, i) => (
            <div key={i} style={{ background: c.cardBg, borderRadius: '14px', padding: '1.2rem', border: `1px solid ${c.border}`, textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: stat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.6rem' }}>{stat.icon}</div>
              <div style={{ fontSize: 'clamp(1.3rem,3vw,1.7rem)', fontWeight: 800, color: stat.color, marginBottom: '0.2rem' }}>{stat.value}</div>
              <div style={{ color: c.subText, fontSize: '0.8rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${c.border}`, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: c.text }}>Recent Orders</h2>
            <Link to="/farmer/orders" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>सर्व बघा →</Link>
          </div>
          {loading ? <p style={{ color: c.subText }}>Loading...</p> : recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: c.subText }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
              <p>अजून कोणते orders नाहीत</p>
              <Link to="/farmer/products/add" style={{ display: 'inline-block', background: '#16a34a', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '10px', textDecoration: 'none', marginTop: '0.75rem', fontWeight: 600, fontSize: '0.88rem' }}>Product Add करा</Link>
            </div>
          ) : recentOrders.map(order => (
            <div key={order._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr', padding: '0.75rem', background: c.tableRow, borderRadius: '10px', marginBottom: '0.5rem', fontSize: '0.85rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', color: '#16a34a', fontSize: '0.8rem' }}>{order.orderId}</span>
              <span style={{ color: c.text }}>{order.buyer?.name}</span>
              <span style={{ color: c.subText }}>{order.items?.length} items</span>
              <span style={{ fontWeight: 600, color: c.text }}>₹{order.grandTotal}</span>
              <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status], width: 'fit-content' }}>{STATUS_LABELS[order.status]}</span>
            </div>
          ))}
        </div>

        <div style={{ background: isDark ? '#1a3a2a' : 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: isDark ? '#4ade80' : '#15803d' }}>💡 Tips</h3>
          {['Products चे photos upload करा — जास्त orders येतात', 'Organic असल्यास mark करा — premium price मिळतो', 'Available quantity update ठेवा', 'Orders लवकर confirm करा'].map((tip, i) => (
            <div key={i} style={{ fontSize: '0.88rem', color: isDark ? '#86efac' : '#166534', marginBottom: '0.4rem' }}>✅ {tip}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FarmerDashboard;
