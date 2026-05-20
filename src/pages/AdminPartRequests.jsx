import { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, ShoppingBag, MoreVertical } from 'lucide-react';
import api from '../utils/api';

const STATUS_COLORS = {
  Pending:   { bg: '#fef3c7', color: '#92400e' },
  Approved:  { bg: '#d1fae5', color: '#065f46' },
  Rejected:  { bg: '#fee2e2', color: '#991b1b' },
  Ordered:   { bg: '#dbeafe', color: '#1e40af' },
  Completed: { bg: '#ede9fe', color: '#5b21b6' },
};

function AdminPartRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [actionModal, setActionModal] = useState(null); // { id, currentStatus }
  const [actionForm, setActionForm] = useState({ status: '', adminNote: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/partrequests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openModal = (req) => {
    setActionModal(req);
    setActionForm({ status: req.status, adminNote: req.adminNote || '' });
  };

  const closeModal = () => { setActionModal(null); };

  const handleUpdate = async () => {
    if (!actionForm.status) return;
    setSaving(true);
    try {
      await api.patch(`/api/partrequests/${actionModal.id}/status`, actionForm);
      showToast(`✅ Request #${actionModal.id} updated to "${actionForm.status}"`);
      closeModal();
      fetchRequests();
    } catch (err) {
      alert(err.response?.data || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = requests.filter(r => {
    const matchStatus = filter === 'All' || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.partName?.toLowerCase().includes(q) || r.userName?.toLowerCase().includes(q) || r.brand?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="page-container">
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999,
          background: '#10b981', color: '#fff', padding: '0.75rem 1.5rem',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 600
        }}>
          {toast}
        </div>
      )}

      <div className="page-header">
        <Package size={28} />
        <h1>Part Requests Management</h1>
      </div>
      <p className="page-desc">View and manage all part requests submitted by customers and staff.</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by part, brand, user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '220px' }}
        />
        {['All', 'Pending', 'Approved', 'Rejected', 'Ordered', 'Completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: filter === s ? 'none' : '1px solid var(--border)',
              background: filter === s ? 'var(--primary)' : 'transparent',
              color: filter === s ? '#fff' : 'inherit',
              cursor: 'pointer',
              fontWeight: filter === s ? 600 : 400,
              fontSize: '0.85rem'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid-2-col" style={{ marginBottom: '2rem' }}>
        {['Pending', 'Approved', 'Rejected', 'Ordered'].map(s => (
          <div key={s} className="form-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{s}</span>
            <span style={{
              fontWeight: 700, fontSize: '1.4rem',
              color: STATUS_COLORS[s]?.color || '#111'
            }}>
              {requests.filter(r => r.status === s).length}
            </span>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading part requests...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>No part requests found.</p>
        </div>
      ) : (
        <div className="list-card">
          <table className="cart-table" style={{ fontSize: '0.87rem' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Requested By</th>
                <th>Role</th>
                <th>Part Name</th>
                <th>Brand</th>
                <th>Vehicle Model</th>
                <th>Qty</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const sc = STATUS_COLORS[r.status] || {};
                return (
                  <tr key={r.id}>
                    <td>REQ-{r.id.toString().padStart(4, '0')}</td>
                    <td>{r.userName || '—'}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                        background: r.userRole === 'Admin' ? '#fee2e2' : r.userRole === 'Staff' ? '#dbeafe' : '#d1fae5',
                        color: r.userRole === 'Admin' ? '#991b1b' : r.userRole === 'Staff' ? '#1e40af' : '#065f46'
                      }}>
                        {r.userRole || '—'}
                      </span>
                    </td>
                    <td><strong>{r.partName}</strong></td>
                    <td>{r.brand}</td>
                    <td>{r.vehicleModel}</td>
                    <td>{r.quantity}</td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={r.description}>
                      {r.description}
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                        background: sc.bg, color: sc.color
                      }}>
                        {r.status}
                      </span>
                      {r.adminNote && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 0' }}>📝 {r.adminNote}</p>
                      )}
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() => openModal(r)}
                        title="Update Status"
                        style={{ background: '#6366f1', color: '#fff', padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      >
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem',
            width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Update Request Status</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              REQ-{actionModal.id.toString().padStart(4, '0')} — <strong>{actionModal.partName}</strong> by {actionModal.userName}
            </p>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Status</label>
              <select
                value={actionForm.status}
                onChange={e => setActionForm({ ...actionForm, status: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Ordered">Ordered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Admin Note (optional)</label>
              <textarea
                value={actionForm.adminNote}
                onChange={e => setActionForm({ ...actionForm, adminNote: e.target.value })}
                rows={3}
                placeholder="Reason for rejection, estimated arrival date, etc..."
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleUpdate}
                disabled={saving}
                style={{ flex: 1, padding: '0.7rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={closeModal}
                style={{ padding: '0.7rem 1.5rem', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPartRequests;
