import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, X } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

const CATEGORIES = ['Filters', 'Brakes', 'Engine', 'Electrical', 'Suspension', 'Exhaust', 'Cooling', 'Transmission', 'Other'];

const emptyForm = { partName: '', brand: '', category: 'Filters', price: '', stockQuantity: '' };

export default function InventoryManagement() {
  const [parts, setParts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState('');
  const [successMsg, setSuccess]  = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [formErr, setFormErr]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  // ── Load parts ──────────────────────────────────────────────────────
  const loadParts = async () => {
    try {
      setLoading(true);
      setApiError('');
      const res = await axios.get(`${API}/api/parts`);
      setParts(res.data);
    } catch {
      setApiError('Cannot reach backend. Make sure ASP.NET Core is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadParts(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };

  // ── Open Add form ────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErr('');
    setShowModal(true);
  };

  // ── Open Edit form ───────────────────────────────────────────────────
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ partName: p.partName, brand: p.brand, category: p.category, price: String(p.price), stockQuantity: String(p.stockQuantity) });
    setFormErr('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setFormErr(''); };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Save (Add or Edit) ───────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setFormErr('');
    if (!form.partName.trim())                          return setFormErr('Part name is required.');
    if (!form.price || isNaN(form.price) || +form.price <= 0) return setFormErr('Enter a valid price greater than 0.');
    if (form.stockQuantity === '' || isNaN(form.stockQuantity) || +form.stockQuantity < 0)
      return setFormErr('Stock quantity must be 0 or more.');

    const payload = {
      partName:      form.partName.trim(),
      brand:         form.brand.trim(),
      category:      form.category,
      price:         parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
    };

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${API}/api/parts/${editingId}`, payload);
        flash('Part updated successfully!');
      } else {
        await axios.post(`${API}/api/parts`, payload);
        flash('Part added successfully!');
      }
      await loadParts();
      closeModal();
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/api/parts/${deleteId}`);
      flash('Part deleted successfully!');
      await loadParts();
    } catch {
      setApiError('Failed to delete part.');
    } finally {
      setDeleteId(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Inventory Management &gt; Parts</p>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.2rem' }}>Inventory Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Add, edit, and remove vehicle parts from stock</p>
        </div>
        <button className="btn-primary" id="btn-add-part" onClick={openAdd}>
          <Plus size={15} /> Add New Part
        </button>
      </div>

      {/* Banners */}
      {successMsg && <div className="success-banner">{successMsg}</div>}
      {apiError   && <div className="inv-error-banner">{apiError}</div>}

      {/* Parts Table */}
      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading parts…</p>
        ) : parts.length === 0 ? (
          <div className="empty-state">
            <Package size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>No parts in inventory yet. Click <strong>Add New Part</strong> to get started.</p>
          </div>
        ) : (
          <div className="cart-table-wrapper">
            <table className="cart-table inv-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Part Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price (Rs.)</th>
                  <th>Stock</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.partName}</td>
                    <td>{p.brand || '—'}</td>
                    <td><span className="part-category">{p.category || '—'}</span></td>
                    <td style={{ fontWeight: 600 }}>Rs. {Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${p.stockQuantity > 5 ? 'in' : 'low'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(p.createdDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="inv-action-btn edit" title="Edit" onClick={() => openEdit(p)}>
                          <Pencil size={14} />
                        </button>
                        <button className="inv-action-btn del" title="Delete" onClick={() => setDeleteId(p.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="inv-overlay" onClick={closeModal}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h2>{editingId ? 'Edit Part' : 'Add New Part'}</h2>
              <button className="inv-modal-close" onClick={closeModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} id="part-form">
              {formErr && <div className="inv-form-error">{formErr}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="partName">Part Name *</label>
                  <input id="partName" name="partName" value={form.partName} onChange={handleChange} placeholder="e.g. Oil Filter" />
                </div>
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input id="brand" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Bosch" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price (Rs.) *</label>
                  <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity *</label>
                <input id="stockQuantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} placeholder="0" />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="submit-btn" disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving…' : editingId ? 'Update Part' : 'Add Part'}
                </button>
                <button type="button" className="clear-btn" onClick={closeModal} style={{ flex: '0 0 auto', padding: '11px 20px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────────── */}
      {deleteId && (
        <div className="inv-overlay" onClick={() => setDeleteId(null)}>
          <div className="inv-modal inv-confirm" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Delete Part?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                This will permanently remove the part from inventory. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="inv-delete-confirm-btn" id="btn-confirm-delete" onClick={handleDelete}>Yes, Delete</button>
                <button className="clear-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
