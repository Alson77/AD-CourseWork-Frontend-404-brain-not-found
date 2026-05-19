import { useState, useEffect } from 'react';
import api from '../utils/api';
import { UsersRound, Edit, Trash2 } from 'lucide-react';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await api.get('/api/vendors');
      setVendors(data);
    } catch (err) {
      setError('Could not load vendors. Make sure backend is running.');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/api/vendors/${editingId}`, form);
      } else {
        await api.post('/api/vendors', form);
      }
      setForm({ name: '', contactPerson: '', phone: '', email: '', address: '' });
      setEditingId(null);
      fetchVendors();
    } catch (err) {
      setError(`Error saving vendor: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    setForm({ name: v.name, contactPerson: v.contactPerson, phone: v.phone, email: v.email, address: v.address });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete vendor?')) return;
    try {
      await api.delete(`/api/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      setError('Error deleting vendor.');
    }
  };

  return (
    <div className="main-content">
      <p className="page-breadcrumb">Operations &gt; Vendor Management</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <UsersRound size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Vendor Management</h1>
      </div>

      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="form-card">
        <strong style={{ display: 'block', marginBottom: '1rem' }}>
          {editingId ? '✏️ Edit Vendor' : '➕ Add New Vendor'}
        </strong>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Vendor Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="inv-inline-input" />
          <input placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} className="inv-inline-input" />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="inv-inline-input" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="inv-inline-input" />
          <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="inv-inline-input" style={{gridColumn: '1 / -1'}}/>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
            <button className="btn-primary" type="submit">{editingId ? 'Update Vendor' : 'Add Vendor'}</button>
            {editingId && (
              <button type="button" className="clear-btn" onClick={() => { setEditingId(null); setForm({ name: '', contactPerson: '', phone: '', email: '', address: '' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="inv-table-card" style={{ marginTop: '20px' }}>
        {vendors.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No vendors registered yet.</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr><th>Name</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td>{v.contactPerson}</td>
                  <td>{v.phone}</td>
                  <td>{v.email}</td>
                  <td>{v.address}</td>
                  <td>
                    <button onClick={() => handleEdit(v)} className="btn-primary" style={{ marginRight: '6px', padding: '4px 10px' }}><Edit size={14}/></button>
                    <button onClick={() => handleDelete(v.id)} className="remove-btn" style={{ padding: '4px 10px' }}><Trash2 size={14}/></button>
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
