import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };
const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', picked_up: 'Picked Up', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get('/api/admin/orders', { params: filter !== 'all' ? { status: filter } : {} }),
        axios.get('/api/admin/users', { params: { role: 'delivery' } })
      ]);
      setOrders(ordersRes.data.orders);
      setDeliveryBoys(usersRes.data.users.filter(u => u.isActive));
    } catch { toast.error('Load failed'); }
    finally { setLoading(false); }
  };

  const assignDelivery = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return;
    try {
      const res = await axios.put(`/api/admin/orders/${orderId}/assign-delivery`, { deliveryBoyId });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryBoy: res.data.order.deliveryBoy } : o));
      toast.success('Delivery boy assigned!');
    } catch { toast.error('Assign failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/admin" style={s.back}>← Dashboard</Link>
        <h1 style={s.title}>Orders Management</h1>
      </div>
      <div style={s.tabs}>
        {['all', 'pending', 'confirmed', 'packed', 'in_transit', 'delivered', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.tab, background: filter === f ? '#111827' : '#f3f4f6', color: filter === f ? '#fff' : '#374151' }}>
            {f === 'all' ? `सर्व (${orders.length})` : STATUS_LABELS[f]}
          </button>
        ))}
      </div>
      {loading ? <p style={s.loading}>Loading...</p> : orders.length === 0 ? (
        <div style={s.empty}><div style={{ fontSize: '3rem' }}>📦</div><p>कोणते orders नाहीत</p></div>
      ) : (
        <div style={s.ordersList}>
          {orders.map(order => (
            <div key={order._id} style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.headerLeft}>
                  <span style={s.orderId}>{order.orderId}</span>
                  <span style={{ ...s.statusBadge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span style={s.payBadge}>{order.paymentMethod?.toUpperCase()}</span>
                </div>
                <div style={s.headerRight}>
                  <span style={s.amount}>₹{order.grandTotal}</span>
                  <span style={s.date}>{new Date(order.createdAt).toLocaleDateString('mr-IN')}</span>
                </div>
              </div>
              <div style={s.cardBody}>
                <div style={s.info}>
                  <div><strong>Buyer:</strong> {order.buyer?.name} · {order.buyer?.phone}</div>
                  <div><strong>Items:</strong> {order.items?.length} items</div>
                  {order.deliveryAddress && <div><strong>📍</strong> {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}</div>}
                </div>
                <div style={s.deliverySection}>
                  <div style={s.deliveryLabel}>Delivery Boy:</div>
                  {order.deliveryBoy ? (
                    <div style={s.assignedDelivery}>
                      <span>🚴 {order.deliveryBoy.name}</span>
                      <span style={s.deliveryPhone}>{order.deliveryBoy.phone}</span>
                    </div>
                  ) : (
                    <select style={s.deliverySelect} onChange={e => assignDelivery(order._id, e.target.value)} defaultValue="">
                      <option value="">-- Assign करा --</option>
                      {deliveryBoys.map(db => (
                        <option key={db._id} value={db._id}>{db.name} ({db.assignedArea})</option>
                      ))}
                    </select>
                  )}
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
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.3rem' },
  tabs: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  tab: { border: 'none', padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' },
  loading: { textAlign: 'center', color: '#6b7280', padding: '3rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  orderId: { fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  payBadge: { background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 },
  headerRight: { display: 'flex', gap: '1rem', alignItems: 'center' },
  amount: { fontWeight: 800, fontSize: '1.1rem', color: '#15803d' },
  date: { fontSize: '0.82rem', color: '#9ca3af' },
  cardBody: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' },
  info: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#374151' },
  deliverySection: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  deliveryLabel: { fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' },
  assignedDelivery: { display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' },
  deliveryPhone: { color: '#16a34a', fontSize: '0.8rem' },
  deliverySelect: { padding: '0.5rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' },
};

export default AdminOrders;
