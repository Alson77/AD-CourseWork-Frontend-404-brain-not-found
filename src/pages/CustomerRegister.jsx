import { useState } from 'react';
import { UserCheck } from 'lucide-react';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  vehicleNumber: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
};

function CustomerRegister() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
    if (!form.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required.';
    if (!form.vehicleBrand.trim()) newErrors.vehicleBrand = 'Vehicle brand is required.';
    if (!form.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required.';
    if (!form.vehicleYear.trim()) newErrors.vehicleYear = 'Vehicle year is required.';
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
    setPreview(form);
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <UserCheck size={28} />
        <h1>Customer Registration</h1>
      </div>
      <p className="page-desc">Register your details and vehicle information below.</p>

      {submitted && (
        <div className="success-banner">
          ✅ Registration successful! Your details have been saved.
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <h2 className="form-section-title">Personal Information</h2>

        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
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
          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Kathmandu, Nepal"
            />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>
        </div>

        <h2 className="form-section-title">Vehicle Information</h2>

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
            <label>Vehicle Brand *</label>
            <input
              type="text"
              name="vehicleBrand"
              value={form.vehicleBrand}
              onChange={handleChange}
              placeholder="e.g. Toyota"
            />
            {errors.vehicleBrand && <span className="error-msg">{errors.vehicleBrand}</span>}
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
              placeholder="e.g. Corolla"
            />
            {errors.vehicleModel && <span className="error-msg">{errors.vehicleModel}</span>}
          </div>
          <div className="form-group">
            <label>Vehicle Year *</label>
            <input
              type="number"
              name="vehicleYear"
              value={form.vehicleYear}
              onChange={handleChange}
              placeholder="e.g. 2020"
              min="1990"
              max="2026"
            />
            {errors.vehicleYear && <span className="error-msg">{errors.vehicleYear}</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn">Register</button>
      </form>

      {preview && (
        <div className="preview-card">
          <h2>📋 Registered Details</h2>
          <div className="preview-grid">
            <div><strong>Name:</strong> {preview.fullName}</div>
            <div><strong>Email:</strong> {preview.email}</div>
            <div><strong>Phone:</strong> {preview.phone}</div>
            <div><strong>Address:</strong> {preview.address}</div>
            <div><strong>Vehicle No:</strong> {preview.vehicleNumber}</div>
            <div><strong>Brand:</strong> {preview.vehicleBrand}</div>
            <div><strong>Model:</strong> {preview.vehicleModel}</div>
            <div><strong>Year:</strong> {preview.vehicleYear}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerRegister;
