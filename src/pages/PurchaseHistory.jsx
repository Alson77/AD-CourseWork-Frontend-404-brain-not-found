import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function PurchaseHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id) => {
    alert(`Downloading PDF for invoice #${id} (Mock)`);
  };

  if (loading) return <div className="page-container">Loading purchase history...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <FileText size={28} />
        <h1>Purchase History</h1>
      </div>
      <p className="page-desc">View your past orders and download invoices.</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>You haven't made any purchases yet.</p>
        </div>
      ) : (
        <div className="list-card">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (Rs.)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>ORD-{order.id.toString().padStart(4, '0')}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td>
                    <strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong>
                    {order.discountAmount > 0 && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#16a34a' }}>
                        Loyalty -Rs. {Number(order.discountAmount).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${order.paymentStatus === 'Paid' ? 'completed' : 'pending'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleDownload(order.id)} title="View Details">
                      <FileText size={16} />
                    </button>
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

export default PurchaseHistory;
