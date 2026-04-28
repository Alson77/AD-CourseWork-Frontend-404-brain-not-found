import { useState, useEffect } from 'react';
import { UsersRound, Search, UserCheck } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API}/api/customers`);
      setCustomers(res.data);
    } catch {
      setError('Cannot reach backend to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, []);

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ maxWidth: '1100px' }}>
      <p className="page-breadcrumb">Customer Management &gt; Manage Customers</p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <UsersRound size={26} color="var(--accent)" />
        <h1 className="page-title" style={{ margin: 0 }}>Manage Customers</h1>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box" style={{ maxWidth: '400px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or vehicle number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="inv-error-banner">{error}</div>}

      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading customer database...</p>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <UserCheck size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>No customers found matching your search criteria.</p>
          </div>
        ) : (
          <div className="cart-table-wrapper" style={{ margin: 0 }}>
            <table className="cart-table inv-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Contact Details</th>
                  <th>Vehicle Details</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>CUST-{c.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.fullName}</td>
                    <td>
                      <div>📞 {c.phone}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>✉️ {c.email}</div>
                    </td>
                    <td>
                      <div><span className="part-category">{c.vehicleBrand} {c.vehicleModel}</span></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>🚘 {c.vehicleNumber}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(c.registeredDate).toLocaleDateString()}
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
