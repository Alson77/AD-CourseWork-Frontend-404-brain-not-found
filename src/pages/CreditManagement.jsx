import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, AlertTriangle, RefreshCw, Receipt } from 'lucide-react';
import api from '../utils/api';

export default function CreditManagement() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/api/credit/admin');
      setOverview(data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError('Credit API not found (404). Stop the backend and run "dotnet run" again, then refresh.');
      } else if (status === 401 || status === 403) {
        setError('Not authorized. Log out and sign in again as Admin.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach the backend at http://localhost:5000. Start the backend with "dotnet run".');
      } else {
        setError(err.response?.data?.message || `Failed to load credit data (${status || 'error'}).`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  const openPayCustomer = (c) => {
    setPayModal({
      type: 'customer',
      customerId: c.id ?? null,
      customerKey: c.customerKey,
      customerPhone: c.phone,
      customerName: c.fullName,
      name: c.fullName,
      maxAmount: c.totalOutstanding,
    });
    setPayAmount(String(c.totalOutstanding));
  };

  const openPayInvoice = (inv) => {
    setPayModal({
      type: 'invoice',
      invoiceId: inv.id,
      name: inv.customerName,
      maxAmount: inv.balanceAmount,
    });
    setPayAmount(String(inv.balanceAmount));
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;
    if (amount > payModal.maxAmount + 0.01) {
      setError(`Payment cannot exceed outstanding balance (Rs. ${payModal.maxAmount.toFixed(2)}).`);
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload =
        payModal.type === 'invoice'
          ? { invoiceId: payModal.invoiceId, amount }
          : {
              customerId: payModal.customerId || undefined,
              customerKey: payModal.customerKey,
              customerPhone: payModal.customerPhone,
              customerName: payModal.customerName,
              amount,
            };

      await api.post('/api/credit/admin/record-payment', payload);
      flash(`Payment of Rs. ${amount.toFixed(2)} recorded successfully.`);
      setPayModal(null);
      setPayAmount('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setSaving(false);
    }
  };

  const customers = overview?.customers ?? [];
  const invoices = overview?.invoices ?? [];

  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Sales &amp; Finance &gt; Credit Management</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={26} color="var(--accent)" />
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>Credit Management</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Track outstanding balances and record customer payments.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="clear-btn" onClick={load} disabled={loading}>
            <RefreshCw size={15} /> Refresh
          </button>
          <Link to="/invoice" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <Receipt size={15} /> Generate Invoice
          </Link>
        </div>
      </div>

      <div className="info-card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
          <strong>Generate Invoice</strong> is required for walk-in sales and credit invoices (Payment: Credit/Partial).
          Balances are calculated from unpaid invoices (Total − Paid).
        </p>
      </div>

      {success && <div className="success-banner">{success}</div>}
      {error && <div className="inv-error-banner">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading credit overview…</p>
      ) : overview ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="info-card" style={{ padding: '1.25rem' }}>
              <p className="ov-label">Total Outstanding</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#be123c' }}>
                Rs. {Number(overview.totalOutstanding).toFixed(2)}
              </p>
            </div>
            <div className="info-card" style={{ padding: '1.25rem' }}>
              <p className="ov-label">Customers with Balance</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{overview.pendingCustomerCount}</p>
            </div>
            <div className="info-card" style={{ padding: '1.25rem' }}>
              <p className="ov-label">Unpaid Invoices</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{overview.unpaidInvoiceCount}</p>
            </div>
            <div className="info-card" style={{ padding: '1.25rem' }}>
              <p className="ov-label">Overdue</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>{overview.overdueCount}</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Customers with pending credit</h2>
          <div className="inv-table-card" style={{ marginBottom: '2rem' }}>
            {customers.length === 0 ? (
              <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No customers with outstanding credit.</p>
            ) : (
              <div className="cart-table-wrapper">
                <table className="cart-table inv-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Unpaid Invoices</th>
                      <th>Total Outstanding</th>
                      <th>Oldest Due</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.customerKey || c.id || c.fullName}>
                        <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                        <td>{c.phone || '—'}</td>
                        <td>{c.unpaidInvoiceCount}</td>
                        <td style={{ fontWeight: 700, color: '#be123c' }}>Rs. {Number(c.totalOutstanding).toFixed(2)}</td>
                        <td>{c.oldestDueDate ? new Date(c.oldestDueDate).toLocaleDateString() : '—'}</td>
                        <td>
                          {c.status === 'Overdue' ? (
                            <span style={{ color: '#b45309', fontSize: '0.85rem' }}>
                              <AlertTriangle size={14} style={{ verticalAlign: 'middle' }} /> Overdue
                            </span>
                          ) : (
                            <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>Pending</span>
                          )}
                        </td>
                        <td>
                          <button type="button" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openPayCustomer(c)}>
                            Record Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Unpaid credit invoices</h2>
          <div className="inv-table-card">
            {invoices.length === 0 ? (
              <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No unpaid invoices.</p>
            ) : (
              <div className="cart-table-wrapper">
                <table className="cart-table inv-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Balance</th>
                      <th>Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td>INV-{inv.id}</td>
                        <td>
                          <div>{inv.customerName}</div>
                          {inv.customerPhone && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{inv.customerPhone}</div>
                          )}
                        </td>
                        <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                        <td>Rs. {Number(inv.total).toFixed(2)}</td>
                        <td>Rs. {Number(inv.paidAmount).toFixed(2)}</td>
                        <td style={{ fontWeight: 700, color: '#be123c' }}>Rs. {Number(inv.balanceAmount).toFixed(2)}</td>
                        <td>
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                          {inv.isOverdue && <span style={{ display: 'block', fontSize: '0.75rem', color: '#b45309' }}>Overdue</span>}
                        </td>
                        <td>
                          <button type="button" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openPayInvoice(inv)}>
                            Record Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}

      {payModal && (
        <div className="inv-overlay" onClick={() => setPayModal(null)}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '0.5rem' }}>Record Payment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              {payModal.name} — outstanding: <strong>Rs. {payModal.maxAmount.toFixed(2)}</strong>
            </p>
            <form onSubmit={handleRecordPayment}>
              <div className="form-group">
                <label>Payment amount (Rs.)</label>
                <input type="number" min="0.01" step="0.01" max={payModal.maxAmount} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="submit-btn" disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving…' : 'Confirm Payment'}</button>
                <button type="button" className="clear-btn" onClick={() => setPayModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}