import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalInvoices: 0,
    totalCustomers: 0, lowStockParts: [], totalParts: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [partsRes, invoicesRes, customersRes] = await Promise.allSettled([
          axios.get(`${API}/api/parts`),
          axios.get(`${API}/api/invoices`),
          axios.get(`${API}/api/customers`),
        ]);

        const parts     = partsRes.status     === 'fulfilled' ? partsRes.value.data     : [];
        const invoices  = invoicesRes.status  === 'fulfilled' ? invoicesRes.value.data  : [];
        const customers = customersRes.status === 'fulfilled' ? customersRes.value.data : [];

        const lowStock  = parts.filter(p => p.stockQuantity <= 5);
        const revenue   = invoices.reduce((s, inv) => s + inv.total, 0);
        const recent    = invoices.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0, 5);

        setStats({
          totalRevenue:   revenue,
          totalInvoices:  invoices.length,
          totalCustomers: customers.length,
          lowStockParts:  lowStock,
          totalParts:     parts.length,
        });
        setRecentInvoices(recent);
      } catch {
        // Graceful — shows zeros if backend not reachable
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Revenue',   value: `Rs. ${stats.totalRevenue.toFixed(2)}`, icon: <TrendingUp size={24} />, bg: '#d1fae5', color: '#065f46' },
    { label: 'Total Invoices',  value: stats.totalInvoices,                    icon: <BarChart2 size={24} />,  bg: '#dbeafe', color: '#1e40af' },
    { label: 'Customers',       value: stats.totalCustomers,                   icon: <Users size={24} />,      bg: '#ede9fe', color: '#5b21b6' },
    { label: 'Parts in Stock',  value: stats.totalParts,                       icon: <Package size={24} />,    bg: '#fef3c7', color: '#92400e' },
  ];

  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Main &gt; Analytics &amp; Reports</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <BarChart2 size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Analytics &amp; Reports</h1>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics…</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {statCards.map(c => (
              <div key={c.label} className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
                <div>
                  <p className="ov-label">{c.label}</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginTop: '4px' }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="home-bottom-grid">
            {/* Low Stock Alerts */}
            <div className="info-card">
              <div className="info-card-header">
                <AlertTriangle size={16} color="#b45309" />
                <strong>⚠️ Low Stock Alerts</strong>
              </div>
              {stats.lowStockParts.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>✅ All parts have sufficient stock (more than 5 units).</p>
              ) : (
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 700 }}>Part Name</th>
                      <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 700 }}>Qty Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockParts.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '7px 0', color: 'var(--text-primary)', fontWeight: 500 }}>{p.partName} <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>({p.brand})</span></td>
                        <td style={{ padding: '7px 0', textAlign: 'right' }}>
                          <span className="stock-badge low">{p.stockQuantity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="info-card">
              <div className="info-card-header">
                <strong>🧾 Recent Invoices</strong>
              </div>
              {recentInvoices.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No invoices generated yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {recentInvoices.map(inv => (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{inv.customerName}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>INV-{inv.id} · {new Date(inv.invoiceDate).toLocaleDateString()}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>Rs. {Number(inv.total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
