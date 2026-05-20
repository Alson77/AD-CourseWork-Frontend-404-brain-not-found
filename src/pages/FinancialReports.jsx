import { useState, useEffect, useCallback } from 'react';
import { BarChart2 } from 'lucide-react';
import api from '../utils/api';

export default function FinancialReports() {
  const [type, setType] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ type });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const { data } = await api.get(`/api/reports/financial?${params}`);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load report. Ensure you are logged in as Admin and the backend is running.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [type, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="main-content">
      <p className="page-breadcrumb">Sales &amp; Finance &gt; Financial Reports</p>
      <h1 className="page-title"><BarChart2 size={24} /> Financial Reports</h1>

      <div className="form-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={type} onChange={(e) => setType(e.target.value)} className="inv-inline-input">
          <option value="daily">Daily Report</option>
          <option value="monthly">Monthly Report</option>
          <option value="yearly">Yearly Report</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="inv-inline-input" />
        <span>to</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="inv-inline-input" />
      </div>

      {error && <div className="inv-error-banner" style={{ marginTop: '1rem' }}>{error}</div>}
      {loading && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading report…</p>}

      {report && !loading && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="info-card" style={{ flex: 1, minWidth: '200px' }}>
              <p>Total Revenue (Invoices)</p>
              <h2>Rs. {Number(report.totalRevenue).toFixed(2)}</h2>
            </div>
            <div className="info-card" style={{ flex: 1, minWidth: '200px' }}>
              <p>Total Invoices</p>
              <h2>{report.totalInvoices}</h2>
            </div>
          </div>

          <table className="cart-table">
            <thead>
              <tr><th>Date / Period</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {report.data?.length ? report.data.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>Rs. {Number(row.revenue).toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No data for selected period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
