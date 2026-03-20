import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t, theme } = useTheme();
  const c = theme.colors;
  const navigate = useNavigate();
  const deliveryCharge = cartTotal > 500 ? 0 : 30;

  if (cart.length === 0) return (
    <div style={{ minHeight: '100vh', background: c.bg }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: '1rem', color: c.subText }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ color: c.text }}>Cart रिकामा आहे</h2>
        <p>भाजीपाला निवडा आणि cart मध्ये add करा</p>
        <Link to="/shop" style={{ background: '#16a34a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>भाजीपाला बघा →</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Link to="/shop" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' }}>← खरेदी सुरू ठेवा</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: c.text, margin: '0.5rem 0 1.5rem' }}>🛒 माझा Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cart.map(item => (
              <div key={item._id} style={{ background: c.cardBg, borderRadius: '14px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', border: `1px solid ${c.border}` }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '10px', background: c.sectionBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} /> : <span style={{ fontSize: '2rem' }}>🥦</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: c.text, marginBottom: '0.2rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#16a34a' }}>👨‍🌾 {item.farmer?.farmName || item.farmer?.name}</p>
                  <p style={{ fontSize: '0.82rem', color: c.subText }}>₹{item.price}/{item.unit}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                    <button style={{ background: c.hover, border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, color: c.text }} onClick={() => updateQuantity(item._id, item.quantity - 0.5)}>-</button>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: c.text, minWidth: '55px', textAlign: 'center' }}>{item.quantity} {item.unit}</span>
                    <button style={{ background: c.hover, border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, color: c.text }} onClick={() => updateQuantity(item._id, item.quantity + 0.5)}>+</button>
                  </div>
                  <p style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem', marginBottom: '0.2rem' }}>₹{(item.price * item.quantity).toFixed(0)}</p>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem' }} onClick={() => removeFromCart(item._id)}>🗑️ Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: c.cardBg, borderRadius: '16px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '80px', border: `1px solid ${c.border}` }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: c.text }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: c.text }}><span>Sub Total</span><span>₹{cartTotal.toFixed(0)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: c.text }}>
              <span>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#16a34a' : c.text }}>{deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}</span>
            </div>
            {deliveryCharge > 0 && <p style={{ background: '#dcfce7', color: '#166534', fontSize: '0.78rem', padding: '0.5rem', borderRadius: '8px', marginBottom: '0.75rem', textAlign: 'center' }}>₹{500 - cartTotal} अजून खरेदी करा — Free Delivery!</p>}
            <div style={{ height: '1px', background: c.border, margin: '0.75rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: c.text, marginBottom: '1rem' }}>
              <span>एकूण</span><span style={{ color: '#15803d' }}>₹{(cartTotal + deliveryCharge).toFixed(0)}</span>
            </div>
            <button style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }} onClick={() => navigate('/checkout')}>Checkout करा →</button>
            <p style={{ textAlign: 'center', color: c.subText, fontSize: '0.78rem', marginTop: '0.75rem' }}>🔒 Secure Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
