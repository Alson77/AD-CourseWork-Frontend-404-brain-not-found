import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FileText, Plus, Trash2 } from 'lucide-react';

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [items, setItems] = useState([{ partId: '', quantity: 1, costPrice: 0 }]);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pRes, vRes, ptRes] = await Promise.all([
        api.get('/api/purchases'),
        api.get('/api/vendors'),
        api.get('/api/parts')
      ]);
      setPurchases(pRes.data);
      setVendors(vRes.data);
      setParts(ptRes.data);
    } catch (err) {
      setError('Could not load data. Make sure backend is running.');
    }
  };

  const handleAddItem = () => setItems([...items, { partId: '', quantity: 1, costPrice: 0 }]);
  const handleRemoveItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  const total = items.reduce((s, i) => s + (parseFloat(i.quantity || 0) * parseFloat(i.costPrice || 0)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!vendorId) return setError('Please select a vendor.');
    const validItems = items.filter(i => i.partId && i.quantity > 0);
    if (!validItems.length) return setError('Add at least one valid item.');
    try {
      await api.post('/api/purchases', {
        vendorId: parseInt(vendorId),
        items: validItems.map(i => ({ partId: parseInt(i.partId), quantity: parseInt(i.quantity), costPrice: parseFloat(i.costPrice) }))
      });
      setVendorId('');
      setItems([{ partId: '', quantity: 1, costPrice: 0 }]);
      fetchData();
      alert('Purchase recorded and stock updated!');
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="main-content">
      <p className="page-breadcrumb">Operations &gt; Purchase Flow</p>
      <h1 className="page-title">Purchase Flow</h1>
      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}
      <div className="form-card">
        <strong style={{ display:'block', marginBottom:'1rem' }}>Create Purchase Invoice</strong>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <select value={vendorId} onChange={e => setVendorId(e.target.value)} required className="inv-inline-input">
              <option value="">-- Select Vendor --</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <table className="cart-table">
            <thead><tr><th>Part</th><th>Qty</th><th>Cost (Rs.)</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <select value={it.partId} onChange={e => updateItem(idx, 'partId', e.target.value)} className="inv-inline-input">
                      <option value="">-- Select Part --</option>
                      {parts.map(p => <option key={p.id} value={p.id}>{p.partName}</option>)}
                    </select>
                  </td>
                  <td><input type="number" min="1" value={it.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className="inv-inline-input" style={{width:'70px'}}/></td>
                  <td><input type="number" min="0" step="0.01" value={it.costPrice} onChange={e => updateItem(idx, 'costPrice', e.target.value)} className="inv-inline-input" style={{width:'100px'}}/></td>
                  <td>Rs. {(it.quantity * it.costPrice).toFixed(2)}</td>
                  <td><button type="button" onClick={() => handleRemoveItem(idx)} className="remove-btn"><Trash2 size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'12px', alignItems:'center' }}>
            <button type="button" onClick={handleAddItem} className="btn-primary"><Plus size={14}/> Add Item</button>
            <strong>Total: Rs. {total.toFixed(2)}</strong>
          </div>
          <div style={{ marginTop:'16px' }}>
            <button type="submit" className="submit-btn">Record Purchase & Update Stock</button>
          </div>
        </form>
      </div>
      <div className="inv-table-card" style={{ marginTop:'20px' }}>
        <div className="info-card-header"><strong>Purchase History</strong></div>
        {purchases.length === 0 ? (
          <p style={{ padding:'1rem', color:'var(--text-secondary)' }}>No purchases recorded yet.</p>
        ) : (
          <table className="cart-table">
            <thead><tr><th>Date</th><th>Vendor</th><th>Items</th><th>Total</th></tr></thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  <td>{p.vendor?.name || '—'}</td>
                  <td>{p.items?.reduce((s, i) => s + i.quantity, 0)} units</td>
                  <td>Rs. {p.totalAmount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
