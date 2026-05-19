import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function MyProfile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/customerprofile/me');
      setForm({
        fullName: res.data.profile.fullName || '',
        email: res.data.profile.email || '',
        phone: res.data.profile.phone || '',
        address: res.data.profile.address || ''
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/api/customerprofile/me', form);
      setMessage('✅ Profile updated successfully!');
      
      // Update local storage context with new name
      login({ ...user, name: form.fullName });
    } catch (err) {
      setMessage('❌ Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container">Loading profile...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <User size={28} />
        <h1>My Profile</h1>
      </div>
      <p className="page-desc">Manage your personal information.</p>

      {message && <div className="success-banner">{message}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default MyProfile;
