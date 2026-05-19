import { useState, useEffect, useCallback } from 'react';
import { BarChart2, Users, TrendingUp, CreditCard } from 'lucide-react';
import api from '../utils/api';

const customerName = (row) =>
  row.name || row.Name || row.fullName || row.FullName || '—';

const TABS = [
  { id: 'regulars', label: 'Regular Customers', icon: Users },
  { id: 'highspenders', label: 'High Spenders', icon: TrendingUp },
  { id: 'pendingcredit', label: 'Pending Credit', icon: CreditCard },
];

export default function StaffCustomerReports() {
  const [activeTab, setActiveTab] = useState('regulars');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint =
        activeTab === 'regulars'
          ? '/api/customers/reports/regulars'
          : activeTab === 'highspenders'
            ? '/api/customers/reports/highspenders'
            : '/api/customers/reports/pendingcredit';
      const { data: res } = await api.get(endpoint);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report. Ensure you are logged in as Staff.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const renderTable = () => {
    if (activeTab === 'regulars') {
      return (
        <table className="cart-table inv-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Purchases</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.phone || i}>
                <td>{customerName(row)}</td>
                <td>{row.phone || '—'}</td>
                <td>{row.purchaseCount}</td>
                <td style={{ fontWeight: 600 }}>Rs. {Number(row.totalSpent).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === 'highspenders') {
      return (
        <table className="cart-table inv-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.phone || i}>
                <td>{customerName(row)}</td>
                <td>{row.phone || '—'}</td>
                <td style={{ fontWeight: 700, color: '#16a34a' }}>Rs. {Number(row.totalSpent).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <table className="cart-table inv-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Outstanding</th>
            <th>Unpaid Invoices</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.phone || row.name || i}>
              <td>{customerName(row)}</td>
              <td>{row.phone || '—'}</td>
              <td style={{ fontWeight: 700, color: '#b45309' }}>Rs. {Number(row.pendingCredit).toFixed(2)}</td>
              <td>{row.invoiceCount ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Staff &gt; Customer Reports</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <BarChart2 size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Customer Reports</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? 'btn-primary' : 'clear-btn'}
            onClick={() => setActiveTab(id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        <button type="button" className="clear-btn" onClick={load} style={{ marginLeft: 'auto' }}>
          Refresh
        </button>
      </div>

      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading report…</p>
        ) : data.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records for this report.</p>
        ) : (
          <div className="cart-table-wrapper" style={{ margin: 0 }}>{renderTable()}</div>
        )}
      </div>
    </div>
  );
}
