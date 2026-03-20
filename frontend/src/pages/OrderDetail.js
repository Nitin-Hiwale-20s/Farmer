import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'picked_up', 'in_transit', 'delivered'];
const STATUS_LABELS = { pending: '⏳ Pending', confirmed: '✅ Confirmed', packed: '📦 Packed', picked_up: '🚴 Picked Up', in_transit: '🚚 In Transit', delivered: '🎉 Delivered', cancelled: '❌ Cancelled' };
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { theme } = useTheme();
  const c = theme.colors;

  useEffect(() => { axios.get(`/api/orders/${id}`).then(res => setOrder(res.data.order)).catch(() => {}); }, [id]);

  if (!order) return <div style={{ minHeight: '100vh', background: c.bg }}><Navbar /><div style={{ textAlign: 'center', padding: '4rem', color: c.subText }}>Loading...</div></div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Link to="/orders" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' }}>← माझे Orders</Link>
        <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', marginTop: '1rem', border: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h1 style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' }}>{order.orderId}</h1>
            <span style={{ padding: '5px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>{STATUS_LABELS[order.status]}</span>
          </div>

          {order.status !== 'cancelled' && (
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '500px' }}>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.7rem', marginBottom: '0.3rem', zIndex: 1, background: i <= stepIndex ? '#16a34a' : c.border }}>{i <= stepIndex ? '✓' : i + 1}</div>
                    <div style={{ fontSize: '0.62rem', textAlign: 'center', fontWeight: 600, color: i <= stepIndex ? '#16a34a' : c.subText }}>{STATUS_LABELS[step]}</div>
                    {i < STATUS_STEPS.length - 1 && <div style={{ position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px', zIndex: 0, background: i < stepIndex ? '#16a34a' : c.border }}></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: c.text }}>Order Items</h3>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${c.border}` }}>
                <div><div style={{ fontWeight: 600, color: c.text }}>{item.productName}</div><div style={{ fontSize: '0.78rem', color: '#16a34a' }}>👨‍🌾 {item.farmer?.name} · {item.farmer?.farmerId}</div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.82rem', color: c.subText }}>{item.quantity} {item.unit} × ₹{item.pricePerUnit}</div><div style={{ fontWeight: 700, color: '#15803d' }}>₹{item.totalPrice}</div></div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: c.text }}><span>Grand Total:</span><span style={{ color: '#15803d', fontSize: '1.1rem' }}>₹{order.grandTotal}</span></div>
          </div>

          {order.deliveryAddress && (
            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '1rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: c.text }}>📍 Delivery Address</h3>
              <p style={{ color: c.subText, fontSize: '0.9rem' }}>{order.deliveryAddress.name} · {order.deliveryAddress.phone}</p>
              <p style={{ color: c.subText, fontSize: '0.9rem' }}>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}</p>
            </div>
          )}

          {order.deliveryBoy && (
            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '1rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: c.text }}>🚴 Delivery Boy</h3>
              <p style={{ color: c.subText, fontSize: '0.9rem' }}>{order.deliveryBoy.name} · {order.deliveryBoy.phone} · {order.deliveryBoy.vehicleNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
