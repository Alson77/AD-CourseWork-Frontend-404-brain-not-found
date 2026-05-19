import { useState, useEffect } from 'react';
import { Calendar, Wrench } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function ServiceHistory() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container">Loading service history...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <Wrench size={28} />
        <h1>Service History</h1>
      </div>
      <p className="page-desc">View your past and upcoming service appointments.</p>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>You have no service history.</p>
        </div>
      ) : (
        <div className="list-card">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Vehicle</th>
                <th>Service Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.preferredDate}</td>
                  <td>{appt.preferredTime || '-'}</td>
                  <td>{appt.vehicleNumber}</td>
                  <td>{appt.serviceType}</td>
                  <td>
                    <span className={`status-badge ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ServiceHistory;
