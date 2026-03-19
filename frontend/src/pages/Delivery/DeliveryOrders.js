import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/delivery/my-deliveries')
      .then(res => setOrders(res.data.orders))
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const STATUS_COLORS = { packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };

  return (
    <div style={s.page}>
      <Link to="/delivery" style={s.back}>← Dashboard</Link>
      <h1 style={s.title}>माझे Deliveries</h1>
      {loading ? <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading...</p>
        : orders.length === 0 ? <div style={s.empty}><div>🚴</div><p>कोणते deliveries नाहीत</p></div>
        : orders.map(order => (
          <div key={order._id} style={s.card}>
            <div style={s.row}>
              <span style={s.orderId}>{order.orderId}</span>
              <span style={{ ...s.badge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                {order.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div style={s.info}>
              <div>👤 {order.buyer?.name} · 📞 {order.buyer?.phone}</div>
              <div>📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.district}</div>
            </div>
            <div style={s.actions}>
              {order.status === 'picked_up' && <button style={{ ...s.btn, background: '#f97316' }} onClick={() => updateStatus(order._id, 'in_transit')}>🚚 Transit सुरू करा</button>}
              {order.status === 'in_transit' && <button style={{ ...s.btn, background: '#10b981' }} onClick={() => updateStatus(order._id, 'delivered')}>✅ Delivered!</button>}
            </div>
          </div>
        ))}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' },
  back: { color: '#f97316', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#6b7280', fontSize: '1rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  orderId: { fontFamily: 'monospace', fontWeight: 700, color: '#f97316', fontSize: '0.9rem' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 },
  info: { fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.75rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  btn: { color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' },
};

export default DeliveryOrders;
