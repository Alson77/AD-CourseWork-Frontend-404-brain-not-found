import { useState, useEffect } from 'react';
import api from '../utils/api';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Staff', isActive: true });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get('/api/staff');
      setStaff(data);
    } catch (err) {
      setError('Could not load staff. Make sure backend is running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/api/staff/${editingId}`, form);
      } else {
        await api.post('/api/staff', form);
      }
      setForm({ name: '', email: '', password: '', role: 'Staff', isActive: true });
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      setError(`Error saving staff: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, email: s.email, password: '', role: s.role, isActive: s.isActive });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await api.delete(`/api/staff/${id}`);
      fetchStaff();
    } catch (err) {
      setError('Error deleting staff.');
    }
  };

  return (
    <div className="main-content">
      <p className="page-breadcrumb">Admin &gt; Staff Management</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <UserPlus size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Staff Management</h1>
      </div>

      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="form-card">
        <strong style={{ display: 'block', marginBottom: '1rem' }}>
          {editingId ? '✏️ Edit Staff Member' : '➕ Register New Staff'}
        </strong>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="inv-inline-input" />
          <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="inv-inline-input" />
          <input type="password" placeholder={editingId ? "New Password (leave blank to keep)" : "Password *"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingId} className="inv-inline-input" />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="inv-inline-input">
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
            Active Account
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn-primary" type="submit">{editingId ? 'Update Staff' : 'Register Staff'}</button>
            {editingId && (
              <button type="button" className="clear-btn" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', role: 'Staff', isActive: true }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="inv-table-card" style={{ marginTop: '20px' }}>
        {staff.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No staff registered yet.</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.email}</td>
                  <td><span className="part-category">{s.role}</span></td>
                  <td>
                    <span style={{ color: s.isActive ? '#16a34a' : '#ef4444', fontWeight: 600 }}>
                      {s.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(s)} className="btn-primary" style={{ marginRight: '6px', padding: '4px 10px' }}><Edit size={14}/></button>
                    <button onClick={() => handleDelete(s.id)} className="remove-btn" style={{ padding: '4px 10px' }}><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
