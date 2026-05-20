import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
};

function CustomerRegister() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email.';
    if (!form.password.trim()) newErrors.password = 'Password is required.';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
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
      await axios.post('http://localhost:5000/api/customers', form);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <h2>✅ Registration Successful!</h2>
          <p>You can now login with your email and password.</p>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page" style={{ padding: '2rem 0' }}>
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <div className="login-logo" style={{ marginBottom: '1rem' }}>
          <UserCheck size={28} style={{ color: 'var(--primary)' }} />
          <span className="login-logo-text">Create Account</span>
        </div>
        <p className="login-subtitle" style={{ marginBottom: '2rem' }}>Register your details to get started.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. john@example.com" />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9800000000" />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Kathmandu, Nepal" />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>

          <button type="submit" className="login-btn" style={{ marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Registering...' : 'Register Account'}
          </button>
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
