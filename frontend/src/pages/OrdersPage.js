import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };
const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', picked_up: 'Picked Up', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const c = theme.colors;

  useEffect(() => {
    axios.get('/api/orders/my-orders')
      .then(res => setOrders(res.data.orders))
      .catch(() => toast.error('Orders load failed'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Link to="/shop" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' }}>← Shop</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: c.text, margin: '0.5rem 0 1.5rem' }}>माझे Orders</h1>
        {loading ? <p style={{ textAlign: 'center', color: c.subText, padding: '3rem' }}>Loading...</p>
          : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', color: c.subText }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p>अजून कोणते orders नाहीत</p>
              <Link to="/shop" style={{ display: 'inline-block', background: '#16a34a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, marginTop: '1rem' }}>भाजीपाला खरेदी करा</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map(order => (
                <Link key={order._id} to={`/orders/${order._id}`} style={{ background: c.cardBg, borderRadius: '14px', padding: '1.2rem', border: `1px solid ${c.border}`, textDecoration: 'none', display: 'block', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>{order.orderId}</span>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>{STATUS_LABELS[order.status]}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.88rem', color: c.subText, alignItems: 'center' }}>
                    <span>{order.items?.length} items</span>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>₹{order.grandTotal}</span>
                    <span style={{ marginLeft: 'auto' }}>{new Date(order.createdAt).toLocaleDateString('mr-IN')}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600, marginTop: '0.3rem' }}>बघा →</div>
                </Link>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
export default OrdersPage;
