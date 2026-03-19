import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(searchParams.get('role') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = role !== 'all' ? { role } : {};
      const res = await axios.get('/api/admin/users', { params });
      setUsers(res.data.users);
    } catch { toast.error('Users load failed'); }
    finally { setLoading(false); }
  };

  const verifyUser = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/verify`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isVerified: true } : u));
      toast.success('User verified!');
    } catch { toast.error('Verify failed'); }
  };

  const toggleActive = async (id, current) => {
    try {
      await axios.put(`/api/admin/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !current } : u));
      toast.success(current ? 'User blocked' : 'User activated');
    } catch { toast.error('Update failed'); }
  };

  const roleColors = { farmer: '#16a34a', buyer: '#0ea5e9', delivery: '#f97316', admin: '#8b5cf6' };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <Link to="/admin" style={s.back}>← Dashboard</Link>
        <h1 style={s.title}>Users Management</h1>
      </div>
      <div style={s.tabs}>
        {['all', 'farmer', 'buyer', 'delivery'].map(r => (
          <button key={r} onClick={() => setRole(r)}
            style={{ ...s.tab, background: role === r ? '#111827' : '#f3f4f6', color: role === r ? '#fff' : '#374151' }}>
            {r === 'all' ? 'सर्व' : r.charAt(0).toUpperCase() + r.slice(1)}s
          </button>
        ))}
      </div>
      {loading ? <p style={s.loading}>Loading...</p> : (
        <div style={s.table}>
          <div style={s.tableHead}>
            <span>नाव</span><span>Email</span><span>Role</span><span>Details</span><span>Status</span><span>Actions</span>
          </div>
          {users.map(user => (
            <div key={user._id} style={s.row}>
              <div>
                <div style={s.userName}>{user.name}</div>
                <div style={s.userPhone}>{user.phone}</div>
              </div>
              <div style={s.email}>{user.email}</div>
              <div>
                <span style={{ ...s.roleBadge, background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
                  {user.role}
                </span>
              </div>
              <div style={s.details}>
                {user.role === 'farmer' && <div><span style={s.detailKey}>ID:</span> {user.farmerId}</div>}
                {user.role === 'farmer' && <div><span style={s.detailKey}>Farm:</span> {user.farmName}</div>}
                {user.role === 'farmer' && user.farmLocation && <div><span style={s.detailKey}>📍</span> {user.farmLocation.district}</div>}
                {user.role === 'delivery' && <div><span style={s.detailKey}>Vehicle:</span> {user.vehicleNumber}</div>}
              </div>
              <div>
                {user.isVerified ? <span style={s.verified}>✓ Verified</span> : <span style={s.unverified}>Not Verified</span>}
                <br />
                <span style={{ ...s.activeBadge, color: user.isActive ? '#16a34a' : '#ef4444' }}>
                  {user.isActive ? '● Active' : '● Blocked'}
                </span>
              </div>
              <div style={s.actions}>
                {!user.isVerified && user.role === 'farmer' && (
                  <button style={s.verifyBtn} onClick={() => verifyUser(user._id)}>Verify</button>
                )}
                <button style={{ ...s.toggleBtn, background: user.isActive ? '#fee2e2' : '#dcfce7', color: user.isActive ? '#ef4444' : '#16a34a' }}
                  onClick={() => toggleActive(user._id, user.isActive)}>
                  {user.isActive ? 'Block' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '2rem', fontFamily: "'Segoe UI', sans-serif", maxWidth: '1300px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  back: { color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#111827', marginTop: '0.3rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  loading: { textAlign: 'center', color: '#6b7280', padding: '3rem' },
  table: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  tableHead: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 0.8fr 1.5fr 1fr 1.2fr', padding: '1rem 1.5rem', background: '#f9fafb', fontWeight: 700, fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  row: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 0.8fr 1.5fr 1fr 1.2fr', padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', alignItems: 'center' },
  userName: { fontWeight: 700, fontSize: '0.95rem' },
  userPhone: { fontSize: '0.78rem', color: '#6b7280' },
  email: { fontSize: '0.85rem', color: '#374151' },
  roleBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 },
  details: { fontSize: '0.78rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.15rem' },
  detailKey: { fontWeight: 600, color: '#374151' },
  verified: { background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 },
  unverified: { background: '#fef9c3', color: '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 },
  activeBadge: { fontSize: '0.75rem', fontWeight: 600 },
  actions: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  verifyBtn: { background: '#dbeafe', color: '#1d4ed8', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' },
  toggleBtn: { border: 'none', padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' },
};

export default AdminUsers;
