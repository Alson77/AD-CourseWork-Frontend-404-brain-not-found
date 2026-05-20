import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  partName: '',
  brand: '',
  vehicleModel: '',
  quantity: 1,
  description: ''
};

function PartRequest() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...initialForm, customerName: user?.name || '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/partrequests/my');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.partName.trim()) newErrors.partName = 'Part name is required.';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required.';
    if (!form.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required.';
    if (form.quantity < 1) newErrors.quantity = 'Quantity must be at least 1.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/partrequests', form);
      setRequestDetails(form);
      setSubmitted(true);
      setForm({ ...initialForm, customerName: user?.name || '' });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const urgencyColor = {
    Low: '#2ecc71',
    Medium: '#f39c12',
    High: '#e74c3c',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Package size={28} />
        <h1>Request an Unavailable Part</h1>
      </div>
      <p className="page-desc">
        Can't find the part you need? Submit a request and our team will source it for you.
      </p>

      {submitted && requestDetails && (
        <div className="confirmation-card">
          <h2>📦 Request Submitted!</h2>
          <p>We have received your part request. Our team will contact you shortly.</p>
          <div className="preview-grid">
            <div><strong>Part Name:</strong> {requestDetails.partName}</div>
            <div><strong>Brand:</strong> {requestDetails.brand}</div>
            <div><strong>Vehicle Model:</strong> {requestDetails.vehicleModel}</div>
            <div><strong>Quantity:</strong> {requestDetails.quantity}</div>
            <div className="full-width"><strong>Description:</strong> {requestDetails.description}</div>
          </div>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Part Name *</label>
            <input
              type="text"
              name="partName"
              value={form.partName}
              onChange={handleChange}
              placeholder="e.g. Brake Pad, Alternator"
            />
            {errors.partName && <span className="error-msg">{errors.partName}</span>}
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Honda, Toyota"
            />
            {errors.brand && <span className="error-msg">{errors.brand}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Model *</label>
            <input
              type="text"
              name="vehicleModel"
              value={form.vehicleModel}
              onChange={handleChange}
              placeholder="e.g. Honda City 2019"
            />
            {errors.vehicleModel && <span className="error-msg">{errors.vehicleModel}</span>}
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
            />
            {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description / Reason *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us why you need this part..."
          />
          {errors.description && <span className="error-msg">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-btn">{submitting ? 'Submitting...' : 'Submit Request'}</button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h2>My Requests</h2>
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="empty-state">You have not submitted any part requests.</div>
        ) : (
          <div className="list-card">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Part Name</th>
                  <th>Brand</th>
                  <th>Vehicle</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>{r.partName}</td>
                    <td>{r.brand}</td>
                    <td>{r.vehicleModel}</td>
                    <td>{r.quantity}</td>
                    <td>
                      <span className={`status-badge ${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                      {r.adminNote && <p style={{fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0 0'}}>Note: {r.adminNote}</p>}
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

export default PartRequest;
