import { useState } from 'react';
import { FileText, Plus, Trash2, Printer } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

const emptyItem = { partName: '', quantity: 1, unitPrice: '' };

export default function InvoiceGeneration() {
  const [customer, setCustomer] = useState({ name: '', phone: '', date: new Date().toISOString().split('T')[0] });
  const [items, setItems]       = useState([{ ...emptyItem }]);
  const [discount, setDiscount] = useState('');
  const [saving, setSaving]     = useState(false);
  const [formErr, setFormErr]   = useState('');
  const [invoice, setInvoice]   = useState(null); // saved invoice shown in preview

  // ── Totals ──────────────────────────────────────────────────────────
  const subtotal   = items.reduce((s, i) => s + (parseFloat(i.unitPrice) || 0) * (parseInt(i.quantity) || 0), 0);
  const discAmt    = Math.min(parseFloat(discount) || 0, subtotal);
  const total      = subtotal - discAmt;

  // ── Item helpers ─────────────────────────────────────────────────────
  const addItem = () => setItems(prev => [...prev, { ...emptyItem }]);

  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const updateItem = (idx, field, val) =>
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');

    if (!customer.name.trim())           return setFormErr('Customer name is required.');
    if (items.length === 0)              return setFormErr('Add at least one item.');

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.partName.trim())           return setFormErr(`Row ${i + 1}: Part name is required.`);
      if (!it.quantity || +it.quantity < 1) return setFormErr(`Row ${i + 1}: Quantity must be at least 1.`);
      if (!it.unitPrice || +it.unitPrice <= 0) return setFormErr(`Row ${i + 1}: Unit price must be greater than 0.`);
    }

    const payload = {
      customerName:  customer.name.trim(),
      customerPhone: customer.phone.trim(),
      invoiceDate:   new Date(customer.date).toISOString(),
      discount:      discAmt,
      items: items.map(it => ({
        partName:  it.partName.trim(),
        quantity:  parseInt(it.quantity),
        unitPrice: parseFloat(it.unitPrice),
      })),
    };

    try {
      setSaving(true);
      const res = await axios.post(`${API}/api/invoices`, payload);
      setInvoice(res.data);           // show preview
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Failed to save invoice. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  // ── Print ────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  // ── New invoice ──────────────────────────────────────────────────────
  const handleNew = () => {
    setInvoice(null);
    setCustomer({ name: '', phone: '', date: new Date().toISOString().split('T')[0] });
    setItems([{ ...emptyItem }]);
    setDiscount('');
    setFormErr('');
  };

  // ── Invoice preview (printable) ──────────────────────────────────────
  if (invoice) {
    return (
      <div className="main-content" style={{ maxWidth: '860px' }}>
        <p className="page-breadcrumb">Sales &amp; Finance &gt; Invoice Generation</p>

        {/* Screen-only controls */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h1 className="page-title" style={{ margin: 0, flex: 1 }}>Invoice #{invoice.id}</h1>
          <button className="btn-primary" id="btn-print-invoice" onClick={handlePrint}>
            <Printer size={15} /> Print Invoice
          </button>
          <button className="clear-btn" onClick={handleNew}>New Invoice</button>
        </div>

        {/* Printable invoice */}
        <div className="inv-print-area" id="invoice-preview">
          {/* Header */}
          <div className="inv-print-header">
            <div>
              <h1 className="inv-print-company">AutoParts<span>Plus</span></h1>
              <p className="inv-print-address">Vehicle Parts &amp; Service Center</p>
            </div>
            <div className="inv-print-meta">
              <p><strong>Invoice #</strong> {invoice.id}</p>
              <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="inv-print-divider" />

          {/* Customer */}
          <div className="inv-print-customer">
            <p className="inv-print-label">BILLED TO</p>
            <p className="inv-print-name">{invoice.customerName}</p>
            {invoice.customerPhone && <p className="inv-print-phone">📞 {invoice.customerPhone}</p>}
          </div>

          {/* Items table */}
          <table className="inv-print-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Part Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.partName}</td>
                  <td>{it.quantity}</td>
                  <td>Rs. {Number(it.unitPrice).toFixed(2)}</td>
                  <td>Rs. {Number(it.lineTotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="inv-print-totals">
            <div className="inv-print-total-row">
              <span>Subtotal</span>
              <span>Rs. {Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="inv-print-total-row discount">
                <span>Discount</span>
                <span>- Rs. {Number(invoice.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="inv-print-divider" />
            <div className="inv-print-total-row grand">
              <span>TOTAL AMOUNT</span>
              <span>Rs. {Number(invoice.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="inv-print-footer">
            <p>Thank you for choosing AutoPartsPlus! 🚗</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Invoice form ─────────────────────────────────────────────────────
  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      <p className="page-breadcrumb">Sales &amp; Finance &gt; Invoice Generation</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <FileText size={22} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Generate Invoice</h1>
      </div>

      {formErr && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{formErr}</div>}

      <form onSubmit={handleSubmit} id="invoice-form">
        {/* Customer Info */}
        <div className="form-card">
          <p className="form-section-title">Customer Information</p>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cust-name">Customer Name *</label>
              <input id="cust-name" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label htmlFor="cust-phone">Phone Number</label>
              <input id="cust-phone" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX" />
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: '250px' }}>
            <label htmlFor="inv-date">Invoice Date</label>
            <input id="inv-date" type="date" value={customer.date} onChange={e => setCustomer(p => ({ ...p, date: e.target.value }))} />
          </div>
        </div>

        {/* Items */}
        <div className="form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p className="form-section-title" style={{ margin: 0 }}>Invoice Items</p>
            <button type="button" className="btn-primary" onClick={addItem} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <Plus size={13} /> Add Row
            </button>
          </div>

          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Part Name</th>
                  <th>Qty</th>
                  <th>Unit Price (Rs.)</th>
                  <th>Line Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const lineTotal = (parseFloat(it.unitPrice) || 0) * (parseInt(it.quantity) || 0);
                  return (
                    <tr key={idx}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{idx + 1}</td>
                      <td>
                        <input
                          className="inv-inline-input"
                          value={it.partName}
                          onChange={e => updateItem(idx, 'partName', e.target.value)}
                          placeholder="Part name"
                        />
                      </td>
                      <td>
                        <input
                          className="inv-inline-input"
                          type="number" min="1"
                          value={it.quantity}
                          onChange={e => updateItem(idx, 'quantity', e.target.value)}
                          style={{ width: '70px' }}
                        />
                      </td>
                      <td>
                        <input
                          className="inv-inline-input"
                          type="number" min="0" step="0.01"
                          value={it.unitPrice}
                          onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          style={{ width: '110px' }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>Rs. {lineTotal.toFixed(2)}</td>
                      <td>
                        {items.length > 1 && (
                          <button type="button" className="remove-btn" onClick={() => removeItem(idx)}>
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Discount + Totals summary */}
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Discount (Rs.)</span>
                <input
                  className="inv-inline-input"
                  type="number" min="0" step="0.01"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '110px', textAlign: 'right' }}
                />
              </div>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" id="btn-generate-invoice" disabled={saving} style={{ maxWidth: '300px' }}>
          {saving ? 'Generating…' : '📄 Generate Invoice'}
        </button>
      </form>
    </div>
  );
}
