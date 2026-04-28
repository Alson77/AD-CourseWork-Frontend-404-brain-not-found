import { useState, useEffect } from 'react';
import { FileText, Search, Printer, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function SalesHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API}/api/invoices`);
      // Sort newest first
      const sorted = res.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
      setInvoices(sorted);
    } catch {
      setError('Cannot load sales history. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInvoices(); }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toString().includes(searchTerm)
  );

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);

  // Print single invoice
  const handlePrint = (invoice) => {
    setViewInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // ── Render Printable Invoice View ──────────────────────────────
  if (viewInvoice) {
    return (
      <div className="main-content" style={{ maxWidth: '860px' }}>
        <p className="page-breadcrumb">Sales &amp; Finance &gt; Sales History &gt; Print</p>

        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h1 className="page-title" style={{ margin: 0, flex: 1 }}>Invoice #{viewInvoice.id}</h1>
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer size={15} /> Print Invoice
          </button>
          <button className="clear-btn" onClick={() => setViewInvoice(null)}>Back to History</button>
        </div>

        <div className="inv-print-area" id="invoice-preview">
          <div className="inv-print-header">
            <div>
              <h1 className="inv-print-company">AutoParts<span>Plus</span></h1>
              <p className="inv-print-address">Vehicle Parts &amp; Service Center</p>
            </div>
            <div className="inv-print-meta">
              <p><strong>Invoice #</strong> {viewInvoice.id}</p>
              <p><strong>Date:</strong> {new Date(viewInvoice.invoiceDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="inv-print-divider" />
          <div className="inv-print-customer">
            <p className="inv-print-label">BILLED TO</p>
            <p className="inv-print-name">{viewInvoice.customerName}</p>
            {viewInvoice.customerPhone && <p className="inv-print-phone">📞 {viewInvoice.customerPhone}</p>}
          </div>
          <table className="inv-print-table">
            <thead>
              <tr>
                <th>#</th><th>Part Name</th><th>Qty</th><th>Unit Price</th><th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {viewInvoice.items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td><td>{it.partName}</td><td>{it.quantity}</td>
                  <td>Rs. {Number(it.unitPrice).toFixed(2)}</td>
                  <td>Rs. {Number(it.lineTotal || (it.quantity * it.unitPrice)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inv-print-totals">
            <div className="inv-print-total-row">
              <span>Subtotal</span><span>Rs. {Number(viewInvoice.subtotal).toFixed(2)}</span>
            </div>
            {viewInvoice.discount > 0 && (
              <div className="inv-print-total-row discount">
                <span>Discount</span><span>- Rs. {Number(viewInvoice.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="inv-print-divider" />
            <div className="inv-print-total-row grand">
              <span>TOTAL AMOUNT</span><span>Rs. {Number(viewInvoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render History List ──────────────────────────────────────────
  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Sales &amp; Finance &gt; Sales History</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={26} color="var(--accent)" />
          <h1 className="page-title" style={{ margin: 0 }}>Sales History</h1>
        </div>
        
        <div className="info-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <p className="ov-label">Total Revenue Shown</p>
            <p className="ov-value" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#16a34a' }}>
              Rs. {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box" style={{ maxWidth: '400px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by invoice # or customer name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="inv-error-banner">{error}</div>}

      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading sales history...</p>
        ) : filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>No invoices found matching your criteria.</p>
          </div>
        ) : (
          <div className="cart-table-wrapper" style={{ margin: 0 }}>
            <table className="cart-table inv-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Items Count</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>INV-{inv.id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(inv.invoiceDate).toLocaleString()}</td>
                    <td>{inv.customerName}</td>
                    <td>{inv.items?.length || 0} items</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>Rs. {Number(inv.total).toFixed(2)}</td>
                    <td>
                      <button className="inv-action-btn edit" title="View / Print" onClick={() => handlePrint(inv)}>
                        <Printer size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
