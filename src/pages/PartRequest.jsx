import { useState } from 'react';
import { Package } from 'lucide-react';

const initialForm = {
  customerName: '',
  phone: '',
  vehicleNumber: '',
  partName: '',
  vehicleModel: '',
  urgency: '',
  additionalNote: '',
};

function PartRequest() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!form.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required.';
    if (!form.partName.trim()) newErrors.partName = 'Part name is required.';
    if (!form.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required.';
    if (!form.urgency) newErrors.urgency = 'Please select urgency level.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setRequestDetails(form);
    setSubmitted(true);
    setForm(initialForm);
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
            <div><strong>Name:</strong> {requestDetails.customerName}</div>
            <div><strong>Phone:</strong> {requestDetails.phone}</div>
            <div><strong>Vehicle No:</strong> {requestDetails.vehicleNumber}</div>
            <div><strong>Part Name:</strong> {requestDetails.partName}</div>
            <div><strong>Vehicle Model:</strong> {requestDetails.vehicleModel}</div>
            <div>
              <strong>Urgency: </strong>
              <span
                className="urgency-badge"
                style={{ backgroundColor: urgencyColor[requestDetails.urgency] }}
              >
                {requestDetails.urgency}
              </span>
            </div>
            {requestDetails.additionalNote && (
              <div className="full-width"><strong>Note:</strong> {requestDetails.additionalNote}</div>
            )}
          </div>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="e.g. Ram Bahadur"
            />
            {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 9800000000"
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Number *</label>
            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g. BA 1 CHA 1234"
            />
            {errors.vehicleNumber && <span className="error-msg">{errors.vehicleNumber}</span>}
          </div>
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
            <label>Urgency Level *</label>
            <select name="urgency" value={form.urgency} onChange={handleChange}>
              <option value="">-- Select Urgency --</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.urgency && <span className="error-msg">{errors.urgency}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Additional Note (Optional)</label>
          <textarea
            name="additionalNote"
            value={form.additionalNote}
            onChange={handleChange}
            rows={3}
            placeholder="Any extra details about the part or your situation..."
          />
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
}

export default PartRequest;
