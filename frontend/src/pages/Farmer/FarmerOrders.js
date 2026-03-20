import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };
const STATUS_LABELS = { pending: '⏳ Pending', confirmed: '✅ Confirmed', packed: '📦 Packed', picked_up: '🚴 Picked Up', in_transit: '🚚 Transit', delivered: '🎉 Delivered', cancelled: '❌ Cancelled' };

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/farmer-orders');
      setOrders(res.data.orders);
    } catch { toast.error('Orders load failed'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus, note: `Farmer updated to ${newStatus}` });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Status updated: ${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const getNextAction = (status) => {
    if (status === 'pending') return { label: '✅ Confirm करा', nextStatus: 'confirmed', color: '#3b82f6' };
    if (status === 'confirmed') return { label: '📦 Pack झाले', nextStatus: 'packed', color: '#8b5cf6' };
    return null;
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/farmer" style={s.back}>← Dashboard</Link>
        <h1 style={s.title}>Orders</h1>
      </div>

      {/* Filter Tabs */}
      <div style={s.tabs}>
        {['all', 'pending', 'confirmed', 'packed', 'delivered', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.tab, background: filter === f ? '#16a34a' : '#f3f4f6', color: filter === f ? '#fff' : '#374151' }}>
            {f === 'all' ? `सर्व (${orders.length})` : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>Loading...</p>
        : filtered.length === 0 ? (
          <div style={s.empty}><div style={{ fontSize: '3rem' }}>📦</div><p>कोणते orders नाहीत</p></div>
        ) : (
          <div style={s.ordersList}>
            {filtered.map(order => {
              const action = getNextAction(order.status);
              return (
                <div key={order._id} style={s.orderCard}>
                  <div style={s.orderHeader}>
                    <div>
                      <span style={s.orderId}>{order.orderId}</span>
                      <span style={{ ...s.statusBadge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString('mr-IN')}</div>
                  </div>

                  <div style={s.orderBody}>
                    <div style={s.buyerInfo}>
                      <span style={s.buyerLabel}>ग्राहक:</span>
                      <span style={s.buyerName}>{order.buyer?.name}</span>
                      <a href={`tel:${order.buyer?.phone}`} style={s.phone}>📞 {order.buyer?.phone}</a>
                    </div>
                    <div style={s.items}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={s.item}>
                          <span>{item.productName} × {item.quantity}{item.unit}</span>
                          <span style={s.itemPrice}>₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={s.orderFooter}>
                    <div style={s.totalArea}>
                      <span style={s.totalLabel}>एकूण:</span>
                      <span style={s.totalValue}>₹{order.grandTotal}</span>
                      <span style={s.payMethod}>({order.paymentMethod?.toUpperCase()})</span>
                    </div>
                    {action && (
                      <button style={{ ...s.actionBtn, background: action.color }}
                        onClick={() => updateStatus(order._id, action.nextStatus)}>
                        {action.label}
                      </button>
                    )}
                  </div>

                  {/* Delivery Info */}
                  {order.deliveryAddress && (
                    <div style={s.addressBox}>
                      <span style={s.addressLabel}>📍 Delivery:</span>
                      <span style={s.addressText}>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.3rem' },
  tabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  tab: { border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' },
  empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: { background: '#fff', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  orderId: { fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', marginRight: '0.75rem', fontSize: '0.9rem' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 },
  orderDate: { fontSize: '0.82rem', color: '#9ca3af' },
  orderBody: { borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '0.75rem 0', marginBottom: '0.75rem' },
  buyerInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' },
  buyerLabel: { fontSize: '0.82rem', color: '#6b7280' },
  buyerName: { fontWeight: 700, fontSize: '0.95rem' },
  phone: { color: '#16a34a', textDecoration: 'none', fontSize: '0.85rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  item: { display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#374151' },
  itemPrice: { fontWeight: 600 },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalArea: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  totalLabel: { fontSize: '0.85rem', color: '#6b7280' },
  totalValue: { fontSize: '1.1rem', fontWeight: 800, color: '#15803d' },
  payMethod: { fontSize: '0.75rem', color: '#9ca3af' },
  actionBtn: { color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' },
  addressBox: { background: '#f9fafb', borderRadius: '8px', padding: '0.6rem 0.8rem', marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  addressLabel: { fontSize: '0.8rem', color: '#6b7280' },
  addressText: { fontSize: '0.8rem', color: '#374151' },
};

export default FarmerOrders;
