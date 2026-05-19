import { useState, useEffect, useCallback } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function CreditStatus() {
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/api/credit/my');
      setCredit(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load credit information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="page-container">Loading credit management...</div>;

  const pendingCredit = credit?.pendingCredit ?? 0;
  const isOverdue = credit?.isOverdue ?? false;
  const isCleared = pendingCredit === 0;
  const unpaidInvoices = credit?.unpaidInvoices ?? [];

  return (
    <div className="page-container">
      <div className="page-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={28} />
          <h1>Credit Management</h1>
        </div>
        <button type="button" className="clear-btn" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p className="page-desc">View outstanding balances from in-store credit sales and payment status.</p>

      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      {isOverdue ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={28} color="#dc2626" />
          <div>
            <strong style={{ color: '#b91c1c' }}>Overdue payment</strong>
            <p style={{ margin: '4px 0 0', color: '#7f1d1d', fontSize: '0.9rem' }}>
              One or more invoices are past the due date. Please visit the shop to settle your balance.
            </p>
          </div>
        </div>
      ) : isCleared ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <CheckCircle size={28} color="#059669" />
          <div>
            <strong style={{ color: '#065f46' }}>All clear</strong>
            <p style={{ margin: '4px 0 0', color: '#064e3b', fontSize: '0.9rem' }}>You have no outstanding credit balance.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <Clock size={28} color="#d97706" />
          <div>
            <strong style={{ color: '#92400e' }}>Pending balance</strong>
            <p style={{ margin: '4px 0 0', color: '#78350f', fontSize: '0.9rem' }}>Please settle your outstanding invoices at your earliest convenience.</p>
          </div>
        </div>
      )}

      <div className="form-card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total outstanding</p>
        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: isCleared ? '#10b981' : isOverdue ? '#ef4444' : '#f59e0b', margin: 0 }}>
          Rs. {Number(pendingCredit).toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="inv-table-card">
        <h2 style={{ padding: '1rem 1rem 0', margin: 0 }}>Unpaid invoices</h2>
        {unpaidInvoices.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No unpaid invoices linked to your account.</p>
        ) : (
          <div className="cart-table-wrapper" style={{ margin: 0 }}>
            <table className="cart-table inv-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unpaidInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>INV-{inv.id}</td>
                    <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                    <td>Rs. {Number(inv.total).toFixed(2)}</td>
                    <td>Rs. {Number(inv.paidAmount).toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: '#b45309' }}>Rs. {Number(inv.balanceAmount).toFixed(2)}</td>
                    <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`status-badge ${inv.isOverdue ? 'pending' : 'completed'}`}>
                        {inv.isOverdue ? 'Overdue' : inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Online cart purchases are paid at checkout. Credit shown here is from in-store sales billed on credit.{' '}
        <Link to="/customer-dashboard">Back to dashboard</Link>
      </p>
    </div>
  );
}
