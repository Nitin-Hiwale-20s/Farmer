import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, completedOrders: 0, totalEarnings: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products/farmer/my-products'),
        axios.get('/api/orders/farmer-orders')
      ]);
      const orders = ordersRes.data.orders || [];
      const pending = orders.filter(o => ['pending', 'confirmed', 'packed'].includes(o.status)).length;
      const completed = orders.filter(o => o.status === 'delivered').length;
      const earnings = orders.filter(o => o.status === 'delivered').reduce((sum, o) => {
        const myItems = o.items.filter(i => i.farmer?._id === user._id || i.farmer === user._id);
        return sum + myItems.reduce((s, i) => s + i.totalPrice, 0);
      }, 0);
      setStats({ products: productsRes.data.products.length, pendingOrders: pending, completedOrders: completed, totalEarnings: earnings });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      toast.error('Data load failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };
  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', picked_up: 'Picked Up', in_transit: 'Transit मध्ये', delivered: 'Delivered', cancelled: 'Cancelled' };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>🌾 FarmConnect</div>
        <div style={s.farmerInfo}>
          <div style={s.farmerAvatar}>👨‍🌾</div>
          <div style={s.farmerName}>{user?.name}</div>
          <div style={s.farmerId}>ID: {user?.farmerId}</div>
          <div style={s.farmName}>{user?.farmName}</div>
          {user?.isVerified && <div style={s.verifiedBadge}>✓ Verified Farmer</div>}
        </div>
        <nav style={s.nav}>
          {[
            { to: '/farmer', icon: '📊', label: 'Dashboard' },
            { to: '/farmer/products', icon: '🥦', label: 'माझे Products' },
            { to: '/farmer/products/add', icon: '➕', label: 'Product Add करा' },
            { to: '/farmer/orders', icon: '📦', label: 'Orders' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={s.navItem}>
              <span style={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>नमस्ते, {user?.name?.split(' ')[0]}! 🙏</h1>
            <p style={s.pageSub}>तुमचे FarmConnect Dashboard</p>
          </div>
          <Link to="/farmer/products/add" style={s.addBtn}>+ नवीन Product</Link>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { icon: '🥦', label: 'माझे Products', value: stats.products, color: '#16a34a' },
            { icon: '⏳', label: 'Pending Orders', value: stats.pendingOrders, color: '#f59e0b' },
            { icon: '✅', label: 'Delivered Orders', value: stats.completedOrders, color: '#10b981' },
            { icon: '💰', label: 'एकूण कमाई', value: `₹${stats.totalEarnings.toFixed(0)}`, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.color + '20' }}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Recent Orders</h2>
            <Link to="/farmer/orders" style={s.viewAll}>सर्व बघा →</Link>
          </div>
          {loading ? <p style={{ color: '#6b7280' }}>Loading...</p> : recentOrders.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: '3rem' }}>📦</div>
              <p>अजून कोणते orders नाहीत</p>
              <Link to="/farmer/products/add" style={s.emptyBtn}>Product Add करा</Link>
            </div>
          ) : (
            <div style={s.ordersTable}>
              <div style={s.tableHeader}>
                <span>Order ID</span><span>ग्राहक</span><span>Items</span><span>Total</span><span>Status</span>
              </div>
              {recentOrders.map(order => (
                <div key={order._id} style={s.tableRow}>
                  <span style={s.orderId}>{order.orderId}</span>
                  <span>{order.buyer?.name}</span>
                  <span>{order.items?.length} items</span>
                  <span style={{ fontWeight: 600 }}>₹{order.grandTotal}</span>
                  <span style={{ ...s.statusBadge, background: statusColors[order.status] + '20', color: statusColors[order.status] }}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={s.tipsCard}>
          <h3 style={s.tipsTitle}>💡 शेतकरी Tips</h3>
          <div style={s.tipsList}>
            <div style={s.tip}>✅ Products चे photos upload करा — जास्त orders येतात</div>
            <div style={s.tip}>✅ Organic असल्यास mark करा — premium price मिळतो</div>
            <div style={s.tip}>✅ Available quantity update ठेवा</div>
            <div style={s.tip}>✅ Orders लवकर confirm करा — buyers खूश राहतात</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f9fafb' },
  sidebar: { width: '260px', background: 'linear-gradient(180deg, #052e16 0%, #14532d 100%)', color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' },
  sidebarLogo: { fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.5rem' },
  farmerInfo: { background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' },
  farmerAvatar: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  farmerName: { fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' },
  farmerId: { fontSize: '0.78rem', color: '#4ade80', marginBottom: '0.2rem', fontFamily: 'monospace' },
  farmName: { fontSize: '0.82rem', color: '#d1fae5' },
  verifiedBadge: { background: '#16a34a', color: '#fff', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', marginTop: '0.5rem', display: 'inline-block' },
  nav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', color: '#d1fae5', textDecoration: 'none', marginBottom: '0.3rem', transition: 'background 0.2s', fontSize: '0.9rem' },
  navIcon: { fontSize: '1.1rem' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', color: '#fca5a5', border: 'none', padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, marginTop: 'auto' },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  pageTitle: { fontSize: '1.6rem', fontWeight: 700, color: '#111827', marginBottom: '0.2rem' },
  pageSub: { color: '#6b7280', fontSize: '0.9rem' },
  addBtn: { background: '#16a34a', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' },
  statCard: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' },
  statIcon: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.75rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' },
  statLabel: { color: '#6b7280', fontSize: '0.85rem' },
  section: { background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827' },
  viewAll: { color: '#16a34a', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 },
  emptyState: { textAlign: 'center', padding: '2rem', color: '#6b7280' },
  emptyBtn: { display: 'inline-block', background: '#16a34a', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '10px', textDecoration: 'none', marginTop: '1rem', fontWeight: 600, fontSize: '0.9rem' },
  ordersTable: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '10px', fontSize: '0.9rem', alignItems: 'center' },
  orderId: { fontFamily: 'monospace', fontSize: '0.8rem', color: '#16a34a' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' },
  tipsCard: { background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' },
  tipsTitle: { fontWeight: 700, marginBottom: '1rem', color: '#15803d' },
  tipsList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tip: { fontSize: '0.9rem', color: '#166534' },
};

export default FarmerDashboard;
