import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, ShoppingBag, CreditCard, Calendar, Award, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [credit, setCredit] = useState(null);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [profileRes, creditRes, ordersRes, apptRes] = await Promise.allSettled([
        api.get('/api/customerprofile/me'),
        api.get('/api/credit/my'),
        api.get('/api/orders/my'),
        api.get('/api/appointments/mine'),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data.profile || profileRes.value.data.Profile);
      }

      if (creditRes.status === 'fulfilled') {
        setCredit(creditRes.value.data);
      }

      if (ordersRes.status === 'fulfilled') {
        setOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
      } else {
        setOrders([]);
      }

      if (apptRes.status === 'fulfilled') {
        setAppointments(Array.isArray(apptRes.value.data) ? apptRes.value.data : []);
      }

      const customerId = user?.customerId;
      if (customerId) {
        try {
          const aiRes = await api.get(`/api/aiprediction/${customerId}`);
          setAiPredictions(aiRes.data.predictions || []);
        } catch {
          setAiPredictions(['Update your vehicle mileage to get personalized recommendations.']);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard. Try logging out and back in.');
    } finally {
      setLoading(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="page-container">Loading dashboard...</div>;

  const totalSpent = credit?.loyaltyTotalSpent ?? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPurchases = orders.length;
  const pendingCredit = credit?.pendingCredit ?? 0;
  const upcomingAppts = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length;
  const isGold = credit?.isGoldMember ?? totalSpent >= 5000;
  const amountToGold = credit?.amountToGold ?? Math.max(0, 5000 - totalSpent);
  const loyaltyProgress = credit?.loyaltyProgress ?? Math.min(100, (totalSpent / 5000) * 100);

  return (
    <div className="page-container">
      <div className="page-header">
        <LayoutDashboard size={28} />
        <h1>Welcome, {profile?.fullName || user?.name}!</h1>
      </div>
      <p className="page-desc">Here is a quick overview of your account activity.</p>

      {error && <div className="inv-error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
            <ShoppingBag size={22} />
          </div>
          <div className="stat-info">
            <h3>Total Purchases</h3>
            <p className="stat-value">{totalPurchases}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <p className="stat-value">Rs. {Number(totalSpent).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-info">
            <h3>Pending Credit</h3>
            <p className="stat-value">Rs. {Number(pendingCredit).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <h3>Upcoming Appts</h3>
            <p className="stat-value">{upcomingAppts}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Award size={22} style={{ color: isGold ? '#f59e0b' : '#9ca3af' }} />
            <h2 style={{ margin: 0 }}>Loyalty Status</h2>
          </div>
          {isGold ? (
            <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>🏆 Gold Member</h3>
              <p>You get a <strong>10% discount</strong> automatically on cart orders over Rs. 5,000.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#92400e' }}>
                Lifetime spend: Rs. {Number(totalSpent).toLocaleString()}
              </p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>Standard Member</h3>
              <p>Spend <strong>Rs. {Number(amountToGold).toLocaleString()}</strong> more to unlock Gold status!</p>
              <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px', marginTop: '0.75rem' }}>
                <div
                  style={{
                    background: '#f59e0b',
                    height: '8px',
                    borderRadius: '4px',
                    width: `${loyaltyProgress}%`,
                    transition: 'width 0.5s',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Cpu size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ margin: 0 }}>AI Vehicle Insights</h2>
          </div>
          <div style={{ backgroundColor: '#eef2ff', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
            {aiPredictions.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {aiPredictions.map((p, i) => (
                  <li key={i} style={{ color: '#3730a3', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{p}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#6366f1', fontStyle: 'italic' }}>Update your vehicle mileage in My Profile to get AI-powered recommendations.</p>
            )}
            <Link to="/appointment" className="submit-btn" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', textAlign: 'center', padding: '8px 20px' }}>
              Book Service
            </Link>
          </div>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="form-card">
          <h2 style={{ marginTop: 0 }}>Recent Orders</h2>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>ORD-{o.id}</td>
                    <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td>
                      Rs. {Number(o.totalAmount).toLocaleString()}
                      {o.discountAmount > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', display: 'block' }}>
                          Loyalty -Rs. {Number(o.discountAmount).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td>{o.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/purchase-history" style={{ fontSize: '0.9rem', marginTop: '0.75rem', display: 'inline-block' }}>
            View all purchases →
          </Link>
        </div>
      )}

      {pendingCredit > 0 && (
        <div className="form-card" style={{ marginTop: '1rem', borderColor: '#fde68a' }}>
          <p style={{ margin: 0 }}>
            You have <strong>Rs. {Number(pendingCredit).toLocaleString()}</strong> outstanding.{' '}
            <Link to="/credit-status">View credit details →</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
