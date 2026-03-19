// OrdersPage.js - Buyer orders list
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my-orders')
      .then(res => setOrders(res.data.orders))
      .catch(() => toast.error('Orders load failed'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/shop" style={s.back}>← Shop</Link>
        <h1 style={s.title}>माझे Orders</h1>
      </div>
      {loading ? <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
        : orders.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '3rem' }}>📦</div>
            <p>अजून कोणते orders नाहीत</p>
            <Link to="/shop" style={s.shopBtn}>भाजीपाला खरेदी करा</Link>
          </div>
        ) : (
          <div style={s.ordersList}>
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} style={s.orderCard}>
                <div style={s.orderHeader}>
                  <span style={s.orderId}>{order.orderId}</span>
                  <span style={{ ...s.status, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                    {order.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div style={s.orderBody}>
                  <span>{order.items?.length} items</span>
                  <span style={s.amount}>₹{order.grandTotal}</span>
                  <span style={s.date}>{new Date(order.createdAt).toLocaleDateString('mr-IN')}</span>
                </div>
                <div style={s.arrowRow}>बघा →</div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.3rem' },
  empty: { textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#6b7280' },
  shopBtn: { background: '#16a34a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: { background: '#fff', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textDecoration: 'none', color: 'inherit', display: 'block' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  orderId: { fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' },
  status: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 },
  orderBody: { display: 'flex', gap: '1rem', fontSize: '0.88rem', color: '#6b7280' },
  amount: { fontWeight: 700, color: '#15803d' },
  date: { marginLeft: 'auto' },
  arrowRow: { fontSize: '0.82rem', color: '#16a34a', fontWeight: 600, marginTop: '0.3rem' },
};

export default OrdersPage;
