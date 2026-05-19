import { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ vehicleNumber: '', brand: '', model: '', year: '', mileage: '' });
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/api/vehicles/my');
      setVehicles(res.data);
    } catch (err) {
      setMessage('Failed to load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (vehicle) => {
    setForm(vehicle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      if (form.id) {
        await api.put(`/api/vehicles/${form.id}`, form);
        setMessage('✅ Vehicle updated successfully!');
      } else {
        await api.post('/api/vehicles', form);
        setMessage('✅ Vehicle added successfully!');
      }
      setForm({ vehicleNumber: '', brand: '', model: '', year: '', mileage: '' });
      fetchVehicles();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to save vehicle.'}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (vid) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/api/vehicles/${vid}`);
      fetchVehicles();
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  if (loading) return <div className="page-container">Loading vehicles...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <Wrench size={28} />
        <h1>My Vehicles</h1>
      </div>
      <p className="page-desc">Manage the vehicles registered to your account.</p>

      {message && <div className="success-banner">{message}</div>}

      <div className="grid-2-col">
        {/* Add/Edit vehicle */}
        <div className="form-card">
          <h2>{form.id ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Vehicle Number</label>
              <input type="text" name="vehicleNumber" value={form.vehicleNumber || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" value={form.brand || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input type="text" name="model" value={form.model || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" name="year" value={form.year || ''} onChange={handleChange} required min="1950" max="2030" />
            </div>
            <div className="form-group">
              <label>Mileage (km) / Fuel Type</label>
              <input type="text" name="mileage" value={form.mileage || ''} onChange={handleChange} required placeholder="e.g. 50000 km / Petrol" />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="submit-btn" disabled={adding}>
                <Plus size={16} /> {adding ? 'Saving...' : form.id ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
              {form.id && (
                <button type="button" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => setForm({ vehicleNumber: '', brand: '', model: '', year: '', mileage: '' })}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List of vehicles */}
        <div className="list-card">
          <h2>Registered Vehicles</h2>
          {vehicles.length === 0 ? (
            <p>No vehicles found. Add one to get started.</p>
          ) : (
            <ul className="vehicle-list">
              {vehicles.map(v => (
                <li key={v.id} className="vehicle-item">
                  <div className="vehicle-info">
                    <strong>{v.brand} {v.model} ({v.year})</strong>
                    <p>No: {v.vehicleNumber} | Details: {v.mileage}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(v)} className="icon-btn" title="Edit">
                      <Wrench size={16} />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="icon-btn delete" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyVehicles;
