import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', district: '', pincode: ''
  });

  const deliveryCharge = cartTotal > 500 ? 0 : 30;
  const grandTotal = cartTotal + deliveryCharge;

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.district || !address.pincode) {
      toast.error('Address पूर्णपणे भरा'); return;
    }
    setLoading(true);
    try {
      const items = cart.map(item => ({ productId: item._id, quantity: item.quantity }));
      const res = await axios.post('/api/orders', {
        items, deliveryAddress: address, paymentMethod
      });
      clearCart();
      toast.success(`🎉 Order placed! ID: ${res.data.order.orderId}`);
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (k, v) => setAddress(prev => ({ ...prev, [k]: v }));

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Checkout</h1>
        <p style={s.sub}>Delivery Address आणि Payment</p>
      </div>
      <div style={s.layout}>
        <div>
          <div style={s.card}>
            <h2 style={s.cardTitle}>📍 Delivery Address</h2>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>नाव *</label>
                <input style={s.input} value={address.name} onChange={e => f('name', e.target.value)} placeholder="पूर्ण नाव" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone *</label>
                <input style={s.input} value={address.phone} onChange={e => f('phone', e.target.value)} placeholder="Mobile Number" required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Address / Street *</label>
              <input style={s.input} value={address.street} onChange={e => f('street', e.target.value)} placeholder="घर नंबर, रस्त्याचे नाव" required />
            </div>
            <div style={s.grid3}>
              <div style={s.field}>
                <label style={s.label}>शहर / गाव *</label>
                <input style={s.input} value={address.city} onChange={e => f('city', e.target.value)} placeholder="City" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>जिल्हा *</label>
                <input style={s.input} value={address.district} onChange={e => f('district', e.target.value)} placeholder="District" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Pincode *</label>
                <input style={s.input} value={address.pincode} onChange={e => f('pincode', e.target.value)} placeholder="416XXX" required />
              </div>
            </div>
          </div>

          <div style={{ ...s.card, marginTop: '1.5rem' }}>
            <h2 style={s.cardTitle}>💳 Payment Method</h2>
            <div style={s.paymentOptions}>
              <div onClick={() => setPaymentMethod('cod')} style={{ ...s.payOption, border: paymentMethod === 'cod' ? '2px solid #16a34a' : '2px solid #e5e7eb', background: paymentMethod === 'cod' ? '#f0fdf4' : '#fff' }}>
                <span style={{ fontSize: '1.5rem' }}>💵</span>
                <div>
                  <div style={s.payTitle}>Cash on Delivery</div>
                  <div style={s.paySub}>Delivery झाल्यावर पैसे द्या</div>
                </div>
                {paymentMethod === 'cod' && <span style={s.payCheck}>✓</span>}
              </div>
              <div onClick={() => setPaymentMethod('online')} style={{ ...s.payOption, border: paymentMethod === 'online' ? '2px solid #16a34a' : '2px solid #e5e7eb', background: paymentMethod === 'online' ? '#f0fdf4' : '#fff' }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                  <div style={s.payTitle}>Online Payment</div>
                  <div style={s.paySub}>UPI / Card / Net Banking</div>
                </div>
                {paymentMethod === 'online' && <span style={s.payCheck}>✓</span>}
              </div>
            </div>
          </div>
        </div>

        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id} style={s.orderItem}>
              <span style={s.orderItemName}>{item.name} × {item.quantity}{item.unit}</span>
              <span style={s.orderItemPrice}>₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div style={s.divider}></div>
          <div style={s.summaryRow}><span>Sub Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
          <div style={s.summaryRow}><span>Delivery</span><span style={{ color: deliveryCharge === 0 ? '#16a34a' : '' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
          <div style={s.divider}></div>
          <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: '1.1rem' }}>
            <span>एकूण</span><span style={{ color: '#15803d' }}>₹{grandTotal.toFixed(2)}</span>
          </div>
          <button style={{ ...s.orderBtn, opacity: loading ? 0.7 : 1 }} onClick={handleOrder} disabled={loading}>
            {loading ? 'Order करत आहे...' : `🛒 Order Place करा — ₹${grandTotal.toFixed(0)}`}
          </button>
          <p style={s.note}>Order केल्यावर शेतकऱ्याला notification जाईल</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif" },
  header: { maxWidth: '1100px', margin: '0 auto 2rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827' },
  sub: { color: '#6b7280' },
  layout: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#111827' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.7rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  payOption: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', cursor: 'pointer', position: 'relative' },
  payTitle: { fontWeight: 700, fontSize: '0.95rem' },
  paySub: { fontSize: '0.8rem', color: '#6b7280' },
  payCheck: { marginLeft: 'auto', background: '#16a34a', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  summary: { background: '#fff', borderRadius: '16px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' },
  orderItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#374151' },
  orderItemName: { flex: 1 },
  orderItemPrice: { fontWeight: 600 },
  divider: { height: '1px', background: '#e5e7eb', margin: '0.75rem 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' },
  orderBtn: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  note: { textAlign: 'center', color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.75rem' },
};

export default CheckoutPage;
