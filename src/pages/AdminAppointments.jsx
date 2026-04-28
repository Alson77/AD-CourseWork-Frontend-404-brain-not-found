import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

const statusColor = {
  Pending:   { bg: '#fef9c3', color: '#854d0e', label: '⏳ Pending' },
  Confirmed: { bg: '#dbeafe', color: '#1e40af', label: '✅ Confirmed' },
  Completed: { bg: '#d1fae5', color: '#065f46', label: '🏁 Completed' },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [successMsg, setSuccess]        = useState('');
  const [updating, setUpdating]         = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/appointments`);
      setAppointments(res.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
    } catch {
      setError('Cannot load appointments. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(id);
      const res = await axios.put(`${API}/api/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === id ? res.data : a));
      flash(`Appointment #${id} marked as ${newStatus}.`);
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
  };

  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Operations &gt; Manage Appointments</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <Calendar size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Manage Appointments</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Pending',   count: counts.pending,   icon: <Clock size={22} />,        bg: '#fef9c3', color: '#854d0e' },
          { label: 'Confirmed', count: counts.confirmed, icon: <CheckCircle size={22} />,   bg: '#dbeafe', color: '#1e40af' },
          { label: 'Completed', count: counts.completed, icon: <AlertCircle size={22} />,   bg: '#d1fae5', color: '#065f46' },
        ].map(c => (
          <div key={c.label} className="info-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
            <div>
              <p className="ov-label">{c.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{c.count}</p>
            </div>
          </div>
        ))}
      </div>

      {successMsg && <div className="success-banner">{successMsg}</div>}
      {error      && <div className="inv-error-banner">{error}</div>}

      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading appointments…</p>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>No appointments booked yet.</p>
          </div>
        ) : (
          <div className="cart-table-wrapper" style={{ margin: 0 }}>
            <table className="cart-table inv-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Vehicle No.</th>
                  <th>Service Type</th>
                  <th>Date & Time</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => {
                  const s = statusColor[a.status] || statusColor.Pending;
                  return (
                    <tr key={a.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{a.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.customerName}</td>
                      <td>{a.vehicleNumber}</td>
                      <td><span className="part-category">{a.serviceType}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <div>{a.preferredDate}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{a.preferredTime}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          title={a.issueDescription}>{a.issueDescription}</td>
                      <td>
                        <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>
                          {s.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {a.status === 'Pending' && (
                            <button className="inv-action-btn edit" disabled={updating === a.id}
                              onClick={() => updateStatus(a.id, 'Confirmed')} title="Confirm appointment">
                              ✅
                            </button>
                          )}
                          {a.status === 'Confirmed' && (
                            <button className="inv-action-btn edit" disabled={updating === a.id}
                              onClick={() => updateStatus(a.id, 'Completed')} title="Mark as completed"
                              style={{ background: '#d1fae5', color: '#065f46' }}>
                              🏁
                            </button>
                          )}
                          {a.status === 'Completed' && (
                            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Done</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
