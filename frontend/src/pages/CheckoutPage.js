import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', street: '', city: '', district: '', pincode: '' });
  const deliveryCharge = cartTotal > 500 ? 0 : 30;
  const grandTotal = cartTotal + deliveryCharge;
  const f = (k, v) => setAddress(prev => ({ ...prev, [k]: v }));
  const inputStyle = { width: '100%', padding: '0.72rem', border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '0.95rem', background: c.input, color: c.inputText, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: c.text, marginBottom: '0.3rem' };

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.district || !address.pincode) { toast.error('Address पूर्णपणे भरा'); return; }
    setLoading(true);
    try {
      const items = cart.map(item => ({ productId: item._id, quantity: item.quantity }));
      const res = await axios.post('/api/orders', { items, deliveryAddress: address, paymentMethod });
      clearCart();
      toast.success(`🎉 Order placed! ID: ${res.data.order.orderId}`);
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: c.text, marginBottom: '1.5rem' }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${c.border}` }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', color: c.text }}>📍 Delivery Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div><label style={labelStyle}>नाव *</label><input style={inputStyle} value={address.name} onChange={e => f('name', e.target.value)} placeholder="पूर्ण नाव" required /></div>
                <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={address.phone} onChange={e => f('phone', e.target.value)} placeholder="Mobile" required /></div>
              </div>
              <div style={{ marginTop: '0.75rem' }}><label style={labelStyle}>Address *</label><input style={inputStyle} value={address.street} onChange={e => f('street', e.target.value)} placeholder="घर नंबर, रस्त्याचे नाव" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div><label style={labelStyle}>शहर *</label><input style={inputStyle} value={address.city} onChange={e => f('city', e.target.value)} placeholder="City" required /></div>
                <div><label style={labelStyle}>जिल्हा *</label><input style={inputStyle} value={address.district} onChange={e => f('district', e.target.value)} placeholder="District" required /></div>
                <div><label style={labelStyle}>Pincode *</label><input style={inputStyle} value={address.pincode} onChange={e => f('pincode', e.target.value)} placeholder="416XXX" required /></div>
              </div>
            </div>
            <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${c.border}` }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: c.text }}>💳 Payment Method</h2>
              {[['cod', '💵', 'Cash on Delivery', 'Delivery झाल्यावर पैसे द्या'], ['online', '📱', 'Online Payment', 'UPI / Card / Net Banking']].map(([val, icon, title, sub]) => (
                <div key={val} onClick={() => setPaymentMethod(val)}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', cursor: 'pointer', marginBottom: '0.75rem', border: paymentMethod === val ? '2px solid #16a34a' : `2px solid ${c.border}`, background: paymentMethod === val ? (theme.isDark ? '#1a3a2a' : '#f0fdf4') : c.cardBg }}>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: c.text }}>{title}</div>
                    <div style={{ fontSize: '0.8rem', color: c.subText }}>{sub}</div>
                  </div>
                  {paymentMethod === val && <span style={{ background: '#16a34a', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '80px', border: `1px solid ${c.border}` }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: c.text }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: c.text }}>
                <span style={{ flex: 1 }}>{item.name} × {item.quantity}{item.unit}</span>
                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div style={{ height: '1px', background: c.border, margin: '0.75rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: c.text }}><span>Sub Total</span><span>₹{cartTotal.toFixed(0)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: c.text }}><span>Delivery</span><span style={{ color: deliveryCharge === 0 ? '#16a34a' : c.text }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
            <div style={{ height: '1px', background: c.border, margin: '0.75rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: c.text, marginBottom: '1rem' }}><span>एकूण</span><span style={{ color: '#15803d' }}>₹{grandTotal.toFixed(0)}</span></div>
            <button style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }} onClick={handleOrder} disabled={loading}>
              {loading ? 'Order करत आहे...' : `🛒 Order Place करा`}
            </button>
            <p style={{ textAlign: 'center', color: c.subText, fontSize: '0.78rem', marginTop: '0.75rem' }}>Order केल्यावर शेतकऱ्याला notification जाईल</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
