import { useState } from 'react';
import { Calendar } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const serviceTypes = [
  'General Servicing',
  'Engine Checkup',
  'Brake Repair',
  'Oil Change',
  'Parts Replacement',
  'Battery Check',
  'Clutch Inspection',
];

function AppointmentBooking() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    vehicleNumber: '',
    vehicleModel: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    issueDescription: '',
  });
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required.';
    if (!form.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required.';
    if (!form.serviceType) newErrors.serviceType = 'Please select a service type.';
    if (!form.preferredDate) newErrors.preferredDate = 'Preferred date is required.';
    if (!form.preferredTime) newErrors.preferredTime = 'Preferred time is required.';
    if (!form.issueDescription.trim()) newErrors.issueDescription = 'Issue description is required.';
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
      const res = await api.post('/api/appointments', form);
      setConfirmation(res.data);
      setForm({ customerName: user?.name || '', vehicleNumber: '', vehicleModel: '', serviceType: '', preferredDate: '', preferredTime: '', issueDescription: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Calendar size={28} />
        <h1>Book a Service Appointment</h1>
      </div>
      <p className="page-desc">Fill in the details below to schedule your vehicle service.</p>

      {confirmation && (
        <div className="confirmation-card">
          <h2>✅ Appointment Confirmed!</h2>
          <p>Your appointment has been successfully booked. Details below:</p>
          <div className="preview-grid">
            <div><strong>Customer:</strong> {confirmation.customerName}</div>
            <div><strong>Vehicle No:</strong> {confirmation.vehicleNumber}</div>
            <div><strong>Service:</strong> {confirmation.serviceType}</div>
            <div><strong>Date:</strong> {confirmation.preferredDate}</div>
            <div><strong>Time:</strong> {confirmation.preferredTime}</div>
            <div><strong>Issue:</strong> {confirmation.issueDescription}</div>
          </div>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name *</label>
            <input type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Jane Smith" />
            {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
          </div>
          <div className="form-group">
            <label>Vehicle Number *</label>
            <input type="text" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} placeholder="e.g. BA 1 CHA 1234" />
            {errors.vehicleNumber && <span className="error-msg">{errors.vehicleNumber}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Model</label>
            <input type="text" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="e.g. Toyota Corolla 2020" />
          </div>
          <div className="form-group">
            <label>Service Type *</label>
            <select name="serviceType" value={form.serviceType} onChange={handleChange}>
              <option value="">-- Select Service --</option>
              {serviceTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.serviceType && <span className="error-msg">{errors.serviceType}</span>}
          </div>
          <div className="form-group">
            <label>Preferred Date *</label>
            <input
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.preferredDate && <span className="error-msg">{errors.preferredDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Preferred Time *</label>
            <input
              type="time"
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
            />
            {errors.preferredTime && <span className="error-msg">{errors.preferredTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Issue Description *</label>
          <textarea
            name="issueDescription"
            value={form.issueDescription}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe the issue with your vehicle..."
          />
          {errors.issueDescription && <span className="error-msg">{errors.issueDescription}</span>}
        </div>

        <button type="submit" className="submit-btn">Book Appointment</button>
      </form>
    </div>
  );
}

export default AppointmentBooking;
