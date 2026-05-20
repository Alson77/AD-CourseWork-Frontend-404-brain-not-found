import { useState, useEffect } from 'react';
import { UsersRound, Search, UserCheck, Eye, X } from 'lucide-react';
import api from '../utils/api';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/api/customers?search=${searchTerm}`);
      setCustomers(res.data);
    } catch (err) {
      setError('Cannot reach backend to load customers. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCustomers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleViewCustomer = async (id) => {
    setSelectedCustomer(id);
    setModalLoading(true);
    try {
      const res = await api.get(`/api/customers/${id}`);
      setCustomerDetails(res.data);
    } catch (err) {
      alert('Failed to load customer details');
    } finally {
      setModalLoading(false);
    }
  };

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
            placeholder="Search by name, phone, ID, or vehicle number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="inv-error-banner">{error}</div>}

      <div className="inv-table-card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading customer database...</p>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <UserCheck size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>No customers found{searchTerm ? ' matching your search criteria' : '. Register a customer to get started'}.</p>
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
                  <th>Mileage</th>
                  <th>Pending Credit</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>CUST-{c.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.fullName}</td>
                    <td>
                      <div>📞 {c.phone}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>✉️ {c.email}</div>
                    </td>
                    <td>
                      <div><span className="part-category">{c.vehicleBrand} {c.vehicleModel} {c.vehicleYear}</span></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>🚘 {c.vehicleNumber}</div>
                    </td>
                    <td>{c.mileage > 0 ? `${c.mileage.toLocaleString()} km` : '—'}</td>
                    <td>
                      {c.pendingCredit > 0 
                        ? <span style={{ color: '#ef4444', fontWeight: 600 }}>Rs. {c.pendingCredit.toFixed(2)}</span>
                        : <span style={{ color: '#16a34a' }}>Cleared</span>
                      }
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(c.registeredDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => handleViewCustomer(c.id)} title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button className="close-btn" onClick={() => { setSelectedCustomer(null); setCustomerDetails(null); }}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              {modalLoading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading details...</p>
              ) : customerDetails ? (
                <div>
                  <div className="form-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{customerDetails.profile.fullName}</h3>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-secondary)' }}>📞 {customerDetails.profile.phone}</p>
                      <p style={{ margin: '0 0 0.2rem 0', color: 'var(--text-secondary)' }}>✉️ {customerDetails.profile.email || 'N/A'}</p>
                      <p style={{ margin: '0', color: 'var(--text-secondary)' }}>📍 {customerDetails.profile.address || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>Vehicle</h3>
                      <p style={{ margin: '0 0 0.2rem 0' }}><strong>{customerDetails.profile.vehicleBrand} {customerDetails.profile.vehicleModel}</strong> ({customerDetails.profile.vehicleYear || 'N/A'})</p>
                      <p style={{ margin: '0 0 0.2rem 0' }}>Number: {customerDetails.profile.vehicleNumber}</p>
                      <p style={{ margin: '0' }}>Mileage: {customerDetails.profile.mileage} km</p>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Recent Invoices</h3>
                  {customerDetails.invoices.length > 0 ? (
                    <table className="cart-table" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                      <thead><tr><th>Inv #</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {customerDetails.invoices.slice(0, 5).map(inv => (
                          <tr key={inv.id}>
                            <td>INV-{inv.id}</td>
                            <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                            <td>Rs. {inv.total.toLocaleString()}</td>
                            <td>{inv.paymentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No invoices found.</p>}

                  <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Appointments</h3>
                  {customerDetails.appointments.length > 0 ? (
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {customerDetails.appointments.map(a => (
                        <li key={a.id} style={{ marginBottom: '0.5rem' }}>
                          <strong>{new Date(a.bookedAt).toLocaleDateString()}</strong> - {a.serviceType} <span style={{ padding: '2px 6px', background: '#e5e7eb', borderRadius: '4px', fontSize: '0.75rem' }}>{a.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p style={{ color: 'var(--text-secondary)' }}>No appointments found.</p>}
                </div>
              ) : (
                <p style={{ color: 'red' }}>Error loading data.</p>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="clear-btn" onClick={() => { setSelectedCustomer(null); setCustomerDetails(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
