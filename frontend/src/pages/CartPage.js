import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const deliveryCharge = cartTotal > 500 ? 0 : 30;

  if (cart.length === 0) return (
    <div style={s.page}>
      <div style={s.empty}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2>Cart रिकामा आहे</h2>
        <p style={{ color: '#6b7280' }}>भाजीपाला निवडा आणि cart मध्ये add करा</p>
        <Link to="/shop" style={s.shopBtn}>भाजीपाला बघा →</Link>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/shop" style={s.back}>← खरेदी सुरू ठेवा</Link>
        <h1 style={s.title}>🛒 माझा Cart ({cartCount} items)</h1>
      </div>
      <div style={s.layout}>
        <div style={s.items}>
          {cart.map(item => (
            <div key={item._id} style={s.item}>
              <div style={s.itemImg}>
                {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  : <span style={{ fontSize: '2.5rem' }}>🥦</span>}
              </div>
              <div style={s.itemInfo}>
                <h3 style={s.itemName}>{item.name}</h3>
                <p style={s.itemFarmer}>👨‍🌾 {item.farmer?.farmName || item.farmer?.name}</p>
                <p style={s.itemPrice}>₹{item.price}/{item.unit}</p>
              </div>
              <div style={s.itemRight}>
                <div style={s.qtyRow}>
                  <button style={s.qBtn} onClick={() => updateQuantity(item._id, item.quantity - 0.5)}>-</button>
                  <span style={s.qVal}>{item.quantity} {item.unit}</span>
                  <button style={s.qBtn} onClick={() => updateQuantity(item._id, item.quantity + 0.5)}>+</button>
                </div>
                <p style={s.subtotal}>₹{(item.price * item.quantity).toFixed(2)}</p>
                <button style={s.removeBtn} onClick={() => removeFromCart(item._id)}>🗑️ Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>
          <div style={s.summaryRow}><span>Sub Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
          <div style={s.summaryRow}>
            <span>Delivery Charge</span>
            <span style={{ color: deliveryCharge === 0 ? '#16a34a' : '#111' }}>
              {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
            </span>
          </div>
          {deliveryCharge > 0 && <p style={s.freeNote}>₹{500 - cartTotal} अजून खरेदी करा — Free Delivery मिळेल!</p>}
          <div style={s.summaryDivider}></div>
          <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: '1.1rem' }}>
            <span>एकूण</span><span style={{ color: '#15803d' }}>₹{(cartTotal + deliveryCharge).toFixed(2)}</span>
          </div>
          <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>Checkout करा →</button>
          <p style={s.secureNote}>🔒 Secure & Safe Payment</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif" },
  empty: { textAlign: 'center', padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  shopBtn: { background: '#16a34a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 },
  header: { maxWidth: '1100px', margin: '0 auto 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827' },
  layout: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { background: '#fff', borderRadius: '16px', padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  itemImg: { width: '80px', height: '80px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' },
  itemFarmer: { fontSize: '0.8rem', color: '#16a34a', marginBottom: '0.2rem' },
  itemPrice: { fontSize: '0.85rem', color: '#6b7280' },
  itemRight: { textAlign: 'right' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.4rem' },
  qBtn: { background: '#f3f4f6', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' },
  qVal: { fontWeight: 600, fontSize: '0.85rem', minWidth: '60px', textAlign: 'center' },
  subtotal: { fontWeight: 700, color: '#15803d', fontSize: '1rem', marginBottom: '0.3rem' },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' },
  summary: { background: '#fff', borderRadius: '16px', padding: '1.5rem', height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: '1rem' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#111827' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#374151' },
  freeNote: { background: '#dcfce7', color: '#166534', fontSize: '0.8rem', padding: '0.5rem', borderRadius: '8px', margin: '0.5rem 0', textAlign: 'center' },
  summaryDivider: { height: '1px', background: '#e5e7eb', margin: '1rem 0' },
  checkoutBtn: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  secureNote: { textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.75rem' },
};

export default CartPage;
