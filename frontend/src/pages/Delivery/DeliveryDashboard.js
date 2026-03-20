import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DeliveryDashboard = () => {
  const { user, logout } = useAuth();
  const [myOrders, setMyOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [myRes, availableRes] = await Promise.all([
        axios.get('/api/delivery/my-deliveries'),
        axios.get('/api/delivery/available-orders')
      ]);
      setMyOrders(myRes.data.orders);
      setAvailableOrders(availableRes.data.orders);
    } catch { toast.error('Load failed'); }
    finally { setLoading(false); }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.put('/api/delivery/toggle-availability');
      setIsAvailable(res.data.isAvailable);
      toast.success(res.data.isAvailable ? '🟢 Available आहात' : '🔴 Unavailable झाला');
    } catch { toast.error('Update failed'); }
  };

  const acceptOrder = async (orderId) => {
    try {
      await axios.put(`/api/delivery/accept/${orderId}`);
      toast.success('Order accept केला!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Accept failed'); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status, note: `Delivery boy: ${status}` });
      setMyOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const STATUS_COLORS = { packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981' };

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.logo}>🌾 FarmConnect</div>
        <div style={s.deliveryInfo}>
          <div style={s.avatar}>🚴</div>
          <div style={s.dName}>{user?.name}</div>
          <div style={s.dArea}>{user?.assignedArea}</div>
          <div style={s.dVehicle}>🏍️ {user?.vehicleNumber}</div>
        </div>
        <div style={s.availToggle}>
          <span style={s.availLabel}>Status:</span>
          <button onClick={toggleAvailability} style={{ ...s.availBtn, background: isAvailable ? '#16a34a' : '#6b7280' }}>
            {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
          </button>
        </div>
        <nav style={s.nav}>
          <Link to="/delivery" style={s.navItem}>📊 Dashboard</Link>
          <Link to="/delivery/orders" style={s.navItem}>📦 माझे Orders</Link>
        </nav>
        <button style={s.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>

      <div style={s.main}>
        <h1 style={s.title}>Delivery Dashboard</h1>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { icon: '📦', label: 'Active Deliveries', value: myOrders.filter(o => ['picked_up', 'in_transit'].includes(o.status)).length, color: '#f97316' },
            { icon: '✅', label: 'Completed Today', value: myOrders.filter(o => o.status === 'delivered').length, color: '#10b981' },
            { icon: '🚚', label: 'Available Orders', value: availableOrders.length, color: '#0ea5e9' },
          ].map((stat, i) => (
            <div key={i} style={{ ...s.statCard, borderLeft: `4px solid ${stat.color}` }}>
              <div style={s.statIcon}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Available Orders to Accept */}
        {availableOrders.length > 0 && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>🚚 Available Orders (Accept करा)</h2>
            {availableOrders.map(order => (
              <div key={order._id} style={s.orderCard}>
                <div style={s.orderInfo}>
                  <span style={s.orderId}>{order.orderId}</span>
                  <span style={s.orderItems}>{order.items?.length} items · ₹{order.grandTotal}</span>
                  <div style={s.orderAddress}>
                    📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.district} - {order.deliveryAddress?.pincode}
                  </div>
                  <div style={s.buyerPhone}>📞 {order.buyer?.phone}</div>
                </div>
                <button style={s.acceptBtn} onClick={() => acceptOrder(order._id)}>✓ Accept करा</button>
              </div>
            ))}
          </div>
        )}

        {/* My Active Orders */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>📦 माझे Active Orders</h2>
          {loading ? <p style={{ color: '#6b7280' }}>Loading...</p>
            : myOrders.filter(o => o.status !== 'delivered').length === 0 ? (
              <div style={s.empty}><p>कोणते active orders नाहीत</p></div>
            ) : myOrders.filter(o => o.status !== 'delivered').map(order => (
              <div key={order._id} style={s.orderCard}>
                <div style={s.orderInfo}>
                  <span style={s.orderId}>{order.orderId}</span>
                  <span style={{ ...s.statusBadge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                    {order.status?.replace('_', ' ').toUpperCase()}
                  </span>
                  <div style={s.buyerInfo}>
                    <span>👤 {order.buyer?.name}</span>
                    <a href={`tel:${order.buyer?.phone}`} style={s.callBtn}>📞 Call</a>
                  </div>
                  <div style={s.orderAddress}>📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.district}</div>
                </div>
                <div style={s.statusActions}>
                  {order.status === 'picked_up' && (
                    <button style={s.updateBtn} onClick={() => updateStatus(order._id, 'in_transit')}>🚚 Transit सुरू</button>
                  )}
                  {order.status === 'in_transit' && (
                    <button style={{ ...s.updateBtn, background: '#10b981' }} onClick={() => updateStatus(order._id, 'delivered')}>✅ Delivered!</button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f9fafb' },
  sidebar: { width: '240px', background: 'linear-gradient(180deg, #1c1917 0%, #292524 100%)', color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' },
  logo: { fontSize: '1.1rem', fontWeight: 700, color: '#fb923c', marginBottom: '1rem' },
  deliveryInfo: { background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' },
  avatar: { fontSize: '2rem', marginBottom: '0.3rem' },
  dName: { fontWeight: 700, marginBottom: '0.2rem' },
  dArea: { fontSize: '0.78rem', color: '#fdba74' },
  dVehicle: { fontSize: '0.78rem', color: '#d6d3d1' },
  availToggle: { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' },
  availLabel: { fontSize: '0.75rem', color: '#d6d3d1' },
  availBtn: { border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#fff', fontSize: '0.85rem' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  navItem: { display: 'block', padding: '0.7rem 1rem', borderRadius: '10px', color: '#d6d3d1', textDecoration: 'none', fontSize: '0.9rem' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', color: '#fca5a5', border: 'none', padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, marginTop: 'auto' },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#fff', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  statIcon: { fontSize: '1.5rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 800 },
  statLabel: { color: '#6b7280', fontSize: '0.82rem' },
  section: { background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' },
  orderCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '12px', marginBottom: '0.75rem' },
  orderInfo: { flex: 1 },
  orderId: { fontFamily: 'monospace', fontWeight: 700, color: '#f97316', marginRight: '0.75rem', fontSize: '0.88rem' },
  orderItems: { fontSize: '0.85rem', color: '#6b7280' },
  orderAddress: { fontSize: '0.82rem', color: '#374151', marginTop: '0.3rem' },
  buyerPhone: { fontSize: '0.82rem', color: '#16a34a', marginTop: '0.2rem' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 },
  buyerInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem' },
  callBtn: { background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700 },
  statusActions: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  acceptBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' },
  updateBtn: { background: '#f97316', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' },
  empty: { textAlign: 'center', padding: '2rem', color: '#6b7280' },
};

export default DeliveryDashboard;
