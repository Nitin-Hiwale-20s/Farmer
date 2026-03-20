import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({});
  const [pendingProducts, setPendingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [dashRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/products/pending'),
        axios.get('/api/admin/orders?status=pending')
      ]);
      setStats(dashRes.data.stats);
      setPendingProducts(productsRes.data.products.slice(0, 5));
      setRecentOrders(ordersRes.data.orders.slice(0, 5));
    } catch { toast.error('Data load failed'); }
    finally { setLoading(false); }
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(`/api/admin/products/${id}/approve`);
      setPendingProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product approved!');
    } catch { toast.error('Approve failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.logo}>🌾 FarmConnect</div>
        <div style={s.adminBadge}>👑 Admin Panel</div>
        <nav style={s.nav}>
          {[
            { to: '/admin', icon: '📊', label: 'Dashboard' },
            { to: '/admin/users', icon: '👥', label: 'Users' },
            { to: '/admin/products', icon: '🥦', label: 'Products' },
            { to: '/admin/orders', icon: '📦', label: 'Orders' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={s.navItem}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.sub}>FarmConnect Platform Management</p>
        </div>

        {/* Stats Grid */}
        <div style={s.statsGrid}>
          {[
            { icon: '👨‍🌾', label: 'Farmers', value: stats.totalFarmers || 0, color: '#16a34a', link: '/admin/users?role=farmer' },
            { icon: '🏠', label: 'Buyers', value: stats.totalBuyers || 0, color: '#0ea5e9', link: '/admin/users?role=buyer' },
            { icon: '🚴', label: 'Delivery Boys', value: stats.totalDelivery || 0, color: '#f97316', link: '/admin/users?role=delivery' },
            { icon: '🥦', label: 'Products', value: stats.totalProducts || 0, color: '#8b5cf6', link: '/admin/products' },
            { icon: '📦', label: 'Total Orders', value: stats.totalOrders || 0, color: '#0891b2', link: '/admin/orders' },
            { icon: '⏳', label: 'Pending Approval', value: stats.pendingProducts || 0, color: '#f59e0b', link: '/admin/products' },
            { icon: '🚨', label: 'Pending Orders', value: stats.pendingOrders || 0, color: '#ef4444', link: '/admin/orders' },
            { icon: '💰', label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toFixed(0)}`, color: '#10b981', link: '/admin/orders' },
          ].map((stat, i) => (
            <Link key={i} to={stat.link} style={{ ...s.statCard, textDecoration: 'none' }}>
              <div style={{ ...s.statIcon, background: stat.color + '20' }}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </Link>
          ))}
        </div>

        <div style={s.twoCol}>
          {/* Pending Product Approvals */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>⏳ Pending Product Approvals</h2>
              <Link to="/admin/products" style={s.viewAll}>सर्व बघा</Link>
            </div>
            {loading ? <p style={{ color: '#6b7280' }}>Loading...</p>
              : pendingProducts.length === 0 ? (
                <div style={s.emptySmall}>✅ सर्व products approved आहेत</div>
              ) : pendingProducts.map(p => (
                <div key={p._id} style={s.pendingRow}>
                  <div>
                    <div style={s.pendingName}>{p.name} {p.nameMarathi && `(${p.nameMarathi})`}</div>
                    <div style={s.pendingFarmer}>👨‍🌾 {p.farmer?.name} · {p.farmer?.farmerId}</div>
                    <div style={s.pendingMeta}>{p.category} · ₹{p.price}/{p.unit}</div>
                  </div>
                  <button style={s.approveBtn} onClick={() => approveProduct(p._id)}>✓ Approve</button>
                </div>
              ))}
          </div>

          {/* Recent Pending Orders */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>🚨 Pending Orders</h2>
              <Link to="/admin/orders" style={s.viewAll}>सर्व बघा</Link>
            </div>
            {loading ? <p style={{ color: '#6b7280' }}>Loading...</p>
              : recentOrders.length === 0 ? (
                <div style={s.emptySmall}>✅ कोणते pending orders नाहीत</div>
              ) : recentOrders.map(order => (
                <div key={order._id} style={s.pendingRow}>
                  <div>
                    <div style={s.pendingName}>{order.orderId}</div>
                    <div style={s.pendingFarmer}>{order.buyer?.name} · ₹{order.grandTotal}</div>
                    <div style={s.pendingMeta}>{order.items?.length} items · {new Date(order.createdAt).toLocaleDateString('mr-IN')}</div>
                  </div>
                  <Link to={`/orders/${order._id}`} style={s.viewBtn}>View</Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f9fafb' },
  sidebar: { width: '240px', background: '#111827', color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' },
  logo: { fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.5rem' },
  adminBadge: { background: '#374151', color: '#fbbf24', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', display: 'inline-block' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.2s' },
  logoutBtn: { background: '#374151', color: '#fca5a5', border: 'none', padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, marginTop: 'auto' },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  topbar: { marginBottom: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginBottom: '0.2rem' },
  sub: { color: '#6b7280' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#fff', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', cursor: 'pointer' },
  statIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.6rem' },
  statValue: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' },
  statLabel: { color: '#6b7280', fontSize: '0.8rem' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  section: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#111827' },
  viewAll: { color: '#16a34a', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 },
  emptySmall: { color: '#16a34a', fontSize: '0.9rem', padding: '1rem 0', textAlign: 'center' },
  pendingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' },
  pendingName: { fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' },
  pendingFarmer: { fontSize: '0.78rem', color: '#16a34a', marginBottom: '0.1rem' },
  pendingMeta: { fontSize: '0.75rem', color: '#9ca3af' },
  approveBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' },
  viewBtn: { background: '#f3f4f6', color: '#374151', padding: '0.4rem 0.9rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem' },
};

export default AdminDashboard;
