// OrderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'picked_up', 'in_transit', 'delivered'];
  const STATUS_LABELS = { pending: '⏳ Pending', confirmed: '✅ Confirmed', packed: '📦 Packed', picked_up: '🚴 Picked Up', in_transit: '🚚 In Transit', delivered: '🎉 Delivered', cancelled: '❌ Cancelled' };
  const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', packed: '#8b5cf6', picked_up: '#0ea5e9', in_transit: '#f97316', delivered: '#10b981', cancelled: '#ef4444' };

  useEffect(() => {
    axios.get(`/api/orders/${id}`).then(res => setOrder(res.data.order)).catch(() => {});
  }, [id]);

  if (!order) return <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Segoe UI', sans-serif", color: '#6b7280' }}>Loading...</div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={s.page}>
      <Link to="/orders" style={s.back}>← माझे Orders</Link>
      <div style={s.card}>
        <div style={s.header}>
          <h1 style={s.orderId}>{order.orderId}</h1>
          <span style={{ ...s.statusBadge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* Progress Bar */}
        {order.status !== 'cancelled' && (
          <div style={s.progressArea}>
            <div style={s.progressBar}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={s.stepWrapper}>
                  <div style={{ ...s.stepDot, background: i <= stepIndex ? '#16a34a' : '#e5e7eb' }}>
                    {i <= stepIndex ? '✓' : i + 1}
                  </div>
                  <div style={{ ...s.stepLabel, color: i <= stepIndex ? '#16a34a' : '#9ca3af' }}>
                    {STATUS_LABELS[step]}
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < stepIndex ? '#16a34a' : '#e5e7eb' }}></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>Order Items</h3>
          {order.items?.map((item, i) => (
            <div key={i} style={s.item}>
              <div>
                <div style={s.itemName}>{item.productName}</div>
                <div style={s.itemFarmer}>👨‍🌾 {item.farmer?.name} · {item.farmer?.farmerId}</div>
              </div>
              <div style={s.itemRight}>
                <div style={s.itemQty}>{item.quantity} {item.unit} × ₹{item.pricePerUnit}</div>
                <div style={s.itemTotal}>₹{item.totalPrice}</div>
              </div>
            </div>
          ))}
          <div style={s.totalRow}><span>Grand Total:</span><span style={s.grandTotal}>₹{order.grandTotal}</span></div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>📍 Delivery Address</h3>
            <p style={s.address}>{order.deliveryAddress.name} · {order.deliveryAddress.phone}</p>
            <p style={s.address}>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}</p>
          </div>
        )}

        {/* Delivery Boy */}
        {order.deliveryBoy && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>🚴 Delivery Boy</h3>
            <p style={s.address}>{order.deliveryBoy.name} · {order.deliveryBoy.phone} · {order.deliveryBoy.vehicleNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  orderId: { fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' },
  statusBadge: { padding: '5px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' },
  progressArea: { marginBottom: '1.5rem', overflowX: 'auto' },
  progressBar: { display: 'flex', alignItems: 'flex-start', minWidth: '600px' },
  stepWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 },
  stepDot: { width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.4rem', zIndex: 1 },
  stepLabel: { fontSize: '0.68rem', textAlign: 'center', fontWeight: 600 },
  stepLine: { position: 'absolute', top: '15px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  section: { borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: '1rem' },
  sectionTitle: { fontWeight: 700, marginBottom: '0.75rem', color: '#111827' },
  item: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f9fafb' },
  itemName: { fontWeight: 600, marginBottom: '0.2rem' },
  itemFarmer: { fontSize: '0.78rem', color: '#16a34a' },
  itemRight: { textAlign: 'right' },
  itemQty: { fontSize: '0.82rem', color: '#6b7280' },
  itemTotal: { fontWeight: 700, color: '#15803d' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 600 },
  grandTotal: { color: '#15803d', fontSize: '1.1rem', fontWeight: 800 },
  address: { color: '#374151', fontSize: '0.9rem', marginBottom: '0.3rem' },
};

export default OrderDetail;
